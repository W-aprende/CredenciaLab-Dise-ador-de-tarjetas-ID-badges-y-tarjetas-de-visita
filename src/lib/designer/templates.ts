/**
 * ============================================================================
 *  templates.ts — Catálogo de plantillas completas (anverso + reverso)
 * ============================================================================
 *  Cada plantilla es un diseño cerrado y profesional: fondo (degradado +
 *  patrón + decoración), tipografías, disposición de foto/datos/QR, holograma
 *  y el sello «PROTOTIPO · EJEMPLO NO VÁLIDO».
 *
 *  Los constructores paramétricos (badgeFront / centeredFront / businessFront)
 *  evitan duplicar geometría: cada plantilla sólo declara paleta, patrones,
 *  tipografías y contenidos.
 * ============================================================================
 */

import type {
  BackgroundConfig, CardElement, CardFont, DecorKey, DesignerDoc,
  PatternKey, SideDesign,
} from './types'
import { DEFAULT_AVATAR, DEFAULT_LOGO, FINTECH_ART, GE_EMBLEM } from './assets'
import { makeText, uid } from './defaults'

/* -------------------------------------------------------------------------- */
/*  Helpers de fondo                                                          */
/* -------------------------------------------------------------------------- */

interface BgOpts {
  stops: { color: string; pos: number }[]
  solid?: string
  kind?: 'linear' | 'radial'
  angle?: number
  pattern: PatternKey
  patternOpacity: number
  decor: DecorKey
  decorOpacity: number
  accent: string
  blobs?: boolean
  blobColor?: string
  blobOpacity?: number
}

function bg(o: BgOpts): BackgroundConfig {
  return {
    fillMode: 'gradient',
    solid: o.solid ?? o.stops[0].color,
    gradient: { kind: o.kind ?? 'linear', angle: o.angle ?? 135, stops: o.stops },
    pattern: o.pattern,
    patternColor: '#ffffff',
    patternOpacity: o.patternOpacity,
    decor: o.decor,
    decorColor: o.accent,
    decorOpacity: o.decorOpacity,
    blobs: o.blobs ?? true,
    blobColor: o.blobColor ?? o.accent,
    blobOpacity: o.blobOpacity ?? 20,
  }
}

/* -------------------------------------------------------------------------- */
/*  Layout A · Carné con foto lateral (izquierda o derecha)                   */
/* -------------------------------------------------------------------------- */

interface BadgeOpts {
  accent: string
  text: string
  soft: string
  entityLabel: string
  person: { name: string; role: string; dept: string; id: string }
  qr: string
  photoSide?: 'left' | 'right'
  circularPhoto?: boolean
  nameFont?: CardFont
  nameSize?: number
  idFont?: CardFont
  entityFont?: CardFont
  uppercaseName?: boolean
}

