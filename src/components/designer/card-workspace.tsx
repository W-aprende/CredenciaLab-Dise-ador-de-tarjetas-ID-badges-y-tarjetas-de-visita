'use client'

/**
 * ============================================================================
 *  card-workspace.tsx — Área de trabajo central (lienzo interactivo)
 * ============================================================================
 *  · Mide el espacio disponible (ResizeObserver) y calcula el factor de
 *    escala para que la tarjeta encaje siempre ("zoom to fit").
 *  · La tarjeta se renderiza a resolución base (≈640 px) y se escala con
 *    transform → el nodo #card-export-node mantiene su tamaño natural, lo
 *    que permite exportar a ~600 DPI sin recálculos.
 *  · Muestra una insignia con la cara activa y las dimensiones físicas.
 * ============================================================================
 */

import { useEffect, useRef, useState } from 'react'
import { FlipHorizontal2, Ruler } from 'lucide-react'
import { useDesigner } from '@/lib/designer/store'
import { cardBaseSize, getFormat } from '@/lib/designer/presets'
import { CardFace } from './card-face'

export function CardWorkspace() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  const doc = useDesigner((s) => s.doc)
  const side = useDesigner((s) => s.side)
  const selectedId = useDesigner((s) => s.selectedId)
  const toggleSide = useDesigner((s) => s.toggleSide)

  const { w: baseW, h: baseH } = cardBaseSize(doc.format)
  const fmt = getFormat(doc.format)
  const sideDesign = side === 'front' ? doc.front : doc.back

  /* zoom-to-fit */
  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const compute = () => {
      const rect = node.getBoundingClientRect()
      const s = Math.min(
        (rect.width - 72) / baseW,
        (rect.height - 88) / baseH,
      )
      setScale(Math.max(0.15, Math.min(s, 1.15)))
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(node)
    return () => ro.disconnect()
  }, [baseW, baseH])

  return (
    <div
      ref={containerRef}
      className="workspace-dots relative flex flex-1 items-center justify-center overflow-hidden"
      role="main"
      aria-label="Lienzo de diseño de la tarjeta"
    >
      {/* Reserva de espacio + escala visual.
          data-zoom-wrapper: lo usa export.ts para neutralizar temporalmente
          el transform durante la captura html2canvas (si el lienzo está
          escalado, las palabras se dibujan solapadas en la exportación). */}
      <div style={{ width: baseW * scale, height: baseH * scale }} className="relative">
        <div
          data-zoom-wrapper
          style={{
            width: baseW,
            height: baseH,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <CardFace side={sideDesign} format={doc.format} selectedId={selectedId} scale={scale} />
        </div>
      </div>

      {/* Insignia inferior: cara activa + formato físico */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/85 px-3 py-1.5 text-xs text-muted-foreground shadow-lg backdrop-blur">
          <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
            <FlipHorizontal2 className="h-3.5 w-3.5 text-emerald-500" />
            {side === 'front' ? 'Anverso' : 'Reverso'}
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="inline-flex items-center gap-1.5">
            <Ruler className="h-3.5 w-3.5" />
            {fmt.label} · {fmt.hint}
          </span>
          <button
            onClick={toggleSide}
            className="pointer-events-auto ml-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 transition hover:bg-emerald-500/25 dark:text-emerald-400"
          >
            Girar tarjeta
          </button>
        </div>
      </div>
    </div>
  )
}
