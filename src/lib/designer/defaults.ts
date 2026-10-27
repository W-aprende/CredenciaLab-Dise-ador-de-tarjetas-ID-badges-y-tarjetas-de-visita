/**
 * ============================================================================
 *  defaults.ts — Plantillas iniciales para anverso y reverso
 * ============================================================================
 *  Crea una tarjeta profesional ya compuesta al abrir la aplicación, con:
 *  fondo degradado, guilloché, banda institucional, foto, campos de datos,
 *  QR, holograma y el sello "PROTOTIPO · EJEMPLO NO VÁLIDO".
 * ============================================================================
 */

import type { BackgroundConfig, CardElement, DesignerDoc, FormatKey, SideDesign } from './types'
import { DEFAULT_AVATAR, DEFAULT_LOGO, DEFAULT_WATERMARK } from './assets'

let seq = 0
/** Generador de IDs estables dentro de la sesión */
export function uid(prefix = 'el'): string {
  seq += 1
  return `${prefix}-${Date.now().toString(36)}-${seq}-${Math.floor(Math.random() * 1e6).toString(36)}`
}

/* -------------------------------------------------------------------------- */
/*  Fondos base                                                               */
/* -------------------------------------------------------------------------- */

export function makeFrontBg(): BackgroundConfig {
  return {
    fillMode: 'gradient',
    solid: '#0b2440',
    gradient: {
      kind: 'linear',
      angle: 135,
      stops: [
        { color: '#0b2440', pos: 0 },
        { color: '#14507c', pos: 55 },
        { color: '#1c7fa6', pos: 100 },
      ],
    },
    pattern: 'guilloche',
    patternColor: '#ffffff',
    patternOpacity: 9,
    decor: 'stripe-left',
    decorColor: '#7fd8e8',
    decorOpacity: 85,
    blobs: true,
    blobColor: '#3fb6d9',
    blobOpacity: 22,
  }
}

export function makeBackBg(): BackgroundConfig {
  return {
    fillMode: 'gradient',
    solid: '#101418',
    gradient: {
      kind: 'linear',
      angle: 45,
      stops: [
        { color: '#101418', pos: 0 },
        { color: '#232a31', pos: 100 },
      ],
    },
    pattern: 'circuit',
    patternColor: '#ffffff',
    patternOpacity: 6,
    decor: 'stripe-top',
    decorColor: '#7fd8e8',
    decorOpacity: 70,
    blobs: false,
    blobColor: '#3fb6d9',
    blobOpacity: 18,
  }
}

/* -------------------------------------------------------------------------- */
/*  Fábricas de elementos                                                     */
/* -------------------------------------------------------------------------- */

export function makeText(partial: Partial<CardElement>): CardElement {
  return {
    id: uid('txt'),
    type: 'text',
    name: 'Texto',
    x: 30, y: 30, w: 55, h: 12,
    rotation: 0, opacity: 100, locked: false, hidden: false,
    content: 'Texto de ejemplo',
    fontSize: 22, fontWeight: 500, color: '#ffffff',
    align: 'left', letterSpacing: 0, lineHeight: 1.25,
    uppercase: false, font: 'sans', textPreset: 'custom',
    ...partial,
  }
}

/* -------------------------------------------------------------------------- */
/*  Plantilla del ANVERSO                                                     */
/* -------------------------------------------------------------------------- */

