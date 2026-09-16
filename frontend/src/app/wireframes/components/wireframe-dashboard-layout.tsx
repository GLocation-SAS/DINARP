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
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/shared/user-menu";
import { NotificationsMenu } from "@/components/shared/notifications-menu";

interface WireframeDashboardLayoutProps {
  activeMenu?: string;
  children: React.ReactNode;
}

export function WireframeDashboardLayout({
  activeMenu = "inicio",
  children,
}: WireframeDashboardLayoutProps) {
  const [themeMode, setThemeMode] = useState<"claro" | "oscuro">("claro");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navSections = [
    {
      items: [
        { id: "inicio", label: "Inicio", icon: Home, href: "/wireframes/dashboard" },
      ],
    },
    {
      title: "SOLICITUDES",
      items: [
        { id: "solicitudes", label: "Solicitudes", icon: FileText, href: "/wireframes/solicitudes" },
        { id: "aprobaciones", label: "Aprobaciones", icon: CheckSquare, href: "/wireframes/solicitudes" },
        { id: "proyectos", label: "Proyectos", icon: Folder, href: "/wireframes/solicitudes" },
      ],
    },
    {
      title: "INTEROPERABILIDAD",
      items: [
        { id: "intercambio", label: "Intercambio uno a uno", icon: ArrowLeftRight, href: "/wireframes/solicitudes" },
        { id: "batch", label: "Batch / Excepcionalidades", icon: Server, href: "/wireframes/solicitudes" },
        { id: "catalogo", label: "Catálogo de fuentes", icon: Database, href: "/wireframes/solicitudes" },
        { id: "trazabilidad", label: "Trazabilidad", icon: Network, href: "/wireframes/solicitudes" },
      ],
    },
    {
      title: "GESTIÓN",
      items: [
        { id: "cotizacion", label: "Cotización / Tarifario", icon: Receipt, href: "/wireframes/solicitudes" },
        { id: "reportes", label: "Reportes", icon: BarChart2, href: "/wireframes/solicitudes" },
      ],
    },
    {
      title: "ADMINISTRACIÓN",
      items: [
        { id: "usuarios", label: "Usuarios", icon: Users, href: "/wireframes/solicitudes" },
        { id: "roles", label: "Roles y permisos", icon: ShieldCheck, href: "/wireframes/solicitudes" },
        { id: "configuracion", label: "Configuración", icon: Settings, href: "/wireframes/solicitudes" },
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
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-surface border-r border-border transition-transform duration-300 lg:static lg:translate-x-0 shrink-0",
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

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="lg:hidden text-muted-foreground hover:bg-muted/50"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="size-5" />
          </Button>
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
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left",
                      isActive
                        ? "bg-muted/80 text-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                  >
                    <Icon className={cn("size-4 shrink-0", isActive ? "text-foreground" : "text-muted-foreground")} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Theme Toggle Footer */}
        <div className="p-4 border-t border-border/40 shrink-0">
          <div className="flex items-center bg-muted/40 p-1 rounded-2xl border border-border/60">
            <Button
              type="button"
              variant={themeMode === "claro" ? "neutral" : "ghost"}
              size="sm"
              onClick={() => setThemeMode("claro")}
              className={cn(
                "flex-1 h-8 rounded-xl text-xs font-medium gap-1.5",
                themeMode === "claro" && "bg-surface shadow-xs text-foreground"
              )}
            >
              <Sun className="size-3.5" />
              <span>Claro</span>
            </Button>
            <div className="h-4 w-px bg-border/60 mx-1" />
            <Button
              type="button"
              variant={themeMode === "oscuro" ? "neutral" : "ghost"}
              size="sm"
              onClick={() => setThemeMode("oscuro")}
              className={cn(
                "flex-1 h-8 rounded-xl text-xs font-medium gap-1.5",
                themeMode === "oscuro" && "bg-surface shadow-xs text-foreground"
              )}
            >
              <Moon className="size-3.5" />
              <span>Oscuro</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════
          CONTENIDO PRINCIPAL & HEADER SUPERIOR
         ══════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <header className="h-16 px-4 sm:px-8 flex items-center justify-between border-b border-border/40 bg-surface/50 backdrop-blur-xs shrink-0">
          {/* Mobile Burger */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden text-muted-foreground hover:bg-muted/50"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="size-5" />
          </Button>

          <div className="hidden lg:block" />

          {/* User Profile & Notifications from shared components */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <NotificationsMenu />
            <UserMenu />
          </div>
        </header>

        {/* Dynamic Page Content Slot */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
