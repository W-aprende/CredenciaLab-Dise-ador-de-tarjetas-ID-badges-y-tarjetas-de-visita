/**
 * ============================================================================
 *  patterns.tsx — Patrones de seguridad procedurales (SVG → data-URI)
 * ============================================================================
 *  Los patrones se generan como CADENAS SVG que se incrustan en un <img>
 *  mediante data-URI. Esta técnica es 100 % compatible con html2canvas-pro
 *  (los <svg> en línea se pierden al serializar el clon, pero las imágenes
 *  con data-URI se rasterizan fielmente — es el mismo mecanismo del logo y
 *  la fotografía).
 * ============================================================================
 */

import { useMemo } from 'react'
import type { PatternKey } from '@/lib/designer/types'

interface PatternProps {
  pattern: PatternKey
  color: string
  /** opacidad 0-100 */
  opacity: number
  /** dimensiones del lienzo base en px */
  width: number
  height: number
}

/** Curva rosette tipo guilloché: r(θ) = R0 + A·sin(kθ) */
function rosettePath(cx: number, cy: number, R0: number, A: number, k: number, steps = 540): string {
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const r = R0 + A * Math.sin(k * t)
    const x = cx + r * Math.cos(t)
    const y = cy + r * Math.sin(t)
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return pts.join(' ') + ' Z'
}

/* -------------------------------------------------------------------------- */
/*  Constructores del interior del SVG (devuelven markup)                     */
/* -------------------------------------------------------------------------- */

function guillocheBody(w: number, h: number, color: string): string {
  const cx = w / 2
  const cy = h / 2
  const R0 = Math.min(w, h) * 0.62
  let body = ''
  for (let i = 0; i < 9; i++) {
    body += `<path d="${rosettePath(cx, cy, R0 * (0.55 + i * 0.055), R0 * 0.16, 6 + (i % 3))}"/>`
    body += `<path d="${rosettePath(cx, cy, R0 * (0.58 + i * 0.05), R0 * 0.2, 5 + (i % 4), 420)}"/>`
  }
  return `<g fill="none" stroke="${color}" stroke-width="0.55">${body}</g>`
}

function wavesBody(w: number, h: number, color: string): string {
  const rows = Math.max(14, Math.round(h / 26))
  let body = ''
  for (let r = 0; r <= rows; r++) {
    const yBase = (r / rows) * h
    const amp = 6 + 4 * Math.sin(r * 0.9)
    const freq = (Math.PI * 2) / (w / (3 + (r % 3)))
    let d = ''
    for (let x = 0; x <= w; x += 4) {
      const y = yBase + amp * Math.sin(x * freq + r * 0.7)
      d += `${x === 0 ? 'M' : 'L'}${x},${y.toFixed(1)}`
    }
    body += `<path d="${d}"/>`
  }
  return `<g fill="none" stroke="${color}" stroke-width="0.6">${body}</g>`
}

function circuitBody(w: number, h: number, color: string): string {
  const cells = 7
  const cw = w / cells
  const rows = Math.max(3, Math.round(h / (cw * 0.9)))
  const ch = h / rows
  let traces = ''
  let pads = ''
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cells; c++) {
      const x0 = c * cw
      const y0 = r * ch
      const x1 = x0 + cw
      const my = y0 + ch * (0.25 + ((c * 7 + r * 3) % 5) / 10)
      traces += `<path d="M${x0.toFixed(1)},${my.toFixed(1)} L${(x0 + cw * 0.45).toFixed(1)},${my.toFixed(1)} L${(x0 + cw * 0.45).toFixed(1)},${(my + ch * 0.3).toFixed(1)} L${x1.toFixed(1)},${(my + ch * 0.3).toFixed(1)}"/>`
      pads += `<circle cx="${x0.toFixed(1)}" cy="${my.toFixed(1)}" r="2.4"/><circle cx="${x1.toFixed(1)}" cy="${(my + ch * 0.3).toFixed(1)}" r="2.4"/>`
    }
  }
  return `<g fill="none" stroke="${color}" stroke-width="0.7">${traces}</g><g fill="${color}">${pads}</g>`
}

function gridBody(w: number, h: number, color: string): string {
  const step = 14
  let body = ''
  for (let x = step; x < w; x += step) body += `<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`
  for (let y = step; y < h; y += step) body += `<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`
  return `<g stroke="${color}" stroke-width="0.4">${body}</g>`
}

function dotsBody(w: number, h: number, color: string): string {
  const step = 12
  let body = ''
  for (let y = step; y < h; y += step) {
    for (let x = step; x < w; x += step) {
      body += `<circle cx="${x}" cy="${y}" r="${(x + y) % 3 === 0 ? 1.4 : 0.9}"/>`
    }
  }
  return `<g fill="${color}">${body}</g>`
}

function diamondBody(w: number, h: number, color: string): string {
  const step = 18
  let body = ''
  for (let x = -h; x < w + h; x += step) {
    body += `<path d="M${x},0 L${x + h},${h}"/>`
    body += `<path d="M${x},0 L${x - h},${h}"/>`
  }
  return `<g stroke="${color}" stroke-width="0.45" fill="none">${body}</g>`
}

