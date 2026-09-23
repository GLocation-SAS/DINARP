"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  CreditCard,
  BarChart2,
  Users,
  ShieldCheck,
  Clock,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Layers,
  Search,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { cn, getAssetPath } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WireframeUserMenu } from "./wireframe-user-menu";
import { NotificationsMenu } from "@/components/shared/notifications-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { applyTheme, getStoredTheme, type Theme } from "@/lib/theme";
import { MOCK_USERS_BY_ROLE, type MockUser, type UserRole } from "../catalogo-interoperabilidad/data/catalogo-data";
import { WireframeBreadcrumbs, type BreadcrumbSegment } from "./wireframe-breadcrumbs";

interface WireframeDashboardLayoutProps {
  activeMenu?: string;
  currentUser?: MockUser;
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  breadcrumbs?: BreadcrumbSegment[];
  headerSlot?: React.ReactNode;
  children: React.ReactNode;
}

interface NavSubItem {
  id: string;
  label: string;
  href: string;
  exact?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: NavSubItem[];
  pathPrefix?: string;
  allowedRoles?: UserRole[];
}

const navItems: NavItem[] = [
  {
    id: "catalogo-interoperabilidad-group",
    label: "Catálogo de Interoperabilidad",
    icon: Database,
    pathPrefix: "/wireframes2/catalogo-interoperabilidad",
    children: [
      {
        id: "catalogo-interoperabilidad",
        label: "Consulta",
        href: "/wireframes2/catalogo-interoperabilidad",
        exact: true
      }
    ]
  },
  {
    id: "acceso-interoperabilidad-group",
    label: "Acceso a Interoperabilidad",
    icon: Network,
    pathPrefix: "/wireframes2/acceso-interoperabilidad",
    children: [
      {
        id: "acceso-interoperabilidad",
        label: "Gestión de solicitudes",
        href: "/wireframes2/acceso-interoperabilidad/solicitudes",
        exact: false
      }
    ]
  },
  {
    id: "acceso-seguridad-group",
    label: "Acceso y seguridad",
    icon: ShieldCheck,
    pathPrefix: "/wireframes2/acceso-seguridad",
    children: [
      {
        id: "gestion-ingresos",
        label: "Gestión de ingresos",
        href: "/wireframes2/acceso-seguridad/gestion-ingresos",
        exact: false
      }
    ]
  }
];

