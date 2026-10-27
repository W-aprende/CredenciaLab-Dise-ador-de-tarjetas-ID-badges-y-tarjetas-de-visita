'use client'

/**
 * ============================================================================
 *  element-node.tsx — Elemento interactivo sobre el lienzo
 * ============================================================================
 *  Implementa:
 *   · Arrastre libre (pointer events) con límites y "snapping" a guías
 *     (centros y bordes de la tarjeta).
 *   · Redimensión por asas (esquina BR, borde derecho, borde inferior);
 *     con Shift se conserva la proporción en imágenes.
 *   · Doble clic en textos → edición en línea (contentEditable).
 *   · Barra flotante de alineación/capas contra-escalada (tamaño constante
 *     en pantalla aunque el lienzo esté reducido) — marcada `.screen-only`
 *     para que html2canvas la elimine al exportar.
 * ============================================================================
 */

import { memo, useRef, useState } from 'react'
import {
  AlignHorizontalJustifyCenter, AlignHorizontalJustifyEnd, AlignHorizontalJustifyStart,
  AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, AlignVerticalJustifyStart,
  BringToFront, Copy, Lock, LockOpen, SendToBack, Trash2,
} from 'lucide-react'
import type { CardElement } from '@/lib/designer/types'
import { fontCss } from '@/lib/designer/presets'
import { useDesigner } from '@/lib/designer/store'
import { cn } from '@/lib/utils'
import { QrImage, BarcodeSvg } from './qr-code'

export interface Guides { v: number | null; h: number | null }

interface Props {
  el: CardElement
  selected: boolean
  /** factor de escala visual del lienzo (para contra-escalar controles) */
  scale: number
  baseW: number
  baseH: number
  onGuides: (g: Guides) => void
}

const SNAP = 1.15          // tolerancia de imán (%)
const SAFE = 4.5           // margen de alineación segura (%)

type DragMode = 'move' | 'resize-br' | 'resize-r' | 'resize-b' | null

