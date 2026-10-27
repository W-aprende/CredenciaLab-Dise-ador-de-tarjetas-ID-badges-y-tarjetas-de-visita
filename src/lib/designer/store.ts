/**
 * ============================================================================
 *  store.ts — Estado global del diseñador (Zustand + historial undo/redo)
 * ============================================================================
 *  El documento completo (formato + ambas caras) es inmutable: cada mutación
 *  produce un nuevo objeto y guarda un snapshot en el historial para poder
 *  deshacer/rehacer (Ctrl+Z / Ctrl+Y).
 * ============================================================================
 */

import { create } from 'zustand'
import type {
  BackgroundConfig, CardElement, CardSide, DesignerDoc, FormatKey, SideDesign,
} from './types'
import { defaultDoc, makeBackBg, makeFrontBg, uid } from './defaults'
import { PALETTES } from './presets'
import { getTemplate } from './templates'

const HISTORY_LIMIT = 60

interface DesignerStore {
  doc: DesignerDoc
  side: CardSide
  selectedId: string | null
  /* historial */
  past: DesignerDoc[]
  future: DesignerDoc[]

  /* --- documento --- */
  setFormat: (f: FormatKey) => void
  resetDoc: () => void
  applyPalette: (paletteKey: string) => void
  /** Sustituye ambas caras por la plantilla indicada (con snapshot) */
  applyTemplate: (templateKey: string) => void

  /* --- navegación --- */
  setSide: (s: CardSide) => void
  toggleSide: () => void
  select: (id: string | null) => void

  /* --- elementos --- */
  addElement: (el: CardElement) => void
  updateElement: (id: string, patch: Partial<CardElement>, snapshot?: boolean) => void
  updateSelected: (patch: Partial<CardElement>) => void
  removeElement: (id: string) => void
  duplicateElement: (id: string) => void
  raiseElement: (id: string) => void   // traer al frente
  lowerElement: (id: string) => void   // enviar al fondo

  /* --- fondo --- */
  updateBg: (side: CardSide, patch: Partial<BackgroundConfig>) => void

  /* --- historial --- */
  undo: () => void
  redo: () => void
}

/** Acceso rápido al diseño de la cara activa */
export function sideOf(doc: DesignerDoc, side: CardSide): SideDesign {
  return side === 'front' ? doc.front : doc.back
}

function cloneDoc(d: DesignerDoc): DesignerDoc {
  return JSON.parse(JSON.stringify(d)) as DesignerDoc
}