export function WireframeDashboardLayout({
  activeMenu,
  currentUser,
  currentRole,
  onRoleChange,
  breadcrumbs,
  headerSlot,
  children
}: WireframeDashboardLayoutProps) {
  const pathname = usePathname();
  const [themeMode, setThemeMode] = useState<"claro" | "oscuro">("claro");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "catalogo-interoperabilidad-group": true,
    "acceso-interoperabilidad-group": true,
    "acceso-seguridad-group": true,
  });

  // Determinar usuario activo de acuerdo a props o ruta específica
  const resolvedUser: MockUser = currentUser || (currentRole ? MOCK_USERS_BY_ROLE[currentRole] : undefined) || (() => {
    if (pathname && (pathname.includes("/catalogo-interoperabilidad/gestion") || pathname.includes("/catalogo-interoperabilidad/novedades") || pathname.includes("/acceso-seguridad"))) {
      return MOCK_USERS_BY_ROLE.DGR;
    }
    return MOCK_USERS_BY_ROLE.COORDINADOR_SINARP;
  })();

  const isAprobador = (currentRole || resolvedUser?.role) === "APROBADOR";

  useEffect(() => {
    const stored = getStoredTheme();
    if (stored) {
      setThemeMode(stored === "dark" ? "oscuro" : "claro");
      applyTheme(stored);
    } else {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark";
      setThemeMode(isDark ? "oscuro" : "claro");
    }

    const observer = new MutationObserver(() => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark";
      setThemeMode(isDark ? "oscuro" : "claro");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const handleThemeChange = (mode: "claro" | "oscuro") => {
    setThemeMode(mode);
    applyTheme(mode === "oscuro" ? "dark" : "light");
  };

  const isSubItemActive = (subItem: NavSubItem) => {
    if (activeMenu && activeMenu === subItem.id) return true;
    if (pathname) {
      if (subItem.exact) {
        return pathname === subItem.href;
      }
      return pathname.startsWith(subItem.href);
    }
    return false;
  };

  const isGroupActive = (item: NavItem) => {
    if (item.children) {
      return item.children.some(child => isSubItemActive(child));
    }
    if (item.href && pathname) {
      return pathname.startsWith(item.href);
    }
    return false;
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background text-foreground font-sans antialiased">
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
          "fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-surface border-r border-border transition-all duration-300 lg:static lg:translate-x-0 shrink-0",
          sidebarCollapsed ? "w-[72px]" : "w-72 sm:w-[280px]",
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className={cn(
          "h-16 px-4 flex items-center justify-between border-b border-border/40 shrink-0",
          sidebarCollapsed && "justify-center px-2"
        )}>
          {!sidebarCollapsed ? (
            <>
              <Link href="/wireframes2" className="flex items-center min-w-0">
                <img
                  src={getAssetPath("/logotipo.png")}
                  alt="Logo DINARP - Gobierno del Ecuador"
                  className="h-9 w-auto max-w-[160px] object-contain"
                />
              </Link>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="hidden lg:flex size-8 text-muted-foreground hover:bg-muted/50 rounded-lg"
                      onClick={() => setSidebarCollapsed(true)}
                      aria-label="Contraer menú lateral"
                    >
                      <PanelLeftClose className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Contraer menú lateral</TooltipContent>
                </Tooltip>

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
            </>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 text-muted-foreground hover:bg-muted/50 rounded-lg"
                  onClick={() => setSidebarCollapsed(false)}
                  aria-label="Expandir menú lateral"
                >
                  <PanelLeftOpen className="size-4.5 text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expandir menú lateral</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Sidebar Navigation */}
        <div className={cn("flex-1 overflow-y-auto py-4 space-y-1.5", sidebarCollapsed ? "px-2" : "px-3.5")}>
          {(() => {
            const activeUserRole = currentRole || resolvedUser?.role;
            const visibleNavItems = navItems.filter((item) => {
              if (!item.allowedRoles) return true;
              return activeUserRole ? item.allowedRoles.includes(activeUserRole) : false;
            });

            return visibleNavItems.map((item) => {
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const groupActive = isGroupActive(item);

              // Collapsed Mode (Icon only with Tooltips)
              if (sidebarCollapsed) {
                const active = groupActive || (item.href && pathname ? pathname.startsWith(item.href) : false);
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href || (hasChildren && item.children ? item.children[0].href : "#")}
                        className={cn(
                          "w-full flex items-center justify-center p-2.5 rounded-xl transition-all",
                          active
                            ? "bg-muted text-foreground font-semibold border border-border/80 shadow-2xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                      >
                        <Icon className={cn("size-5", active ? "text-foreground" : "text-muted-foreground")} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="font-medium">{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              // Expanded Mode
              if (hasChildren) {
                const isGroupOpen = openGroups[item.id] !== false;
                return (
                  <div key={item.id} className="space-y-1">
                    {/* Encabezado de Módulo Padre */}
                    <button
                      type="button"
                      onClick={() => {
                        setOpenGroups((prev) => ({
                          ...prev,
                          [item.id]: !isGroupOpen,
                        }));
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left",
                        groupActive
                          ? "bg-muted/70 text-foreground font-bold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={cn("size-4.5 shrink-0", groupActive ? "text-foreground" : "text-muted-foreground")} />
                        <span className="leading-snug">{item.label}</span>
                      </div>
                      {isGroupOpen ? (
                        <ChevronDown className="size-3.5 text-muted-foreground shrink-0 ml-1.5" />
                      ) : (
                        <ChevronRight className="size-3.5 text-muted-foreground shrink-0 ml-1.5" />
                      )}
                    </button>

                    {/* Subsecciones Internas */}
                    {isGroupOpen && (
                    <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-border/60 ml-4">
                      {item.children?.map((sub) => {
                        const isSubActive = isSubItemActive(sub);
                        const subLabel = (sub.id === "acceso-interoperabilidad" && isAprobador)
                          ? "Gestión de solicitudes pendientes"
                          : sub.label;
                        const subDescription = (sub.id === "acceso-interoperabilidad")
                          ? (!isAprobador
                              ? "Crea nuevas solicitudes de interoperabilidad, consulta las solicitudes realizadas y da seguimiento a su estado durante todo el proceso."
                              : "Revisa las solicitudes de interoperabilidad pendientes y gestiona su aprobación o rechazo según la información presentada.")
                          : undefined;

                        return (
                          <Tooltip key={sub.id}>
                            <TooltipTrigger asChild>
                              <Link
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                title={subDescription || subLabel}
                                className={cn(
                                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left",
                                  isSubActive
                                    ? "bg-muted text-foreground font-semibold border border-border/80 shadow-2xs"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                )}
                              >
                                <span className="truncate">{subLabel}</span>
                              </Link>
                            </TooltipTrigger>
                            {subDescription && (
                              <TooltipContent side="right" className="max-w-xs text-xs">
                                <p className="font-semibold mb-0.5">{subLabel}</p>
                                <p className="text-muted-foreground">{subDescription}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isDirectActive = item.href && pathname ? pathname.startsWith(item.href) : false;

            return (
              <Link
                key={item.id}
                href={item.href || "#"}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left",
                  isDirectActive
                    ? "bg-muted text-foreground font-semibold border border-border/80 shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <Icon className={cn("size-4.5 shrink-0", isDirectActive ? "text-foreground" : "text-muted-foreground")} />
                <span className="leading-snug">{item.label}</span>
              </Link>
            );
          });
        })()}
        </div>

        {/* Theme Toggle Footer */}
        <div className="p-3 border-t border-border/40 shrink-0">
          {!sidebarCollapsed ? (
            <div className="flex items-center bg-muted/40 p-1 rounded-2xl border border-border/60">
              <Button
                type="button"
                variant={themeMode === "claro" ? "neutral" : "ghost"}
                size="sm"
                onClick={() => handleThemeChange("claro")}
                className={cn(
                  "flex-1 h-8 rounded-xl text-xs font-medium gap-1.5",
                  themeMode === "claro" && "bg-surface shadow-xs text-foreground font-semibold"
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
                onClick={() => handleThemeChange("oscuro")}
                className={cn(
                  "flex-1 h-8 rounded-xl text-xs font-medium gap-1.5",
                  themeMode === "oscuro" && "bg-surface shadow-xs text-foreground font-semibold"
                )}
              >
                <Moon className="size-3.5" />
                <span>Oscuro</span>
              </Button>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleThemeChange(themeMode === "claro" ? "oscuro" : "claro")}
                  className="w-full size-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  aria-label="Cambiar tema"
                >
                  {themeMode === "claro" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Cambiar tema ({themeMode === "claro" ? "Oscuro" : "Claro"})</TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════
          CONTENIDO PRINCIPAL & HEADER SUPERIOR
         ══════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-4 sm:px-8 flex items-center justify-between border-b border-border/40 bg-surface/80 backdrop-blur-md shrink-0 z-10 gap-4">
          {/* Mobile Burger & Mobile Logo + Desktop Sidebar Toggle + Header Breadcrumbs */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:bg-muted/50 shrink-0"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </Button>

            {/* Breadcrumbs y Header Slot */}
            {(breadcrumbs && breadcrumbs.length > 0) || headerSlot ? (
              <div className="flex items-center flex-wrap gap-2 sm:gap-4 min-w-0 flex-1 pl-1">
                {breadcrumbs && breadcrumbs.length > 0 && (
                  <div className="hidden sm:block truncate">
                    <WireframeBreadcrumbs segments={breadcrumbs} className="text-xs" />
                  </div>
                )}
                {headerSlot && (
                  <div className="flex shrink-0">
                    {headerSlot}
                  </div>
                )}
              </div>
            ) : null}

            <Link href="/wireframes2" className="lg:hidden flex items-center shrink-0">
              <img
                src={getAssetPath("/logotipo.png")}
                alt="Logo DINARP"
                className="h-8 w-auto max-w-[130px] object-contain"
              />
            </Link>
          </div>

          {/* User Profile, Notifications & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <NotificationsMenu />
            <WireframeUserMenu user={resolvedUser} onRoleChange={onRoleChange} />
          </div>
        </header>

        {/* Dynamic Page Content Slot (Independent scroll) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
