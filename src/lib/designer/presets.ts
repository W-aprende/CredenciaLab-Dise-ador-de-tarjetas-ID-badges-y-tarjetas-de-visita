/**
 * ============================================================================
 *  presets.ts — Formatos físicos, paletas institucionales y tipografías
 * ============================================================================
 */

import type { FormatKey } from './types'

export interface CardFormatPreset {
  key: FormatKey
  label: string
  hint: string            // dimensiones físicas en mm
  /** proporción ancho/alto (>1 horizontal, <1 vertical) */
  ratio: number
  /** arista mayor del lienzo de maquetación en px (resolución base) */
  basePx: number
}

/**
 * Formatos predefinidos:
 *  - Carné 3×2 horizontal      → 3 : 2        (76,2 × 50,8 mm)
 *  - Carné 3×2 vertical        → 2 : 3        (50,8 × 76,2 mm)
 *  - DNI / identificación      → CR80 85,6×54 (ISO/IEC 7810 ID-1)
 *  - Tarjeta de visita H       → 90 × 50 mm
 *  - Tarjeta de visita V       → 50 × 90 mm
 */
export const CARD_FORMATS: CardFormatPreset[] = [
  { key: 'badge3x2h', label: 'Carné 3×2 · Horizontal', hint: '76,2 × 50,8 mm', ratio: 3 / 2, basePx: 640 },
  { key: 'badge3x2v', label: 'Carné 3×2 · Vertical', hint: '50,8 × 76,2 mm', ratio: 2 / 3, basePx: 640 },
  { key: 'dni', label: 'DNI / Identificación', hint: '85,6 × 54 mm · ISO ID-1', ratio: 85.6 / 54, basePx: 660 },
  { key: 'businessH', label: 'Visita · Horizontal', hint: '90 × 50 mm', ratio: 9 / 5, basePx: 660 },
  { key: 'businessV', label: 'Visita · Vertical', hint: '50 × 90 mm', ratio: 5 / 9, basePx: 640 },
]

export function getFormat(key: FormatKey): CardFormatPreset {
  return CARD_FORMATS.find((f) => f.key === key) ?? CARD_FORMATS[0]
}

/** Dimensiones del lienzo base en px a partir del formato */
export function cardBaseSize(key: FormatKey): { w: number; h: number } {
  const f = getFormat(key)
  return f.ratio >= 1
    ? { w: f.basePx, h: Math.round(f.basePx / f.ratio) }
    : { w: Math.round(f.basePx * f.ratio), h: f.basePx }
}

/* -------------------------------------------------------------------------- */
/*  Paletas institucionales prediseñadas (fondo degradado + acento)           */
/* -------------------------------------------------------------------------- */

export interface PalettePreset {
  key: string
  label: string
  stops: { color: string; pos: number }[]
  accent: string
  patternColor: string
  blobColor: string
}

