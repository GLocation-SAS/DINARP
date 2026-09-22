"use client";

import React from "react";
import {
  FilePlus,
  ShieldCheck,
  Clock3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WireframeAuthLayoutProps {
  children: React.ReactNode;
}

export function WireframeAuthLayout({ children }: WireframeAuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50 text-foreground p-4 sm:p-6 lg:p-10 xl:p-12 relative">
      <div className="w-full max-w-[1400px] rounded-[2rem] overflow-hidden border border-border shadow-xl grid grid-cols-1 lg:grid-cols-12 bg-background">
        
        {/* ══════════════════════════════════════════════════
            COLUMNA IZQUIERDA: Panel Wireframe con UI Kit
           ══════════════════════════════════════════════════ */}
        <div className="order-last lg:order-first lg:col-span-6 xl:col-span-6 2xl:col-span-7 relative flex flex-col bg-muted/40 border-t lg:border-t-0 lg:border-r border-border min-h-[560px] lg:min-h-[700px] overflow-hidden">
          
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col flex-1 relative z-10">
            {/* Parte Superior: Encabezado y Descripción */}
            <div className="flex flex-col items-start text-left w-full max-w-[520px]">
              <div className="w-8 h-1 bg-foreground rounded-full mb-8" />

              <h1 className="font-heading text-3xl sm:text-[40px] lg:text-[44px] font-extrabold tracking-tight text-foreground leading-[1.2] mb-4">
                Interoperabilidad simple, <br className="hidden sm:inline" />
                segura y centralizada.
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground font-normal leading-relaxed mt-2">
                Gestiona solicitudes, autorizaciones y servicios de interoperabilidad entre instituciones desde un único portal.
              </p>
            </div>
          </div>

          {/* Parte Inferior: Recurso Visual Abstracto */}
          <div className="relative w-full h-[250px] lg:h-[300px] flex items-center justify-center opacity-80 mt-auto pointer-events-none">
            {/* Nodos conectados centralizados (minimalista) */}
            <svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground">
              {/* Líneas conectoras finas */}
              <path d="M40 60 L100 60 M200 60 L140 60 M120 20 L120 40 M120 100 L120 80 M80 30 L105 45 M160 30 L135 45 M80 90 L105 75 M160 90 L135 75" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="3 3"/>
              
              {/* Nodo central */}
              <circle cx="120" cy="60" r="16" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="120" cy="60" r="6" fill="currentColor" />
              
              {/* Nodos periféricos */}
              <circle cx="40" cy="60" r="8" fill="transparent" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="200" cy="60" r="8" fill="transparent" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="120" cy="20" r="8" fill="transparent" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="120" cy="100" r="8" fill="transparent" stroke="currentColor" strokeWidth="1.5" />
              
              <circle cx="80" cy="30" r="5" fill="currentColor" fillOpacity="0.5" />
              <circle cx="160" cy="30" r="5" fill="currentColor" fillOpacity="0.5" />
              <circle cx="80" cy="90" r="5" fill="currentColor" fillOpacity="0.5" />
              <circle cx="160" cy="90" r="5" fill="currentColor" fillOpacity="0.5" />
            </svg>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            COLUMNA DERECHA: Card dinámico (Slot)
           ══════════════════════════════════════════════════ */}
        <div className="order-first lg:order-last lg:col-span-6 xl:col-span-6 2xl:col-span-5 w-full flex items-center justify-center bg-background p-6 sm:p-10 lg:p-16">
          <div className="w-full max-w-[420px] flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
