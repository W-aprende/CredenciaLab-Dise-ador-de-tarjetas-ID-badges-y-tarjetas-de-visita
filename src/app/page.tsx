/**
 * Página raíz — Diseñador de credenciales (SPA).
 * Se carga dinámicamente en cliente porque depende de medidas del navegador
 * (ResizeObserver, canvas de exportación, FileReader, etc.).
 */
'use client'

import dynamic from 'next/dynamic'

const DesignerApp = dynamic(
  () => import('@/components/designer/designer-app').then((m) => m.DesignerApp),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-emerald-500/30 border-t-emerald-500" />
          <p className="text-sm font-medium text-muted-foreground">Cargando el estudio de credenciales…</p>
        </div>
      </div>
    ),
  },
)

export default function Page() {
  return <DesignerApp />
}
