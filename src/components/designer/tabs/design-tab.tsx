'use client'

/**
 * ============================================================================
 *  design-tab.tsx — Pestaña "Diseño": formato, fondo, degradados y seguridad
 * ============================================================================
 */

import { RotateCcw, LayoutTemplate } from 'lucide-react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useDesigner } from '@/lib/designer/store'
import { CARD_FORMATS, PALETTES } from '@/lib/designer/presets'
import { TEMPLATES } from '@/lib/designer/templates'
import type { BackgroundConfig, CardSide, DecorKey, PatternKey } from '@/lib/designer/types'
import { ColorField, Section, SliderField } from '../panel-ui'
import { cn } from '@/lib/utils'

const PATTERNS: { key: PatternKey; label: string }[] = [
  { key: 'none', label: 'Sin patrón' },
  { key: 'guilloche', label: 'Guilloché (rosetas)' },
  { key: 'waves', label: 'Ondas finas' },
  { key: 'circuit', label: 'Circuito estilizado' },
  { key: 'grid', label: 'Retícula de seguridad' },
  { key: 'dots', label: 'Matriz de puntos' },
  { key: 'diamond', label: 'Rombos entrelazados' },
  { key: 'hex', label: 'Panal hexagonal' },
  { key: 'chevron', label: 'Espiga (chevrones)' },
  { key: 'rings', label: 'Anillos concéntricos' },
  { key: 'moire', label: 'Moiré (interferencia)' },
  { key: 'microline', label: 'Microimpresión' },
  { key: 'stars', label: 'Constelación de estrellas' },
]

const DECORS: { key: DecorKey; label: string }[] = [
  { key: 'none', label: 'Sin decoración' },
  { key: 'stripe-top', label: 'Línea superior' },
  { key: 'stripe-bottom', label: 'Línea inferior' },
  { key: 'stripe-left', label: 'Línea lateral izq.' },
  { key: 'stripe-right', label: 'Línea lateral der.' },
  { key: 'top-band', label: 'Banda superior' },
  { key: 'footer-band', label: 'Banda inferior' },
  { key: 'side-band', label: 'Banda diagonal' },
  { key: 'frame', label: 'Marco interior' },
  { key: 'double-frame', label: 'Doble marco (seguridad)' },
  { key: 'corner-arc', label: 'Arcos en esquina' },
  { key: 'corner-wedge', label: 'Cuña diagonal (ministerial)' },
  { key: 'corner-wedge-tr', label: 'Cuña diagonal (derecha)' },
]

