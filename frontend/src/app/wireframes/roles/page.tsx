"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Pencil,
  MoreVertical,
  ChevronDown,
  ShieldCheck,
  Users,
  Trash2,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

interface RolItem {
  id: string;
  iniciales: string;
  nombre: string;
  descripcion: string;
  usuariosAsignados: number;
  estado: "Activo" | "Inactivo";
  fechaActualizacion: string;
}

const ROLES_DATA: RolItem[] = [
  {
    id: "ROL-001",
    iniciales: "AG",
    nombre: "Administrador general",
    descripcion: "Acceso total a la plataforma",
    usuariosAsignados: 12,
    estado: "Activo",
    fechaActualizacion: "02/09/2026 10:24",
  },
  {
    id: "ROL-002",
    iniciales: "CS",
    nombre: "Coordinador SINAP",
    descripcion: "Coordina procesos del SINAP",
    usuariosAsignados: 8,
    estado: "Activo",
    fechaActualizacion: "01/09/2026 16:11",
  },
  {
    id: "ROL-003",
    iniciales: "AN",
    nombre: "Analista",
    descripcion: "Analiza y gestiona información",
    usuariosAsignados: 25,
    estado: "Activo",
    fechaActualizacion: "28/08/2026 09:03",
  },
  {
    id: "ROL-004",
    iniciales: "RV",
    nombre: "Revisor",
    descripcion: "Revisa y valida solicitudes",
    usuariosAsignados: 6,
    estado: "Inactivo",
    fechaActualizacion: "20/08/2026 14:37",
  },
  {
    id: "ROL-005",
    iniciales: "CO",
    nombre: "Consulta",
    descripcion: "Solo acceso de consulta",
    usuariosAsignados: 18,
    estado: "Activo",
    fechaActualizacion: "15/08/2026 11:21",
  },
];

export default function WireframeListadoRolesPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return ROLES_DATA.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEstado = filterEstado === "Todos" || item.estado === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [searchQuery, filterEstado]);

  return (
    <WireframeDashboardLayout activeMenu="roles">
      <main className="relative p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Header Title & Actions ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
              Roles
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
              Gestiona los roles y permisos de la plataforma.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={() => router.push("/wireframes/roles/nuevo")}
            className="h-11 px-5 rounded-xl text-xs font-semibold gap-2 shadow-xs shrink-0"
          >
            <Plus className="size-4" />
            <span>Nuevo rol</span>
          </Button>
        </div>

        {/* ── 2. Buscador y Filtros ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <InputGroup
              size="default"
              leftIcon={<Search className="size-4 text-muted-foreground" />}
              className="bg-surface h-11 rounded-xl border-border/80"
            >
              <InputGroupInput
                placeholder="Buscar por nombre o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </InputGroup>
          </div>

          {/* Botón Filtros Desplegable */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-11 px-4 rounded-xl text-xs font-semibold gap-2 border-border/80 bg-surface w-full sm:w-auto"
              >
                <Filter className="size-3.5 text-muted-foreground" />
                <span>Filtros</span>
                {filterEstado !== "Todos" && (
                  <span className="size-2 rounded-full bg-primary" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs">Filtrar por Estado</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={filterEstado} onValueChange={setFilterEstado}>
                <DropdownMenuRadioItem value="Todos">Todos los estados</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Activo">Activo</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Inactivo">Inactivo</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── 3. Tabla de Roles ── */}
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
          <Table className="w-full border-spacing-0">
              <TableHeader>
                <TableRow className="border-b border-border/80 bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                    NOMBRE DEL ROL
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                    DESCRIPCIÓN
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-center">
                    USUARIOS ASIGNADOS
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                    ESTADO
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                    FECHA DE ACTUALIZACIÓN
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-right">
                    ACCIONES
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                      No se encontraron roles con los filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-b border-border/40 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => router.push(`/wireframes/roles/${row.id}`)}
                    >
                      {/* Nombre con Badge Iniciales */}
                      <TableCell className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-muted-foreground/20 text-foreground font-bold text-xs flex items-center justify-center shrink-0">
                            {row.iniciales}
                          </div>
                          <span className="text-xs font-bold text-foreground">
                            {row.nombre}
                          </span>
                        </div>
                      </TableCell>

                      {/* Descripción */}
                      <TableCell className="py-4 px-6 text-xs text-muted-foreground max-w-xs truncate">
                        {row.descripcion}
                      </TableCell>

                      {/* Usuarios Asignados */}
                      <TableCell className="py-4 px-6 text-xs text-center font-mono font-semibold text-foreground whitespace-nowrap">
                        {row.usuariosAsignados}
                      </TableCell>

                      {/* Estado */}
                      <TableCell className="py-4 px-6 whitespace-nowrap">
                        <Badge
                          tone={row.estado === "Activo" ? "success" : "danger"}
                          appearance="soft"
                          size="sm"
                          className="font-medium text-xs"
                        >
                          {row.estado}
                        </Badge>
                      </TableCell>

                      {/* Fecha de actualización */}
                      <TableCell className="py-4 px-6 text-xs text-muted-foreground whitespace-nowrap font-mono">
                        {row.fechaActualizacion}
                      </TableCell>

                      {/* Acciones */}
                      <TableCell className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => router.push(`/wireframes/roles/${row.id}`)}
                            className="size-8 text-muted-foreground hover:text-foreground"
                            title="Ver detalle"
                          >
                            <Eye className="size-3.5" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => router.push(`/wireframes/roles/${row.id}/editar`)}
                            className="size-8 text-muted-foreground hover:text-foreground"
                            title="Editar rol"
                          >
                            <Pencil className="size-3.5" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="size-8 text-muted-foreground hover:text-foreground"
                              >
                                <MoreVertical className="size-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => router.push(`/wireframes/usuarios`)}>
                                <Users className="size-3.5 mr-2" />
                                <span>Ver usuarios</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="size-3.5 mr-2" />
                                <span>Eliminar rol</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
        </div>

        {/* ── 4. Paginación ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground">
            Mostrando 1 a {filteredData.length} de 12 roles
          </p>

          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage((p) => p - 1);
                  }}
                  className="size-8 rounded-lg border border-border"
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive className="size-8 rounded-lg text-xs">
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="size-8 rounded-lg text-xs">
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="size-8 rounded-lg text-xs">
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="size-8 rounded-lg border border-border"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </WireframeDashboardLayout>
  );
}

