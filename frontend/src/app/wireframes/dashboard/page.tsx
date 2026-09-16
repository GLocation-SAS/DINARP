"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  FilePlus2,
  UserCheck,
  BarChart3,
  ArrowRight,
  ArrowLeftRight,
  Server,
  Database,
  Folder,
} from "lucide-react";

import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

export default function WireframeDashboardPage() {
  // Módulos del dashboard
  const modules = [
    {
      id: "nueva-solicitud",
      title: "Nueva solicitud",
      description: "Crea una solicitud de interoperabilidad de forma guiada.",
      icon: FilePlus2,
      href: "/wireframes/solicitudes/nueva",
    },
    {
      id: "mis-solicitudes",
      title: "Mis solicitudes",
      description: "Consulta y da seguimiento a tus solicitudes.",
      icon: FileText,
      href: "/wireframes/solicitudes",
    },
    {
      id: "aprobaciones",
      title: "Aprobaciones",
      description: "Revisa las solicitudes pendientes de aprobación.",
      icon: UserCheck,
      href: "/wireframes/solicitudes",
    },
    {
      id: "catalogo-fuentes",
      title: "Catálogo de fuentes",
      description: "Explora las instituciones disponibles y sus servicios.",
      icon: Database,
      href: "/wireframes/solicitudes",
    },
    {
      id: "intercambio-uno-a-uno",
      title: "Intercambio uno a uno",
      description: "Gestiona consumos de información en tiempo real.",
      icon: ArrowLeftRight,
      href: "/wireframes/solicitudes",
    },
    {
      id: "batch-excepcionalidades",
      title: "Batch / Excepcionalidades",
      description: "Gestiona intercambios masivos de información.",
      icon: Server,
      href: "/wireframes/solicitudes",
    },
    {
      id: "proyectos",
      title: "Proyectos",
      description: "Administra tus proyectos de interoperabilidad.",
      icon: Folder,
      href: "/wireframes/solicitudes",
    },
    {
      id: "trazabilidad",
      title: "Trazabilidad",
      description: "Consulta el historial de intercambios y eventos.",
      icon: BarChart3,
      href: "/wireframes/solicitudes",
    },
  ];

  return (
    <WireframeDashboardLayout activeMenu="inicio">
      <main className="relative p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-8 sm:space-y-10">
        {/* Background subtle waves */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* Greeting Section */}
        <div className="space-y-2">
          <p className="text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase">
            PANEL PRINCIPAL
          </p>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground flex items-center gap-3">
            <span>Buenos días, Paula</span>
            <span className="inline-block hover:rotate-12 transition-transform cursor-default">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Te damos la bienvenida al portal de interoperabilidad de DINARP. <br className="hidden sm:inline" />
            Desde aquí puedes gestionar tus solicitudes, proyectos y accesos a información institucional.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════
            CARDS RESUMEN DE ESTADO (4 Métricas)
           ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* 1. Solicitudes activas */}
          <Link
            href="/wireframes/solicitudes"
            className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs transition-transform hover:-translate-y-0.5"
          >
            <div className="size-12 rounded-xl bg-muted/60 flex items-center justify-center text-foreground shrink-0">
              <FileText className="size-6 stroke-[1.75]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-2xl text-foreground leading-tight">
                12
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Solicitudes activas
              </span>
            </div>
          </Link>

          {/* 2. Pendientes por aprobación */}
          <Link
            href="/wireframes/solicitudes"
            className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs transition-transform hover:-translate-y-0.5"
          >
            <div className="size-12 rounded-xl bg-muted/60 flex items-center justify-center text-foreground shrink-0">
              <Clock className="size-6 stroke-[1.75]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-2xl text-foreground leading-tight">
                4
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Pendientes por aprobación
              </span>
            </div>
          </Link>

          {/* 3. Aprobadas este mes */}
          <Link
            href="/wireframes/solicitudes"
            className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs transition-transform hover:-translate-y-0.5"
          >
            <div className="size-12 rounded-xl bg-muted/60 flex items-center justify-center text-foreground shrink-0">
              <CheckCircle2 className="size-6 stroke-[1.75]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-2xl text-foreground leading-tight">
                8
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Aprobadas este mes
              </span>
            </div>
          </Link>

          {/* 4. Requieren atención */}
          <Link
            href="/wireframes/solicitudes"
            className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs transition-transform hover:-translate-y-0.5"
          >
            <div className="size-12 rounded-xl bg-muted/60 flex items-center justify-center text-foreground shrink-0">
              <XCircle className="size-6 stroke-[1.75]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-2xl text-foreground leading-tight">
                2
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Requieren atención
              </span>
            </div>
          </Link>
        </div>

        {/* ══════════════════════════════════════════════════
            SECCIÓN: EXPLORAR MÓDULOS (Grid de 8 Cards)
           ══════════════════════════════════════════════════ */}
        <div className="space-y-4 sm:space-y-5">
          <div className="space-y-1">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-foreground tracking-tight">
              Explorar módulos
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Accede a las funcionalidades principales del sistema.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.id}
                  href={mod.href}
                  className="group relative flex flex-col justify-between p-6 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-md transition-all duration-200"
                >
                  <div>
                    {/* Icon */}
                    <div className="size-12 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center text-foreground mb-4 group-hover:scale-105 transition-transform">
                      <Icon className="size-6 stroke-[1.75]" />
                    </div>

                    {/* Content */}
                    <h3 className="font-heading font-bold text-base text-foreground group-hover:text-foreground transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>

                  {/* Bottom Action Icon */}
                  <div className="mt-6 flex justify-end">
                    <div className="size-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground/40 group-hover:translate-x-0.5 transition-all">
                      <ArrowRight className="size-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </WireframeDashboardLayout>
  );
}
