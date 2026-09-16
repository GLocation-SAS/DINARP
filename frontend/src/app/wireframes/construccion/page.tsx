"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Wrench } from "lucide-react";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

export default function WireframeConstruccionPage() {
  return (
    <WireframeDashboardLayout>
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 sm:p-12 text-center">
        <div className="max-w-xl w-full flex flex-col items-center">
          <div className="size-20 rounded-3xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-6">
            <Wrench className="size-10 text-foreground" strokeWidth={1.5} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground tracking-tight mb-3">
            Módulo en construcción
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
            Esta sección se encuentra en proceso de especificación y diseño para los wireframes del sistema DINARP.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link href="/wireframes/dashboard">
              <Button variant="primary" className="px-6 h-11 text-xs font-semibold">
                Volver al Dashboard <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="px-6 h-11 text-xs font-semibold"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 size-4" />
              Regresar
            </Button>
          </div>
        </div>
      </div>
    </WireframeDashboardLayout>
  );
}

