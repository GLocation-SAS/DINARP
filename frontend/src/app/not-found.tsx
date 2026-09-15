"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, FileQuestion, Link2Off, Home, MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden selection:bg-primary/20">

      {/* Texture and Ambient Light */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-danger/10 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse [animation-duration:8s]" />

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">

        {/* Floating 404 Scene */}
        <div className="relative w-full h-[320px] flex items-center justify-center select-none mt-10 sm:mt-0">

          {/* Central Main 404 */}
          <div className="relative z-20 flex items-center justify-center drop-shadow-2xl p-8 animate-[ha-float_6s_ease-in-out_infinite]">
            <h1 className="text-[120px] sm:text-[180px] md:text-[220px] font-black font-heading text-transparent bg-clip-text bg-gradient-to-br from-primary to-danger/80 leading-none tracking-tighter">
              404
            </h1>
          </div>

          {/* Floating UI Elements (Glassmorphism Cards representing errors) */}

          {/* Card 1: Missing File */}
          <div className="absolute top-4 left-[5%] sm:left-[15%] w-48 bg-surface/80 dark:bg-surface-raised/90 border border-border shadow-xl backdrop-blur-md p-3 rounded-2xl animate-[ha-float_7s_ease-in-out_infinite_1s] flex flex-col gap-2 -rotate-6 z-10 hidden sm:flex">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-danger/10 text-danger"><FileQuestion className="size-4" /></div>
              <div className="h-2 w-20 bg-border rounded-full" />
            </div>
            <div className="w-full h-12 bg-muted/50 rounded-lg border border-border/50 border-dashed flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground font-mono">not_found.json</span>
            </div>
          </div>

          {/* Card 2: Error Badge */}
          <div className="absolute bottom-6 left-[10%] sm:left-[22%] bg-warning/10 border border-warning/20 shadow-lg backdrop-blur-md px-4 py-2.5 rounded-full animate-[ha-float_5s_ease-in-out_infinite_0.5s] flex items-center gap-2 rotate-3 z-30">
            <AlertCircle className="size-4 text-warning animate-pulse" />
            <span className="text-xs font-semibold text-warning">Ruta inaccesible</span>
          </div>

          {/* Card 3: Location Not Found */}
          <div className="absolute top-10 right-[5%] sm:right-[15%] w-40 bg-surface/80 dark:bg-surface-raised/90 border border-border shadow-xl backdrop-blur-md p-3 rounded-2xl animate-[ha-float_8s_ease-in-out_infinite_2s] flex flex-col gap-3 rotate-6 z-10 hidden sm:flex">
            <div className="flex flex-col gap-2 border-b border-border pb-2 mb-1">
              <div className="h-2 w-full bg-border rounded-full" />
              <div className="h-2 w-2/3 bg-border rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <MapPinOff className="size-4 text-muted-foreground" />
              <div className="h-1.5 w-12 bg-danger/40 rounded-full" />
            </div>
          </div>

          {/* Card 4: Broken Link Bubble */}
          <div className="absolute bottom-16 right-[10%] sm:right-[25%] bg-surface/90 dark:bg-surface-raised/90 border border-border/80 shadow-lg backdrop-blur-md p-3 rounded-2xl animate-[ha-float_6s_ease-in-out_infinite_1.5s] flex items-center justify-center -rotate-12 z-20">
            <Link2Off className="size-6 text-danger animate-pulse" />
          </div>

          {/* Decorative Tools & Particles */}
          <div className="absolute top-1/4 left-1/3 bg-primary/10 border border-primary/20 p-2 rounded-xl animate-[ha-float_4s_ease-in-out_infinite_0.2s] z-0">
            <Search className="size-5 text-primary" />
          </div>

          {/* Floating Dots */}
          <div className="absolute top-1/3 left-1/4 size-3 rounded-full bg-danger/40 animate-ping [animation-duration:3s]" />
          <div className="absolute bottom-1/3 right-1/4 size-4 rounded-full bg-primary/40 animate-pulse [animation-duration:2s]" />
          <div className="absolute top-1/4 right-1/3 size-2 rounded-full bg-warning/50" />
        </div>

        {/* Text Content */}
        <div className="space-y-4 max-w-xl mt-4 z-20">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-danger/10 border border-danger/20 text-danger text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2">
            Error de navegación
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-foreground tracking-tight drop-shadow-sm">
            ¡Ups! Página <span className="text-transparent bg-clip-text bg-gradient-to-r from-danger to-warning">no encontrada</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans font-medium">
            Lo sentimos, la página que buscas no existe, fue movida o no está disponible en este momento dentro del geoportal.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap z-20">
          <Link href="/">
            <Button variant="primary" size="lg" className="rounded-full shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all duration-300" leftIcon={<Home className="size-4" />}>
              Volver al inicio
            </Button>
          </Link>
          <Button variant="secondary" size="lg" className="rounded-full bg-surface hover:bg-muted text-foreground border border-border shadow-sm hover:-translate-y-1 transition-all duration-300" onClick={() => window.history.back()}>
            Regresar
          </Button>
        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-xs text-muted-foreground/60 font-sans tracking-wide">
        GRisk — GEOportal v2.0
      </div>
    </div>
  );
}