function frontElements(): CardElement[] {
  return [
    {
      id: uid('logo'), type: 'logo', name: 'Logotipo',
      x: 4.5, y: 6, w: 13, h: 16,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      src: DEFAULT_LOGO, radius: 10, circular: false,
    },
    makeText({
      name: 'Entidad', textPreset: 'entidad',
      content: 'INSTITUTO NACIONAL\nDE CREDENCIALES',
      x: 20, y: 6.5, w: 55, h: 14,
      fontSize: 15, fontWeight: 700, letterSpacing: 1.5,
      color: '#7fd8e8', uppercase: true, lineHeight: 1.35,
    }),
    {
      id: uid('photo'), type: 'photo', name: 'Fotografía',
      x: 5.5, y: 27, w: 21, h: 52,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      src: DEFAULT_AVATAR, radius: 12, circular: false,
    },
    makeText({
      name: 'Nombre completo', textPreset: 'nombre',
      content: 'María Fernanda Ríos',
      x: 31, y: 30, w: 41, h: 13,
      fontSize: 24, fontWeight: 800, color: '#ffffff', lineHeight: 1.2,
    }),
    makeText({
      name: 'Cargo', textPreset: 'cargo',
      content: 'Ingeniera Senior de Sistemas',
      x: 31, y: 44, w: 41, h: 9,
      fontSize: 15, fontWeight: 500, color: '#7fd8e8', letterSpacing: 0.4,
    }),
    makeText({
      name: 'Departamento', textPreset: 'departamento',
      content: 'DIR. TECNOLOGÍA · DT-04',
      x: 31, y: 54, w: 41, h: 8,
      fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.75)',
      letterSpacing: 1.2, uppercase: true,
    }),
    makeText({
      name: 'ID de empleado', textPreset: 'empleadoId',
      content: 'ID  0042-2026-A',
      x: 31, y: 64, w: 40, h: 10,
      fontSize: 15, fontWeight: 700, font: 'mono', color: '#ffffff',
      letterSpacing: 1.5,
    }),
    {
      id: uid('qr'), type: 'qr', name: 'Código QR',
      x: 74, y: 27, w: 19, h: 30,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      qrPayload: 'ID-0042-2026-A | M. F. Ríos | Verificación: ejemplo.no-valido/0042',
      qrDark: '#0b2440', qrLight: '',
    },
    makeText({
      name: 'Fecha de emisión', textPreset: 'emision',
      content: 'EMISIÓN  01 / 2026',
      x: 74, y: 59, w: 22, h: 7,
      fontSize: 9.5, fontWeight: 600, color: 'rgba(255,255,255,0.8)',
      letterSpacing: 0.8,
    }),
    makeText({
      name: 'Fecha de caducidad', textPreset: 'caducidad',
      content: 'CADUCA  01 / 2030',
      x: 74, y: 67, w: 22, h: 7,
      fontSize: 9.5, fontWeight: 600, color: 'rgba(255,255,255,0.8)',
      letterSpacing: 0.8,
    }),
    {
      id: uid('holo'), type: 'hologram', name: 'Sello holográfico',
      x: 4.5, y: 80, w: 13, h: 14.5,
      rotation: 0, opacity: 88, locked: false, hidden: false,
    },
    {
      id: uid('stamp'), type: 'stamp', name: 'Sello PROTOTIPO',
      x: 26, y: 74, w: 46, h: 15,
      rotation: -8, opacity: 100, locked: false, hidden: false,
      content: 'PROTOTIPO · EJEMPLO NO VÁLIDO',
      variant: 'band',
    },
  ]
}

/* -------------------------------------------------------------------------- */
/*  Plantilla del REVERSO                                                     */
/* -------------------------------------------------------------------------- */