export const PALETTES: PalettePreset[] = [
  {
    key: 'institucional', label: 'Azul institucional',
    stops: [{ color: '#0b2440', pos: 0 }, { color: '#14507c', pos: 55 }, { color: '#1c7fa6', pos: 100 }],
    accent: '#7fd8e8', patternColor: '#ffffff', blobColor: '#3fb6d9',
  },
  {
    key: 'esmeralda', label: 'Verde esmeralda',
    stops: [{ color: '#04291f', pos: 0 }, { color: '#0b5c43', pos: 60 }, { color: '#1d9a6c', pos: 100 }],
    accent: '#8ff0c6', patternColor: '#ffffff', blobColor: '#27c08b',
  },
  {
    key: 'borgona', label: 'Borgoña ejecutivo',
    stops: [{ color: '#33061b', pos: 0 }, { color: '#6e1230', pos: 58 }, { color: '#a01d3f', pos: 100 }],
    accent: '#f4a9bc', patternColor: '#ffffff', blobColor: '#d34b6f',
  },
  {
    key: 'grafito', label: 'Grafito minimal',
    stops: [{ color: '#101418', pos: 0 }, { color: '#232a31', pos: 60 }, { color: '#3a4550', pos: 100 }],
    accent: '#d4b36a', patternColor: '#ffffff', blobColor: '#5d6b77',
  },
  {
    key: 'violeta', label: 'Violeta moderno',
    stops: [{ color: '#23103f', pos: 0 }, { color: '#45207a', pos: 55 }, { color: '#7c3aed', pos: 100 }],
    accent: '#d8b4fe', patternColor: '#ffffff', blobColor: '#9f67fa',
  },
  {
    key: 'ambar', label: 'Ámbar corporativo',
    stops: [{ color: '#3a1f04', pos: 0 }, { color: '#8a4d0b', pos: 55 }, { color: '#d97706', pos: 100 }],
    accent: '#fcd9a8', patternColor: '#ffffff', blobColor: '#f59e0b',
  },
  /* ---- Paletas ampliadas (segunda generación) ---- */
  {
    key: 'marino', label: 'Marino profundo',
    stops: [{ color: '#041729', pos: 0 }, { color: '#0a3555', pos: 55 }, { color: '#115c93', pos: 100 }],
    accent: '#9fd4ff', patternColor: '#ffffff', blobColor: '#2e7fc2',
  },
  {
    key: 'turquesa', label: 'Turquesa sanitario',
    stops: [{ color: '#052e2b', pos: 0 }, { color: '#0d5f58', pos: 58 }, { color: '#14a08f', pos: 100 }],
    accent: '#a5f3e3', patternColor: '#ffffff', blobColor: '#1fb5a0',
  },
  {
    key: 'carmesi', label: 'Carmesí deportivo',
    stops: [{ color: '#340507', pos: 0 }, { color: '#7c0e14', pos: 56 }, { color: '#c01d26', pos: 100 }],
    accent: '#ffb3ae', patternColor: '#ffffff', blobColor: '#e04248',
  },
  {
    key: 'indigo', label: 'Índigo universitario',
    stops: [{ color: '#14103a', pos: 0 }, { color: '#2c2470', pos: 56 }, { color: '#4f46e5', pos: 100 }],
    accent: '#c7d2fe', patternColor: '#ffffff', blobColor: '#6d67f0',
  },
  {
    key: 'oliva', label: 'Oliva militar',
    stops: [{ color: '#1c2110', pos: 0 }, { color: '#414a20', pos: 58 }, { color: '#6b7a34', pos: 100 }],
    accent: '#d9e3a8', patternColor: '#ffffff', blobColor: '#8a9c48',
  },
  {
    key: 'cobre', label: 'Cobre ejecutivo',
    stops: [{ color: '#271407', pos: 0 }, { color: '#6b3a15', pos: 56 }, { color: '#b4652a', pos: 100 }],
    accent: '#f3cfa4', patternColor: '#ffffff', blobColor: '#d0803f',
  },
  {
    key: 'rosa', label: 'Rosa corporativo',
    stops: [{ color: '#350b24', pos: 0 }, { color: '#8a1e55', pos: 56 }, { color: '#d63384', pos: 100 }],
    accent: '#ffc2dd', patternColor: '#ffffff', blobColor: '#e5609f',
  },
  {
    key: 'verdebandera', label: 'Verde bandera',
    stops: [{ color: '#05240f', pos: 0 }, { color: '#0c5a26', pos: 56 }, { color: '#12873c', pos: 100 }],
    accent: '#b7f0c2', patternColor: '#ffffff', blobColor: '#1fa84e',
  },
  {
    key: 'pizarra', label: 'Pizarra azul',
    stops: [{ color: '#161e2c', pos: 0 }, { color: '#2c3e5d', pos: 58 }, { color: '#41597f', pos: 100 }],
    accent: '#b8c9e8', patternColor: '#ffffff', blobColor: '#5a77a6',
  },
  {
    key: 'neon', label: 'Cian eléctrico',
    stops: [{ color: '#03121d', pos: 0 }, { color: '#073a52', pos: 55 }, { color: '#0a7291', pos: 100 }],
    accent: '#67e8f9', patternColor: '#ffffff', blobColor: '#0ea5c4',
  },
  /* ---- Paletas claras (tarjetas de fondo blanco) ---- */
  {
    key: 'cielo', label: 'Azul cielo suave',
    stops: [{ color: '#dcefff', pos: 0 }, { color: '#b8ddf9', pos: 55 }, { color: '#8ec9f5', pos: 100 }],
    accent: '#1d5c94', patternColor: '#1d5c94', blobColor: '#7ab8ef',
  },
  {
    key: 'arena', label: 'Arena neutra',
    stops: [{ color: '#f7f2e8', pos: 0 }, { color: '#eadfc9', pos: 58 }, { color: '#d8c8a4', pos: 100 }],
    accent: '#7a5c2e', patternColor: '#7a5c2e', blobColor: '#cbb38a',
  },
  {
    key: 'niebla', label: 'Gris niebla',
    stops: [{ color: '#f2f4f7', pos: 0 }, { color: '#dfe4ea', pos: 58 }, { color: '#c8d0da', pos: 100 }],
    accent: '#33475c', patternColor: '#33475c', blobColor: '#a9b6c4',
  },
]

