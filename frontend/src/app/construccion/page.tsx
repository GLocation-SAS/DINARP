"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Layers } from "lucide-react";

export default function Construccion() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 text-center relative">
      <div className="relative z-10 max-w-lg w-full flex flex-col items-center">
        <div className="size-20 rounded-3xl bg-muted/50 border border-border flex items-center justify-center mb-6">
          <Layers className="size-10 text-foreground" strokeWidth={1.5} />
        </div>

        <Badge
          appearance="outline"
          tone="neutral"
          className="mb-3 border-border text-xs px-3 py-1 font-semibold"
        >
          Etapa de wireframes
        </Badge>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Función no disponible
        </h1>

        <p className="text-sm sm:text-base font-semibold text-foreground/80 mb-3">
          Función en evaluación de diseño UX/UI
        </p>

        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
          Esta funcionalidad se encuentra en proceso de validación conceptual, técnica y normativa para la sesión de trabajo con DINARP e instituciones participantes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            size="default"
            asChild
            className="px-6 h-10 text-xs font-semibold"
          >
            <Link href="/wireframes/dashboard">
              Ir al Dashboard
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="default"
            className="px-6 h-10 text-xs font-semibold border-border"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 size-4" />
            Regresar
          </Button>
        </div>
      </div>
    </div>
  );
}
