"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Diamond,
  Sparkles,
  Settings,
  Bell,
  LogOut,
  ChevronDown,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const navigateTo = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const TriggerButton = (
    <button className="group flex items-center gap-2 rounded-full outline-none pr-3 pl-1.5 py-1.5 hover:bg-surface-subtle data-[state=open]:bg-surface-subtle transition-all cursor-pointer border border-transparent hover:border-border">
      <Avatar className="size-8 cursor-pointer transition-all duration-200 group-hover:ring-2 group-hover:ring-primary/30 group-hover:ring-offset-1 group-hover:ring-offset-background">
        <AvatarFallback className="bg-gradient-to-tr from-primary to-primary-600 text-white text-xs font-bold shadow-xs">PR</AvatarFallback>
      </Avatar>
      <div className="hidden sm:flex items-center gap-1.5 transition-colors">
        <div className="flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold text-foreground/90 group-hover:text-foreground">Paula Rozo</span>
          <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5"><div className="size-1.5 rounded-full bg-primary shrink-0" />Super Admin</span>
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
            open && "rotate-180"
          )}
          strokeWidth={2}
        />
      </div>
    </button>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <div onClick={() => setOpen(true)}>{TriggerButton}</div>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="rounded-t-[32px] p-0 border-none bg-background flex flex-col focus-visible:outline-none focus:outline-none"
        >
          <SheetTitle className="sr-only">Menú de usuario</SheetTitle>

          {/* Header Móvil */}
          <div className="flex items-center justify-between px-4 py-3 sm:py-4 border-b border-border/40 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="-ml-2 rounded-full text-foreground hover:bg-surface-subtle transition-colors"
              aria-label="Volver"
            >
              <ChevronLeft className="size-6" strokeWidth={2} />
            </Button>
            <span className="text-[11px] sm:text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground">Cuenta</span>
            <div className="size-8" />
          </div>

          <div className="px-4 sm:px-6 pb-6 sm:pb-8 pt-4 sm:pt-6 overflow-y-auto max-h-[85vh]">
            {/* User Info Header */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 px-1 sm:px-2">
              <Avatar className="size-12 sm:size-16 shrink-0">
                <AvatarFallback className="bg-gradient-to-tr from-primary to-primary-600 text-white text-base sm:text-xl font-bold shadow-sm">PR</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm sm:text-base font-bold text-foreground truncate">Paula Rozo</span>
                <span className="text-xs font-semibold text-primary mt-0.5 flex items-center gap-1.5"><div className="size-1.5 rounded-full bg-primary shrink-0" />Super Admin</span>
                <span className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate">paula.rozo@geoportal.gob.ec</span>
              </div>
            </div>

            <div className="h-px bg-border/60 mx-1 sm:mx-2 mb-4 sm:mb-6" />

            <div className="flex flex-col gap-1 sm:gap-2">
              <MobileMenuItem icon={User} label="Perfil" onClick={() => navigateTo("/construccion")} />
              <MobileMenuItem icon={Diamond} label="Suscripción" onClick={() => navigateTo("/construccion")} />
              <MobileMenuItem icon={Sparkles} label="Inspiraciones" isActive onClick={() => navigateTo("/uikit")} />
              <MobileMenuItem icon={Settings} label="Ajustes" onClick={() => navigateTo("/construccion")} />

              <div className="h-px bg-border my-2 mx-1 sm:mx-2" />

              <MobileMenuItem icon={Bell} label="Actualizaciones" badge="Nuevo" onClick={() => navigateTo("/notifications-menu-preview")} />
              <MobileMenuItem icon={LogOut} label="Cerrar sesión" isWarning onClick={() => navigateTo("/login")} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {TriggerButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={8}
        className={cn(
          "w-[calc(100vw-1.5rem)] sm:w-[280px] max-w-[280px] rounded-xl border border-border bg-surface p-1.5 shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-[0.98]",
          "data-[state=closed]:slide-out-to-top-1.5 data-[state=open]:slide-in-from-top-1.5",
          "duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
        )}
      >
        <div className="flex flex-col p-2 mb-1 border-b border-border/60">
          <div className="flex items-center gap-3 px-1 py-1">
            <Avatar className="size-10">
              <AvatarFallback className="bg-gradient-to-tr from-primary to-primary-600 text-white font-bold shadow-xs">PR</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-foreground truncate">Paula Rozo</span>
              <span className="text-[11px] font-semibold text-primary truncate flex items-center gap-1.5"><div className="size-1.5 rounded-full bg-primary shrink-0" />Super Admin</span>
              <span className="text-[10px] text-muted-foreground truncate mt-0.5">paula.rozo@geoportal.gob.ec</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <DesktopMenuItem icon={User} label="Perfil" onClick={() => navigateTo("/construccion")} />
          <DesktopMenuItem icon={Diamond} label="Suscripción" onClick={() => navigateTo("/construccion")} />
          <DesktopMenuItem icon={Sparkles} label="Inspiraciones" isActive onClick={() => navigateTo("/uikit")} />
          <DesktopMenuItem icon={Settings} label="Ajustes" onClick={() => navigateTo("/construccion")} />

          <DropdownMenuSeparator className="my-1 bg-border/50" />

          <DesktopMenuItem icon={Bell} label="Actualizaciones" badge="Nuevo" onClick={() => navigateTo("/notifications-menu-preview")} />
          <DesktopMenuItem icon={LogOut} label="Cerrar sesión" isWarning onClick={() => navigateTo("/login")} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface MenuItemProps {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  isActive?: boolean;
  isWarning?: boolean;
  badge?: string;
  onClick?: () => void;
}

// ── Componentes Internos para Mobile/Desktop ──

function MobileMenuItem({
  icon: Icon,
  label,
  isActive,
  isWarning,
  badge,
  onClick
}: MenuItemProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "group relative flex w-full select-none items-center justify-start gap-4 rounded-xl px-4 py-4 h-auto text-body font-semibold outline-none transition-all duration-200",
        isActive
          ? "bg-primary-400/10 text-primary-400 hover:bg-primary-400/20 hover:text-primary-400"
          : isWarning
            ? "text-danger hover:bg-danger/10 hover:text-danger"
            : "text-foreground hover:bg-surface-subtle"
      )}
    >
      {isActive && (
        <div className="absolute -left-3 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-full bg-primary-400" />
      )}

      <Icon className={cn(
        "size-[22px] transition-colors duration-200",
        isActive
          ? "text-primary-400"
          : isWarning
            ? "text-danger"
            : "text-muted-foreground group-hover:text-foreground"
      )} strokeWidth={isActive ? 2.5 : 1.75} />

      <span className="flex-1 text-left">{label}</span>

      {badge && (
        <span className="rounded-full bg-primary-400/15 px-2.5 py-0.5 text-xs font-bold text-primary-400">
          {badge}
        </span>
      )}
    </Button>
  );
}

function DesktopMenuItem({
  icon: Icon,
  label,
  isActive,
  isWarning,
  badge,
  onClick
}: MenuItemProps) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className={cn(
        "group relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2 text-sm font-medium outline-none transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary"
          : isWarning
            ? "text-danger focus:bg-danger/10 focus:text-danger"
            : "text-foreground focus:bg-surface-subtle focus:text-foreground"
      )}
    >
      <Icon className={cn(
        "size-4 transition-colors duration-200",
        isActive
          ? "text-primary"
          : isWarning
            ? "text-danger"
            : "text-muted-foreground group-focus:text-foreground"
      )} />

      <span className="flex-1 text-left">{label}</span>

      {badge && (
        <span className="shrink-0 rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
          {badge}
        </span>
      )}
    </DropdownMenuItem>
  );
}
