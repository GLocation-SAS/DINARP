"use client";

import React from "react";
import { getAssetPath } from "@/lib/utils";

interface WireframeAuthLayoutProps {
  children: React.ReactNode;
  imageSrc?: string;
}

export function WireframeAuthLayout({
  children,
  imageSrc = getAssetPath("/1avatar.png"),
}: WireframeAuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground grid grid-cols-1 lg:grid-cols-12">
      {/* ══════════════════════════════════════════════════
          COLUMNA IZQUIERDA: Foto Institucional (1avatar)
         ══════════════════════════════════════════════════ */}
      <div className="order-last lg:order-first lg:col-span-6 xl:col-span-6 2xl:col-span-7 relative flex items-center justify-center bg-slate-950 border-t lg:border-t-0 lg:border-r border-border min-h-[460px] lg:min-h-screen overflow-hidden">
        <img
          src={imageSrc}
          alt="Portal de Interoperabilidad DINARP"
          className="w-full h-full object-cover object-center select-none"
        />
      </div>

      {/* ══════════════════════════════════════════════════
          COLUMNA DERECHA: Card dinámico (Slot)
         ══════════════════════════════════════════════════ */}
      <div className="order-first lg:order-last lg:col-span-6 xl:col-span-6 2xl:col-span-5 w-full flex items-center justify-center bg-background p-6 sm:p-10 lg:p-16 min-h-screen">
        <div className="w-full max-w-[480px] flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