export const useDesigner = create<DesignerStore>((set, get) => {
  /** Ejecuta una mutación sobre el documento guardando snapshot en historial */
  function mutate(fn: (draft: DesignerDoc) => void, snapshot = true) {
    const { doc, past } = get()
    const next = cloneDoc(doc)
    fn(next)
    set({
      doc: next,
      past: snapshot ? [...past, doc].slice(-HISTORY_LIMIT) : past,
      future: snapshot ? [] : get().future,
    })
  }

  return {
    doc: defaultDoc(),
    side: 'front',
    selectedId: null,
    past: [],
    future: [],

    /* ------------------------------- documento ---------------------------- */
    setFormat: (f) => mutate((d) => { d.format = f }),

    resetDoc: () => {
      const fresh = defaultDoc()
      set((s) => ({ doc: fresh, past: [...s.past, s.doc].slice(-HISTORY_LIMIT), future: [], selectedId: null }))
    },

    /** Aplica una plantilla completa (anverso + reverso) conservando el historial */
    applyTemplate: (templateKey) => {
      const tpl = getTemplate(templateKey)
      const fresh = tpl.build()
      set((s) => ({
        doc: fresh,
        past: [...s.past, s.doc].slice(-HISTORY_LIMIT),
        future: [],
        selectedId: null,
      }))
    },

    /** Aplica una paleta institucional a la cara activa (fondo + acentos claros) */
    applyPalette: (paletteKey) => {
      const p = PALETTES.find((x) => x.key === paletteKey)
      if (!p) return
      const side = get().side
      mutate((d) => {
        const bg = side === 'front' ? d.front.bg : d.back.bg
        bg.gradient.stops = p.stops.map((s) => ({ ...s }))
        bg.solid = p.stops[0].color
        bg.patternColor = p.patternColor
        bg.decorColor = p.accent
        bg.blobColor = p.blobColor
        // Recolorea acentos claros habituales de los elementos de texto
        const els = side === 'front' ? d.front.elements : d.back.elements
        for (const el of els) {
          if (el.type === 'text' && el.color === '#7fd8e8') el.color = p.accent
        }
      })
    },

    /* ------------------------------ navegación ---------------------------- */
    setSide: (s) => set({ side: s, selectedId: null }),
    toggleSide: () => set((s) => ({ side: s.side === 'front' ? 'back' : 'front', selectedId: null })),
    select: (id) => set({ selectedId: id }),

    /* ------------------------------- elementos ---------------------------- */
    addElement: (el) => {
      mutate((d) => {
        const target = get().side === 'front' ? d.front : d.back
        target.elements.push(el)
      })
      set({ selectedId: el.id })
    },

    updateElement: (id, patch, snapshot = true) =>
      mutate((d) => {
        const target = get().side === 'front' ? d.front : d.back
        const el = target.elements.find((e) => e.id === id)
        if (el) Object.assign(el, patch)
      }, snapshot),

    updateSelected: (patch) => {
      const id = get().selectedId
      if (id) get().updateElement(id, patch)
    },

    removeElement: (id) => {
      mutate((d) => {
        const target = get().side === 'front' ? d.front : d.back
        target.elements = target.elements.filter((e) => e.id !== id)
      })
      if (get().selectedId === id) set({ selectedId: null })
    },

    duplicateElement: (id) => {
      const side = get().side
      const src = sideOf(get().doc, side).elements.find((e) => e.id === id)
      if (!src) return
      const copy: CardElement = {
        ...JSON.parse(JSON.stringify(src)),
        id: uid('dup'),
        name: `${src.name} (copia)`,
        x: Math.min(src.x + 3, 92),
        y: Math.min(src.y + 3, 92),
      }
      mutate((d) => {
        const target = side === 'front' ? d.front : d.back
        target.elements.push(copy)
      })
      set({ selectedId: copy.id })
    },

    raiseElement: (id) => mutate((d) => {
      const target = get().side === 'front' ? d.front : d.back
      const i = target.elements.findIndex((e) => e.id === id)
      if (i >= 0 && i < target.elements.length - 1) {
        const [el] = target.elements.splice(i, 1)
        target.elements.push(el)
      }
    }),

    lowerElement: (id) => mutate((d) => {
      const target = get().side === 'front' ? d.front : d.back
      const i = target.elements.findIndex((e) => e.id === id)
      if (i > 0) {
        const [el] = target.elements.splice(i, 1)
        target.elements.unshift(el)
      }
    }),

    /* --------------------------------- fondo ------------------------------ */
    updateBg: (side, patch) => mutate((d) => {
      const bg = side === 'front' ? d.front.bg : d.back.bg
      Object.assign(bg, patch)
    }),

    /* ------------------------------- historial ---------------------------- */
    undo: () => {
      const { past, doc, future } = get()
      if (past.length === 0) return
      const prev = past[past.length - 1]
      set({ doc: prev, past: past.slice(0, -1), future: [doc, ...future].slice(0, HISTORY_LIMIT), selectedId: null })
    },

    redo: () => {
      const { past, doc, future } = get()
      if (future.length === 0) return
      const next = future[0]
      set({ doc: next, past: [...past, doc].slice(-HISTORY_LIMIT), future: future.slice(1), selectedId: null })
    },
  }
})

/** Reinicia únicamente el fondo de la cara activa a sus valores por defecto */
export function resetSideBg(side: CardSide) {
  const patch = side === 'front' ? makeFrontBg() : makeBackBg()
  useDesigner.getState().updateBg(side, patch)
}
