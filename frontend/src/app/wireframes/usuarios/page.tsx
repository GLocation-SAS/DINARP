"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Filter,
  Pencil,
  MoreVertical,
  ChevronDown,
  User,
  Shield,
  Eye,
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

interface UsuarioItem {
  id: string;
  iniciales: string;
  nombre: string;
  correo: string;
  institucion: string;
  rol: "Administrador" | "Analista" | "Consultor" | "Revisor";
  estado: "Activo" | "Inactivo";
  ultimoAcceso: string;
}

const USUARIOS_DATA: UsuarioItem[] = [
  {
    id: "USR-001",
    iniciales: "MC",
    nombre: "María Cuenca",
    correo: "maria.cuenca@registrocivil.gob.ec",
    institucion: "Registro Civil",
    rol: "Administrador",
    estado: "Activo",
    ultimoAcceso: "02/09/2026 10:24",
  },
  {
    id: "USR-002",
    iniciales: "JP",
    nombre: "Juan Pérez",
    correo: "juan.perez@sri.gob.ec",
    institucion: "SRI",
    rol: "Analista",
    estado: "Activo",
    ultimoAcceso: "01/09/2026 16:11",
  },
  {
    id: "USR-003",
    iniciales: "LA",
    nombre: "Luis Álvarez",
    correo: "luis.alvarez@educacion.gob.ec",
    institucion: "Ministerio de Educación",
    rol: "Consultor",
    estado: "Inactivo",
    ultimoAcceso: "28/08/2026 09:03",
  },
  {
    id: "USR-004",
    iniciales: "SC",
    nombre: "Sofía Castro",
    correo: "sofia.castro@dinarp.gob.ec",
    institucion: "DINARP",
    rol: "Administrador",
    estado: "Activo",
    ultimoAcceso: "03/09/2026 08:45",
  },
  {
    id: "USR-005",
    iniciales: "DR",
    nombre: "Diego Ruiz",
    correo: "diego.ruiz@salud.gob.ec",
    institucion: "Ministerio de Salud",
    rol: "Analista",
    estado: "Activo",
    ultimoAcceso: "02/09/2026 14:20",
  },
];

export default function WireframeListadoUsuariosPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRol, setFilterRol] = useState("Todos");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return USUARIOS_DATA.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.correo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institucion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rol.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRol = filterRol === "Todos" || item.rol === filterRol;
      const matchesEstado = filterEstado === "Todos" || item.estado === filterEstado;

      return matchesSearch && matchesRol && matchesEstado;
    });
  }, [searchQuery, filterRol, filterEstado]);

  return (
    <WireframeDashboardLayout activeMenu="usuarios">
      <main className="relative p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Header Title, Description & Action ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
              Usuarios
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
              Gestiona los usuarios de la plataforma.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={() => router.push("/wireframes/usuarios/nuevo")}
            className="h-11 px-5 rounded-xl text-xs font-semibold gap-2 shadow-xs shrink-0"
          >
            <Plus className="size-4" />
            <span>Nuevo usuario</span>
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
                placeholder="Buscar por nombre, correo o institución..."
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
                {(filterRol !== "Todos" || filterEstado !== "Todos") && (
                  <span className="size-2 rounded-full bg-primary" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs">Filtrar por Rol</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={filterRol} onValueChange={setFilterRol}>
                <DropdownMenuRadioItem value="Todos">Todos los roles</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Administrador">Administrador</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Analista">Analista</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Consultor">Consultor</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs">Filtrar por Estado</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={filterEstado} onValueChange={setFilterEstado}>
                <DropdownMenuRadioItem value="Todos">Todos los estados</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Activo">Activo</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Inactivo">Inactivo</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── 3. Tabla de Usuarios ── */}
        <Card className="rounded-2xl border-border bg-surface overflow-hidden shadow-xs">
          <CardContent className="p-0 overflow-x-auto">
            <Table className="w-full border-spacing-0">
              <TableHeader>
                <TableRow className="border-b border-border/80 bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                    NOMBRE
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                    CORREO ELECTRÓNICO
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                    INSTITUCIÓN
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                    ROL
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                    ESTADO
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                    ÚLTIMO ACCESO
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-right">
                    ACCIONES
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-sm">
                      No se encontraron usuarios con los filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-b border-border/40 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => router.push(`/wireframes/usuarios/${row.id}`)}
                    >
                      {/* Nombre con Avatar de Iniciales */}
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

                      {/* Correo Electrónico */}
                      <TableCell className="py-4 px-6 text-xs text-muted-foreground whitespace-nowrap">
                        {row.correo}
                      </TableCell>

                      {/* Institución */}
                      <TableCell className="py-4 px-6 text-xs text-muted-foreground whitespace-nowrap">
                        {row.institucion}
                      </TableCell>

                      {/* Rol */}
                      <TableCell className="py-4 px-6 text-xs text-foreground font-medium whitespace-nowrap">
                        {row.rol}
                      </TableCell>

                      {/* Estado Badge */}
                      <TableCell className="py-4 px-6 whitespace-nowrap">
                        <Badge
                          tone={row.estado === "Activo" ? "success" : "danger"}
                          appearance="soft"
                          size="sm"
                          className="font-medium gap-1 text-xs"
                        >
                          {row.estado}
                        </Badge>
                      </TableCell>

                      {/* Último acceso */}
                      <TableCell className="py-4 px-6 text-xs text-muted-foreground whitespace-nowrap font-mono">
                        {row.ultimoAcceso}
                      </TableCell>

                      {/* Acciones */}
                      <TableCell className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => router.push(`/wireframes/usuarios/${row.id}/editar`)}
                            className="size-8 text-muted-foreground hover:text-foreground"
                            title="Editar usuario"
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
                              <DropdownMenuItem onClick={() => router.push(`/wireframes/usuarios/${row.id}`)}>
                                <Eye className="size-3.5 mr-2" />
                                <span>Ver detalle</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/wireframes/usuarios/${row.id}/editar`)}>
                                <Pencil className="size-3.5 mr-2" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Lock className="size-3.5 mr-2" />
                                <span>Desactivar</span>
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
          </CardContent>
        </Card>

        {/* ── 4. Paginación ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground">
            Mostrando 1 a {filteredData.length} de 42 usuarios
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
                <PaginationLink href="#" className="size-8 rounded-lg text-xs">
                  4
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="size-8 rounded-lg text-xs">
                  5
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
