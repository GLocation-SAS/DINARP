"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, FileQuestion } from "lucide-react";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

export default function Wireframe404Page() {
  return (
    <WireframeDashboardLayout>
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 sm:p-12 text-center">
        <div className="max-w-xl w-full flex flex-col items-center">
          <div className="size-20 rounded-3xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-6">
            <FileQuestion className="size-10 text-foreground" />
          </div>

          <h1 className="text-6xl sm:text-8xl font-black font-heading text-foreground tracking-tight mb-2">
            404
          </h1>

          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
            Página no encontrada
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
            La ruta a la que intentas acceder no existe en el prototipo o ha sido reubicada.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link href="/wireframes/dashboard">
              <Button variant="primary" className="rounded-xl px-6 h-11 text-xs font-semibold">
                Volver al Dashboard <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="rounded-xl px-6 h-11 text-xs font-semibold"
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
