"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Server,
  Database,
  Clock,
  ChevronRight,
  ChevronLeft,
  Settings,
  BellOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const INSTITUTIONAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Proyecto observado por DINARP",
    desc: "PRJ-2026-001 requiere justificación adicional para campos solicitados al Registro Civil.",
    time: "hace 10 min",
    icon: AlertCircle,
    unread: true,
    href: "/wireframes/solicitudes/detalle?id=PRJ-2026-001",
  },
  {
    id: 2,
    title: "Servicio SRI autorizado",
    desc: "Se emitió resolución favorable para consulta de RUC en línea.",
    time: "hace 1 h",
    icon: CheckCircle2,
    unread: true,
    href: "/wireframes/solicitudes/detalle",
  },
  {
    id: 3,
    title: "Actualización de catálogo de fuentes",
    desc: "ANT publicó nuevo servicio de consulta de citaciones e infracciones v2.",
    time: "hace 3 h",
    icon: Server,
    unread: true,
    href: "/wireframes/catalogo-fuentes",
  },
  {
    id: 4,
    title: "Lote de intercambio masivo procesado",
    desc: "BATCH-2026-001 completó la validación de 1,200 registros de identidad.",
    time: "ayer",
    icon: Database,
    unread: false,
    href: "/wireframes/intercambios-masivos",
  },
  {
    id: 5,
    title: "Mantenimiento programado de plataforma",
    desc: "Ventana técnica institucional programada el sábado de 02:00 a 04:00.",
    time: "hace 2 días",
    icon: Clock,
    unread: false,
    href: "/wireframes/construccion",
  },
];

export function NotificationsMenu({ isEmpty = false }: { isEmpty?: boolean }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(INSTITUTIONAL_NOTIFICATIONS);

  const unreadCount = isEmpty ? 0 : notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const TriggerButton = (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-full text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground data-[state=open]:bg-muted/50"
      aria-label={`Notificaciones (${unreadCount} sin leer)`}
    >
      <Bell className="size-4 sm:size-5" strokeWidth={1.75} />
      {unreadCount > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold leading-none text-background">
          {unreadCount}
        </span>
      )}
    </Button>
  );

  // ── Vista Móvil (Full Screen Sheet) ──
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <div onClick={() => setOpen(true)}>{TriggerButton}</div>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="h-[100dvh] w-full p-0 border-none bg-background flex flex-col focus-visible:outline-none focus:outline-none rounded-none"
        >
          <SheetTitle className="sr-only">Notificaciones institucionales</SheetTitle>

          {/* Header Móvil */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="-ml-2 rounded-full text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Volver"
            >
              <ChevronLeft className="size-5" strokeWidth={2} />
            </Button>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Notificaciones
            </h3>
            {unreadCount > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-[11px] h-7 px-2 text-foreground font-semibold"
              >
                Leídas
              </Button>
            ) : (
              <div className="size-8" />
            )}
          </div>

          {/* Lista de Notificaciones */}
          <div className="flex-1 overflow-y-auto">
            {unreadCount === 0 && isEmpty ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center h-full">
                <div className="size-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-4">
                  <BellOff className="size-8 text-muted-foreground" />
                </div>
                <p className="text-base font-bold text-foreground mb-1">Bandeja al día</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  No hay notificaciones o avisos institucionales pendientes.
                </p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border/40">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <Link
                      key={notif.id}
                      href={notif.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-start gap-3.5 px-4 py-3.5 text-left transition-colors",
                        notif.unread ? "bg-muted/30" : "hover:bg-muted/20"
                      )}
                    >
                      <div className="size-8 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="size-4 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn("text-xs text-foreground", notif.unread ? "font-bold" : "font-medium")}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {notif.desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Móvil */}
          <div className="shrink-0 p-3 border-t border-border/60 bg-muted/20">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full text-xs font-semibold gap-1.5 border-border"
              asChild
            >
              <Link href="/wireframes/solicitudes">
                Ir al panel de proyectos
                <ChevronRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // ── Vista Desktop (DropdownMenu) ──
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {TriggerButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={10}
        className={cn(
          "w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card p-0 shadow-lg overflow-hidden flex flex-col",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-[0.98]",
          "duration-150 ease-out"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-foreground">Notificaciones</h3>
            {unreadCount > 0 && (
              <Badge appearance="outline" tone="neutral" className="text-[10px] py-0 px-1.5 h-4 border-border">
                {unreadCount} nuevas
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-[11px] font-semibold text-muted-foreground hover:text-foreground underline-offset-2 hover:underline cursor-pointer"
            >
              Marcar leídas
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto max-h-[380px] divide-y divide-border/40">
          {unreadCount === 0 && isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="size-12 rounded-2xl bg-muted border border-border flex items-center justify-center mb-3">
                <BellOff className="size-6 text-muted-foreground" />
              </div>
              <p className="text-xs font-bold text-foreground mb-0.5">Bandeja al día</p>
              <p className="text-[11px] text-muted-foreground">No tienes notificaciones pendientes.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <DropdownMenuPrimitive.Item
                  key={notif.id}
                  asChild
                  className="outline-none"
                >
                  <Link
                    href={notif.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 text-left transition-colors cursor-pointer",
                      notif.unread ? "bg-muted/40 hover:bg-muted/60" : "hover:bg-muted/20"
                    )}
                  >
                    <div className="size-8 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="size-4 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <p className={cn("text-xs text-foreground truncate", notif.unread ? "font-bold" : "font-medium")}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {notif.desc}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuPrimitive.Item>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 p-2 bg-muted/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="w-full text-xs font-semibold text-foreground hover:bg-muted/50 justify-between h-8 px-2"
            asChild
          >
            <Link href="/wireframes/solicitudes">
              <span>Ir a Proyectos de interoperabilidad</span>
              <ChevronRight className="size-3.5 text-muted-foreground" />
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
