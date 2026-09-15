"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench, Hammer, HardHat, Home, Search, Map, ShieldAlert, BarChart3, Settings } from "lucide-react";

export default function Construccion() {
  return (
    <div className="relative min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden selection:bg-primary/20">

      {/* Texture and Ambient Light */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse [animation-duration:8s]" />

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">

        {/* Floating Construction Scene */}
        <div className="relative w-full h-[320px] flex items-center justify-center select-none mt-10 sm:mt-0">

          {/* Central Main Icon */}
          <div className="relative z-20 text-primary drop-shadow-2xl p-8 bg-surface/50 border border-border/50 rounded-full backdrop-blur-xl animate-[ha-float_6s_ease-in-out_infinite]">
            <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping [animation-duration:3s]" />
            <Wrench className="size-[80px] sm:size-[100px] animate-[ha-spin_20s_linear_infinite]" strokeWidth={1.5} />
          </div>

          {/* Floating UI Elements (Glassmorphism Cards representing modules) */}

          {/* Card 1: Map Module */}
          <div className="absolute top-4 left-[5%] sm:left-[15%] w-48 bg-surface/80 dark:bg-surface-raised/90 border border-border shadow-xl backdrop-blur-md p-3 rounded-2xl animate-[ha-float_7s_ease-in-out_infinite_1s] flex flex-col gap-2 -rotate-6 z-10 hidden sm:flex">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-info/10 text-info"><Map className="size-4" /></div>
              <div className="h-2 w-16 bg-border rounded-full" />
            </div>
            <div className="w-full h-12 bg-muted/50 rounded-lg border border-border/50 border-dashed" />
          </div>

          {/* Card 2: Risk Alert */}
          <div className="absolute bottom-6 left-[10%] sm:left-[22%] bg-danger/10 border border-danger/20 shadow-lg backdrop-blur-md px-4 py-2.5 rounded-full animate-[ha-float_5s_ease-in-out_infinite_0.5s] flex items-center gap-2 rotate-3 z-30">
            <ShieldAlert className="size-4 text-danger animate-pulse" />
            <span className="text-xs font-semibold text-danger">Módulo de Riesgos</span>
          </div>

          {/* Card 3: Analytics */}
          <div className="absolute top-10 right-[5%] sm:right-[15%] w-40 bg-surface/80 dark:bg-surface-raised/90 border border-border shadow-xl backdrop-blur-md p-3 rounded-2xl animate-[ha-float_8s_ease-in-out_infinite_2s] flex flex-col gap-3 rotate-6 z-10 hidden sm:flex">
            <div className="flex justify-between items-end">
              <div className="w-6 h-8 bg-primary/40 rounded-sm" />
              <div className="w-6 h-12 bg-primary/70 rounded-sm" />
              <div className="w-6 h-6 bg-primary/20 rounded-sm" />
            </div>
            <div className="flex items-center gap-2 border-t border-border pt-2 mt-1">
              <BarChart3 className="size-3 text-muted-foreground" />
              <div className="h-1.5 w-12 bg-border rounded-full" />
            </div>
          </div>

          {/* Card 4: Settings Bubble */}
          <div className="absolute bottom-16 right-[10%] sm:right-[25%] bg-surface/90 dark:bg-surface-raised/90 border border-border/80 shadow-lg backdrop-blur-md p-3 rounded-2xl animate-[ha-float_6s_ease-in-out_infinite_1.5s] flex items-center justify-center -rotate-12 z-20">
            <Settings className="size-6 text-secondary animate-[ha-spin-r_15s_linear_infinite]" />
          </div>

          {/* Decorative Tools & Particles */}
          <div className="absolute top-1/4 left-1/3 bg-warning/20 border border-warning/30 p-2 rounded-xl animate-[ha-float_4s_ease-in-out_infinite_0.2s] z-0">
            <HardHat className="size-5 text-warning" />
          </div>
          <div className="absolute bottom-1/4 right-1/3 bg-success/10 border border-success/20 p-2 rounded-xl animate-[ha-float_5.5s_ease-in-out_infinite_1s] z-0">
            <Hammer className="size-5 text-success" />
          </div>

          {/* Floating Dots */}
          <div className="absolute top-1/3 left-1/4 size-3 rounded-full bg-primary/40 animate-ping [animation-duration:3s]" />
          <div className="absolute bottom-1/3 right-1/4 size-4 rounded-full bg-secondary/40 animate-pulse [animation-duration:2s]" />
          <div className="absolute top-1/4 right-1/3 size-2 rounded-full bg-warning/50" />
        </div>

        {/* Text Content */}
        <div className="space-y-4 max-w-xl mt-4 z-20">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2">
            Módulo en desarrollo
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-foreground tracking-tight drop-shadow-sm">
            Página en <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">construcción</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans font-medium">
            Nuestros ingenieros están ensamblando nuevos componentes cartográficos y de gestión para ofrecerte herramientas más potentes en el Geoportal.
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
