'use client'

/**
 * ============================================================================
 *  elements-tab.tsx — Pestaña "Elementos": inserción de contenido
 * ============================================================================
 *  Botones para añadir campos de datos, imágenes (con carga local vía
 *  FileReader → dataURL), códigos QR/barcode, sello holográfico, sello de
 *  prototipo y formas geométricas.
 * ============================================================================
 */

import { useRef } from 'react'
import {
  BadgeCheck, Barcode, CircleDot, CreditCard, Droplets, IdCard, ImagePlus,
  QrCode, ScanLine, Shapes, Signature, Stamp, Square, User, UserRound,
} from 'lucide-react'
import { toast } from 'sonner'
import { useDesigner } from '@/lib/designer/store'
import {
  makeBarcode, makeHologram, makeLogo, makePhoto, makeQr, makeShape,
  makeStamp, makeWatermark, textField,
} from '@/lib/designer/defaults'
import { Section } from '../panel-ui'
import { cn } from '@/lib/utils'

const MAX_IMG_BYTES = 6 * 1024 * 1024

/** Botón cuadriculado para insertar elementos */
function GridBtn({
  icon: Icon, label, onClick, className,
}: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card px-2 py-3 text-[10.5px] font-medium text-muted-foreground transition hover:border-emerald-500/60 hover:bg-emerald-500/5 hover:text-foreground',
        className,
      )}
    >
      <Icon className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
      {label}
    </button>
  )
}

export function ElementsTab() {
  const addElement = useDesigner((s) => s.addElement)
  const photoInput = useRef<HTMLInputElement>(null)
  const logoInput = useRef<HTMLInputElement>(null)
  const watermarkInput = useRef<HTMLInputElement>(null)

  /** Lee una imagen local y la convierte en dataURL */
  function readImage(file: File | undefined, cb: (dataUrl: string) => void) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo seleccionado no es una imagen.')
      return
    }
    if (file.size > MAX_IMG_BYTES) {
      toast.error('La imagen supera los 6 MB. Reduce su tamaño e inténtalo de nuevo.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => cb(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------ campos de datos */}
      <Section title="Campos de datos">
        <div className="grid grid-cols-3 gap-2">
          <GridBtn icon={UserRound} label="Nombre" onClick={() => addElement(textField('nombre'))} />
          <GridBtn icon={IdCard} label="Cargo" onClick={() => addElement(textField('cargo'))} />
          <GridBtn icon={ScanLine} label="ID empleado" onClick={() => addElement(textField('empleadoId'))} />
          <GridBtn icon={Shapes} label="Depto." onClick={() => addElement(textField('departamento'))} />
          <GridBtn icon={BadgeCheck} label="Emisión" onClick={() => addElement(textField('emision'))} />
          <GridBtn icon={BadgeCheck} label="Caducidad" onClick={() => addElement(textField('caducidad'))} />
          <GridBtn icon={CreditCard} label="Entidad" onClick={() => addElement(textField('entidad'))} />
          <GridBtn icon={Signature} label="Texto libre" onClick={() => addElement(textField('custom'))} />
          <GridBtn icon={ScanLine} label="Aviso legal" onClick={() => addElement(textField('legal'))} />
        </div>
        <p className="text-[11px] leading-snug text-muted-foreground">
          Doble clic sobre un texto en el lienzo para editarlo en el momento.
        </p>
      </Section>

      {/* ------------------------------------------------ imágenes */}
      <Section title="Imágenes y multimedia">
        <input
          ref={photoInput} type="file" accept="image/*" className="hidden"
          onChange={(e) => {
            readImage(e.target.files?.[0], (src) => {
              addElement(makePhoto(src))
              toast.success('Fotografía añadida.')
            })
            e.target.value = ''
          }}
        />
        <input
          ref={logoInput} type="file" accept="image/*" className="hidden"
          onChange={(e) => {
            readImage(e.target.files?.[0], (src) => {
              addElement(makeLogo(src))
              toast.success('Logotipo añadido.')
            })
            e.target.value = ''
          }}
        />
        <input
          ref={watermarkInput} type="file" accept="image/*" className="hidden"
          onChange={(e) => {
            readImage(e.target.files?.[0], (src) => {
              addElement(makeWatermark(src))
              toast.success('Marca de agua añadida con opacidad reducida.')
            })
            e.target.value = ''
          }}
        />
        <div className="grid grid-cols-3 gap-2">
          <GridBtn icon={User} label="Foto titular" onClick={() => photoInput.current?.click()} />
          <GridBtn icon={ImagePlus} label="Logotipo" onClick={() => logoInput.current?.click()} />
          <GridBtn icon={Droplets} label="Marca de agua" onClick={() => watermarkInput.current?.click()} />
        </div>
        <p className="text-[11px] leading-snug text-muted-foreground">
          También puedes añadir el emblema prediseñado sin cargar archivos:
        </p>
        <div className="grid grid-cols-3 gap-2">
          <GridBtn icon={User} label="Foto ejemplo" onClick={() => addElement(makePhoto())} />
          <GridBtn icon={ImagePlus} label="Logo ejemplo" onClick={() => addElement(makeLogo())} />
          <GridBtn icon={Droplets} label="Marca tipo" onClick={() => addElement(makeWatermark())} />
        </div>
      </Section>

      {/* ------------------------------------------------ códigos y seguridad */}
      <Section title="Códigos y seguridad">
        <div className="grid grid-cols-3 gap-2">
          <GridBtn icon={QrCode} label="Código QR" onClick={() => addElement(makeQr())} />
          <GridBtn icon={Barcode} label="Barcode" onClick={() => addElement(makeBarcode())} />
          <GridBtn icon={CircleDot} label="Holograma" onClick={() => addElement(makeHologram())} />
          <GridBtn
            icon={Stamp} label="Sello prototipo" className="col-span-3 flex-row justify-start px-3"
            onClick={() => {
              addElement(makeStamp())
              toast.info('Sello «PROTOTIPO · EJEMPLO NO VÁLIDO» añadido.')
            }}
          />
        </div>
      </Section>

      {/* ------------------------------------------------ formas */}
      <Section title="Formas geométricas">
        <div className="grid grid-cols-4 gap-2">
          <GridBtn icon={Square} label="Rectáng." onClick={() => addElement(makeShape('rect'))} />
          <GridBtn icon={CircleDot} label="Círculo" onClick={() => addElement(makeShape('circle'))} />
          <GridBtn icon={Signature} label="Línea" onClick={() => addElement(makeShape('line'))} />
          <GridBtn icon={CircleDot} label="Anillo" onClick={() => addElement(makeShape('ring'))} />
        </div>
      </Section>
    </div>
  )
}
