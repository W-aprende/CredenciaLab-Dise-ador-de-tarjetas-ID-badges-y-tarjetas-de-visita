'use client'

/**
 * ============================================================================
 *  control-panel.tsx — Panel lateral de control (sidebar izquierdo)
 * ============================================================================
 *  Aloja las tres pestañas de edición: Diseño, Elementos y Propiedades.
 * ============================================================================
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette, MousePointerClick, SquarePlus } from 'lucide-react'
import { DesignTab } from './tabs/design-tab'
import { ElementsTab } from './tabs/elements-tab'
import { PropertiesTab } from './tabs/properties-tab'

export function ControlPanel() {
  return (
    <aside
      className="flex h-[46%] w-full shrink-0 flex-col border-t border-border bg-background lg:h-full lg:w-[350px] lg:shrink-0 lg:border-t-0 lg:border-r"
      aria-label="Panel de control de diseño"
    >
      <Tabs defaultValue="design" className="flex h-full min-h-0 flex-col gap-0">
        <div className="border-b border-border px-3 pt-3">
          <TabsList className="grid h-10 w-full grid-cols-3 bg-muted/60">
            <TabsTrigger value="design" className="gap-1.5 text-xs font-semibold">
              <Palette className="h-3.5 w-3.5" /> Diseño
            </TabsTrigger>
            <TabsTrigger value="elements" className="gap-1.5 text-xs font-semibold">
              <SquarePlus className="h-3.5 w-3.5" /> Elementos
            </TabsTrigger>
            <TabsTrigger value="props" className="gap-1.5 text-xs font-semibold">
              <MousePointerClick className="h-3.5 w-3.5" /> Propiedades
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="design" className="thin-scroll mt-0 min-h-0 flex-1 overflow-y-auto p-4">
          <DesignTab />
        </TabsContent>
        <TabsContent value="elements" className="thin-scroll mt-0 min-h-0 flex-1 overflow-y-auto p-4">
          <ElementsTab />
        </TabsContent>
        <TabsContent value="props" className="thin-scroll mt-0 min-h-0 flex-1 overflow-y-auto p-4">
          <PropertiesTab />
        </TabsContent>
      </Tabs>
    </aside>
  )
}
