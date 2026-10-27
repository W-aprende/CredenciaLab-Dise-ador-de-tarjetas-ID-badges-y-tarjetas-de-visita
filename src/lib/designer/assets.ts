/**
 * ============================================================================
 *  assets.ts — Recursos gráficos por defecto (SVG → data-URI)
 * ============================================================================
 *  Se usan como marcadores iniciales para logo, fotografía y marca de agua.
 *  Al ser data-URI no generan peticiones de red y son seguros para la
 *  exportación con html2canvas.
 * ============================================================================
 */

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/** Emblema corporativo por defecto (rombo + initiales) */
export const DEFAULT_LOGO = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <rect x="4" y="4" width="112" height="112" rx="26" fill="#0e3a5c"/>
  <path d="M60 18 L98 60 L60 102 L22 60 Z" fill="none" stroke="#7fd8e8" stroke-width="5"/>
  <path d="M60 38 L82 60 L60 82 L38 60 Z" fill="#7fd8e8"/>
  <circle cx="60" cy="60" r="7" fill="#0e3a5c"/>
</svg>`)

/** Retrato neutro por defecto (silueta de persona) */
export const DEFAULT_AVATAR = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240">
  <rect width="200" height="240" fill="#dfe6ec"/>
  <circle cx="100" cy="88" r="46" fill="#9fb1c0"/>
  <path d="M100 142 c-44 0 -72 30 -78 70 l156 0 c-6 -40 -34 -70 -78 -70 Z" fill="#9fb1c0"/>
</svg>`)

/** Emblema de marca de agua (escudo lineal grande) */
export const DEFAULT_WATERMARK = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <path d="M100 12 L176 40 V104 c0 46 -32 72 -76 84 C56 176 24 150 24 104 V40 Z"
        fill="none" stroke="#ffffff" stroke-width="6"/>
  <path d="M68 100 l22 22 l44 -46" fill="none" stroke="#ffffff" stroke-width="8"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>`)

/**
 * Emblema institucional estilo escudo «Guinea Ecuatorial» (simplificado):
 * franja verde superior, triángulo azul con estrella blanca, ceiba estilizada
 * y banda roja inferior. Pensado para credenciales ministeriales/gubernamentales.
 */
export const GE_EMBLEM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="190" viewBox="0 0 160 190">
  <path d="M10 10 H150 V104 c0 42 -34 60 -70 70 C44 164 10 146 10 104 Z"
        fill="#ffffff" stroke="#8fa1b0" stroke-width="3"/>
  <path d="M10 10 H150 V74 H10 Z" fill="#2c9e4b"/>
  <path d="M10 10 L74 96 L10 156 Z" fill="#2b6fc2"/>
  <path d="M38 34 l7 14.5 16 2.2 -11.7 11.2 2.9 15.7 -14.2-7.5 -14.2 7.5 2.9-15.7 -11.7-11.2 16-2.2 Z" fill="#ffffff"/>
  <path d="M96 62 c-14 0 -22 10 -24 20 h48 c-2 -10 -10 -20 -24 -20 Z" fill="#1e7a3a"/>
  <rect x="93" y="82" width="6" height="22" rx="2" fill="#1e7a3a"/>
  <path d="M84 104 h24" stroke="#1e7a3a" stroke-width="5" stroke-linecap="round"/>
  <path d="M10 116 H150" stroke="#d0332e" stroke-width="7"/>
  <path d="M10 128 H150" stroke="#2c9e4b" stroke-width="4" opacity="0.85"/>
</svg>`)

/**
 * Arte lineal «fintech» (calculadora, gráfico de barras con flecha, moneda,
 * base de datos y pistas de circuito) en trazo verde. Decoración de la zona
 * inferior en credenciales de ministerios de economía/hacienda.
 */
export const FINTECH_ART = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="190" viewBox="0 0 420 190">
  <g fill="none" stroke="#1e7a4a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
    <!-- moneda con símbolo de moneda -->
    <circle cx="52" cy="52" r="30"/>
    <path d="M52 32 v40 M45 40 c0 -4 14 -4 14 0 c0 5 -14 4 -14 10 c0 6 14 5 14 10 c0 4 -14 4 -14 0"/>
    <!-- calculadora -->
    <rect x="108" y="62" width="72" height="106" rx="8"/>
    <rect x="118" y="74" width="52" height="24" rx="3"/>
    <path d="M124 78 l6 16 M136 78 l-6 16"/>
    <g stroke-width="3">
      <rect x="118" y="108" width="12" height="12" rx="2"/><rect x="136" y="108" width="12" height="12" rx="2"/><rect x="154" y="108" width="12" height="12" rx="2"/>
      <rect x="118" y="126" width="12" height="12" rx="2"/><rect x="136" y="126" width="12" height="12" rx="2"/><rect x="154" y="126" width="12" height="12" rx="2"/>
      <rect x="118" y="144" width="30" height="12" rx="2"/><rect x="154" y="144" width="12" height="12" rx="2"/>
    </g>
    <!-- gráfico de barras con flecha ascendente -->
    <rect x="216" y="120" width="14" height="48" rx="2"/>
    <rect x="238" y="104" width="14" height="64" rx="2"/>
    <rect x="260" y="86" width="14" height="82" rx="2"/>
    <rect x="282" y="64" width="14" height="104" rx="2"/>
    <path d="M212 96 L296 42 M296 42 h-16 M296 42 v14"/>
    <!-- base de datos -->
    <ellipse cx="352" cy="140" rx="26" ry="9"/>
    <path d="M326 140 v26 c0 5 12 9 26 9 s26 -4 26 -9 v-26"/>
    <path d="M326 152 c0 5 12 9 26 9 s26 -4 26 -9"/>
    <!-- pistas de circuito -->
    <path d="M6 158 h60 l14 -14 h40" stroke-width="2.5"/>
    <circle cx="6" cy="158" r="4"/>
    <path d="M20 178 h90 l12 -12" stroke-width="2.5"/>
    <circle cx="20" cy="178" r="4"/>
    <path d="M330 178 h70" stroke-width="2.5"/>
    <circle cx="404" cy="178" r="4"/>
    <path d="M300 24 h60 l12 12 h28" stroke-width="2.5"/>
    <circle cx="404" cy="36" r="4"/>
    <!-- rayitas diagonales decorativas -->
    <path d="M148 22 l10 -12 M162 22 l10 -12 M176 22 l10 -12" stroke-width="2.5"/>
  </g>
</svg>`)
