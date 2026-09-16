"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  FileText,
  CheckSquare,
  Folder,
  ArrowLeftRight,
  Server,
  Database,
  Network,
  Receipt,
  BarChart2,
  Users,
  ShieldCheck,
  Settings,
  Bell,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  FilePlus2,
  UserCheck,
  BarChart3,
  ArrowRight,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

import { cn, getAssetPath } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function WireframeDashboardPage() {
  const [activeMenu, setActiveMenu] = useState("inicio");
  const [themeMode, setThemeMode] = useState<"claro" | "oscuro">("claro");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Módulos del dashboard
  const modules = [
    {
      id: "nueva-solicitud",
      title: "Nueva solicitud",
      description: "Crea una solicitud de interoperabilidad de forma guiada.",
      icon: FilePlus2,
      href: "/wireframes",
    },
    {
      id: "mis-solicitudes",
      title: "Mis solicitudes",
      description: "Consulta y da seguimiento a tus solicitudes.",
      icon: FileText,
      href: "/wireframes",
    },
    {
      id: "aprobaciones",
      title: "Aprobaciones",
      description: "Revisa las solicitudes pendientes de aprobación.",
      icon: UserCheck,
      href: "/wireframes",
    },
    {
      id: "catalogo-fuentes",
      title: "Catálogo de fuentes",
      description: "Explora las instituciones disponibles y sus servicios.",
      icon: Database,
      href: "/wireframes",
    },
    {
      id: "intercambio-uno-a-uno",
      title: "Intercambio uno a uno",
      description: "Gestiona consumos de información en tiempo real.",
      icon: ArrowLeftRight,
      href: "/wireframes",
    },
    {
      id: "batch-excepcionalidades",
      title: "Batch / Excepcionalidades",
      description: "Gestiona intercambios masivos de información.",
      icon: Server,
      href: "/wireframes",
    },
    {
      id: "proyectos",
      title: "Proyectos",
      description: "Administra tus proyectos de interoperabilidad.",
      icon: Folder,
      href: "/wireframes",
    },
    {
      id: "trazabilidad",
      title: "Trazabilidad",
      description: "Consulta el historial de intercambios y eventos.",
      icon: BarChart3,
      href: "/wireframes",
    },
  ];

  const navSections = [
    {
      items: [
        { id: "inicio", label: "Inicio", icon: Home, href: "/wireframes/dashboard" },
      ],
    },
    {
      title: "SOLICITUDES",
      items: [
        { id: "solicitudes", label: "Solicitudes", icon: FileText, href: "/wireframes" },
        { id: "aprobaciones", label: "Aprobaciones", icon: CheckSquare, href: "/wireframes" },
        { id: "proyectos", label: "Proyectos", icon: Folder, href: "/wireframes" },
      ],
    },
    {
      title: "INTEROPERABILIDAD",
      items: [
        { id: "intercambio", label: "Intercambio uno a uno", icon: ArrowLeftRight, href: "/wireframes" },
        { id: "batch", label: "Batch / Excepcionalidades", icon: Server, href: "/wireframes" },
        { id: "catalogo", label: "Catálogo de fuentes", icon: Database, href: "/wireframes" },
        { id: "trazabilidad", label: "Trazabilidad", icon: Network, href: "/wireframes" },
      ],
    },
    {
      title: "GESTIÓN",
      items: [
        { id: "cotizacion", label: "Cotización / Tarifario", icon: Receipt, href: "/wireframes" },
        { id: "reportes", label: "Reportes", icon: BarChart2, href: "/wireframes" },
      ],
    },
    {
      title: "ADMINISTRACIÓN",
      items: [
        { id: "usuarios", label: "Usuarios", icon: Users, href: "/wireframes" },
        { id: "roles", label: "Roles y permisos", icon: ShieldCheck, href: "/wireframes" },
        { id: "configuracion", label: "Configuración", icon: Settings, href: "/wireframes" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans antialiased">
      {/* ══════════════════════════════════════════════════
          SIDEBAR IZQUIERDO (Desktop & Mobile Drawer)
         ══════════════════════════════════════════════════ */}
      {/* Overlay Mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-surface border-r border-border transition-transform duration-300 lg:static lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-border/40 shrink-0">
          <Link href="/wireframes/dashboard" className="flex flex-col">
            <span className="font-heading font-extrabold text-xl tracking-tight text-foreground leading-none">
              DINARP
            </span>
            <span className="text-[11px] text-muted-foreground font-medium leading-tight mt-0.5">
              Gobierno del Ecuador
            </span>
          </Link>

          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <p className="px-3 text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase mb-2">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveMenu(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left",
                      isActive
                        ? "bg-muted/80 text-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                  >
                    <Icon className={cn("size-4 shrink-0", isActive ? "text-foreground" : "text-muted-foreground")} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Theme Toggle Footer */}
        <div className="p-4 border-t border-border/40 shrink-0">
          <div className="flex items-center bg-muted/40 p-1 rounded-2xl border border-border/60">
            <button
              type="button"
              onClick={() => setThemeMode("claro")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-medium transition-all",
                themeMode === "claro"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sun className="size-3.5" />
              <span>Claro</span>
            </button>
            <div className="h-4 w-px bg-border/60 mx-1" />
            <button
              type="button"
              onClick={() => setThemeMode("oscuro")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-medium transition-all",
                themeMode === "oscuro"
                  ? "bg-surface text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Moon className="size-3.5" />
              <span>Oscuro</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════
          CONTENIDO PRINCIPAL & HEADER SUPERIOR
         ══════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 px-4 sm:px-8 flex items-center justify-between border-b border-border/40 bg-surface/50 backdrop-blur-xs shrink-0">
          {/* Mobile Burger */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted/50"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="size-5" />
          </button>

          <div className="hidden lg:block" />

          {/* User Profile & Notifications */}
          <div className="flex items-center gap-4 sm:gap-6 ml-auto">
            <button
              type="button"
              className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              aria-label="Notificaciones"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-foreground" />
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-border/60">
              <div className="size-8 rounded-full bg-muted/80 border border-border flex items-center justify-center text-xs font-bold text-foreground">
                PN
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-foreground leading-tight">
                  Paula Rozo
                </span>
                <span className="text-[10px] text-muted-foreground font-medium leading-tight">
                  Analista
                </span>
              </div>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="flex-1 relative p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-8 sm:space-y-10">
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
            <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs transition-transform hover:-translate-y-0.5">
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
            </div>

            {/* 2. Pendientes por aprobación */}
            <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs transition-transform hover:-translate-y-0.5">
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
            </div>

            {/* 3. Aprobadas este mes */}
            <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs transition-transform hover:-translate-y-0.5">
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
            </div>

            {/* 4. Requieren atención */}
            <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs transition-transform hover:-translate-y-0.5">
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
            </div>
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
      </div>
    </div>
  );
}
