'use client'

/**
 * ============================================================================
 *  properties-tab.tsx — Pestaña "Propiedades" del elemento seleccionado
 * ============================================================================
 *  Contenido del texto, tipografía, colores específicos por tipo (QR, formas,
 *  fotos), posición/tamaño/rotación/opacidad, orden de capas, bloqueo y
 *  borrado. Incluye la lista de capas de la cara activa.
 * ============================================================================
 */

import {
  ArrowDown, ArrowUp, Barcode, CircleDot, Copy, Eye, EyeClosed, ImagePlus,
  Lock, LockOpen, MousePointerClick, QrCode, Signature, Stamp, Trash2, Type,
} from 'lucide-react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useDesigner } from '@/lib/designer/store'
import { CARD_FONTS, cardBaseSize } from '@/lib/designer/presets'
import type { CardElement, ShapeKind, StrokeStyle, TextAlign } from '@/lib/designer/types'
import { ColorField, NumField, Section, SliderField } from '../panel-ui'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const TYPE_META: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
  text: { icon: Type, label: 'Texto' },
  photo: { icon: ImagePlus, label: 'Fotografía' },
  logo: { icon: ImagePlus, label: 'Imagen / Logo' },
  qr: { icon: QrCode, label: 'Código QR' },
  hologram: { icon: CircleDot, label: 'Holograma' },
  shape: { icon: Signature, label: 'Forma' },
  stamp: { icon: Stamp, label: 'Sello prototipo' },
  barcode: { icon: Barcode, label: 'Código de barras' },
}

