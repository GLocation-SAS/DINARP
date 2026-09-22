"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ChevronDown,
  Info,
  LogOut,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type MockUser, type UserRole, ROLES_CONFIG } from "../catalogo-interoperabilidad/data/catalogo-data";

interface WireframeUserMenuProps {
  user: MockUser;
  onRoleChange?: (role: UserRole) => void;
}

export function WireframeUserMenu({ user, onRoleChange }: WireframeUserMenuProps) {
  const [open, setOpen] = useState(false);

  const getEmail = (name: string, inst: string) => {
    const slug = name.toLowerCase().replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u").replace(/\s+/g, ".");
    const domain = inst.toLowerCase().includes("registro") ? "registrocivil.gob.ec" : "dinarp.gob.ec";
    return `${slug}@${domain}`;
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group flex items-center gap-2.5 rounded-full outline-none pr-3 pl-1.5 py-1 hover:bg-muted/50 data-[state=open]:bg-muted/50 transition-all cursor-pointer border border-transparent hover:border-border/60"
          aria-label="Perfil de usuario"
        >
          <Avatar className="size-8 cursor-pointer transition-all duration-200 border border-border">
            <AvatarFallback className="bg-foreground text-background text-xs font-bold">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex items-center gap-1.5 transition-colors">
            <div className="flex flex-col items-start leading-tight">
              <span className="text-xs font-bold text-foreground">{user.name}</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-foreground shrink-0" />
                {user.roleTitle.split("(")[0].trim()}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "size-3.5 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
                open && "rotate-180"
              )}
              strokeWidth={2}
            />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 p-2 border-border bg-popover text-popover-foreground shadow-lg rounded-xl"
      >
        {/* Encabezado del Perfil */}
        <div className="p-3 bg-muted/40 rounded-lg flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border border-border">
              <AvatarFallback className="bg-foreground text-background text-sm font-bold">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-foreground truncate">{user.name}</span>
              <span className="text-[11px] text-muted-foreground truncate">{getEmail(user.name, user.institution)}</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-border/60 flex flex-col gap-1 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Rol / Cargo:</span>
              <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold">
                {ROLES_CONFIG[user.role]?.shortName || user.roleTitle}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Institución:</span>
              <span className="font-medium text-foreground truncate max-w-[150px] text-right">
                {user.institution}
              </span>
            </div>
          </div>
        </div>

        {/* Nota de Demostración Wireframe */}
        <div className="p-2.5 my-1 bg-surface border border-border rounded-md text-[10px] text-muted-foreground leading-relaxed flex items-start gap-2">
          <Info className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <strong className="text-foreground font-semibold">Modo prototipo · Vista por rol:</strong> En producción el rol será asignado al usuario autenticado.
          </div>
        </div>

        <DropdownMenuSeparator className="bg-border/60" />

        {onRoleChange && (
          <div className="py-1">
            <span className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
              Cambiar rol de visualización
            </span>
            {(["COORDINADOR_SINARP", "DGR", "DTD", "DPI"] as UserRole[]).map(role => (
              <DropdownMenuItem
                key={role}
                onClick={() => onRoleChange(role)}
                className={cn(
                  "text-xs cursor-pointer justify-between",
                  user.role === role && "bg-muted font-medium text-foreground"
                )}
              >
                <span>{ROLES_CONFIG[role].shortName}</span>
                {user.role === role && <CheckCircle2 className="size-3.5 text-foreground" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-border/60 mt-1" />
          </div>
        )}

        <DropdownMenuItem asChild className="text-xs cursor-pointer">
          <Link href="/wireframes2" className="flex items-center gap-2">
            <Building2 className="size-3.5 text-muted-foreground" />
            <span>Hub Principal de Módulos</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