function backElements(): CardElement[] {
  return [
    {
      id: uid('shape'), type: 'shape', shape: 'rect', name: 'Banda magnética',
      x: 0, y: 12, w: 100, h: 14,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      fill: '#0a0d10', radius: 0,
    },
    makeText({
      name: 'Aviso legal', textPreset: 'legal',
      content: 'DOCUMENTO DE DEMOSTRACIÓN. Esta credencial es un prototipo ' +
        'generado con fines de maquetación y no acredita identidad, ' +
        'membresía ni autorización alguna. Cualquier parecido con ' +
        'documentos reales es puramente casual.',
      x: 7, y: 32, w: 86, h: 20,
      fontSize: 9.5, fontWeight: 400, color: 'rgba(255,255,255,0.72)',
      lineHeight: 1.5, align: 'left',
    }),
    makeText({
      name: 'Firma del titular', textPreset: 'custom',
      content: 'M. F. Ríos',
      x: 7, y: 56, w: 34, h: 12,
      fontSize: 20, fontWeight: 400, font: 'serif', color: '#ffffff',
    }),
    {
      id: uid('shape'), type: 'shape', shape: 'line', name: 'Línea de firma',
      x: 7, y: 68.5, w: 34, h: 0.5,
      rotation: 0, opacity: 70, locked: false, hidden: false,
      fill: '#ffffff', borderWidth: 1.5,
    },
    makeText({
      name: 'Etiqueta firma', textPreset: 'custom',
      content: 'FIRMA DEL TITULAR',
      x: 7, y: 71, w: 34, h: 6,
      fontSize: 8.5, fontWeight: 600, color: 'rgba(255,255,255,0.6)',
      letterSpacing: 1.4,
    }),
    {
      id: uid('barcode'), type: 'barcode', name: 'Código de barras',
      x: 48, y: 52, w: 30, h: 18,
      rotation: 0, opacity: 92, locked: false, hidden: false,
      fill: '#ffffff',
    },
    {
      id: uid('qr'), type: 'qr', name: 'QR de verificación',
      x: 81, y: 50, w: 14, h: 22,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      qrPayload: 'VERIF-0042-2026-A · prototipo no válido',
      qrDark: '#101418', qrLight: '#ffffff',
    },
    {
      id: uid('shape'), type: 'shape', shape: 'rect', name: 'Fondo QR',
      x: 79.5, y: 48.5, w: 17, h: 25,
      rotation: 0, opacity: 100, locked: false, hidden: true,
      fill: '#ffffff', radius: 6,
    },
    makeText({
      name: 'Soporte / contacto', textPreset: 'custom',
      content: 'soporte@ejemplo.org  ·  +00 900 000 000  ·  ejemplo.no-valido/verificar',
      x: 7, y: 86, w: 86, h: 8,
      fontSize: 9.5, fontWeight: 500, color: 'rgba(255,255,255,0.65)',
      letterSpacing: 0.4,
    }),
  ]
}

/* -------------------------------------------------------------------------- */
/*  Fábricas de todos los tipos de elemento (usadas por el panel Elementos)   */
/* -------------------------------------------------------------------------- */

export function makePhoto(src?: string): CardElement {
  return {
    id: uid('photo'), type: 'photo', name: 'Fotografía',
    x: 8, y: 26, w: 22, h: 52,
    rotation: 0, opacity: 100, locked: false, hidden: false,
    src: src || DEFAULT_AVATAR, radius: 12, circular: false,
  }
}

export function makeLogo(src?: string): CardElement {
  return {
    id: uid('logo'), type: 'logo', name: 'Logotipo',
    x: 5, y: 6, w: 14, h: 16,
    rotation: 0, opacity: 100, locked: false, hidden: false,
    src: src || DEFAULT_LOGO, radius: 8, circular: false,
  }
}

export function makeWatermark(src?: string): CardElement {
  return {
    id: uid('wm'), type: 'logo', name: 'Marca de agua',
    x: 22, y: 12, w: 56, h: 76,
    rotation: 0, opacity: 13, locked: false, hidden: false,
    src: src || DEFAULT_WATERMARK, radius: 0, circular: false,
  }
}

export function makeQr(payload = 'https://ejemplo.no-valido/verificar'): CardElement {
  return {
    id: uid('qr'), type: 'qr', name: 'Código QR',
    x: 72, y: 30, w: 20, h: 30,
    rotation: 0, opacity: 100, locked: false, hidden: false,
    qrPayload: payload, qrDark: '#0b2440', qrLight: '',
  }
}

export function makeHologram(): CardElement {
  return {
    id: uid('holo'), type: 'hologram', name: 'Sello holográfico',
    x: 82, y: 74, w: 13, h: 14.5,
    rotation: 0, opacity: 88, locked: false, hidden: false,
  }
}

export function makeStamp(): CardElement {
  return {
    id: uid('stamp'), type: 'stamp', name: 'Sello PROTOTIPO',
    x: 24, y: 74, w: 46, h: 15,
    rotation: -8, opacity: 100, locked: false, hidden: false,
    content: 'PROTOTIPO · EJEMPLO NO VÁLIDO',
    variant: 'band',
  }
}

