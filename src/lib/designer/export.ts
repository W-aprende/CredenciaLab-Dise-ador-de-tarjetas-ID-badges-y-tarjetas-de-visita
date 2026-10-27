/**
 * ============================================================================
 *  export.ts — Exportación del diseño en alta resolución
 * ============================================================================
 *  Usa html2canvas-pro (soporta colores modernos oklch de Tailwind 4) para
 *  rasterizar el nodo de la tarjeta a ~600 DPI, y jsPDF para generar un PDF
 *  con las dimensiones físicas reales del formato elegido.
 * ============================================================================
 */

import html2canvas from 'html2canvas-pro'
import { jsPDF } from 'jspdf'
import { cardBaseSize } from './presets'
import type { FormatKey } from './types'

export type ExportFormat = 'png' | 'jpeg' | 'pdf'

/** Factor de escala de rasterizado respecto al lienzo base (≈ 600 DPI) */
const EXPORT_SCALE = 5

function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function slug(s: string): string {
  return s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

/**
 * Exporta el nodo DOM de la tarjeta (debe llevar el id `card-export-node`).
 * El nodo se renderiza a tamaño base (p. ej. 640 px de ancho) sin escalado
 * visual — el transform de ajuste a pantalla vive en el contenedor padre, por
 * lo que html2canvas captura siempre a resolución nativa × EXPORT_SCALE.
 *
 * ⚠ Zoom-to-fit: si el workspace escaló el lienzo (scale ≠ 1), las posiciones
 * de las palabras medidas por html2canvas-pro salen del rect TRANSFORMADO del
 * DOM mientras los glifos se dibujan con el tamaño de fuente SIN transformar
 * → texto solapado en la exportación de formatos verticales. La solución es
 * neutralizar temporalmente ese transform durante la captura y restaurarlo
 * al terminar (el parpadeo dura lo que tarda el rasterizado).
 */
export async function exportCard(
  format: ExportFormat,
  cardFormat: FormatKey,
  faceLabel: string,
): Promise<void> {
  const node = document.getElementById('card-export-node')
  if (!node) throw new Error('No se encontró la tarjeta en el DOM')

  const zoomWrapper = node.closest<HTMLElement>('[data-zoom-wrapper]')
  const prevTransform = zoomWrapper?.style.transform ?? ''
  if (zoomWrapper) zoomWrapper.style.transform = 'none'

  try {
    const canvas = await html2canvas(node, {
      scale: EXPORT_SCALE,
      backgroundColor: format === 'png' ? null : '#ffffff',
      useCORS: true,
      logging: false,
      // Elimina del clon todo artefacto de pantalla (anillos de selección,
      // asas de redimensión, barra flotante, guías de imán…). También
      // garantiza que el clon se maquete a tamaño base (sin zoom).
      onclone: (doc) => {
        doc.querySelectorAll('.screen-only').forEach((n) => n.remove())
        const clonedZoom = doc.querySelector('[data-zoom-wrapper]') as HTMLElement | null
        if (clonedZoom) clonedZoom.style.transform = 'none'
      },
    })

    const stamp = new Date().toISOString().slice(0, 10)
    const base = `credencial-${slug(faceLabel)}-${stamp}`

    if (format === 'pdf') {
      // El PDF usa las dimensiones físicas reales en mm del formato elegido,
      // de modo que la tarjeta impresa mide exactamente lo anunciado.
      const mm = physicalMm(cardFormat)
      const pdf = new jsPDF({
        orientation: mm.w >= mm.h ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [mm.w, mm.h],
      })
      const dataUrl = canvas.toDataURL('image/png', 1)
      pdf.addImage(dataUrl, 'PNG', 0, 0, mm.w, mm.h, undefined, 'FAST')
      pdf.save(`${base}.pdf`)
      return
    }

    const mime = format === 'png' ? 'image/png' : 'image/jpeg'
    const dataUrl = canvas.toDataURL(mime, format === 'jpeg' ? 0.95 : undefined)
    triggerDownload(dataUrl, `${base}.${format}`)
  } finally {
    // Restaura el zoom-to-fit pase lo que pase (éxito o error de exportación)
    if (zoomWrapper) zoomWrapper.style.transform = prevTransform
  }
}

/** Dimensiones físicas en mm de cada formato (para el PDF) */
function physicalMm(key: FormatKey): { w: number; h: number } {
  switch (key) {
    case 'badge3x2h': return { w: 76.2, h: 50.8 }
    case 'badge3x2v': return { w: 50.8, h: 76.2 }
    case 'dni':       return { w: 85.6, h: 54 }
    case 'businessH': return { w: 90,   h: 50 }
    case 'businessV': return { w: 50,   h: 90 }
  }
}

/** Utilidad: dimensiones de exportación esperadas (informativo para UI) */
export function exportDimensions(cardFormat: FormatKey): { w: number; h: number } {
  const { w, h } = cardBaseSize(cardFormat)
  return { w: w * EXPORT_SCALE, h: h * EXPORT_SCALE }
}
