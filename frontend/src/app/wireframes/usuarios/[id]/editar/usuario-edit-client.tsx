"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { WireframeDashboardLayout } from "../../../components/wireframe-dashboard-layout";

interface UsuarioEditClientProps {
  id: string;
}

export function UsuarioEditClient({ id }: UsuarioEditClientProps) {
  const router = useRouter();

  // Preloaded Form State from mock
  const [nombres, setNombres] = useState("María");
  const [apellidos, setApellidos] = useState("Cuenca Serrano");
  const [correo, setCorreo] = useState("maria.cuenca@registrocivil.gob.ec");
  const [telefono, setTelefono] = useState("099 587 6543");
  const [institucion, setInstitucion] = useState("Registro Civil");
  const [cargo, setCargo] = useState("Analista de Interoperabilidad");
  const [rol, setRol] = useState("Administrador");
  const [estado, setEstado] = useState("Activo");

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccessModalOpen(true);
  };

  return (
    <WireframeDashboardLayout activeMenu="usuarios">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Breadcrumbs ── */}
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/wireframes/usuarios" className="text-muted-foreground hover:text-foreground">
                  Usuarios
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Editar usuario
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header Title & Description ── */}
        <div className="space-y-1">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
            Editar usuario
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Modifica la información del usuario.
          </p>
        </div>

        {/* ── 3. Formulario Card ── */}
        <form onSubmit={handleSubmit}>
          <Card className="rounded-2xl border-border bg-surface p-6 sm:p-8 space-y-8 shadow-xs">
            {/* Bloque 1: Información Personal */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-foreground">
                Información personal
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombres */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Nombres <span className="text-destructive">*</span>
                  </label>
                  <InputGroup className="bg-surface h-10 rounded-xl border-border">
                    <InputGroupInput
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
                      required
                      className="text-xs sm:text-sm"
                    />
                  </InputGroup>
                </div>

                {/* Apellidos */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Apellidos <span className="text-destructive">*</span>
                  </label>
                  <InputGroup className="bg-surface h-10 rounded-xl border-border">
                    <InputGroupInput
                      value={apellidos}
                      onChange={(e) => setApellidos(e.target.value)}
                      required
                      className="text-xs sm:text-sm"
                    />
                  </InputGroup>
                </div>

                {/* Correo Electrónico */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Correo electrónico <span className="text-destructive">*</span>
                  </label>
                  <InputGroup className="bg-surface h-10 rounded-xl border-border">
                    <InputGroupInput
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      required
                      className="text-xs sm:text-sm font-mono"
                    />
                  </InputGroup>
                </div>

                {/* Número de teléfono */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Número de teléfono
                  </label>
                  <InputGroup className="bg-surface h-10 rounded-xl border-border">
                    <InputGroupInput
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="text-xs sm:text-sm font-mono"
                    />
                  </InputGroup>
                </div>

                {/* Institución */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Institución <span className="text-destructive">*</span>
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 px-3 flex items-center justify-between bg-surface border-border rounded-xl text-left w-full text-xs font-normal"
                      >
                        <span className="text-foreground truncate">{institucion}</span>
                        <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      <DropdownMenuRadioGroup value={institucion} onValueChange={setInstitucion}>
                        <DropdownMenuRadioItem value="Registro Civil">Registro Civil</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="SRI">SRI</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Ministerio de Educación">Ministerio de Educación</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="DINARP">DINARP</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Ministerio de Salud">Ministerio de Salud</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Agencia Nacional de Tránsito (ANT)">Agencia Nacional de Tránsito (ANT)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="IESS">IESS</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Cargo */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Cargo
                  </label>
                  <InputGroup className="bg-surface h-10 rounded-xl border-border">
                    <InputGroupInput
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      className="text-xs sm:text-sm"
                    />
                  </InputGroup>
                </div>
              </div>
            </div>

            {/* Bloque 2: Acceso y Rol */}
            <div className="space-y-4 pt-4 border-t border-border/80">
              <h2 className="text-sm font-bold text-foreground">
                Acceso y rol
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Rol */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Rol <span className="text-destructive">*</span>
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 px-3 flex items-center justify-between bg-surface border-border rounded-xl text-left w-full text-xs font-normal"
                      >
                        <span className="text-foreground truncate">{rol}</span>
                        <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuRadioGroup value={rol} onValueChange={setRol}>
                        <DropdownMenuRadioItem value="Administrador">Administrador</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Analista">Analista</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Consultor">Consultor</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Revisor">Revisor</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Estado */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Estado <span className="text-destructive">*</span>
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 px-3 flex items-center justify-between bg-surface border-border rounded-xl text-left w-full text-xs font-normal"
                      >
                        <span className="text-foreground truncate">{estado}</span>
                        <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-44">
                      <DropdownMenuRadioGroup value={estado} onValueChange={setEstado}>
                        <DropdownMenuRadioItem value="Activo">Activo</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Inactivo">Inactivo</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Acciones del Formulario */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/80">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/wireframes/usuarios/${id}`)}
                className="h-10 px-5 rounded-xl text-xs font-semibold border-border"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary"
                className="h-10 px-6 rounded-xl text-xs font-semibold shadow-xs"
              >
                Guardar cambios
              </Button>
            </div>
          </Card>
        </form>

        {/* Modal de Éxito al Guardar */}
        <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
          <DialogContent variant="success" className="max-w-[440px] rounded-3xl p-6 sm:p-8 bg-background border-border shadow-2xl">
            <DialogHeader className="text-center space-y-2">
              <DialogTitle className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                Cambios guardados
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                La información de <strong>{nombres} {apellidos}</strong> ha sido actualizada correctamente.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 flex w-full">
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  router.push(`/wireframes/usuarios/${id}`);
                }}
                className="w-full h-11 rounded-xl text-xs font-semibold"
              >
                Volver al detalle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </WireframeDashboardLayout>
  );
}