function badgeFront(o: BadgeOpts): CardElement[] {
  const left = (o.photoSide ?? 'left') === 'left'
  const photoX = left ? 5.5 : 73.5
  const colX = left ? 31 : 6
  const colW = left ? 41 : 62
  const qrX = left ? 74 : 71
  const logoX = left ? 4.5 : 80
  const entityX = left ? 20 : 6
  return [
    {
      id: uid('logo'), type: 'logo', name: 'Logotipo',
      x: logoX, y: 6, w: 13, h: 16,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      src: DEFAULT_LOGO, radius: 10, circular: false,
    },
    makeText({
      name: 'Entidad', textPreset: 'entidad',
      content: o.entityLabel,
      x: entityX, y: 6.5, w: left ? 55 : 70, h: 14,
      fontSize: 15, fontWeight: 700, letterSpacing: 1.5,
      color: o.accent, uppercase: true, lineHeight: 1.35,
      font: o.entityFont ?? 'sans',
    }),
    {
      id: uid('photo'), type: 'photo', name: 'Fotografía',
      x: photoX, y: 27, w: 21, h: 52,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      src: DEFAULT_AVATAR, radius: o.circularPhoto ? 200 : 12, circular: !!o.circularPhoto,
    },
    makeText({
      name: 'Nombre completo', textPreset: 'nombre',
      content: o.person.name,
      x: colX, y: 30, w: colW, h: 13,
      fontSize: o.nameSize ?? 24, fontWeight: 800, color: o.text,
      lineHeight: 1.2, font: o.nameFont ?? 'sans',
      uppercase: o.uppercaseName ?? false,
    }),
    makeText({
      name: 'Cargo', textPreset: 'cargo',
      content: o.person.role,
      x: colX, y: 44, w: colW, h: 9,
      fontSize: 15, fontWeight: 500, color: o.accent, letterSpacing: 0.4,
    }),
    makeText({
      name: 'Departamento', textPreset: 'departamento',
      content: o.person.dept,
      x: colX, y: 54, w: colW, h: 8,
      fontSize: 11.5, fontWeight: 600, color: o.soft,
      letterSpacing: 1.2, uppercase: true,
    }),
    makeText({
      name: 'ID de empleado', textPreset: 'empleadoId',
      content: o.person.id,
      x: colX, y: 64, w: colW - 1, h: 10,
      fontSize: 15, fontWeight: 700, font: o.idFont ?? 'mono', color: o.text,
      letterSpacing: 1.5,
    }),
    {
      id: uid('qr'), type: 'qr', name: 'Código QR',
      x: qrX, y: 27, w: 19, h: 30,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      qrPayload: o.qr, qrDark: '#0b2440', qrLight: '',
    },
    makeText({
      name: 'Fecha de emisión', textPreset: 'emision',
      content: 'EMISIÓN  01 / 2026',
      x: qrX, y: 59, w: 22, h: 7,
      fontSize: 9.5, fontWeight: 600, color: o.soft, letterSpacing: 0.8,
    }),
    makeText({
      name: 'Fecha de caducidad', textPreset: 'caducidad',
      content: 'CADUCA  01 / 2030',
      x: qrX, y: 67, w: 22, h: 7,
      fontSize: 9.5, fontWeight: 600, color: o.soft, letterSpacing: 0.8,
    }),
    {
      id: uid('holo'), type: 'hologram', name: 'Sello holográfico',
      x: left ? 4.5 : 82, y: 80, w: 13, h: 14.5,
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
/*  Layout B · Acreditación centrada (eventos, vertical-friendly)             */
/* -------------------------------------------------------------------------- */

interface CenteredOpts {
  accent: string
  text: string
  soft: string
  tagLabel: string
  org: string
  person: { name: string; role: string; id: string }
  qr: string
  nameFont?: CardFont
}

function centeredFront(o: CenteredOpts): CardElement[] {
  return [
    makeText({
      name: 'Organización', textPreset: 'entidad',
      content: o.org,
      x: 8, y: 6, w: 84, h: 9,
      fontSize: 14, fontWeight: 700, color: o.accent,
      align: 'center', letterSpacing: 2.5, uppercase: true,
    }),
    {
      id: uid('photo'), type: 'photo', name: 'Fotografía',
      x: 37, y: 17, w: 26, h: 30,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      src: DEFAULT_AVATAR, radius: 200, circular: true,
    },
    makeText({
      name: 'Tipo de acreditación', textPreset: 'custom',
      content: o.tagLabel,
      x: 26, y: 49, w: 48, h: 8,
      fontSize: 11, fontWeight: 700, color: o.text,
      align: 'center', letterSpacing: 3, uppercase: true,
    }),
    makeText({
      name: 'Nombre completo', textPreset: 'nombre',
      content: o.person.name,
      x: 10, y: 58, w: 80, h: 12,
      fontSize: 22, fontWeight: 800, color: o.text,
      align: 'center', font: o.nameFont ?? 'sans',
    }),
    makeText({
      name: 'Cargo / Rol', textPreset: 'cargo',
      content: o.person.role,
      x: 14, y: 70, w: 72, h: 7,
      fontSize: 12.5, fontWeight: 500, color: o.accent, align: 'center',
    }),
    makeText({
      name: 'ID de asistente', textPreset: 'empleadoId',
      content: o.person.id,
      x: 20, y: 78, w: 60, h: 8,
      fontSize: 12, fontWeight: 700, font: 'mono', color: o.soft,
      align: 'center', letterSpacing: 2,
    }),
    {
      id: uid('qr'), type: 'qr', name: 'QR de acceso',
      x: 4.5, y: 78, w: 13, h: 18,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      qrPayload: o.qr, qrDark: '#33061b', qrLight: '',
    },
    {
      id: uid('holo'), type: 'hologram', name: 'Sello holográfico',
      x: 82.5, y: 78, w: 13, h: 14.5,
      rotation: 0, opacity: 88, locked: false, hidden: false,
    },
    {
      id: uid('stamp'), type: 'stamp', name: 'Sello PROTOTIPO',
      x: 22, y: 87.5, w: 56, h: 10.5,
      rotation: -7, opacity: 100, locked: false, hidden: false,
      content: 'PROTOTIPO · EJEMPLO NO VÁLIDO',
      variant: 'band',
    },
  ]
}

/* -------------------------------------------------------------------------- */
/*  Layout C · Tarjeta de visita (sin foto, contacto protagonista)            */
/* -------------------------------------------------------------------------- */

interface BusinessOpts {
  accent: string
  text: string
  soft: string
  entityLabel: string
  person: { name: string; role: string; dept: string }
  contacts: string[]
  qr: string
  nameFont?: CardFont
  nameSize?: number
  logoSide?: 'left' | 'right'
  dividerStyle?: 'solid' | 'dashed' | 'dotted' | 'double'
}

function businessFront(o: BusinessOpts): CardElement[] {
  const logoRight = (o.logoSide ?? 'right') === 'right'
  return [
    {
      id: uid('logo'), type: 'logo', name: 'Logotipo',
      x: logoRight ? 80.5 : 5, y: 7, w: 14.5, h: 17,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      src: DEFAULT_LOGO, radius: 10, circular: false,
    },
    makeText({
      name: 'Entidad', textPreset: 'entidad',
      content: o.entityLabel,
      x: logoRight ? 6 : 22, y: 9, w: 72, h: 13,
      fontSize: 17, fontWeight: 700, letterSpacing: 1.8,
      color: o.accent, uppercase: true, lineHeight: 1.3,
    }),
    makeText({
      name: 'Nombre completo', textPreset: 'nombre',
      content: o.person.name,
      x: 6, y: 36, w: 66, h: 14,
      fontSize: o.nameSize ?? 26, fontWeight: 700, color: o.text,
      font: o.nameFont ?? 'sans', lineHeight: 1.15,
    }),
    makeText({
      name: 'Cargo', textPreset: 'cargo',
      content: o.person.role,
      x: 6, y: 51, w: 66, h: 8,
      fontSize: 14, fontWeight: 500, color: o.accent, letterSpacing: 0.4,
    }),
    makeText({
      name: 'Departamento', textPreset: 'departamento',
      content: o.person.dept,
      x: 6, y: 59.5, w: 66, h: 7,
      fontSize: 10.5, fontWeight: 600, color: o.soft,
      letterSpacing: 1.2, uppercase: true,
    }),
    {
      id: uid('shape'), type: 'shape', shape: 'line', name: 'Línea divisoria',
      x: 6, y: 70, w: 60, h: 1,
      rotation: 0, opacity: 75, locked: false, hidden: false,
      fill: o.accent, borderWidth: 1.5,
      strokeStyle: o.dividerStyle ?? 'solid', borderColor: o.accent,
    },
    ...o.contacts.map((line, i) =>
      makeText({
        name: `Contacto ${i + 1}`, textPreset: 'custom',
        content: line,
        x: 6, y: 74.5 + i * 7.5, w: 70, h: 7,
        fontSize: 10.5, fontWeight: 500, color: o.soft, letterSpacing: 0.3,
      }),
    ),
    {
      id: uid('qr'), type: 'qr', name: 'Código QR',
      x: 80, y: 72, w: 14.5, h: 22,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      qrPayload: o.qr, qrDark: '#101418', qrLight: '',
    },
    {
      id: uid('stamp'), type: 'stamp', name: 'Sello PROTOTIPO',
      x: 27, y: 87.5, w: 46, h: 9.5,
      rotation: -6, opacity: 90, locked: false, hidden: false,
      content: 'PROTOTIPO · EJEMPLO NO VÁLIDO',
      variant: 'band',
    },
  ]
}

/* -------------------------------------------------------------------------- */
/*  Reverso estándar (paramétrico)                                            */
/* -------------------------------------------------------------------------- */

interface BackOpts {
  bgOpts: BgOpts
  text: string
  soft: string
  accent: string
  barcodeColor?: string
  qrDark?: string
}

function standardBack(o: BackOpts): SideDesign {
  return {
    bg: bg(o.bgOpts),
    elements: [
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
        fontSize: 9.5, fontWeight: 400, color: o.soft,
        lineHeight: 1.5, align: 'left',
      }),
      makeText({
        name: 'Firma del titular', textPreset: 'custom',
        content: 'M. F. Ríos',
        x: 7, y: 56, w: 34, h: 12,
        fontSize: 20, fontWeight: 400, font: 'serif', color: o.text,
      }),
      {
        id: uid('shape'), type: 'shape', shape: 'line', name: 'Línea de firma',
        x: 7, y: 68.5, w: 34, h: 0.5,
        rotation: 0, opacity: 70, locked: false, hidden: false,
        fill: o.text, borderWidth: 1.5,
      },
      makeText({
        name: 'Etiqueta firma', textPreset: 'custom',
        content: 'FIRMA DEL TITULAR',
        x: 7, y: 71, w: 34, h: 6,
        fontSize: 8.5, fontWeight: 600, color: o.soft, letterSpacing: 1.4,
      }),
      {
        id: uid('barcode'), type: 'barcode', name: 'Código de barras',
        x: 48, y: 52, w: 30, h: 18,
        rotation: 0, opacity: 92, locked: false, hidden: false,
        fill: o.barcodeColor ?? '#ffffff',
      },
      {
        id: uid('qr'), type: 'qr', name: 'QR de verificación',
        x: 81, y: 50, w: 14, h: 22,
        rotation: 0, opacity: 100, locked: false, hidden: false,
        qrPayload: 'VERIF-0042-2026-A · prototipo no válido',
        qrDark: o.qrDark ?? '#101418', qrLight: '#ffffff',
      },
      makeText({
        name: 'Soporte / contacto', textPreset: 'custom',
        content: 'soporte@ejemplo.org  ·  +00 900 000 000  ·  ejemplo.no-valido/verificar',
        x: 7, y: 86, w: 86, h: 8,
        fontSize: 9.5, fontWeight: 500, color: o.soft, letterSpacing: 0.4,
      }),
    ],
  }
}

/** Reverso ligero para tarjetas de visita (sin banda magnética ni barcode) */
function businessBack(o: BackOpts): SideDesign {
  return {
    bg: bg(o.bgOpts),
    elements: [
      makeText({
        name: 'Nota', textPreset: 'custom',
        content: 'Documento de demostración generado con fines de maquetación. ' +
          'No acredita identidad ni autorización alguna.',
        x: 7, y: 14, w: 86, h: 14,
        fontSize: 9.5, fontWeight: 400, color: o.soft, lineHeight: 1.55,
      }),
      {
        id: uid('shape'), type: 'shape', shape: 'line', name: 'Línea divisoria',
        x: 7, y: 32, w: 86, h: 0.6,
        rotation: 0, opacity: 45, locked: false, hidden: false,
        fill: o.accent, borderWidth: 1,
      },
      makeText({
        name: 'Dirección', textPreset: 'custom',
        content: 'Calle Ejemplo 123, 4.º B · 28000 Ciudad (prototipo)',
        x: 7, y: 40, w: 86, h: 8,
        fontSize: 11, fontWeight: 500, color: o.text, letterSpacing: 0.3,
      }),
      makeText({
        name: 'Web y correo', textPreset: 'custom',
        content: 'www.ejemplo.no-valido  ·  hola@ejemplo.org',
        x: 7, y: 49, w: 86, h: 8,
        fontSize: 11, fontWeight: 500, color: o.text, letterSpacing: 0.3,
      }),
      {
        id: uid('qr'), type: 'qr', name: 'QR de contacto',
        x: 7, y: 62, w: 22, h: 26,
        rotation: 0, opacity: 100, locked: false, hidden: false,
        qrPayload: 'BEGIN:VCARD\nVERSION:3.0\nFN:María Fernanda Ríos\nORG:Estudio Ejemplo\nTEL:+00 900 000 000\nEMAIL:hola@ejemplo.org\nEND:VCARD',
        qrDark: o.qrDark ?? '#101418', qrLight: '',
      },
      makeText({
        name: 'Lema', textPreset: 'custom',
        content: '«Diseño, identidad y confianza»',
        x: 34, y: 70, w: 59, h: 10,
        fontSize: 14, fontWeight: 400, font: 'serif', color: o.accent,
        align: 'right',
      }),
      {
        id: uid('stamp'), type: 'stamp', name: 'Sello PROTOTIPO',
        x: 30, y: 85, w: 42, h: 10,
        rotation: -6, opacity: 88, locked: false, hidden: false,
        content: 'PROTOTIPO · EJEMPLO NO VÁLIDO',
        variant: 'band',
      },
    ],
  }
}

/* -------------------------------------------------------------------------- */
/*  Layout D · Credencial ministerial vertical (estilo Ministerio de Hacienda) */
/* -------------------------------------------------------------------------- */

interface GovOpts {
  wedgeColor: string      // verde de la cuña y del marco de la foto
  ink: string             // tinta principal (títulos y valores)
  label: string           // color de las etiquetas grises
  entityLabel: string
  entitySub: string
  person: { name: string; role: string; id: string; dept: string; expiry: string }
  qr: string
}

function govFront(o: GovOpts): CardElement[] {
  return [
    /* Escudo institucional sobre la cuña */
    {
      id: uid('logo'), type: 'logo', name: 'Escudo institucional',
      x: 4.5, y: 4.5, w: 19, h: 23,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      src: GE_EMBLEM, radius: 0, circular: false,
    },
    makeText({
      name: 'Entidad', textPreset: 'entidad',
      content: o.entityLabel,
      x: 36.5, y: 5.5, w: 55, h: 14.5,
      fontSize: 16, fontWeight: 800, color: o.ink,
      lineHeight: 1.18, letterSpacing: 0.3, font: 'arial',
    }),
    makeText({
      name: 'País', textPreset: 'custom',
      content: o.entitySub,
      x: 36.5, y: 20, w: 55, h: 4.5,
      fontSize: 9.5, fontWeight: 500, color: 'rgba(22,50,74,0.72)',
      letterSpacing: 1.4, font: 'arial',
    }),
    /* Marco de la foto (alfombra blanca + borde verde) */
    {
      id: uid('shape'), type: 'shape', shape: 'rect', name: 'Marco de foto',
      x: 7.5, y: 28.5, w: 36, h: 29.5,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      fill: '#ffffff', radius: 3, borderColor: o.wedgeColor, borderWidth: 2,
    },
    {
      id: uid('photo'), type: 'photo', name: 'Fotografía',
      x: 9.2, y: 30.2, w: 32.6, h: 26.2,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      src: DEFAULT_AVATAR, radius: 2, circular: false,
    },
    {
      id: uid('qr'), type: 'qr', name: 'Código QR',
      x: 56, y: 28.5, w: 25, h: 20.5,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      qrPayload: o.qr, qrDark: '#16324a', qrLight: '',
    },
    {
      id: uid('holo'), type: 'hologram', name: 'Sello holográfico',
      x: 75.5, y: 52, w: 15, h: 12.5,
      rotation: 0, opacity: 90, locked: false, hidden: false,
    },
    /* Arte financiero decorativo (zona inferior derecha) */
    {
      id: uid('logo'), type: 'logo', name: 'Arte financiero',
      x: 51, y: 70.5, w: 47, h: 26.5,
      rotation: 0, opacity: 42, locked: false, hidden: false,
      src: FINTECH_ART, radius: 0, circular: false,
    },
    /* Campos de datos */
    makeText({
      name: 'Etiqueta nombre', textPreset: 'custom',
      content: 'NOMBRE COMPLETO:',
      x: 7, y: 59.3, w: 55, h: 2.9,
      fontSize: 7.5, fontWeight: 600, color: o.label, letterSpacing: 0.6, font: 'arial',
    }),
    makeText({
      name: 'Nombre completo', textPreset: 'nombre',
      content: o.person.name,
      x: 7, y: 62.1, w: 70, h: 6,
      fontSize: 13.5, fontWeight: 800, color: o.ink, font: 'arial', lineHeight: 1.15,
    }),
    makeText({
      name: 'Etiqueta cargo', textPreset: 'custom',
      content: 'CARGO:',
      x: 7, y: 68.5, w: 40, h: 2.9,
      fontSize: 7.5, fontWeight: 600, color: o.label, letterSpacing: 0.6, font: 'arial',
    }),
    makeText({
      name: 'Cargo', textPreset: 'cargo',
      content: o.person.role,
      x: 7, y: 71.3, w: 62, h: 4.5,
      fontSize: 10.5, fontWeight: 700, color: o.ink, font: 'arial',
    }),
    makeText({
      name: 'Etiqueta N.º empleado', textPreset: 'custom',
      content: 'Nº EMPLEADO:',
      x: 7, y: 76.2, w: 40, h: 2.9,
      fontSize: 7.5, fontWeight: 600, color: o.label, letterSpacing: 0.6, font: 'arial',
    }),
    makeText({
      name: 'ID de empleado', textPreset: 'empleadoId',
      content: o.person.id,
      x: 7, y: 79, w: 40, h: 4.5,
      fontSize: 10.5, fontWeight: 700, color: o.ink, font: 'arial', letterSpacing: 0.6,
    }),
    makeText({
      name: 'Etiqueta departamento', textPreset: 'custom',
      content: 'DEPARTAMENTO:',
      x: 7, y: 83.9, w: 40, h: 2.9,
      fontSize: 7.5, fontWeight: 600, color: o.label, letterSpacing: 0.6, font: 'arial',
    }),
    makeText({
      name: 'Departamento', textPreset: 'departamento',
      content: o.person.dept,
      x: 7, y: 86.7, w: 56, h: 4.5,
      fontSize: 10.5, fontWeight: 700, color: o.ink, font: 'arial',
    }),
    makeText({
      name: 'Fecha de caducidad', textPreset: 'caducidad',
      content: `FECHA DE CADUCIDAD:  ${o.person.expiry}`,
      x: 7, y: 91.6, w: 60, h: 3.2,
      fontSize: 8, fontWeight: 700, color: o.ink, font: 'arial', letterSpacing: 0.4,
    }),
    /* Banda inferior con leyenda */
    {
      id: uid('shape'), type: 'shape', shape: 'rect', name: 'Banda inferior',
      x: 1, y: 95, w: 98, h: 5,
      rotation: 0, opacity: 100, locked: false, hidden: false,
      fill: '#e2e8ee', radius: 6,
    },
    makeText({
      name: 'Leyenda prototipo', textPreset: 'legal',
      content: 'PROTOTIPO · EJEMPLO NO VÁLIDO',
      x: 15, y: 95.4, w: 70, h: 4,
      fontSize: 7.5, fontWeight: 700, color: '#5b6b7a',
      align: 'center', letterSpacing: 1.2, font: 'arial',
    }),
  ]
}

/** Reverso ministerial claro, coherente con el anverso */
function govBack(o: GovOpts): SideDesign {
  return {
    bg: bg({
      stops: [{ color: '#eef3f7', pos: 0 }, { color: '#e2e9f0', pos: 100 }],
      angle: 160,
      pattern: 'microline', patternOpacity: 4,
      decor: 'stripe-top', decorOpacity: 90,
      accent: o.wedgeColor,
      blobs: false,
    }),
    elements: [
      {
        id: uid('shape'), type: 'shape', shape: 'rect', name: 'Banda magnética',
        x: 0, y: 9, w: 100, h: 13,
        rotation: 0, opacity: 100, locked: false, hidden: false,
        fill: '#12171c', radius: 0,
      },
      makeText({
        name: 'Aviso legal', textPreset: 'legal',
        content: 'DOCUMENTO DE DEMOSTRACIÓN. Esta credencial es un prototipo ' +
          'generado con fines de maquetación y no acredita identidad, ' +
          'membresía ni autorización alguna. Cualquier parecido con ' +
          'documentos reales es puramente casual.',
        x: 7, y: 27, w: 86, h: 18,
        fontSize: 8.5, fontWeight: 400, color: 'rgba(22,50,74,0.75)',
        lineHeight: 1.55, align: 'left', font: 'arial',
      }),
      makeText({
        name: 'Firma del titular', textPreset: 'custom',
        content: 'A. M. Obiang',
        x: 7, y: 50, w: 34, h: 10,
        fontSize: 17, fontWeight: 400, font: 'serif', color: o.ink,
      }),
      {
        id: uid('shape'), type: 'shape', shape: 'line', name: 'Línea de firma',
        x: 7, y: 60.5, w: 34, h: 0.5,
        rotation: 0, opacity: 70, locked: false, hidden: false,
        fill: o.ink, borderWidth: 1.5,
      },
      makeText({
        name: 'Etiqueta firma', textPreset: 'custom',
        content: 'FIRMA DEL TITULAR',
        x: 7, y: 62.5, w: 34, h: 5.5,
        fontSize: 7.5, fontWeight: 600, color: 'rgba(22,50,74,0.6)', letterSpacing: 1.4, font: 'arial',
      }),
      {
        id: uid('barcode'), type: 'barcode', name: 'Código de barras',
        x: 46, y: 49, w: 30, h: 16,
        rotation: 0, opacity: 92, locked: false, hidden: false,
        fill: o.ink,
      },
      {
        id: uid('qr'), type: 'qr', name: 'QR de verificación',
        x: 79, y: 47, w: 15, h: 20,
        rotation: 0, opacity: 100, locked: false, hidden: false,
        qrPayload: 'VERIF-GE2024001 · prototipo no válido',
        qrDark: o.ink, qrLight: '#ffffff',
      },
      {
        id: uid('stamp'), type: 'stamp', name: 'Sello PROTOTIPO',
        x: 26, y: 76, w: 48, h: 11,
        rotation: -6, opacity: 100, locked: false, hidden: false,
        content: 'PROTOTIPO · EJEMPLO NO VÁLIDO',
        variant: 'band',
      },
      makeText({
        name: 'Soporte / contacto', textPreset: 'custom',
        content: 'soporte@hacienda.ejemplo  ·  +240 000 000 000  ·  ejemplo.no-valido/verificar',
        x: 7, y: 90, w: 86, h: 7,
        fontSize: 8, fontWeight: 500, color: 'rgba(22,50,74,0.65)', letterSpacing: 0.4, font: 'arial',
      }),
    ],
  }
}

/* -------------------------------------------------------------------------- */
/*  Catálogo de plantillas                                                    */
/* -------------------------------------------------------------------------- */

export interface TemplatePreset {
  key: string
  label: string
  desc: string
  /** tres colores para la miniatura del selector */
  swatch: [string, string, string]
  build: () => DesignerDoc
}

export const TEMPLATES: TemplatePreset[] = [
  /* 1 ── Clásico institucional (el diseño inicial de la app) ─────────────── */
  {
    key: 'clasico',
    label: 'Clásico institucional',
    desc: 'Azul degradado, guilloché y foto lateral. El diseño inicial.',
    swatch: ['#0b2440', '#14507c', '#1c7fa6'],
    build: () => ({
      format: 'badge3x2h',
      front: {
        bg: bg({
          stops: [
            { color: '#0b2440', pos: 0 }, { color: '#14507c', pos: 55 }, { color: '#1c7fa6', pos: 100 },
          ],
          pattern: 'guilloche', patternOpacity: 9, decor: 'stripe-left', decorOpacity: 85,
          accent: '#7fd8e8', blobColor: '#3fb6d9',
        }),
        elements: badgeFront({
          accent: '#7fd8e8', text: '#ffffff', soft: 'rgba(255,255,255,0.75)',
          entityLabel: 'INSTITUTO NACIONAL\nDE CREDENCIALES',
          person: { name: 'María Fernanda Ríos', role: 'Ingeniera Senior de Sistemas', dept: 'DIR. TECNOLOGÍA · DT-04', id: 'ID  0042-2026-A' },
          qr: 'ID-0042-2026-A | M. F. Ríos | Verificación: ejemplo.no-valido/0042',
        }),
      },
      back: standardBack({
        bgOpts: {
          stops: [{ color: '#101418', pos: 0 }, { color: '#232a31', pos: 100 }],
          angle: 45, pattern: 'circuit', patternOpacity: 6,
          decor: 'stripe-top', decorOpacity: 70, accent: '#7fd8e8', blobs: false,
        },
        text: '#ffffff', soft: 'rgba(255,255,255,0.72)', accent: '#7fd8e8',
      }),
    }),
  },

  /* 2 ── Ejecutivo grafito ───────────────────────────────────────────────── */
  {
    key: 'ejecutivo',
    label: 'Ejecutivo grafito',
    desc: 'Gris oscuro minimal con acentos dorados y tipografía serif.',
    swatch: ['#101418', '#232a31', '#3a4550'],
    build: () => ({
      format: 'badge3x2h',
      front: {
        bg: bg({
          stops: [
            { color: '#101418', pos: 0 }, { color: '#232a31', pos: 60 }, { color: '#3a4550', pos: 100 },
          ],
          pattern: 'grid', patternOpacity: 6, decor: 'frame', decorOpacity: 55,
          accent: '#d4b36a', blobColor: '#5d6b77', blobOpacity: 16,
        }),
        elements: badgeFront({
          accent: '#d4b36a', text: '#f5f2ea', soft: 'rgba(245,242,234,0.7)',
          entityLabel: 'GRUPO CORPORATIVO\nALTAMIRA',
          person: { name: 'Carlos Andrés Vega', role: 'Director Financiero', dept: 'CONSEJO DE DIRECCIÓN', id: 'ID  0017-2026-B' },
          qr: 'ID-0017-2026-B | C. A. Vega | Verificación: ejemplo.no-valido/0017',
          nameFont: 'garamond', nameSize: 26, entityFont: 'sans',
        }),
      },
      back: standardBack({
        bgOpts: {
          stops: [{ color: '#0d1013', pos: 0 }, { color: '#1d232a', pos: 100 }],
          angle: 45, pattern: 'grid', patternOpacity: 5,
          decor: 'double-frame', decorOpacity: 40, accent: '#d4b36a', blobs: false,
        },
        text: '#f5f2ea', soft: 'rgba(245,242,234,0.66)', accent: '#d4b36a',
      }),
    }),
  },

  /* 3 ── Salud esmeralda ─────────────────────────────────────────────────── */
  {
    key: 'salud',
    label: 'Salud esmeralda',
    desc: 'Verde sanitario, foto circular a la derecha y ondas finas.',
    swatch: ['#04291f', '#0b5c43', '#1d9a6c'],
    build: () => ({
      format: 'badge3x2h',
      front: {
        bg: bg({
          stops: [
            { color: '#04291f', pos: 0 }, { color: '#0b5c43', pos: 60 }, { color: '#1d9a6c', pos: 100 },
          ],
          pattern: 'waves', patternOpacity: 8, decor: 'side-band', decorOpacity: 80,
          accent: '#8ff0c6', blobColor: '#27c08b',
        }),
        elements: badgeFront({
          accent: '#8ff0c6', text: '#ffffff', soft: 'rgba(255,255,255,0.78)',
          entityLabel: 'HOSPITAL GENERAL\nSAN MIGUEL',
          person: { name: 'Lucía Herrera Martín', role: 'Dra. Medicina Interna', dept: 'SERVICIO DE URGENCIAS', id: 'COL  08-11245' },
          qr: 'COL-08-11245 | L. Herrera | Verificación: ejemplo.no-valido/11245',
          photoSide: 'right', circularPhoto: true, nameFont: 'verdana', nameSize: 21,
        }),
      },
      back: standardBack({
        bgOpts: {
          stops: [{ color: '#06251c', pos: 0 }, { color: '#0e4a37', pos: 100 }],
          angle: 135, pattern: 'waves', patternOpacity: 6,
          decor: 'stripe-top', decorOpacity: 75, accent: '#8ff0c6', blobs: false,
        },
        text: '#ffffff', soft: 'rgba(255,255,255,0.72)', accent: '#8ff0c6',
      }),
    }),
  },

  /* 4 ── Acreditación de evento ──────────────────────────────────────────── */
  {
    key: 'evento',
    label: 'Acreditación de evento',
    desc: 'Foto circular centrada tipo backstage, borgoña y puntos.',
    swatch: ['#33061b', '#6e1230', '#a01d3f'],
    build: () => ({
      format: 'badge3x2v',
      front: {
        bg: bg({
          stops: [
            { color: '#33061b', pos: 0 }, { color: '#6e1230', pos: 58 }, { color: '#a01d3f', pos: 100 },
          ],
          pattern: 'dots', patternOpacity: 9, decor: 'corner-arc', decorOpacity: 60,
          accent: '#f4a9bc', blobColor: '#d34b6f',
        }),
        elements: centeredFront({
          accent: '#f4a9bc', text: '#ffffff', soft: 'rgba(255,255,255,0.75)',
          tagLabel: 'ASISTENTE · VIP',
          org: 'CUMBRE TECNOLÓGICA 2026',
          person: { name: 'Elena Castillo Ruiz', role: 'Ponente invitada', id: 'EVT  26-00871' },
          qr: 'EVT-26-00871 | E. Castillo | ACCESO VIP · prototipo',
          nameFont: 'trebuchet',
        }),
      },
      back: businessBack({
        bgOpts: {
          stops: [{ color: '#2a0515', pos: 0 }, { color: '#571027', pos: 100 }],
          angle: 160, pattern: 'dots', patternOpacity: 7,
          decor: 'stripe-bottom', decorOpacity: 70, accent: '#f4a9bc', blobs: false,
        },
        text: '#ffffff', soft: 'rgba(255,255,255,0.7)', accent: '#f4a9bc',
        qrDark: '#2a0515',
      }),
    }),
  },

  /* 5 ── Tecno violeta ───────────────────────────────────────────────────── */
  {
    key: 'tecno',
    label: 'Tecno violeta',
    desc: 'Patrón de circuito, violeta moderno e ID monoespaciado.',
    swatch: ['#23103f', '#45207a', '#7c3aed'],
    build: () => ({
      format: 'badge3x2h',
      front: {
        bg: bg({
          stops: [
            { color: '#23103f', pos: 0 }, { color: '#45207a', pos: 55 }, { color: '#7c3aed', pos: 100 },
          ],
          pattern: 'circuit', patternOpacity: 10, decor: 'stripe-top', decorOpacity: 80,
          accent: '#d8b4fe', blobColor: '#9f67fa',
        }),
        elements: badgeFront({
          accent: '#d8b4fe', text: '#ffffff', soft: 'rgba(255,255,255,0.75)',
          entityLabel: 'NEXUS LABS\nDIVISIÓN DE I+D',
          person: { name: 'Diego Alejandro Fontán', role: 'Arquitecto de Software', dept: 'PLATAFORMAS CLOUD', id: 'NX-DEV-0342' },
          qr: 'NX-DEV-0342 | D. Fontán | Verificación: ejemplo.no-valido/0342',
        }),
      },
      back: standardBack({
        bgOpts: {
          stops: [{ color: '#1a0c30', pos: 0 }, { color: '#37165f', pos: 100 }],
          angle: 45, pattern: 'circuit', patternOpacity: 8,
          decor: 'frame', decorOpacity: 45, accent: '#d8b4fe', blobs: false,
        },
        text: '#ffffff', soft: 'rgba(255,255,255,0.7)', accent: '#d8b4fe',
      }),
    }),
  },

  /* 6 ── Obra y mantenimiento ────────────────────────────────────────────── */
  {
    key: 'obra',
    label: 'Obra y mantenimiento',
    desc: 'Ámbar de alta visibilidad con banda superior y tipografía impact.',
    swatch: ['#3a1f04', '#8a4d0b', '#d97706'],
    build: () => ({
      format: 'badge3x2h',
      front: {
        bg: bg({
          stops: [
            { color: '#3a1f04', pos: 0 }, { color: '#8a4d0b', pos: 55 }, { color: '#d97706', pos: 100 },
          ],
          pattern: 'diamond', patternOpacity: 8, decor: 'top-band', decorOpacity: 85,
          accent: '#fcd9a8', blobColor: '#f59e0b',
        }),
        elements: badgeFront({
          accent: '#fcd9a8', text: '#ffffff', soft: 'rgba(255,255,255,0.78)',
          entityLabel: 'CONSTRUCTORA PONIENTE\nCONFIDENCIAL',
          person: { name: 'Javier Osuna Leal', role: 'Jefe de Obra', dept: 'ZONA NORTE · GRUA 3', id: 'OBRA  44-2210' },
          qr: 'OBRA-44-2210 | J. Osuna | Acceso restrictedo · prototipo',
          photoSide: 'right', nameFont: 'impact', nameSize: 24, uppercaseName: true,
        }),
      },
      back: standardBack({
        bgOpts: {
          stops: [{ color: '#2c1803', pos: 0 }, { color: '#6b3b08', pos: 100 }],
          angle: 135, pattern: 'diamond', patternOpacity: 7,
          decor: 'footer-band', decorOpacity: 80, accent: '#fcd9a8', blobs: false,
        },
        text: '#ffffff', soft: 'rgba(255,255,255,0.72)', accent: '#fcd9a8',
      }),
    }),
  },

  /* 7 ── Visita minimal clara ────────────────────────────────────────────── */
  {
    key: 'visita-minimal',
    label: 'Visita minimal clara',
    desc: 'Tarjeta de visita blanca, líneas finas y acento coral.',
    swatch: ['#f4f6f8', '#dde5ec', '#c2410c'],
    build: () => ({
      format: 'businessH',
      front: {
        bg: bg({
          stops: [{ color: '#f4f6f8', pos: 0 }, { color: '#dde5ec', pos: 100 }],
          angle: 160, pattern: 'none', patternOpacity: 0,
          decor: 'frame', decorOpacity: 70, accent: '#c2410c', blobs: false,
        }),
        elements: businessFront({
          accent: '#c2410c', text: '#16233a', soft: 'rgba(22,35,58,0.68)',
          entityLabel: 'ESTUDIO NORDAL',
          person: { name: 'Marta Iglesias Prado', role: 'Directora Creativa', dept: 'BRANDING & IDENTIDAD' },
          contacts: ['+34 600 000 000  ·  marta@nordal.ejemplo', 'www.nordal.ejemplo.no-valido'],
          qr: 'VCARD MARTA IGLESIAS · ESTUDIO NORDAL · prototipo',
          nameFont: 'sans', nameSize: 25,
        }),
      },
      back: businessBack({
        bgOpts: {
          stops: [{ color: '#ffffff', pos: 0 }, { color: '#e8edf3', pos: 100 }],
          angle: 200, pattern: 'grid', patternOpacity: 4,
          decor: 'stripe-bottom', decorOpacity: 90, accent: '#c2410c', blobs: false,
        },
        text: '#16233a', soft: 'rgba(22,35,58,0.65)', accent: '#c2410c',
        qrDark: '#16233a',
      }),
    }),
  },

  /* 8 ── Visita elegante serif ───────────────────────────────────────────── */
  {
    key: 'visita-elegante',
    label: 'Visita elegante serif',
    desc: 'Papel crema, Palatino y doble marco clásico de abogados.',
    swatch: ['#f7f3ec', '#e5d9c3', '#7a5c2e'],
    build: () => ({
      format: 'businessV',
      front: {
        bg: bg({
          stops: [{ color: '#f7f3ec', pos: 0 }, { color: '#e5d9c3', pos: 100 }],
          angle: 170, pattern: 'none', patternOpacity: 0,
          decor: 'double-frame', decorOpacity: 85, accent: '#7a5c2e', blobs: false,
        }),
        elements: businessFront({
          accent: '#7a5c2e', text: '#2b2317', soft: 'rgba(43,35,23,0.68)',
          entityLabel: 'VEGA & ASOCIADOS',
          person: { name: 'Alejandro Vega Sotomayor', role: 'Abogado Socio', dept: 'DERECHO MERCANTIL' },
          contacts: ['+34 910 000 000  ·  despacho@vega.ejemplo', 'Calle Serrano 00, Madrid (prototipo)'],
          qr: 'AV-VEGA-ASOCIADOS | A. Vega | prototipo no válido',
          nameFont: 'palatino', nameSize: 22, logoSide: 'left',
          dividerStyle: 'double',
        }),
      },
      back: businessBack({
        bgOpts: {
          stops: [{ color: '#f3ede2', pos: 0 }, { color: '#dccfb4', pos: 100 }],
          angle: 20, pattern: 'guilloche', patternOpacity: 5,
          decor: 'frame', decorOpacity: 75, accent: '#7a5c2e', blobs: false,
        },
        text: '#2b2317', soft: 'rgba(43,35,23,0.62)', accent: '#7a5c2e',
        qrDark: '#2b2317',
      }),
    }),
  },

  /* 9 ── Ministerio de Hacienda (Guinea Ecuatorial) ───────────────────────── */
  {
    key: 'hacienda',
    label: 'Ministerio de Hacienda (GE)',
    desc: 'Carné vertical ministerial: cuña verde, escudo, foto enmarcada, QR y arte financiero.',
    swatch: ['#2c9e4b', '#9ed4f2', '#ffffff'],
    build: () => {
      const gov: GovOpts = {
        wedgeColor: '#2c9e4b',
        ink: '#16324a',
        label: 'rgba(22,50,74,0.62)',
        entityLabel: 'MINISTERIO\nDE HACIENDA\nY PRESUPUESTOS',
        entitySub: '- GUINEA ECUATORIAL',
        person: {
          name: 'Ana María Obiang Mangue',
          role: 'ANALISTA FINANCIERA SENIOR',
          id: 'GE2024001',
          dept: 'GESTIÓN PRESUPUESTARIA',
          expiry: '31/12/2026',
        },
        qr: 'GE2024001 | A. M. Obiang | Gestión Presupuestaria | Verificación: ejemplo.no-valido/GE2024001',
      }
      return {
        format: 'badge3x2v',
        front: {
          bg: bg({
            stops: [
              { color: '#9ed4f2', pos: 0 },
              { color: '#d9edfa', pos: 28 },
              { color: '#f5f7f9', pos: 58 },
            ],
            angle: 170,
            pattern: 'none', patternOpacity: 0,
            decor: 'corner-wedge', decorOpacity: 100,
            accent: gov.wedgeColor, blobs: false,
          }),
          elements: govFront(gov),
        },
        back: govBack(gov),
      }
    },
  },
]

export function getTemplate(key: string): TemplatePreset {
  return TEMPLATES.find((t) => t.key === key) ?? TEMPLATES[0]
}
