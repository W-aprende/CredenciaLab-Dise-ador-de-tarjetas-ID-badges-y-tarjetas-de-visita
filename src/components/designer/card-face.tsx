'use client'

/**
 * ============================================================================
 *  card-face.tsx — Renderizado físico de una cara de la tarjeta
 * ============================================================================
 *  Estructura en capas (todas exportables excepto lo marcado .screen-only):
 *   1. Fondo (sólido / degradado lineal o radial)
 *   2. Formas flotantes (blobs de degradado radial suave)
 *   3. Patrón de seguridad guilloché (SVG procedural)
 *   4. Banda / línea decorativa institucional
 *   5. Elementos interactivos (texto, foto, QR, holograma…)
 *   6. Guías de imán (solo pantalla)
 * ============================================================================
 */

import { useState } from 'react'
import type { FormatKey, SideDesign } from '@/lib/designer/types'
import { cardBaseSize, getFormat, hexToRgba } from '@/lib/designer/presets'
import { useDesigner } from '@/lib/designer/store'
import { SecurityPattern } from './patterns'
import { ElementNode, type Guides } from './element-node'

interface Props {
  side: SideDesign
  format: FormatKey
  selectedId: string | null
  /** factor de escala visual actual (para contra-escalar controles flotantes) */
  scale: number
}

/** Color fijo del ribete que acompaña a la cuña diagonal (rojo bandera) */
const WEDGE_RIBBON = '#d0332e'

/**
 * Cuña diagonal de esquina como SVG→data-URI (hipotenusa de (0,100) a (100,0)
 * en espacio normalizado, con banda roja paralela separada por un filete
 * blanco). `mirror` invierte la geometría para la esquina superior derecha.
 */
