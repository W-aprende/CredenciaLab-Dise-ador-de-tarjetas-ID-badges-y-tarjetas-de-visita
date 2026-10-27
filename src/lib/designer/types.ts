/**
 * ============================================================================
 *  types.ts — Modelo de datos del Diseñador de Tarjetas / Badges
 * ============================================================================
 *  Todas las posiciones y tamaños de los elementos se almacenan en PORCENTAJES
 *  (%) relativos a la tarjeta. Esto hace el diseño independiente de la
 *  resolución: se ve igual en pantalla (escalado) y en la exportación (alta
 *  resolución, ~600 DPI).
 * ============================================================================
 */

/** Caras de la tarjeta */
export type CardSide = 'front' | 'back'

/** Formatos físicos predefinidos (ver presets.ts) */
export type FormatKey = 'badge3x2h' | 'badge3x2v' | 'dni' | 'businessH' | 'businessV'

/** Tipos de elemento insertables en el lienzo */
export type ElementType =
  | 'text'      // Campo de texto editable (nombre, cargo, ID...)
  | 'photo'     // Fotografía del titular (con máscara circular/rectangular)
  | 'logo'      // Logotipo institucional (imagen subida o emblema por defecto)
  | 'qr'        // Código QR dinámico generado a partir de texto
  | 'hologram'  // Sello holográfico simulado (degradados iridiscentes)
  | 'shape'     // Forma geométrica decorativa (rect, círculo, línea, anillo)
  | 'stamp'     // Etiqueta "PROTOTIPO · EJEMPLO NO VÁLIDO"
  | 'barcode'   // Código de barras simulado (SVG procedural)

export type TextPreset =
  | 'custom' | 'nombre' | 'cargo' | 'empleadoId' | 'departamento'
  | 'emision' | 'caducidad' | 'entidad' | 'legal'

export type ShapeKind = 'rect' | 'circle' | 'line' | 'ring'
export type TextAlign = 'left' | 'center' | 'right'
/**
 * Tipografías de tarjeta. Cada clave se resuelve en presets.ts (CARD_FONTS)
 * a una pila CSS con fuentes del sistema — seguras tanto en pantalla como en
 * la exportación html2canvas (no dependen de descargas de webfonts).
 */
export type CardFont =
  | 'sans' | 'serif' | 'mono'
  | 'arial' | 'verdana' | 'tahoma' | 'trebuchet'
  | 'times' | 'garamond' | 'palatino' | 'impact' | 'century'

/** Estilo de trazo (borde) aplicable a formas, líneas y sellos */
export type StrokeStyle = 'solid' | 'dashed' | 'dotted' | 'double'

/** Configuración del fondo de una cara */
export interface BackgroundConfig {
  /** Relleno: color sólido o degradado */
  fillMode: 'solid' | 'gradient'
  solid: string
  gradient: {
    kind: 'linear' | 'radial'
    angle: number          // grados (solo lineal)
    stops: { color: string; pos: number }[]  // 2-3 paradas de color
  }
  /** Patrón de seguridad tipo guilloché renderizado en SVG */
  pattern: PatternKey
  patternColor: string
  patternOpacity: number   // 0-100
  /** Banda / línea decorativa institucional */
  decor: DecorKey
  decorColor: string
  decorOpacity: number     // 0-100
  /** Formas flotantes (blobs de degradado radial suave) */
  blobs: boolean
  blobColor: string
  blobOpacity: number      // 0-100
}

export type PatternKey =
  | 'none'
  | 'guilloche'   // rosetas tipo guilloché clásico
  | 'waves'       // ondas finas horizontales
  | 'circuit'     // pistas de circuito impreso
  | 'grid'        // retícula cuadrada
  | 'dots'        // matriz de puntos
  | 'diamond'     // rombos entrelazados
  | 'hex'         // panal hexagonal
  | 'chevron'     // espiga / chevrones
  | 'rings'       // anillos concéntricos (rosácea)
  | 'moire'       // interferencia moiré (dos retículas)
  | 'microline'   // microtexto (líneas finísimas verticales)
  | 'stars'       // constelación de estrellas

/**
 * Decoraciones institucionales de fondo (trazos y bandas).
 * Todas se renderizan con divs CSS puros para exportar fielmente.
 */
export type DecorKey =
  | 'none'
  | 'stripe-top'      // línea fina superior
  | 'stripe-bottom'   // línea fina inferior
  | 'stripe-left'     // línea lateral izquierda
  | 'stripe-right'    // línea lateral derecha
  | 'top-band'        // banda superior ancha
  | 'footer-band'     // banda inferior ancha
  | 'side-band'       // banda diagonal lateral
  | 'frame'           // marco interior fino
  | 'double-frame'    // doble marco fino (clásico de seguridad)
  | 'corner-arc'      // arcos en esquina
  | 'corner-wedge'    // cuña diagonal superior izquierda (estilo ministerial)
  | 'corner-wedge-tr' // cuña diagonal superior derecha (espejo)

/** Un elemento situado sobre la tarjeta */
export interface CardElement {
  id: string
  type: ElementType
  name: string            // etiqueta legible para la lista de capas
  x: number               // % del ancho de la tarjeta (borde izquierdo)
  y: number               // % del alto  (borde superior)
  w: number               // % del ancho
  h: number               // % del alto
  rotation: number        // grados
  opacity: number         // 0-100
  locked: boolean
  hidden: boolean
  /* --- Texto --- */
  content?: string
  fontSize?: number       // px respecto al lienzo base (640 px)
  fontWeight?: number
  color?: string
  align?: TextAlign
  letterSpacing?: number  // px
  lineHeight?: number
  uppercase?: boolean
  font?: CardFont
  textPreset?: TextPreset
  /* --- Imagen (photo / logo) --- */
  src?: string            // data-URL de la imagen cargada
  radius?: number         // px de redondeo
  circular?: boolean      // máscara circular (retrato)
  /* --- QR --- */
  qrPayload?: string      // contenido codificado
  qrDark?: string         // color de módulos
  qrLight?: string        // color de fondo (transparente si vacío)
  /* --- Formas --- */
  shape?: ShapeKind
  fill?: string
  borderWidth?: number    // grosor de trazo: 'line' / 'ring' y borde de 'rect'
  strokeStyle?: StrokeStyle // estilo del trazo: sólido, discontinuo, punteado, doble
  /* --- Sello prototipo / variante visual --- */
  variant?: string
  borderColor?: string    // color del trazo (rect / sello)
}

/** Diseño completo de una cara */
export interface SideDesign {
  bg: BackgroundConfig
  elements: CardElement[]
}

/** Estado raíz del diseñador */
export interface DesignerDoc {
  format: FormatKey
  front: SideDesign
  back: SideDesign
}
