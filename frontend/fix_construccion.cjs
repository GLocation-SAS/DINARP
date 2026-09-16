const fs = require('fs');
const content = `
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench, Hammer, HardHat, Home, Search, Map, ShieldAlert, BarChart3, Settings } from "lucide-react";

export default function Construccion() {
  return (
    <div className="relative min-h-screen w-full bg-[#f8faff] dark:bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden selection:bg-primary/20">

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-info/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">

        {/* Central Element / Icon */}
        <div className="relative z-20 text-primary drop-shadow-2xl p-8 mb-4">
            <Wrench className="size-[100px] sm:size-[140px] md:size-[180px] animate-[ha-spin_20s_linear_infinite]" strokeWidth={1.5} />
        </div>

        {/* Text Content */}
        <div className="space-y-4 max-w-xl z-20 flex flex-col items-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-2">
            Módulo en desarrollo
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-foreground tracking-tight mb-2 drop-shadow-sm">
            Página en construcción
          </h2>
          
          <p className="text-base sm:text-lg text-muted-foreground/80 leading-relaxed max-w-md mx-auto mb-10">
            Nuestros ingenieros están ensamblando nuevos componentes cartográficos y de gestión para ofrecerte herramientas más potentes en el Geoportal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mt-6 z-20">
          <Link href="/">
            <Button variant="primary" size="lg" className="rounded-full px-8 py-6 text-base font-semibold shadow-md hover:-translate-y-0.5 transition-transform" leftIcon={<Home className="size-5 mr-2" />}>
              Volver al inicio
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-base font-semibold border-border/80 hover:bg-muted/50 transition-colors" onClick={() => window.history.back()}>
            Regresar
          </Button>
        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-xs text-muted-foreground/60 font-sans tracking-wide">
        DINARP • GEOportal v2.0
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/app/construccion/page.tsx', content, 'utf8');
