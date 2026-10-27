'use client'

/**
 * ============================================================================
 *  top-bar.tsx — Barra superior: identidad, cara A/B, historial y exportación
 * ============================================================================
 */

import {
  Download, FileText, FileImage, FileDown, IdCard,
  Redo2, RotateCcw, Sun, Moon, Undo2,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useDesigner } from '@/lib/designer/store'
import { exportCard } from '@/lib/designer/export'
import { getFormat } from '@/lib/designer/presets'
import { cn } from '@/lib/utils'

export function TopBar() {
  const side = useDesigner((s) => s.side)
  const setSide = useDesigner((s) => s.setSide)
  const toggleSide = useDesigner((s) => s.toggleSide)
  const doc = useDesigner((s) => s.doc)
  const past = useDesigner((s) => s.past)
  const future = useDesigner((s) => s.future)
  const undo = useDesigner((s) => s.undo)
  const redo = useDesigner((s) => s.redo)
  const select = useDesigner((s) => s.select)
  const resetDoc = useDesigner((s) => s.resetDoc)
  const { resolvedTheme, setTheme } = useTheme()
  const fmt = getFormat(doc.format)

  /** deselecciona y espera un frame para que el anillo de selección no se exporte */
  async function doExport(kind: 'png' | 'jpeg' | 'pdf') {
    select(null)
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null))))
    const face = side === 'front' ? 'anverso' : 'reverso'
    const toastId = toast.loading(`Rasterizando ${face} en alta resolución…`)
    try {
      await exportCard(kind, doc.format, face)
      toast.success(`Exportación ${kind.toUpperCase()} completada.`, { id: toastId })
    } catch (err) {
      console.error(err)
      toast.error('No se pudo exportar la tarjeta. Inténtalo de nuevo.', { id: toastId })
    }
  }

  return (
    <TooltipProvider delayDuration={250}>
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/90 px-3 backdrop-blur sm:px-4">
        {/* Identidad */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
            <IdCard className="h-4.5 w-4.5" />
          </span>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold leading-tight tracking-tight">CredenciaLab</h1>
            <p className="text-[10px] leading-tight text-muted-foreground">Prototipador de credenciales y badges</p>
          </div>
        </div>

        {/* Conmutador de cara */}
        <div className="mx-auto flex items-center rounded-xl border border-border bg-muted/50 p-1">
          {(['front', 'back'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              aria-pressed={side === s}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:px-4',
                side === s
                  ? 'bg-background text-emerald-600 shadow-sm dark:text-emerald-400'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {s === 'front' ? 'Anverso' : 'Reverso'}
            </button>
          ))}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={past.length === 0} aria-label="Deshacer">
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Deshacer (Ctrl+Z)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={future.length === 0} aria-label="Rehacer">
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rehacer (Ctrl+Y)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost" size="icon" className="h-8 w-8 hidden sm:inline-flex"
                onClick={() => {
                  if (confirm('¿Restablecer la plantilla por defecto? Se perderán los cambios de ambas caras.')) {
                    resetDoc()
                    toast.info('Plantilla restablecida.')
                  }
                }}
                aria-label="Restablecer"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Restablecer plantilla</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost" size="icon" className="h-8 w-8"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                aria-label="Cambiar tema"
              >
                {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Modo claro / oscuro</TooltipContent>
          </Tooltip>

          {/* Exportación */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="ml-1 h-8 gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-xs font-bold text-white shadow-md hover:from-emerald-600 hover:to-teal-700">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="text-[11px] text-muted-foreground">
                Cara activa · {fmt.label}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => doExport('png')} className="gap-2.5 text-xs">
                <FileImage className="h-4 w-4 text-emerald-500" />
                <span>
                  PNG <span className="text-muted-foreground">— fondo nítido, ~600 DPI</span>
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => doExport('jpeg')} className="gap-2.5 text-xs">
                <FileText className="h-4 w-4 text-emerald-500" />
                <span>
                  JPEG <span className="text-muted-foreground">— ligero, para presentaciones</span>
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => doExport('pdf')} className="gap-2.5 text-xs">
                <FileDown className="h-4 w-4 text-emerald-500" />
                <span>
                  PDF <span className="text-muted-foreground">— medidas físicas exactas ({fmt.hint})</span>
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  )
}
