"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Pencil,
  MoreVertical,
  Users,
  Shield,
  LayoutDashboard,
  FileText,
  Server,
  Activity,
  BarChart2,
  SlidersHorizontal,
  Building,
  Settings,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";

interface RolDetailClientProps {
  id: string;
}

const MODULE_PERMISSIONS_LIST = [
  { module: "Dashboard", icon: LayoutDashboard, permissions: "Ver" },
  { module: "Solicitudes", icon: FileText, permissions: "Ver, Crear, Editar, Aprobar" },
  { module: "Servicios", icon: Server, permissions: "Ver, Crear, Editar" },
  { module: "Monitoreo", icon: Activity, permissions: "Ver, Editar, Exportar" },
  { module: "Reportes", icon: BarChart2, permissions: "Ver, Exportar" },
  { module: "Administración", icon: SlidersHorizontal, permissions: "Ver, Configurar" },
  { module: "Usuarios", icon: Users, permissions: "Ver, Crear, Editar" },
  { module: "Roles", icon: Shield, permissions: "Ver, Crear" },
  { module: "Instituciones", icon: Building, permissions: "Ver" },
  { module: "Configuración", icon: Settings, permissions: "Ver, Configurar" },
];

const ASSIGNED_USERS_MOCK = [
  { name: "Juan Pérez", email: "juan.perez@entidad.gob.ec", cargo: "Coordinador de TI", estado: "Activo" },
  { name: "María Cuenca Serrano", email: "maria.cuenca@dinarp.gob.ec", cargo: "Especialista de Sistemas", estado: "Activo" },
  { name: "Luis Andrade", email: "luis.andrade@registrocivil.gob.ec", cargo: "Administrador de Datos", estado: "Activo" },
  { name: "Sofia Castro", email: "sofia.castro@sri.gob.ec", cargo: "Analista de Interoperabilidad", estado: "Activo" },
  { name: "Diego Ramos", email: "diego.ramos@educacion.gob.ec", cargo: "Líder Técnico", estado: "Activo" },
];

export function RolDetailClient({ id }: RolDetailClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("permisos");

  const rolName = id === "ROL-001" ? "Administrador general" : "Coordinador SINAP";
  const rolInitials = id === "ROL-001" ? "AG" : "CS";

  return (
    <WireframeDashboardLayout activeMenu="roles">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Breadcrumbs ── */}
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/wireframes/roles" className="text-muted-foreground hover:text-foreground">
                  Roles
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Detalle de rol
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Profile Header Card ── */}
        <Card className="rounded-2xl border-border bg-surface p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-14 sm:size-16 rounded-full bg-muted-foreground/15 text-foreground font-bold text-xl flex items-center justify-center shrink-0 border border-border">
                {rolInitials}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-foreground">
                    {rolName}
                  </h1>
                  <Badge tone="success" appearance="soft" size="sm" className="font-semibold text-xs">
                    Activo
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Coordina y supervisa los procesos del SINAP, gestiona solicitudes y da seguimiento a su ejecución.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/wireframes/roles/${id}/editar`)}
                className="h-10 px-4 rounded-xl text-xs font-semibold gap-2 border-border bg-surface"
              >
                <Pencil className="size-3.5" />
                <span>Editar</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-10 rounded-xl text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => router.push("/wireframes/usuarios")}>
                    <Users className="size-3.5 mr-2" />
                    <span>Ver usuarios</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    Desactivar rol
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>

        {/* ── 3. Tabs Navigation ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="bg-muted/40 p-1 rounded-xl h-auto border border-border/60">
            <TabsTrigger value="informacion" className="rounded-lg text-xs font-semibold py-2 px-4">
              Información
            </TabsTrigger>
            <TabsTrigger value="permisos" className="rounded-lg text-xs font-semibold py-2 px-4">
              Permisos
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="rounded-lg text-xs font-semibold py-2 px-4">
              Usuarios asignados
            </TabsTrigger>
          </TabsList>

          {/* ── Tab: Permisos ── */}
          <TabsContent value="permisos" className="space-y-6 m-0">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-foreground">
                Permisos asignados
              </h2>
              <p className="text-xs text-muted-foreground">
                Lista de permisos que tiene este rol por cada módulo.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
              <Table className="w-full border-spacing-0">
                <TableHeader>
                  <TableRow className="border-b border-border/80 bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3 px-4 text-left w-1/3">
                      MÓDULO
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3 px-4 text-left">
                      PERMISOS CONCEDIDOS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MODULE_PERMISSIONS_LIST.map((item) => {
                    const Icon = item.icon;
                    return (
                      <TableRow key={item.module} className="border-b border-border/40 hover:bg-muted/20">
                        <TableCell className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <Icon className="size-4 text-muted-foreground shrink-0" />
                            <span className="text-xs font-bold text-foreground">
                              {item.module}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-xs text-foreground font-medium">
                          {item.permissions}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Bottom Card: Usuarios Asignados */}
            <Card className="rounded-2xl border-border bg-surface p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Users className="size-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">Usuarios asignados</span>
                  <span className="text-xs text-muted-foreground">8 usuarios tienen este rol asignado.</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/wireframes/usuarios")}
                className="h-9 px-4 rounded-xl text-xs font-semibold border-border shrink-0"
              >
                Ver usuarios
              </Button>
            </Card>
          </TabsContent>

          {/* ── Tab: Información ── */}
          <TabsContent value="informacion" className="space-y-6 m-0">
            <Card className="rounded-2xl border-border bg-surface p-6 sm:p-7 space-y-6 shadow-xs">
              <h2 className="text-sm font-bold text-foreground">
                Datos del rol
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px] mb-1">Identificador</span>
                  <span className="font-mono font-bold text-foreground">{id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px] mb-1">Nombre completo</span>
                  <span className="font-semibold text-foreground">{rolName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px] mb-1">Fecha de creación</span>
                  <span className="text-foreground font-mono">10/01/2026 09:30</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px] mb-1">Última actualización</span>
                  <span className="text-foreground font-mono">01/09/2026 16:11</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px] mb-1">Creado por</span>
                  <span className="text-foreground">Administrador General</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px] mb-1">Alcance institucional</span>
                  <span className="text-foreground">Nacional / SINAP</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* ── Tab: Usuarios Asignados ── */}
          <TabsContent value="usuarios" className="space-y-6 m-0">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="text-sm font-bold text-foreground">
                  Lista de usuarios con este rol
                </h2>
                <p className="text-xs text-muted-foreground">
                  Total: 5 usuarios visibles de 8 registrados
                </p>
              </div>

              <Button
                type="button"
                variant="primary"
                onClick={() => router.push("/wireframes/usuarios/nuevo")}
                className="h-9 px-3.5 rounded-xl text-xs font-semibold"
              >
                Asignar usuario
              </Button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
              <Table className="w-full border-spacing-0">
                <TableHeader>
                  <TableRow className="border-b border-border/80 bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3 px-4 text-left">
                      NOMBRE
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3 px-4 text-left">
                      CORREO ELECTRÓNICO
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3 px-4 text-left">
                      CARGO
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3 px-4 text-left">
                      ESTADO
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ASSIGNED_USERS_MOCK.map((u) => (
                    <TableRow key={u.email} className="border-b border-border/40 hover:bg-muted/20">
                      <TableCell className="py-3 px-4 text-xs font-bold text-foreground whitespace-nowrap">
                        {u.name}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {u.email}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {u.cargo}
                      </TableCell>
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        <Badge tone="success" appearance="soft" size="sm" className="text-xs">
                          {u.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </WireframeDashboardLayout>
  );
}
