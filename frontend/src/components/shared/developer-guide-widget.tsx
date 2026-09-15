"use client"

import React, { useState, useEffect } from "react"
import { Code2, BookOpen, Palette, CheckCircle2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function DeveloperGuideWidget() {
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Solo mostrar en modo desarrollo (opcional, pero buena práctica)
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="primary"
          size="icon"
          className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-xl shadow-primary/20 z-50 animate-bounce hover:animate-none"
          title="Guía de UI Kit (Dev)"
        >
          <Code2 className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto border-r border-border bg-surface p-0 flex flex-col">
        <div className="p-6 pb-0 border-b border-border sticky top-0 bg-surface/95 backdrop-blur z-10">
          <SheetHeader className="mb-4">
            <div className="flex items-center gap-2">
              <Badge tone="primary" appearance="soft" size="sm" className="mb-2">Dev Tools</Badge>
            </div>
            <SheetTitle className="text-xl flex items-center gap-2">
              <BookOpen className="size-5 text-primary" /> Guía UI Kit
            </SheetTitle>
            <SheetDescription>
              Reglas y convenciones del Design System.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="reglas" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="reglas">Reglas</TabsTrigger>
              <TabsTrigger value="componentes">UI Core</TabsTrigger>
              <TabsTrigger value="auditoria">Checklist</TabsTrigger>
            </TabsList>

            {/* TABS CONTENT: REGLAS */}
            <TabsContent value="reglas" className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                  <h4 className="font-bold flex items-center gap-2 text-primary mb-2">
                    <ShieldAlert className="size-4" /> 1. Tokens Semánticos
                  </h4>
                  <p className="text-sm text-foreground/80 mb-2">
                    <strong>PROHIBIDO:</strong> Usar colores puros de Tailwind (`bg-blue-500`) o HEX (`#ff0000`).
                  </p>
                  <p className="text-sm text-foreground/80">
                    <strong>OBLIGATORIO:</strong> Usa los tokens de `globals.css` (`bg-primary`, `text-success`, `border-border`).
                  </p>
                </div>

                <div className="p-4 bg-surface border border-border rounded-xl">
                  <h4 className="font-bold flex items-center gap-2 text-foreground mb-2">
                    <Palette className="size-4" /> 2. Estilos Inline
                  </h4>
                  <p className="text-sm text-foreground/80">
                    {"Prohibido `style={{}}` para diseño estático. Solo permitido para cálculos dinámicos en JS (posiciones XY, anchos calculados)."}
                  </p>
                </div>

                <div className="p-4 bg-surface border border-border rounded-xl">
                  <h4 className="font-bold flex items-center gap-2 text-foreground mb-2">
                    <Code2 className="size-4" /> 3. Reutilización e IA
                  </h4>
                  <p className="text-sm text-foreground/80 mb-2">
                    No reinventes la rueda ni permitas que la IA alucine componentes.
                  </p>
                  <p className="text-sm text-foreground/80">
                    Busca siempre en `src/components/ui/` antes de crear un elemento HTML crudo (`&lt;input&gt;`, `&lt;button&gt;`).
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* TABS CONTENT: COMPONENTES */}
            <TabsContent value="componentes" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-base mb-2 text-foreground">Botones (`button.tsx`)</h4>
                  <p className="text-sm text-muted-foreground mb-2">Nunca uses `&lt;button&gt;` estándar.</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge appearance="outline">variant="primary"</Badge>
                    <Badge appearance="outline">variant="secondary"</Badge>
                    <Badge appearance="outline">variant="ghost"</Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-base mb-2 text-foreground">Inputs y Formularios</h4>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                    <li><strong>Input:</strong> Campo estándar (`rounded-full`).</li>
                    <li><strong>Textarea:</strong> Multilínea. Usa `appearance="chat"` para asistentes.</li>
                    <li><strong>InputGroup:</strong> Obligatorio para inputs con iconos o prefijos (ej: Coordenadas).</li>
                    <li><strong>Slider:</strong> Obligatorio en mapas en lugar de `input type="range"`.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-base mb-2 text-foreground">Etiquetas (`badge.tsx`)</h4>
                  <p className="text-sm text-muted-foreground mb-2">No uses `asChild` si tiene múltiples elementos dentro (rompe Radix Slot).</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="success" appearance="soft">tone="success"</Badge>
                    <Badge tone="danger" appearance="soft">tone="danger"</Badge>
                    <Badge tone="info" appearance="soft">tone="info"</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TABS CONTENT: AUDITORIA */}
            <TabsContent value="auditoria" className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Antes de hacer commit, hazte estas preguntas:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 text-success shrink-0" />
                  <span className="text-sm text-foreground">¿Reutilicé componentes de `@/components/ui`?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 text-success shrink-0" />
                  <span className="text-sm text-foreground">¿Están eliminados todos los colores hardcodeados (`HEX`, `bg-blue-500`)?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 text-success shrink-0" />
                  <span className="text-sm text-foreground">¿Los espaciados usan la escala de Tailwind (`p-4`, `gap-6`)?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 text-success shrink-0" />
                  <span className="text-sm text-foreground">¿Evité crear inputs complejos sueltos y utilicé `InputGroup`?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 text-success shrink-0" />
                  <span className="text-sm text-foreground">¿Se adapta correctamente al modo Oscuro/Claro?</span>
                </li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}