export function DesignTab() {
  const doc = useDesigner((s) => s.doc)
  const side = useDesigner((s) => s.side)
  const setFormat = useDesigner((s) => s.setFormat)
  const updateBg = useDesigner((s) => s.updateBg)
  const applyPalette = useDesigner((s) => s.applyPalette)
  const applyTemplate = useDesigner((s) => s.applyTemplate)
  const resetDoc = useDesigner((s) => s.resetDoc)
  const bg: BackgroundConfig = side === 'front' ? doc.front.bg : doc.back.bg

  /** helper para parchear el fondo de la cara activa */
  const patch = (p: Partial<BackgroundConfig>) => updateBg(side as CardSide, p)
  const patchGradient = (p: Partial<BackgroundConfig['gradient']>) =>
    updateBg(side as CardSide, { gradient: { ...bg.gradient, ...p } })

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------ plantillas completas */}
      <Section title="Plantillas completas">
        <div className="grid grid-cols-1 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                applyTemplate(t.key)
              }}
              title={t.desc}
              className="group flex items-center gap-2.5 rounded-lg border border-border p-2 text-left transition hover:border-emerald-500/60 hover:ring-2 hover:ring-emerald-500/40"
            >
              <span
                className="block h-9 w-14 shrink-0 rounded-md shadow-inner"
                style={{
                  background: `linear-gradient(135deg, ${t.swatch[0]} 0%, ${t.swatch[1]} 58%, ${t.swatch[2]} 100%)`,
                }}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {t.label}
                </span>
                <span className="block truncate text-[10px] leading-tight text-muted-foreground">
                  {t.desc}
                </span>
              </span>
              <LayoutTemplate className="h-4 w-4 shrink-0 text-muted-foreground/50 group-hover:text-emerald-500" />
            </button>
          ))}
        </div>
        <p className="text-[11px] leading-snug text-muted-foreground">
          Aplicar una plantilla reemplaza anverso y reverso. Puedes deshacerlo con <b>Ctrl+Z</b>.
        </p>
      </Section>

      {/* ------------------------------------------------ formato físico */}
      <Section title="Formato de tarjeta">
        <Select value={doc.format} onValueChange={(v) => setFormat(v as never)}>
          <SelectTrigger className="h-9 w-full text-xs" aria-label="Formato de tarjeta">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CARD_FORMATS.map((f) => (
              <SelectItem key={f.key} value={f.key} className="text-xs">
                {f.label} — {f.hint}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Miniatura de proporción */}
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-border p-2.5">
          <div
            className="shrink-0 rounded-[4px] bg-gradient-to-br from-emerald-500/70 to-teal-600/70 shadow-inner"
            style={{
              width: CARD_FORMATS.find((f) => f.key === doc.format)!.ratio >= 1 ? 44 : 44 * CARD_FORMATS.find((f) => f.key === doc.format)!.ratio,
              height: CARD_FORMATS.find((f) => f.key === doc.format)!.ratio >= 1 ? 44 / CARD_FORMATS.find((f) => f.key === doc.format)!.ratio : 44,
            }}
          />
          <p className="text-[11px] leading-snug text-muted-foreground">
            El contenido se reencuadra automáticamente. Usa <b>Anverso/Reverso</b> para editar cada cara por separado.
          </p>
        </div>
      </Section>

      {/* ------------------------------------------------ paletas rápidas */}
      <Section title="Paletas institucionales">
        <div className="grid grid-cols-3 gap-2">
          {PALETTES.map((p) => (
            <button
              key={p.key}
              onClick={() => applyPalette(p.key)}
              title={p.label}
              className="group overflow-hidden rounded-lg border border-border transition hover:ring-2 hover:ring-emerald-500/60"
            >
              <span
                className="block h-9 w-full"
                style={{ background: `linear-gradient(120deg, ${p.stops.map((s) => `${s.color} ${s.pos}%`).join(', ')})` }}
              />
              <span className="block truncate px-1 py-1 text-[9.5px] font-medium text-muted-foreground group-hover:text-foreground">
                {p.label}
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------ fondo */}
      <Section title="Fondo de la cara">
        <div className="grid grid-cols-2 gap-2">
          {(['solid', 'gradient'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => patch({ fillMode: mode })}
              className={cn(
                'rounded-lg border px-3 py-2 text-xs font-semibold transition',
                bg.fillMode === mode
                  ? 'border-emerald-500/70 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              {mode === 'solid' ? 'Color sólido' : 'Degradado'}
            </button>
          ))}
        </div>

        {bg.fillMode === 'solid' ? (
          <ColorField label="Color de fondo" value={bg.solid} onChange={(v) => patch({ solid: v })} />
        ) : (
          <div className="space-y-3 rounded-lg border border-border p-3">
            <div className="grid grid-cols-2 gap-2">
              {(['linear', 'radial'] as const).map((kind) => (
                <button
                  key={kind}
                  onClick={() => patchGradient({ kind })}
                  className={cn(
                    'rounded-md border px-2 py-1.5 text-[11px] font-semibold transition',
                    bg.gradient.kind === kind
                      ? 'border-emerald-500/70 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-border text-muted-foreground hover:bg-muted',
                  )}
                >
                  {kind === 'linear' ? 'Lineal' : 'Radial'}
                </button>
              ))}
            </div>

            {bg.gradient.kind === 'linear' && (
              <SliderField
                label="Ángulo" min={0} max={360} step={5} suffix="°"
                value={bg.gradient.angle}
                onChange={(v) => patchGradient({ angle: v })}
                onCommit={(v) => patchGradient({ angle: v })}
              />
            )}

            {/* Paradas de color (2-3) */}
            {bg.gradient.stops.map((stop, i) => (
              <div key={i} className="space-y-2 rounded-md bg-muted/40 p-2">
                <ColorField
                  label={`Color ${i + 1}`}
                  value={stop.color}
                  onChange={(v) => {
                    const stops = bg.gradient.stops.map((s, j) => (j === i ? { ...s, color: v } : s))
                    patchGradient({ stops })
                  }}
                />
                <SliderField
                  label="Posición" min={0} max={100} suffix="%"
                  value={stop.pos}
                  onChange={(v) => {
                    const stops = bg.gradient.stops.map((s, j) => (j === i ? { ...s, pos: v } : s))
                    patchGradient({ stops })
                  }}
                  onCommit={(v) => {
                    const stops = bg.gradient.stops.map((s, j) => (j === i ? { ...s, pos: v } : s))
                    patchGradient({ stops })
                  }}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button
                variant="outline" size="sm" className="h-7 flex-1 text-[11px]"
                disabled={bg.gradient.stops.length >= 3}
                onClick={() => {
                  if (bg.gradient.stops.length >= 3) return
                  const stops = [...bg.gradient.stops, { color: '#ffffff', pos: 50 }]
                  patchGradient({ stops: stops.sort((a, b) => a.pos - b.pos) })
                }}
              >
                + Parada
              </Button>
              <Button
                variant="outline" size="sm" className="h-7 flex-1 text-[11px]"
                disabled={bg.gradient.stops.length <= 2}
                onClick={() => patchGradient({ stops: bg.gradient.stops.slice(0, -1) })}
              >
                − Parada
              </Button>
            </div>
          </div>
        )}
      </Section>

      {/* ------------------------------------------------ patrón de seguridad */}
      <Section title="Patrón de seguridad">
        <Select value={bg.pattern} onValueChange={(v) => patch({ pattern: v as PatternKey })}>
          <SelectTrigger className="h-9 w-full text-xs" aria-label="Patrón de seguridad">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PATTERNS.map((p) => (
              <SelectItem key={p.key} value={p.key} className="text-xs">{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {bg.pattern !== 'none' && (
          <>
            <ColorField label="Color del patrón" value={bg.patternColor} onChange={(v) => patch({ patternColor: v })} />
            <SliderField
              label="Opacidad" min={0} max={40} suffix="%"
              value={bg.patternOpacity}
              onChange={(v) => patch({ patternOpacity: v })}
              onCommit={(v) => patch({ patternOpacity: v })}
            />
          </>
        )}
      </Section>

      {/* ------------------------------------------------ decoración */}
      <Section title="Líneas y bandas">
        <Select value={bg.decor} onValueChange={(v) => patch({ decor: v as DecorKey })}>
          <SelectTrigger className="h-9 w-full text-xs" aria-label="Decoración">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DECORS.map((d) => (
              <SelectItem key={d.key} value={d.key} className="text-xs">{d.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {bg.decor !== 'none' && (
          <>
            <ColorField label="Color" value={bg.decorColor} onChange={(v) => patch({ decorColor: v })} />
            <SliderField
              label="Opacidad" min={0} max={100} suffix="%"
              value={bg.decorOpacity}
              onChange={(v) => patch({ decorOpacity: v })}
              onCommit={(v) => patch({ decorOpacity: v })}
            />
          </>
        )}
      </Section>

      {/* ------------------------------------------------ formas flotantes */}
      <Section title="Formas flotantes">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Habilitar brillos suaves</span>
          <Switch checked={bg.blobs} onCheckedChange={(v) => patch({ blobs: v })} />
        </div>
        {bg.blobs && (
          <>
            <ColorField label="Color de las formas" value={bg.blobColor} onChange={(v) => patch({ blobColor: v })} />
            <SliderField
              label="Opacidad" min={0} max={60} suffix="%"
              value={bg.blobOpacity}
              onChange={(v) => patch({ blobOpacity: v })}
              onCommit={(v) => patch({ blobOpacity: v })}
            />
          </>
        )}
      </Section>

      <Button
        variant="outline"
        className="w-full text-xs"
        onClick={() => {
          if (confirm('¿Restablecer todo el diseño a la plantilla inicial? Se perderán los cambios de ambas caras.')) resetDoc()
        }}
      >
        <RotateCcw className="mr-2 h-3.5 w-3.5" />
        Restablecer plantilla completa
      </Button>
    </div>
  )
}