function cornerWedgeUri(color: string, mirror: boolean): string {
  const tri = mirror ? '100,0 0,0 100,100' : '0,0 100,0 0,100'
  const band = mirror ? '0,13 0,23 77,100 87,100' : '100,13 100,23 23,100 13,100'
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 100 100" ` +
    `preserveAspectRatio="none">` +
    `<polygon points="${band}" fill="${WEDGE_RIBBON}"/>` +
    `<polygon points="${tri}" fill="${color}"/>` +
    `</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function CardFace({ side, format, selectedId, scale }: Props) {
  const { w: baseW, h: baseH } = cardBaseSize(format)
  const bg = side.bg
  const select = useDesigner((s) => s.select)
  const [guides, setGuides] = useState<Guides>({ v: null, h: null })

  /* CSS del fondo según el modo elegido */
  const bgStyle: React.CSSProperties =
    bg.fillMode === 'solid'
      ? { background: bg.solid }
      : {
          background:
            bg.gradient.kind === 'linear'
              ? `linear-gradient(${bg.gradient.angle}deg, ${bg.gradient.stops
                  .map((s) => `${s.color} ${s.pos}%`)
                  .join(', ')})`
              : `radial-gradient(circle at 50% 42%, ${bg.gradient.stops
                  .map((s) => `${s.color} ${s.pos}%`)
                  .join(', ')})`,
        }

  const radius = Math.round(baseW * 0.052) // esquinas redondeadas tipo ID-1

  return (
    <div
      className="relative"
      style={{ width: baseW, height: baseH, borderRadius: radius }}
      data-card-root
    >
      {/* Nodo capturado por html2canvas en la exportación */}
      <div id="card-export-node" className="absolute inset-0" style={{ borderRadius: radius }}>
        {/* 1-4 · Capas de fondo con recorte de esquinas */}
        <div className="absolute inset-0 overflow-hidden" style={{ ...bgStyle, borderRadius: radius }}>
          {/* 2 · Formas flotantes */}
          {bg.blobs && bg.blobOpacity > 0 && (
            <div
              className="absolute inset-0"
              aria-hidden
              style={{
                opacity: bg.blobOpacity / 100,
                background: [
                  `radial-gradient(circle at 80% 12%, ${hexToRgba(bg.blobColor, 0.85)} 0%, transparent 52%)`,
                  `radial-gradient(circle at 8% 88%, ${hexToRgba(bg.blobColor, 0.7)} 0%, transparent 48%)`,
                  `radial-gradient(circle at 92% 78%, ${hexToRgba(bg.blobColor, 0.5)} 0%, transparent 40%)`,
                ].join(', '),
              }}
            />
          )}

          {/* 3 · Patrón de seguridad */}
          <SecurityPattern
            pattern={bg.pattern}
            color={bg.patternColor}
            opacity={bg.patternOpacity}
            width={baseW}
            height={baseH}
          />

          {/* 4 · Decoración institucional — líneas, bandas y marcos */}
          {bg.decor === 'stripe-top' && (
            <div
              className="absolute inset-x-0 top-0"
              aria-hidden
              style={{ height: Math.max(6, baseH * 0.045), background: bg.decorColor, opacity: bg.decorOpacity / 100 }}
            />
          )}
          {bg.decor === 'stripe-bottom' && (
            <div
              className="absolute inset-x-0 bottom-0"
              aria-hidden
              style={{ height: Math.max(6, baseH * 0.045), background: bg.decorColor, opacity: bg.decorOpacity / 100 }}
            />
          )}
          {bg.decor === 'stripe-left' && (
            <div
              className="absolute inset-y-0 left-0"
              aria-hidden
              style={{ width: Math.max(5, baseW * 0.018), background: bg.decorColor, opacity: bg.decorOpacity / 100 }}
            />
          )}
          {bg.decor === 'stripe-right' && (
            <div
              className="absolute inset-y-0 right-0"
              aria-hidden
              style={{ width: Math.max(5, baseW * 0.018), background: bg.decorColor, opacity: bg.decorOpacity / 100 }}
            />
          )}
          {bg.decor === 'top-band' && (
            <div
              className="absolute inset-x-0 top-0"
              aria-hidden
              style={{ height: baseH * 0.12, background: bg.decorColor, opacity: bg.decorOpacity / 100 }}
            />
          )}
          {bg.decor === 'footer-band' && (
            <div
              className="absolute inset-x-0 bottom-0"
              aria-hidden
              style={{ height: baseH * 0.12, background: bg.decorColor, opacity: bg.decorOpacity / 100 }}
            />
          )}
          {bg.decor === 'frame' && (
            /* Marco interior fino clásico de credenciales */
            <div
              className="absolute"
              aria-hidden
              style={{
                inset: baseW * 0.03,
                border: `${Math.max(1.5, baseW * 0.004)}px solid ${bg.decorColor}`,
                borderRadius: radius * 0.55,
                opacity: bg.decorOpacity / 100,
              }}
            />
          )}
          {bg.decor === 'double-frame' && (
            /* Doble marco fino estilo documento de seguridad */
            <div className="absolute" aria-hidden style={{ inset: baseW * 0.028, opacity: bg.decorOpacity / 100 }}>
              <div
                className="absolute inset-0"
                style={{
                  border: `${Math.max(1.5, baseW * 0.0045)}px solid ${bg.decorColor}`,
                  borderRadius: radius * 0.55,
                }}
              />
              <div
                className="absolute"
                style={{
                  inset: baseW * 0.017,
                  border: `${Math.max(1, baseW * 0.0022)}px solid ${bg.decorColor}`,
                  borderRadius: radius * 0.45,
                }}
              />
            </div>
          )}
          {bg.decor === 'side-band' && (
            <div
              className="absolute inset-y-[-6%] left-[-9%] w-[27%]"
              aria-hidden
              style={{
                background: `linear-gradient(180deg, ${hexToRgba(bg.decorColor, 0.95)}, ${hexToRgba(bg.decorColor, 0.45)})`,
                transform: 'skewX(-7deg)',
                opacity: bg.decorOpacity / 100,
              }}
            />
          )}
          {bg.decor === 'corner-wedge' && (
            /* Cuña diagonal con ribete rojo (estilo credencial ministerial).
               Se genera como SVG→data-URI para exportarse fielmente. */
            <img
              src={cornerWedgeUri(bg.decorColor, false)}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute left-0 top-0 select-none"
              style={{
                width: baseW * 0.47,
                height: baseH * 0.235,
                opacity: bg.decorOpacity / 100,
                pointerEvents: 'none',
              }}
            />
          )}
          {bg.decor === 'corner-wedge-tr' && (
            <img
              src={cornerWedgeUri(bg.decorColor, true)}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute right-0 top-0 select-none"
              style={{
                width: baseW * 0.47,
                height: baseH * 0.235,
                opacity: bg.decorOpacity / 100,
                pointerEvents: 'none',
              }}
            />
          )}
          {bg.decor === 'corner-arc' && (
            /* Arcos en esquina con círculos CSS (borde redondeado): se
               rasterizan fielmente en la exportación, a diferencia de los
               SVG en línea. El recorte lo hace la capa de fondo. */
            <div className="absolute" aria-hidden style={{ right: 0, top: 0, width: baseW * 0.42, height: baseW * 0.42, opacity: bg.decorOpacity / 100 }}>
              <div className="absolute rounded-full" style={{ width: baseW * 0.55, height: baseW * 0.55, right: -baseW * 0.09, top: -baseW * 0.275, border: `${Math.max(1.5, baseW * 0.0035)}px solid ${bg.decorColor}` }} />
              <div className="absolute rounded-full" style={{ width: baseW * 0.42, height: baseW * 0.42, right: -baseW * 0.026, top: -baseW * 0.21, border: `${Math.max(1, baseW * 0.0022)}px solid ${bg.decorColor}` }} />
              <div className="absolute rounded-full" style={{ width: baseW * 0.33, height: baseW * 0.33, right: baseW * 0.02, top: -baseW * 0.165, border: `${Math.max(2, baseW * 0.005)}px solid ${bg.decorColor}` }} />
            </div>
          )}
        </div>

        {/* 5 · Elementos interactivos */}
        <div
          className="absolute inset-0"
          onPointerDown={(e) => {
            // clic en zona vacía → deseleccionar
            if (e.target === e.currentTarget) select(null)
          }}
        >
          {side.elements.map((el) => (
            <ElementNode
              key={el.id}
              el={el}
              selected={el.id === selectedId}
              scale={scale}
              baseW={baseW}
              baseH={baseH}
              onGuides={setGuides}
            />
          ))}
        </div>
      </div>

      {/* 6 · Guías de imán (solo pantalla, no se exportan) */}
      {guides.v !== null && (
        <div
          className="screen-only pointer-events-none absolute inset-y-[-2%] z-40"
          style={{ left: `${guides.v}%`, borderLeft: '1.5px dashed #10b981' }}
        />
      )}
      {guides.h !== null && (
        <div
          className="screen-only pointer-events-none absolute inset-x-[-2%] z-40"
          style={{ top: `${guides.h}%`, borderTop: '1.5px dashed #10b981' }}
        />
      )}

      {/* Sombra + borde luminoso exterior (fuera del nodo de exportación) */}
      <div
        className="screen-only pointer-events-none absolute inset-0"
        style={{
          borderRadius: radius,
          boxShadow: '0 24px 60px -18px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.08)',
        }}
        aria-hidden
      />
    </div>
  )
}