/** Selector común de estilo de trazo (sólido / rayas / puntos / doble) */
function StrokeStyleField({ value, onChange }: { value: StrokeStyle; onChange: (v: StrokeStyle) => void }) {
  const OPTS: { key: StrokeStyle; label: string }[] = [
    { key: 'solid', label: 'Sólido' },
    { key: 'dashed', label: 'Rayas' },
    { key: 'dotted', label: 'Puntos' },
    { key: 'double', label: 'Doble' },
  ]
  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium">Estilo de trazo</span>
      <div className="grid grid-cols-4 gap-1.5">
        {OPTS.map((s) => (
          <button
            key={s.key}
            onClick={() => onChange(s.key)}
            title={`Trazo ${s.label.toLowerCase()}`}
            className={cn(
              'rounded-md border px-1 py-1.5 text-[10px] font-semibold transition',
              value === s.key
                ? 'border-emerald-500/70 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-border text-muted-foreground hover:bg-muted',
            )}
          >
            {s.key === 'solid' && <span className="block h-0.5 w-full rounded bg-current" />}
            {s.key === 'dashed' && <span className="mx-auto block h-0.5 w-full" style={{ background: 'repeating-linear-gradient(90deg, currentColor 0 4px, transparent 4px 7px)' }} />}
            {s.key === 'dotted' && <span className="mx-auto block h-0.5 w-full" style={{ background: 'repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 5px)' }} />}
            {s.key === 'double' && <span className="mx-auto block w-full" style={{ height: 4, background: 'repeating-linear-gradient(180deg, currentColor 0 1.5px, transparent 1.5px 4px)' }} />}
            <span className="mt-1 block">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function PropertiesTab() {
  const doc = useDesigner((s) => s.doc)
  const side = useDesigner((s) => s.side)
  const selectedId = useDesigner((s) => s.selectedId)
  const select = useDesigner((s) => s.select)
  const updateElement = useDesigner((s) => s.updateElement)
  const updateSelected = useDesigner((s) => s.updateSelected)
  const removeElement = useDesigner((s) => s.removeElement)
  const duplicateElement = useDesigner((s) => s.duplicateElement)
  const raiseElement = useDesigner((s) => s.raiseElement)
  const lowerElement = useDesigner((s) => s.lowerElement)

  const design = side === 'front' ? doc.front : doc.back
  const el = design.elements.find((e) => e.id === selectedId) ?? null

  /** commit instantáneo (snapshot único) */
  const set = (patch: Partial<CardElement>) => updateSelected(patch)

  /* -------------------------------------------------------- sin selección */
  if (!el) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-4 py-8 text-center">
          <MousePointerClick className="h-6 w-6 text-emerald-500" />
          <p className="text-sm font-semibold">Ningún elemento seleccionado</p>
          <p className="max-w-[220px] text-[11.5px] leading-snug text-muted-foreground">
            Haz clic sobre un elemento del lienzo —o en la lista de capas— para editar sus propiedades.
          </p>
        </div>
        <LayersList />
      </div>
    )
  }

  const meta = TYPE_META[el.type] ?? TYPE_META.text
  const Icon = meta.icon

  /** tamaño auto del sello (coincide con element-node) mientras no haya override */
  const { h: baseH } = cardBaseSize(doc.format)
  const stampAutoSize = Math.max(8, baseH * (el.h / 100) * 0.30)

  return (
    <div className="space-y-6">
      {/* --------------------------------------------------- cabecera */}
      <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
          <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </span>
        <div className="min-w-0 flex-1">
          <input
            value={el.name}
            onChange={(e) => set({ name: e.target.value })}
            className="w-full truncate bg-transparent text-sm font-semibold outline-none"
            aria-label="Nombre de la capa"
          />
          <p className="text-[10.5px] text-muted-foreground">{meta.label}</p>
        </div>
        <div className="flex">
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Subir capa" onClick={() => raiseElement(el.id)}>
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Bajar capa" onClick={() => lowerElement(el.id)}>
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* --------------------------------------------------- contenido textual */}
      {el.type === 'text' && (
        <Section title="Contenido">
          <Textarea
            value={el.content ?? ''}
            onChange={(e) => set({ content: e.target.value })}
            rows={3}
            className="resize-none text-xs"
            placeholder="Texto del campo…"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">MAYÚSCULAS</span>
            <Switch checked={!!el.uppercase} onCheckedChange={(v) => set({ uppercase: v })} />
          </div>
        </Section>
      )}

      {el.type === 'stamp' && (
        <Section title="Texto del sello">
          <Textarea
            value={el.content ?? ''}
            onChange={(e) => set({ content: e.target.value })}
            rows={2}
            className="resize-none text-xs"
          />
          <Select value={el.font ?? 'sans'} onValueChange={(v) => set({ font: v as never })}>
            <SelectTrigger className="h-9 w-full text-xs" aria-label="Fuente del sello"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CARD_FONTS.map((f) => (
                <SelectItem key={f.key} value={f.key} className="text-xs">{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <SliderField
            label="Tamaño del texto" min={6} max={96} step={0.5} suffix="px"
            value={el.fontSize ?? stampAutoSize}
            onChange={(v) => set({ fontSize: v })}
            onCommit={(v) => set({ fontSize: v })}
          />
          {!el.fontSize && (
            <p className="text-[10.5px] leading-snug text-muted-foreground">
              Mostrando el tamaño automático ({stampAutoSize.toFixed(1)} px). Mueve el deslizador para fijarlo.
            </p>
          )}
          <ColorField label="Color del texto" value={el.color ?? '#ef4444'} onChange={(v) => set({ color: v })} />
          <ColorField label="Color del trazo" value={el.borderColor ?? '#ef4444'} onChange={(v) => set({ borderColor: v })} />
          <SliderField
            label="Grosor del trazo" min={0.5} max={8} step={0.5} suffix="px"
            value={el.borderWidth ?? 3}
            onChange={(v) => set({ borderWidth: v })}
            onCommit={(v) => set({ borderWidth: v })}
          />
          <StrokeStyleField value={el.strokeStyle ?? 'solid'} onChange={(v) => set({ strokeStyle: v })} />
        </Section>
      )}

      {el.type === 'qr' && (
        <Section title="Contenido del QR">
          <Textarea
            value={el.qrPayload ?? ''}
            onChange={(e) => set({ qrPayload: e.target.value })}
            rows={3}
            className="resize-none font-mono text-[11px]"
            placeholder="URL, identificador, texto libre…"
          />
          <p className="text-[11px] text-muted-foreground">
            El código se regenera automáticamente al escribir.
          </p>
          <ColorField label="Color de módulos" value={el.qrDark ?? '#000000'} onChange={(v) => set({ qrDark: v })} />
          <ColorField label="Fondo (opcional)" value={el.qrLight ?? ''} onChange={(v) => set({ qrLight: v })} allowEmpty />
        </Section>
      )}

      {(el.type === 'photo' || el.type === 'logo') && (
        <Section title="Imagen">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-4 text-xs font-medium text-muted-foreground transition hover:border-emerald-500/60 hover:text-foreground">
            <ImagePlus className="h-4 w-4" />
            Reemplazar imagen…
            <input
              type="file" accept="image/*" className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  set({ src: String(reader.result) })
                  toast.success('Imagen actualizada.')
                }
                reader.readAsDataURL(file)
                e.target.value = ''
              }}
            />
          </label>
          {el.type === 'photo' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Recorte circular</span>
                <Switch checked={!!el.circular} onCheckedChange={(v) => set({ circular: v })} />
              </div>
              <SliderField
                label="Redondeo de esquinas" min={0} max={40} suffix="px"
                value={el.radius ?? 0}
                onChange={(v) => set({ radius: v })}
                onCommit={(v) => set({ radius: v })}
              />
            </>
          )}
        </Section>
      )}

      {el.type === 'barcode' && (
        <Section title="Barcode">
          <ColorField label="Color de barras" value={el.fill ?? '#ffffff'} onChange={(v) => set({ fill: v })} />
        </Section>
      )}

      {el.type === 'shape' && (
        <Section title="Forma">
          <Select value={el.shape ?? 'rect'} onValueChange={(v) => set({ shape: v as ShapeKind })}>
            <SelectTrigger className="h-9 w-full text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rect" className="text-xs">Rectángulo</SelectItem>
              <SelectItem value="circle" className="text-xs">Círculo</SelectItem>
              <SelectItem value="line" className="text-xs">Línea</SelectItem>
              <SelectItem value="ring" className="text-xs">Anillo</SelectItem>
            </SelectContent>
          </Select>
          <ColorField label="Color de relleno" value={el.fill ?? '#ffffff'} onChange={(v) => set({ fill: v })} />
          {(el.shape === 'rect') && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Trazo en el borde</span>
                <Switch
                  checked={!!el.borderColor}
                  onCheckedChange={(v) => set({ borderColor: v ? '#ffffff' : '' })}
                />
              </div>
              {!!el.borderColor && (
                <>
                  <ColorField label="Color del trazo" value={el.borderColor} onChange={(v) => set({ borderColor: v })} />
                  <SliderField
                    label="Grosor del trazo" min={0.5} max={10} step={0.5} suffix="px"
                    value={el.borderWidth ?? 1.5}
                    onChange={(v) => set({ borderWidth: v })}
                    onCommit={(v) => set({ borderWidth: v })}
                  />
                </>
              )}
              <SliderField
                label="Redondeo" min={0} max={40} suffix="px"
                value={el.radius ?? 0}
                onChange={(v) => set({ radius: v })}
                onCommit={(v) => set({ radius: v })}
              />
            </>
          )}
          {(el.shape === 'line' || el.shape === 'ring') && (
            <>
              <SliderField
                label="Grosor" min={0.5} max={12} step={0.5} suffix="px"
                value={el.borderWidth ?? 1.5}
                onChange={(v) => set({ borderWidth: v })}
                onCommit={(v) => set({ borderWidth: v })}
              />
              {(el.shape === 'ring' || (el.shape === 'line' && (el.strokeStyle ?? 'solid') !== 'solid')) && (
                <ColorField label="Color del trazo" value={el.borderColor ?? el.fill ?? '#ffffff'} onChange={(v) => set({ borderColor: v })} />
              )}
              <StrokeStyleField
                value={el.strokeStyle ?? 'solid'}
                onChange={(v) => set({ strokeStyle: v })}
              />
            </>
          )}
        </Section>
      )}

      {/* --------------------------------------------------- tipografía */}
      {el.type === 'text' && (
        <Section title="Tipografía">
          <Select value={el.font ?? 'sans'} onValueChange={(v) => set({ font: v as never })}>
            <SelectTrigger className="h-9 w-full text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CARD_FONTS.map((f) => (
                <SelectItem key={f.key} value={f.key} className="text-xs">{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <SliderField
            label="Tamaño" min={6} max={96} step={0.5} suffix="px"
            value={el.fontSize ?? 16}
            onChange={(v) => set({ fontSize: v })}
            onCommit={(v) => set({ fontSize: v })}
          />
          <SliderField
            label="Grosor" min={300} max={800} step={100}
            value={el.fontWeight ?? 500}
            onChange={(v) => set({ fontWeight: v })}
            onCommit={(v) => set({ fontWeight: v })}
          />
          <SliderField
            label="Espaciado" min={-1} max={6} step={0.1} suffix="px"
            value={el.letterSpacing ?? 0}
            onChange={(v) => set({ letterSpacing: v })}
            onCommit={(v) => set({ letterSpacing: v })}
          />
          <SliderField
            label="Altura de línea" min={0.9} max={2.2} step={0.05}
            value={el.lineHeight ?? 1.25}
            onChange={(v) => set({ lineHeight: v })}
            onCommit={(v) => set({ lineHeight: v })}
          />
          <div>
            <span className="mb-1.5 block text-xs font-medium">Alineación</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['left', 'center', 'right'] as TextAlign[]).map((a) => (
                <button
                  key={a}
                  onClick={() => set({ align: a })}
                  className={cn(
                    'rounded-md border px-2 py-1.5 text-[11px] font-semibold transition',
                    el.align === a
                      ? 'border-emerald-500/70 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-border text-muted-foreground hover:bg-muted',
                  )}
                >
                  {a === 'left' ? 'Izq.' : a === 'center' ? 'Centro' : 'Der.'}
                </button>
              ))}
            </div>
          </div>
          <ColorField label="Color del texto" value={el.color ?? '#ffffff'} onChange={(v) => set({ color: v })} />
        </Section>
      )}

      {/* --------------------------------------------------- geometría */}
      <Section title="Posición y tamaño">
        <div className="grid grid-cols-2 gap-2">
          <NumField label="X (%)" value={el.x} onCommit={(v) => set({ x: v })} />
          <NumField label="Y (%)" value={el.y} onCommit={(v) => set({ y: v })} />
          <NumField label="Ancho (%)" value={el.w} onCommit={(v) => set({ w: Math.max(1, v) })} min={1} />
          <NumField label="Alto (%)" value={el.h} onCommit={(v) => set({ h: Math.max(0.4, v) })} min={0.4} />
        </div>
        <SliderField
          label="Rotación" min={-45} max={45} suffix="°"
          value={el.rotation}
          onChange={(v) => set({ rotation: v })}
          onCommit={(v) => set({ rotation: v })}
        />
        <SliderField
          label="Opacidad" min={5} max={100} suffix="%"
          value={el.opacity}
          onChange={(v) => set({ opacity: v })}
          onCommit={(v) => set({ opacity: v })}
        />
      </Section>

      {/* --------------------------------------------------- acciones */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="text-xs" onClick={() => duplicateElement(el.id)}>
          <Copy className="mr-1.5 h-3.5 w-3.5" /> Duplicar
        </Button>
        <Button
          variant="outline" size="sm" className="text-xs"
          onClick={() => set({ locked: !el.locked })}
        >
          {el.locked ? <LockOpen className="mr-1.5 h-3.5 w-3.5" /> : <Lock className="mr-1.5 h-3.5 w-3.5" />}
          {el.locked ? 'Desbloquear' : 'Bloquear'}
        </Button>
        <Button
          variant="outline" size="sm" className="text-xs"
          onClick={() => set({ hidden: true })}
        >
          <EyeClosed className="mr-1.5 h-3.5 w-3.5" /> Ocultar
        </Button>
        <Button
          variant="destructive" size="sm" className="text-xs"
          onClick={() => {
            removeElement(el.id)
            toast.success('Elemento eliminado.')
          }}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Eliminar
        </Button>
      </div>

      <LayersList />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Lista de capas                                                            */
/* -------------------------------------------------------------------------- */

function LayersList() {
  const doc = useDesigner((s) => s.doc)
  const side = useDesigner((s) => s.side)
  const selectedId = useDesigner((s) => s.selectedId)
  const select = useDesigner((s) => s.select)
  const updateElement = useDesigner((s) => s.updateElement)
  const design = side === 'front' ? doc.front : doc.back
  // mostramos de arriba (frente) hacia abajo (fondo)
  const layers = [...design.elements].reverse()

  return (
    <Section title={`Capas · ${side === 'front' ? 'Anverso' : 'Reverso'}`}>
      <div className="max-h-64 space-y-1 overflow-y-auto pr-1 thin-scroll">
        {layers.length === 0 && (
          <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-[11px] text-muted-foreground">
            Aún no hay elementos en esta cara.
          </p>
        )}
        {layers.map((el) => (
          <div
            key={el.id}
            onClick={() => select(el.id)}
            className={cn(
              'group flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 text-xs transition',
              el.id === selectedId
                ? 'border-emerald-500/60 bg-emerald-500/10'
                : 'border-transparent hover:border-border hover:bg-muted/60',
            )}
          >
            <span className={cn('h-2 w-2 shrink-0 rounded-full', el.hidden ? 'bg-muted-foreground/30' : 'bg-emerald-500')} />
            <span className={cn('min-w-0 flex-1 truncate font-medium', el.hidden && 'text-muted-foreground line-through')}>
              {el.name}
            </span>
            <button
              title={el.hidden ? 'Mostrar' : 'Ocultar'}
              onClick={(e) => { e.stopPropagation(); updateElement(el.id, { hidden: !el.hidden }, true) }}
              className="rounded p-1 text-muted-foreground hover:text-foreground"
            >
              {el.hidden ? <EyeClosed className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </button>
            <button
              title={el.locked ? 'Desbloquear' : 'Bloquear'}
              onClick={(e) => { e.stopPropagation(); updateElement(el.id, { locked: !el.locked }, true) }}
              className={cn('rounded p-1', el.locked ? 'text-amber-500' : 'text-muted-foreground hover:text-foreground')}
            >
              {el.locked ? <Lock className="h-3 w-3" /> : <LockOpen className="h-3 w-3" />}
            </button>
          </div>
        ))}
      </div>
    </Section>
  )
}
