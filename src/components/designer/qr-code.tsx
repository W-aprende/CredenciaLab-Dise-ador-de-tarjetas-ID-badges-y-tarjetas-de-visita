/**
 * ============================================================================
 *  qr-code.tsx — Código QR dinámico y código de barras simulado
 * ============================================================================
 *  El QR se genera con la librería `qrcode` a partir del texto introducido y
 *  se recodifica automáticamente al cambiar el payload o los colores.
 *  El barcode es un SVG procedural (ancho de barras pseudoaleatorio
 *  determinista a partir del propio texto) — 100 % exportable.
 * ============================================================================
 */

import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import type { CardElement } from '@/lib/designer/types'

interface QrProps {
  payload: string
  dark: string
  light: string  // vacío ⇒ fondo transparente
  className?: string
}

export function QrImage({ payload, dark, light, className }: QrProps) {
  const [dataUrl, setDataUrl] = useState<string>('')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    const text = payload && payload.trim().length > 0
      ? payload
      : 'PROTOTIPO · EJEMPLO NO VÁLIDO'
    QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 512,
      color: {
        dark: dark || '#000000',
        light: light && light.length >= 7 ? light : '#00000000', // transparencia
      },
    })
      .then((url) => { if (alive) { setDataUrl(url); setFailed(false) } })
      .catch(() => { if (alive) setFailed(true) })
    return () => { alive = false }
  }, [payload, dark, light])

  // Nunca renderizamos <img src=""> (dispararía una recarga de página):
  // mostramos un marcador neutro mientras el QR se genera o si falla.
  if (failed || !dataUrl) {
    return (
      <div className={`flex h-full w-full items-center justify-center rounded bg-black/10 text-[10px] text-black/50 ${className ?? ''}`}>
        {failed ? 'QR inválido' : '…'}
      </div>
    )
  }

  return (
    <img
      src={dataUrl}
      alt="Código QR de verificación"
      className={`h-full w-full ${className ?? ''}`}
      draggable={false}
      style={{ objectFit: 'contain' }}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  Código de barras simulado (SVG procedural determinista)                    */
/* -------------------------------------------------------------------------- */

export function BarcodeSvg({ seed, color }: { seed: string; color: string }) {
  const src = useMemo(() => {
    // PRNG determinista a partir del texto (hash simple)
    let h = 2166136261
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    const rand = () => {
      h ^= h << 13; h ^= h >>> 17; h ^= h << 5
      return ((h >>> 0) % 1000) / 1000
    }
    const bars: string[] = []
    let x = 0
    while (x < 100) {
      const w = 0.6 + rand() * 2.2          // ancho de barra 0.6 - 2.8 unidades
      bars.push(`<rect x="${x.toFixed(2)}" y="0" width="${w.toFixed(2)}" height="32"/>`)
      x += w + 0.8 + rand() * 2.4           // espacio
    }
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="64" viewBox="0 0 100 32" ` +
      `preserveAspectRatio="none"><g fill="${color}">${bars.join('')}</g></svg>`
    )
  }, [seed, color])

  return (
    <img
      src={`data:image/svg+xml;utf8,${encodeURIComponent(src)}`}
      alt=""
      aria-hidden
      draggable={false}
      className="h-full w-full"
    />
  )
}

/** Ayuda: QR de un elemento (reutilizable desde card-face) */
export function elementQrProps(el: CardElement): QrProps {
  return {
    payload: el.qrPayload ?? '',
    dark: el.qrDark ?? '#000000',
    light: el.qrLight ?? '',
  }
}