/* -------------------------------------------------------------------------- */
/*  Tipografías disponibles en la tarjeta (pila CSS segura para exportación)  */
/*  Solo fuentes del sistema: se ven igual en pantalla, en la previsualización */
/*  y en la exportación html2canvas sin depender de webfonts descargadas.      */
/* -------------------------------------------------------------------------- */

export const CARD_FONTS: { key: string; label: string; css: string }[] = [
  /* Pila offline: fuentes locales del sistema (sin webfonts descargadas) */
  { key: 'sans',      label: 'Sans del sistema (predeterminada)', css: "'Inter', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif" },
  { key: 'arial',     label: 'Arial / Helvetica',             css: "Arial, Helvetica, 'Helvetica Neue', sans-serif" },
  { key: 'verdana',   label: 'Verdana',                       css: "Verdana, Geneva, 'DejaVu Sans', sans-serif" },
  { key: 'tahoma',    label: 'Tahoma',                        css: "Tahoma, Verdana, 'Segoe UI', sans-serif" },
  { key: 'trebuchet', label: 'Trebuchet MS',                  css: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', sans-serif" },
  { key: 'century',   label: 'Century Gothic (geométrica)',   css: "'Century Gothic', 'CenturyGothic', 'AppleGothic', 'Futura', sans-serif" },
  { key: 'serif',     label: 'Georgia',                       css: "Georgia, 'DejaVu Serif', serif" },
  { key: 'times',     label: 'Times New Roman',               css: "'Times New Roman', Times, 'Liberation Serif', serif" },
  { key: 'garamond',  label: 'Garamond (clásica)',            css: "Garamond, 'EB Garamond', 'Apple Garamond', 'Palatino Linotype', serif" },
  { key: 'palatino',  label: 'Palatino / Book Antiqua',       css: "'Palatino Linotype', 'Book Antiqua', Palatino, 'DejaVu Serif', serif" },
  { key: 'mono',      label: 'Courier (mono)',                css: "'Courier New', Courier, 'Liberation Mono', monospace" },
  { key: 'impact',    label: 'Impact (condensada)',           css: "Impact, 'Arial Narrow', 'Haettenschweiler', sans-serif" },
]

export function fontCss(key?: string): string {
  return CARD_FONTS.find((f) => f.key === key)?.css ?? CARD_FONTS[0].css
}

/* -------------------------------------------------------------------------- */
/*  Color helper: hex → rgba()                                                */
/* -------------------------------------------------------------------------- */

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full.slice(0, 6), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