export function makeBarcode(): CardElement {
  return {
    id: uid('bar'), type: 'barcode', name: 'Código de barras',
    x: 30, y: 55, w: 32, h: 18,
    rotation: 0, opacity: 92, locked: false, hidden: false,
    fill: '#ffffff',
  }
}

export function makeShape(kind: 'rect' | 'circle' | 'line' | 'ring'): CardElement {
  return {
    id: uid('shape'), type: 'shape', shape: kind,
    name: kind === 'rect' ? 'Rectángulo' : kind === 'circle' ? 'Círculo' : kind === 'line' ? 'Línea' : 'Anillo',
    x: 32, y: 40, w: kind === 'line' ? 34 : 18, h: kind === 'line' ? 1 : 18,
    rotation: 0, opacity: 55, locked: false, hidden: false,
    fill: '#ffffff', radius: 6, borderWidth: kind === 'ring' ? 2 : 1.5,
  }
}

export function textField(kind: Extract<CardElement['textPreset'], string>): CardElement {
  switch (kind) {
    case 'nombre':
      return makeText({ name: 'Nombre completo', textPreset: kind, content: 'Nombre y Apellidos', fontSize: 24, fontWeight: 800, y: 30 })
    case 'cargo':
      return makeText({ name: 'Cargo', textPreset: kind, content: 'Cargo o Puesto', fontSize: 16, fontWeight: 500, color: '#7fd8e8', y: 44 })
    case 'empleadoId':
      return makeText({ name: 'ID de empleado', textPreset: kind, content: 'ID  0000-0000', fontSize: 15, fontWeight: 700, font: 'mono', letterSpacing: 1.5, y: 56 })
    case 'departamento':
      return makeText({ name: 'Departamento', textPreset: kind, content: 'DEPARTAMENTO / ÁREA', fontSize: 12, fontWeight: 600, uppercase: true, letterSpacing: 1.2, y: 64 })
    case 'emision':
      return makeText({ name: 'Fecha de emisión', textPreset: kind, content: 'EMISIÓN  MM / AAAA', fontSize: 10, fontWeight: 600, letterSpacing: 0.8, y: 72 })
    case 'caducidad':
      return makeText({ name: 'Fecha de caducidad', textPreset: kind, content: 'CADUCA  MM / AAAA', fontSize: 10, fontWeight: 600, letterSpacing: 0.8, y: 80 })
    case 'entidad':
      return makeText({ name: 'Entidad', textPreset: kind, content: 'NOMBRE DE LA ENTIDAD', fontSize: 14, fontWeight: 700, uppercase: true, letterSpacing: 1.5, color: '#7fd8e8', y: 7, x: 22, w: 60 })
    case 'legal':
      return makeText({ name: 'Aviso legal', textPreset: kind, content: 'Texto legal de la credencial…', fontSize: 9.5, fontWeight: 400, lineHeight: 1.5, y: 30 })
    default:
      return makeText({ name: 'Texto' })
  }
}

export function defaultDoc(_format?: FormatKey): DesignerDoc {
  return {
    format: 'badge3x2h',
    front: { bg: makeFrontBg(), elements: frontElements() },
    back: { bg: makeBackBg(), elements: backElements() },
  }
}

/** Plantilla neutra clara (usada al restablecer con fondo blanco) */
export function blankSide(): SideDesign {
  return {
    bg: {
      ...makeFrontBg(),
      fillMode: 'gradient',
      gradient: {
        kind: 'linear', angle: 160,
        stops: [{ color: '#f4f6f8', pos: 0 }, { color: '#dde5ec', pos: 100 }],
      },
      pattern: 'none', patternOpacity: 8,
      decor: 'stripe-top', decorColor: '#14507c', decorOpacity: 90,
      blobs: false,
    },
    elements: [],
  }
}

export { DEFAULT_WATERMARK }