/* Panal hexagonal: malla de hexágonos regulares conectados */
function hexBody(w: number, h: number, color: string): string {
  const r = 9                       // radio del hexágono
  const hw = r * Math.sqrt(3)       // ancho de celda
  const vs = r * 1.5                // salto vertical
  let body = ''
  for (let row = -1; row * vs <= h + r; row++) {
    for (let col = -1; col * hw <= w + r; col++) {
      const cx = col * hw + (row % 2 ? hw / 2 : 0)
      const cy = row * vs
      const pts: string[] = []
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 180) * (60 * i - 30)
        pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`)
      }
      body += `<polygon points="${pts.join(' ')}"/>`
    }
  }
  return `<g fill="none" stroke="${color}" stroke-width="0.45">${body}</g>`
}

/* Espiga / chevrones: columnas de “V” apiladas */
function chevronBody(w: number, h: number, color: string): string {
  const cw = 16
  const chh = 11
  let body = ''
  for (let x = -cw; x < w + cw; x += cw) {
    for (let y = -chh; y < h + chh; y += chh) {
      body += `<path d="M${x},${y} L${x + cw / 2},${y + chh / 2} L${x + cw},${y} L${x + cw},${y + chh * 0.45} L${x + cw / 2},${y + chh * 0.95} L${x},${y + chh * 0.45} Z"/>`
    }
  }
  return `<g fill="none" stroke="${color}" stroke-width="0.5">${body}</g>`
}

/* Rosácea de anillos concéntricos desplazados (esquina superior derecha) */
function ringsBody(w: number, h: number, color: string): string {
  const cx = w * 0.82
  const cy = h * 0.2
  const maxR = Math.hypot(w, h)
  let body = ''
  for (let r = 10; r < maxR; r += 8) {
    body += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}"/>`
  }
  return `<g fill="none" stroke="${color}" stroke-width="0.5">${body}</g>`
}

/* Moiré: dos retículas de líneas superpuestas con ángulos cercanos */
function moireBody(w: number, h: number, color: string): string {
  let a = ''
  let b = ''
  const gap = 7
  for (let x = -h; x < w + h; x += gap) {
    a += `<line x1="${x}" y1="0" x2="${x + h * 0.12}" y2="${h}"/>`
    b += `<line x1="${x}" y1="0" x2="${x - h * 0.12}" y2="${h}"/>`
  }
  return `<g stroke="${color}" stroke-width="0.35">${a}${b}</g>`
}

/* Microtexto: líneas verticales finísimas (efecto banda de microimpresión) */
function microlineBody(w: number, h: number, color: string): string {
  let body = ''
  for (let x = 3; x < w; x += 2.6) {
    const tall = (x / 2.6) % 9 === 0
    body += `<line x1="${x.toFixed(1)}" y1="${tall ? 0 : h * 0.18}" x2="${x.toFixed(1)}" y2="${tall ? h : h * 0.82}"/>`
  }
  return `<g stroke="${color}" stroke-width="0.4">${body}</g>`
}

/* Constelación: estrellas de 4 puntas dispersas con determinismo simple */
function starsBody(w: number, h: number, color: string): string {
  let body = ''
  let seed = 7
  const rnd = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  for (let i = 0; i < 42; i++) {
    const x = rnd() * w
    const y = rnd() * h
    const s = 2 + rnd() * 4
    body += `<path d="M${x.toFixed(1)},${(y - s).toFixed(1)} L${(x + s * 0.28).toFixed(1)},${(y - s * 0.28).toFixed(1)} L${(x + s).toFixed(1)},${y.toFixed(1)} L${(x + s * 0.28).toFixed(1)},${(y + s * 0.28).toFixed(1)} L${x.toFixed(1)},${(y + s).toFixed(1)} L${(x - s * 0.28).toFixed(1)},${(y + s * 0.28).toFixed(1)} L${(x - s).toFixed(1)},${y.toFixed(1)} L${(x - s * 0.28).toFixed(1)},${(y - s * 0.28).toFixed(1)} Z"/>`
  }
  return `<g fill="${color}" stroke="none">${body}</g>`
}

/** Genera la cadena SVG completa del patrón elegido */
function buildPatternSvg(pattern: PatternKey, color: string, w: number, h: number): string | null {
  let body: string
  switch (pattern) {
    case 'guilloche': body = guillocheBody(w, h, color); break
    case 'waves':     body = wavesBody(w, h, color); break
    case 'circuit':   body = circuitBody(w, h, color); break
    case 'grid':      body = gridBody(w, h, color); break
    case 'dots':      body = dotsBody(w, h, color); break
    case 'diamond':   body = diamondBody(w, h, color); break
    case 'hex':       body = hexBody(w, h, color); break
    case 'chevron':   body = chevronBody(w, h, color); break
    case 'rings':     body = ringsBody(w, h, color); break
    case 'moire':     body = moireBody(w, h, color); break
    case 'microline': body = microlineBody(w, h, color); break
    case 'stars':     body = starsBody(w, h, color); break
    default: return null
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" ` +
    `viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${body}</svg>`
  )
}

/**
 * Capa de patrón sobre el fondo de la tarjeta.
 * Se monta como <img> con data-URI: fiable en pantalla y en la exportación.
 */
export function SecurityPattern({ pattern, color, opacity, width, height }: PatternProps) {
  const src = useMemo(
    () => buildPatternSvg(pattern, color, Math.round(width), Math.round(height)),
    [pattern, color, width, height],
  )
  if (!src || opacity <= 0) return null
  return (
    <img
      src={`data:image/svg+xml;utf8,${encodeURIComponent(src)}`}
      alt=""
      aria-hidden
      draggable={false}
      className="absolute inset-0 h-full w-full select-none"
      style={{ opacity: opacity / 100, pointerEvents: 'none' }}
    />
  )
}