function ElementNodeInner({ el, selected, scale, baseW, baseH, onGuides }: Props) {
  const { updateElement, select, removeElement, duplicateElement, raiseElement, lowerElement } = useDesigner()
  const boxRef = useRef<HTMLDivElement>(null)
  const editRef = useRef<HTMLDivElement>(null)
  const liveRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null)
  const [editing, setEditing] = useState(false)
  /** posición/tamaño local durante el gesto (feedback en vivo, sin tocar el store) */
  const [live, setLive] = useState<Pick<CardElement, 'x' | 'y' | 'w' | 'h'> | null>(null)

  const cur = live ?? { x: el.x, y: el.y, w: el.w, h: el.h }
  const inv = scale > 0 ? 1 / scale : 1

  /* ------------------------------------------------------------------ drag */
  function startDrag(e: React.PointerEvent, mode: DragMode) {
    if (editing) return
    e.stopPropagation()
    select(el.id)
    if (el.locked) return

    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
    const startX = e.clientX
    const startY = e.clientY
    const start = { x: el.x, y: el.y, w: el.w, h: el.h }
    const pxW = baseW * scale
    const pxH = baseH * scale
    let moved = false

    const onMove = (ev: PointerEvent) => {
      const dxPct = ((ev.clientX - startX) / pxW) * 100
      const dyPct = ((ev.clientY - startY) / pxH) * 100
      if (Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) > 3) moved = true
      let nx = start.x, ny = start.y, nw = start.w, nh = start.h
      let gv: number | null = null
      let gh: number | null = null

      if (mode === 'move') {
        nx = start.x + dxPct
        ny = start.y + dyPct
        // imán: centro horizontal
        const cx = nx + nw / 2
        if (Math.abs(cx - 50) < SNAP) { nx = 50 - nw / 2; gv = 50 }
        // imán: bordes izquierdo/derecho
        if (Math.abs(nx) < SNAP) { nx = 0; gv = 0 }
        if (Math.abs(nx + nw - 100) < SNAP) { nx = 100 - nw; gv = 100 }
        // imán: centro vertical
        const cy = ny + nh / 2
        if (Math.abs(cy - 50) < SNAP) { ny = 50 - nh / 2; gh = 50 }
        if (Math.abs(ny) < SNAP) { ny = 0; gh = 0 }
        if (Math.abs(ny + nh - 100) < SNAP) { ny = 100 - nh; gh = 100 }
        // límites: al menos el 10 % del elemento dentro de la tarjeta
        nx = Math.max(-nw * 0.9, Math.min(nx, 100 - nw * 0.1))
        ny = Math.max(-nh * 0.9, Math.min(ny, 100 - nh * 0.1))
      } else {
        const keepRatio = ev.shiftKey && (el.type === 'photo' || el.type === 'logo')
        if (mode === 'resize-br' || mode === 'resize-r') {
          nw = Math.max(2, start.w + dxPct)
          if (keepRatio) nh = Math.max(2, nw * (start.h / start.w))
        }
        if (mode === 'resize-br' || mode === 'resize-b') {
          nh = Math.max(0.5, start.h + dyPct)
          if (keepRatio) nw = Math.max(2, nh * (start.w / start.h))
        }
      }
      liveRef.current = { x: nx, y: ny, w: nw, h: nh }
      setLive({ x: nx, y: ny, w: nw, h: nh })
      onGuides({ v: gv, h: gh })
    }

    const onUp = () => {
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerup', onUp)
      target.removeEventListener('pointercancel', onUp)
      onGuides({ v: null, h: null })
      // commit final con snapshot para el historial (los pasos intermedios
      // solo se reflejan en el estado local `live`, sin saturar el historial)
      if (moved && liveRef.current) {
        updateElement(el.id, liveRef.current, true)
      }
      liveRef.current = null
      setLive(null)
    }

    target.addEventListener('pointermove', onMove)
    target.addEventListener('pointerup', onUp)
    target.addEventListener('pointercancel', onUp)
  }

  /* ----------------------------------------------------------- edición texto */
  function beginEdit() {
    if (el.type !== 'text' || el.locked) return
    setEditing(true)
    requestAnimationFrame(() => {
      const node = editRef.current
      if (node) {
        node.focus()
        // coloca el cursor al final
        const sel = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(node)
        range.collapse(false)
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
    })
  }

  function commitEdit() {
    const node = editRef.current
    if (node) {
      const text = node.innerText.replace(/\n{3,}/g, '\n\n').trimEnd()
      updateElement(el.id, { content: text || el.content }, true)
    }
    setEditing(false)
  }

  /* --------------------------------------------------------------- alineación */
  const align = (dir: 'l' | 'c' | 'r' | 't' | 'm' | 'b') => {
    let { x, y } = cur
    if (dir === 'l') x = SAFE
    if (dir === 'c') x = (100 - cur.w) / 2
    if (dir === 'r') x = 100 - SAFE - cur.w
    if (dir === 't') y = SAFE
    if (dir === 'm') y = (100 - cur.h) / 2
    if (dir === 'b') y = 100 - SAFE - cur.h
    updateElement(el.id, { x, y }, true)
  }

  if (el.hidden) return null

  const isText = el.type === 'text'
  const interactive = !el.locked

  /* ---------------------------------------------------------------- contenido */
  function renderContent() {
    switch (el.type) {
      case 'text':
        return (
          <div
            ref={editing ? editRef : undefined}
            contentEditable={editing}
            suppressContentEditableWarning
            onBlur={commitEdit}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === 'Escape') (e.target as HTMLElement).blur()
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) (e.target as HTMLElement).blur()
            }}
            onPointerDown={(e) => { if (editing) e.stopPropagation() }}
            className={cn(
              'h-full w-full whitespace-pre-line break-words outline-none',
              editing && 'cursor-text ring-2 ring-emerald-400/80',
            )}
            style={{
              /* tipografía por elemento: fuente + tamaño + grosor independientes */
              fontFamily: fontCss(el.font),
              fontSize: el.fontSize,
              fontWeight: el.fontWeight,
              color: el.color,
              textAlign: el.align,
              letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
              lineHeight: el.lineHeight,
              textTransform: el.uppercase ? 'uppercase' : 'none',
            }}
          >
            {editing ? undefined : el.content}
          </div>
        )
      case 'photo':
      case 'logo':
        return (
           
          <img
            src={el.src}
            alt={el.name}
            draggable={false}
            className="h-full w-full select-none object-cover"
            style={{
              objectFit: el.type === 'logo' ? 'contain' : 'cover',
              borderRadius: el.circular ? '50%' : el.radius,
            }}
          />
        )
      case 'qr':
        return (
          <div className="h-full w-full">
            <QrImage payload={el.qrPayload ?? ''} dark={el.qrDark ?? '#000'} light={el.qrLight ?? ''} />
          </div>
        )
      case 'barcode':
        return <BarcodeSvg seed={el.id} color={el.fill ?? '#fff'} />
      case 'hologram':
        return (
          <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden"
            style={{
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.75)',
              background: [
                'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 42%)',
                'linear-gradient(135deg, #ff9a9e 0%, #fbc2eb 22%, #a1c4fd 45%, #c2f9d0 68%, #ffd1ff 86%, #ffe29a 100%)',
              ].join(', '),
              boxShadow: 'inset 0 0 6px rgba(255,255,255,0.8)',
            }}
          >
            <svg viewBox="0 0 24 24" className="h-[58%] w-[58%] drop-shadow" fill="none"
              stroke="rgba(20,40,60,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span
              className="absolute bottom-[7%] font-bold uppercase"
              style={{ fontSize: Math.max(4, el.h * 0.9), letterSpacing: 0.5, color: 'rgba(20,40,60,0.8)' }}
            >
              DEMO
            </span>
          </div>
        )
      case 'shape': {
        const fill = el.fill ?? '#ffffff'
        /** estilo de trazo común (sólido por defecto para compatibilidad) */
        const stroke = el.strokeStyle ?? 'solid'
        const strokeCss = `${el.borderWidth ?? 1.5}px ${stroke} ${el.borderColor ?? fill}`
        if (el.shape === 'circle') {
          return <div className="h-full w-full rounded-full" style={{ background: fill }} />
        }
        if (el.shape === 'ring') {
          return (
            <div className="h-full w-full rounded-full"
              style={{ border: strokeCss, background: 'transparent' }} />
          )
        }
        if (el.shape === 'line') {
          /* línea con estilo de trazo: sólida (relleno) o discontinua/punteada/doble (borde) */
          if (stroke === 'solid') {
            return <div className="h-full w-full" style={{ background: fill, height: Math.max(1.5, el.borderWidth ?? 1.5) }} />
          }
          return (
            <div
              className="h-full w-full"
              style={{
                height: 0,
                borderTop: `${Math.max(1.5, el.borderWidth ?? 1.5)}px ${stroke} ${el.borderColor ?? fill}`,
              }}
            />
          )
        }
        /* rectángulo: relleno + trazo opcional configurable */
        const hasStroke = !!el.borderColor || stroke !== 'solid'
        return (
          <div
            className="h-full w-full"
            style={{
              background: fill,
              borderRadius: el.radius,
              border: hasStroke ? strokeCss : undefined,
            }}
          />
        )
      }
      case 'stamp': {
        /* Sello configurable: fuente, tamaño, color de texto y trazo propios.
           Sin override (fontSize undefined) se mantiene el auto-escalado clásico. */
        const autoSize = Math.max(8, (baseH * (cur.h / 100)) * 0.30)
        const stampStroke = el.strokeStyle ?? 'solid'
        return (
          <div className="flex h-full w-full items-center justify-center">
            <div
              className="w-full rounded-md px-[4%] py-[2%] text-center font-extrabold uppercase leading-tight"
              style={{
                fontFamily: fontCss(el.font),
                fontSize: el.fontSize ?? autoSize,
                color: el.color ?? 'rgba(239,68,68,0.92)',
                border: `${el.borderWidth ?? 3}px ${stampStroke} ${el.borderColor ?? 'rgba(239,68,68,0.85)'}`,
                background: 'rgba(255,255,255,0.14)',
                letterSpacing: 1.6,
                boxShadow: '0 0 0 1px rgba(255,255,255,0.15) inset',
              }}
            >
              {el.content || 'PROTOTIPO · EJEMPLO NO VÁLIDO'}
            </div>
          </div>
        )
      }
      default:
        return null
    }
  }

  /* ------------------------------------------------------------------- render */
  return (
    <>
      {/* Caja del elemento (rotable) */}
      <div
        ref={boxRef}
        onPointerDown={(e) => startDrag(e, 'move')}
        onDoubleClick={beginEdit}
        className={cn(
          'absolute select-none',
          interactive ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
          editing && 'cursor-text',
        )}
        style={{
          left: `${cur.x}%`,
          top: `${cur.y}%`,
          width: `${cur.w}%`,
          height: `${cur.h}%`,
          transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
          opacity: el.opacity / 100,
          touchAction: 'none',
          zIndex: 1,
        }}
        data-element-id={el.id}
      >
        {renderContent()}

        {/* Anillo de selección + asas (eliminados en la exportación) */}
        {selected && (
          <div className="screen-only pointer-events-none absolute inset-0 rounded-[2px]"
            style={{ outline: '1.5px solid #10b981', outlineOffset: 0 }} />
        )}
        {selected && interactive && (
          <>
            <div
              className="screen-only absolute"
              style={{
                right: -5 * inv, bottom: -5 * inv, width: 10 * inv, height: 10 * inv,
                background: '#10b981', border: `${Math.max(1, 1.5 * inv)}px solid white`,
                borderRadius: 2 * inv, transform: 'translate(50%, 50%)',
                transformOrigin: 'center', cursor: 'nwse-resize', touchAction: 'none',
              }}
              onPointerDown={(e) => startDrag(e, 'resize-br')}
            />
            <div
              className="screen-only absolute"
              style={{
                right: -4 * inv, top: '50%', width: 8 * inv, height: 16 * inv,
                background: '#10b981', border: `${Math.max(1, 1.5 * inv)}px solid white`,
                borderRadius: 2 * inv, transform: 'translate(50%, -50%)',
                cursor: 'ew-resize', touchAction: 'none',
              }}
              onPointerDown={(e) => startDrag(e, 'resize-r')}
            />
            <div
              className="screen-only absolute"
              style={{
                left: '50%', bottom: -4 * inv, width: 16 * inv, height: 8 * inv,
                background: '#10b981', border: `${Math.max(1, 1.5 * inv)}px solid white`,
                borderRadius: 2 * inv, transform: 'translate(-50%, 50%)',
                cursor: 'ns-resize', touchAction: 'none',
              }}
              onPointerDown={(e) => startDrag(e, 'resize-b')}
            />
          </>
        )}
      </div>

      {/* Barra flotante (fuera de la caja rotable, contra-escalada) */}
      {selected && !editing && (
        <div
          className="screen-only absolute z-50"
          style={{
            left: `${cur.x + cur.w / 2}%`,
            top: `${cur.y}%`,
            transform: `translate(-50%, calc(-100% - ${10 * inv}px)) scale(${inv})`,
            transformOrigin: 'bottom center',
            touchAction: 'none',
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-0.5 rounded-lg border border-emerald-500/30 bg-background/95 p-1 shadow-xl backdrop-blur">
            {[
              { icon: AlignHorizontalJustifyStart, t: 'Alinear izquierda', fn: () => align('l') },
              { icon: AlignHorizontalJustifyCenter, t: 'Centrar horizontal', fn: () => align('c') },
              { icon: AlignHorizontalJustifyEnd, t: 'Alinear derecha', fn: () => align('r') },
              { icon: AlignVerticalJustifyStart, t: 'Alinear arriba', fn: () => align('t') },
              { icon: AlignVerticalJustifyCenter, t: 'Centrar vertical', fn: () => align('m') },
              { icon: AlignVerticalJustifyEnd, t: 'Alinear abajo', fn: () => align('b') },
            ].map(({ icon: Icon, t, fn }) => (
              <button key={t} title={t} onClick={fn}
                className="rounded p-1.5 text-foreground/70 hover:bg-emerald-500/15 hover:text-emerald-600">
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
            <div className="mx-0.5 h-5 w-px bg-border" />
            <button title="Duplicar" onClick={() => duplicateElement(el.id)}
              className="rounded p-1.5 text-foreground/70 hover:bg-emerald-500/15 hover:text-emerald-600">
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button title="Traer al frente" onClick={() => raiseElement(el.id)}
              className="rounded p-1.5 text-foreground/70 hover:bg-emerald-500/15 hover:text-emerald-600">
              <BringToFront className="h-3.5 w-3.5" />
            </button>
            <button title="Enviar al fondo" onClick={() => lowerElement(el.id)}
              className="rounded p-1.5 text-foreground/70 hover:bg-emerald-500/15 hover:text-emerald-600">
              <SendToBack className="h-3.5 w-3.5" />
            </button>
            <button title={el.locked ? 'Desbloquear' : 'Bloquear'} onClick={() => updateElement(el.id, { locked: !el.locked }, true)}
              className={cn('rounded p-1.5 hover:bg-emerald-500/15', el.locked ? 'text-amber-500' : 'text-foreground/70 hover:text-emerald-600')}>
              {el.locked ? <Lock className="h-3.5 w-3.5" /> : <LockOpen className="h-3.5 w-3.5" />}
            </button>
            <button title="Eliminar" onClick={() => removeElement(el.id)}
              className="rounded p-1.5 text-foreground/70 hover:bg-red-500/15 hover:text-red-600">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export const ElementNode = memo(ElementNodeInner)
