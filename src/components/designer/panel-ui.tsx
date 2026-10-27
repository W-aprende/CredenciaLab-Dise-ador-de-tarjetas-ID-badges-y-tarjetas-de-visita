'use client'

/**
 * ============================================================================
 *  panel-ui.tsx — Primitivas de interfaz del panel de control
 * ============================================================================
 */

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

/** Título de sección con línea divisoria */
export function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('space-y-3', className)}>
      <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
        <span className="h-px flex-1 bg-border" />
      </h3>
      {children}
    </section>
  )
}

/** Selector de color: pozo nativo + campo hex */
export function ColorField({
  label, value, onChange, allowEmpty,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  allowEmpty?: boolean
}) {
  const safe = value?.startsWith('#') ? value : '#ffffff'
  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="flex items-center gap-1.5">
        {allowEmpty && (
          <button
            type="button"
            onClick={() => onChange('')}
            title="Sin color (transparente)"
            className={cn(
              'h-7 rounded-md border border-border px-1.5 text-[10px] font-semibold',
              !value ? 'bg-emerald-500/15 text-emerald-600' : 'text-muted-foreground hover:bg-muted',
            )}
          >
            ∅
          </button>
        )}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-24 font-mono text-[11px] uppercase"
          spellCheck={false}
        />
        <label className="relative h-7 w-8 cursor-pointer overflow-hidden rounded-md border border-border shadow-inner">
          <span className="absolute inset-0" style={{ background: value || 'transparent' }} />
          <input
            type="color"
            value={safe}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={label}
          />
        </label>
      </div>
    </div>
  )
}

/** Fila numérica compacta (X / Y / Ancho / Alto en %) */
export function NumField({
  label, value, onCommit, min = -50, max = 150, step = 0.5,
}: {
  label: string
  value: number
  onCommit: (v: number) => void
  min?: number
  max?: number
  step?: number
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      <Input
        type="number"
        value={Number(value.toFixed(1))}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const v = parseFloat(e.target.value)
          if (!Number.isNaN(v)) onCommit(Math.max(min, Math.min(max, v)))
        }}
        className="h-8 px-2 text-xs"
      />
    </div>
  )
}

/** Deslizador con etiqueta y valor */
export function SliderField({
  label, value, onChange, onCommit, min, max, step = 1, suffix = '',
}: {
  label: string
  value: number
  onChange: (v: number) => void
  onCommit?: (v: number) => void
  min: number
  max: number
  step?: number
  suffix?: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{label}</Label>
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {Number(value).toFixed(step < 1 ? 1 : 0)}{suffix}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
        onValueCommit={(v) => onCommit?.(v[0])}
        className="cursor-pointer"
      />
    </div>
  )
}
