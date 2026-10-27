'use client'

/**
 * ============================================================================
 *  designer-app.tsx — Shell principal de la SPA
 * ============================================================================
 *  Composición: barra superior + panel de control (izquierda) + lienzo
 *  central. Registra los atajos de teclado globales y las notificaciones.
 * ============================================================================
 */

import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { TopBar } from './top-bar'
import { ControlPanel } from './control-panel'
import { CardWorkspace } from './card-workspace'
import { useDesigner } from '@/lib/designer/store'
import { toast } from 'sonner'

/** ¿El foco está en un campo editable? (para no interceptar atajos) */
function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  return (
    el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.tagName === 'SELECT' ||
    el.isContentEditable
  )
}

export function DesignerApp() {
  /* ------------------------------------------------------------ atajos */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const st = useDesigner.getState()
      const mod = e.ctrlKey || e.metaKey

      if (e.key === 'Escape') {
        st.select(null)
        return
      }
      if (isTyping(e.target)) return

      if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault(); st.undo(); return
      }
      if (mod && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault(); st.redo(); return
      }
      if (mod && e.key.toLowerCase() === 'd' && st.selectedId) {
        e.preventDefault(); st.duplicateElement(st.selectedId); return
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && st.selectedId) {
        const side = st.side
        const el = (side === 'front' ? st.doc.front : st.doc.back).elements.find((x) => x.id === st.selectedId)
        if (el && !el.locked) {
          e.preventDefault()
          st.removeElement(st.selectedId)
          toast.success('Elemento eliminado.')
        }
        return
      }

      // flechas → nudging fino del elemento seleccionado
      if (e.key.startsWith('Arrow') && st.selectedId) {
        const el = (st.side === 'front' ? st.doc.front : st.doc.back).elements.find((x) => x.id === st.selectedId)
        if (!el || el.locked) return
        e.preventDefault()
        const step = e.shiftKey ? 1.5 : 0.4
        const patch = { x: el.x, y: el.y }
        if (e.key === 'ArrowLeft') patch.x -= step
        if (e.key === 'ArrowRight') patch.x += step
        if (e.key === 'ArrowUp') patch.y -= step
        if (e.key === 'ArrowDown') patch.y += step
        st.updateSelected(patch)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <TopBar />

      {/* En pantallas grandes: panel izq. + lienzo; en móviles: lienzo arriba */}
      <div className="flex min-h-0 flex-1 flex-col-reverse lg:flex-row">
        <ControlPanel />
        <CardWorkspace />
      </div>

      <Toaster position="bottom-right" richColors closeButton />
    </div>
  )
}
