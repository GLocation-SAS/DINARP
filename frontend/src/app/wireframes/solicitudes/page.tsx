"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  FilePlus2,
  Search,
  ChevronDown,
  Eye,
  Pencil,
  MoreVertical,
  ArrowDown,
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
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

interface Solicitud {
  codigo: string;
  solicitud: string;
  institucionSolicitante: string;
  institucionFuente: string;
  estado: "Borrador" | "En revisión" | "Aprobada" | "Observada";
  prioridad: "Alta" | "Media" | "Baja";
  ultimaActualizacion: string;
}

const INITIAL_SOLICITUDES: Solicitud[] = [
  {
    codigo: "SOL-2025-0024",
    solicitud: "Validación de identidad ciudadana",
    institucionSolicitante: "Ministerio del Interior",
    institucionFuente: "Registro Civil",
    estado: "En revisión",
    prioridad: "Alta",
    ultimaActualizacion: "12 abr 2025 10:24",
  },
  {
    codigo: "SOL-2025-0023",
    solicitud: "Consulta de antecedentes penales",
    institucionSolicitante: "Consejo de la Judicatura",
    institucionFuente: "Policía Nacional",
    estado: "Aprobada",
    prioridad: "Media",
    ultimaActualizacion: "10 abr 2025 16:12",
  },
  {
    codigo: "SOL-2025-0022",
    solicitud: "Verificación de RUC",
    institucionSolicitante: "Servicio de Rentas Internas",
    institucionFuente: "SRI",
    estado: "Observada",
    prioridad: "Alta",
    ultimaActualizacion: "08 abr 2025 14:30",
  },
  {
    codigo: "SOL-2025-0021",
    solicitud: "Consulta de información vehicular",
    institucionSolicitante: "Agencia Nacional de Tránsito",
    institucionFuente: "ANT",
    estado: "Borrador",
    prioridad: "Baja",
    ultimaActualizacion: "07 abr 2025 11:05",
  },
  {
    codigo: "SOL-2025-0020",
    solicitud: "Validación de títulos profesionales",
    institucionSolicitante: "Senescyt",
    institucionFuente: "DINARP",
    estado: "Aprobada",
    prioridad: "Media",
    ultimaActualizacion: "04 abr 2025 09:18",
  },
  {
    codigo: "SOL-2025-0019",
    solicitud: "Consulta de catastro",
    institucionSolicitante: "Municipio de Quito",
    institucionFuente: "MIDUVI",
    estado: "En revisión",
    prioridad: "Media",
    ultimaActualizacion: "02 abr 2025 17:40",
  },
  {
    codigo: "SOL-2025-0018",
    solicitud: "Verificación de permisos de construcción",
    institucionSolicitante: "Municipio de Guayaquil",
    institucionFuente: "MIDUVI",
    estado: "Observada",
    prioridad: "Baja",
    ultimaActualizacion: "28 mar 2025 15:22",
  },
];

export default function WireframeSolicitudesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("Todos");
  const [selectedTipo, setSelectedTipo] = useState("Todos");
  const [selectedFuente, setSelectedFuente] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrado reactivo mock
  const filteredSolicitudes = useMemo(() => {
    return INITIAL_SOLICITUDES.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.solicitud.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institucionSolicitante.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institucionFuente.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEstado =
        selectedEstado === "Todos" || item.estado === selectedEstado;

      const matchesFuente =
        selectedFuente === "Todos" || item.institucionFuente === selectedFuente;

      return matchesSearch && matchesEstado && matchesFuente;
    });
  }, [searchQuery, selectedEstado, selectedFuente]);

  return (
    <WireframeDashboardLayout activeMenu="solicitudes">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── Breadcrumbs ── */}
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/wireframes/dashboard" className="text-muted-foreground hover:text-foreground">
                  Inicio
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Solicitudes
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── Header Title & Description ── */}
        <div className="space-y-1">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
            Solicitudes
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
            Gestiona tus solicitudes de interoperabilidad, revisa su estado y crea nuevas solicitudes.
          </p>
        </div>

        {/* ── Zona Superior: Botón Acción, Búsqueda & Selectores DropdownMenu ── */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Botón Nueva Solicitud */}
          <Button
            type="button"
            variant="primary"
            onClick={() => router.push("/wireframes/solicitudes/nueva")}
            className="h-11 px-5 rounded-xl font-semibold flex items-center gap-2 shrink-0 justify-center shadow-xs"
          >
            <FilePlus2 className="size-4 stroke-[2]" />
            <span>Nueva solicitud</span>
          </Button>

          {/* Input de Búsqueda */}
          <div className="flex-1 min-w-[240px]">
            <InputGroup
              size="default"
              leftIcon={<Search className="size-4 text-muted-foreground" />}
              className="bg-surface h-11 rounded-xl border-border/80"
            >
              <InputGroupInput
                placeholder="Buscar por nombre, código o institución..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </InputGroup>
          </div>

          {/* Selectores de Filtro con DropdownMenu */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0">
            {/* Filtro Estado */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 px-3 py-1.5 flex flex-col items-start justify-center bg-surface border-border/80 rounded-xl min-w-[120px] text-left"
                >
                  <span className="text-[10px] font-medium text-muted-foreground leading-none">Estado</span>
                  <div className="w-full flex items-center justify-between gap-1 mt-0.5">
                    <span className="text-xs font-semibold text-foreground truncate">{selectedEstado}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs">Filtrar por estado</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={selectedEstado} onValueChange={setSelectedEstado}>
                  <DropdownMenuRadioItem value="Todos">Todos</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Borrador">Borrador</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="En revisión">En revisión</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Aprobada">Aprobada</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Observada">Observada</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filtro Tipo */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 px-3 py-1.5 flex flex-col items-start justify-center bg-surface border-border/80 rounded-xl min-w-[120px] text-left"
                >
                  <span className="text-[10px] font-medium text-muted-foreground leading-none">Tipo</span>
                  <div className="w-full flex items-center justify-between gap-1 mt-0.5">
                    <span className="text-xs font-semibold text-foreground truncate">{selectedTipo}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs">Filtrar por tipo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={selectedTipo} onValueChange={setSelectedTipo}>
                  <DropdownMenuRadioItem value="Todos">Todos</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Validación">Validación</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Consulta">Consulta</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Verificación">Verificación</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filtro Institución fuente */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 px-3 py-1.5 flex flex-col items-start justify-center bg-surface border-border/80 rounded-xl min-w-[140px] text-left"
                >
                  <span className="text-[10px] font-medium text-muted-foreground leading-none">Institución fuente</span>
                  <div className="w-full flex items-center justify-between gap-1 mt-0.5">
                    <span className="text-xs font-semibold text-foreground truncate">{selectedFuente}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">Institución fuente</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={selectedFuente} onValueChange={setSelectedFuente}>
                  <DropdownMenuRadioItem value="Todos">Todos</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Registro Civil">Registro Civil</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Policía Nacional">Policía Nacional</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="SRI">SRI</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ANT">ANT</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="DINARP">DINARP</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="MIDUVI">MIDUVI</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ── Cards Resumen de Solicitudes con Card UI ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Borradores */}
          <Card className="border-border bg-surface shadow-xs">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="size-12 rounded-xl bg-muted/60 flex items-center justify-center text-foreground shrink-0">
                <FileText className="size-6 stroke-[1.75]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-2xl text-foreground leading-tight">
                  4
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Borradores
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 2. En revisión */}
          <Card className="border-border bg-surface shadow-xs">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="size-12 rounded-xl bg-muted/60 flex items-center justify-center text-foreground shrink-0">
                <Clock className="size-6 stroke-[1.75]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-2xl text-foreground leading-tight">
                  5
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  En revisión
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 3. Aprobadas */}
          <Card className="border-border bg-surface shadow-xs">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="size-12 rounded-xl bg-muted/60 flex items-center justify-center text-foreground shrink-0">
                <CheckCircle2 className="size-6 stroke-[1.75]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-2xl text-foreground leading-tight">
                  12
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Aprobadas
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 4. Observadas */}
          <Card className="border-border bg-surface shadow-xs">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="size-12 rounded-xl bg-muted/60 flex items-center justify-center text-foreground shrink-0">
                <XCircle className="size-6 stroke-[1.75]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-2xl text-foreground leading-tight">
                  3
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Observadas
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Tabla de Solicitudes con Table UI Component ── */}
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
          <Table className="w-full border-spacing-0">
            <TableHeader>
              <TableRow className="border-b border-border/80 bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  CÓDIGO
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  SOLICITUD
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  INSTITUCIÓN SOLICITANTE
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  INSTITUCIÓN FUENTE
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  ESTADO
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  PRIORIDAD
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  <span className="inline-flex items-center gap-1">
                    ÚLTIMA ACTUALIZACIÓN
                    <ArrowDown className="size-3" />
                  </span>
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-right">
                  ACCIONES
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSolicitudes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-sm">
                    No se encontraron solicitudes con los filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSolicitudes.map((item) => (
                  <TableRow
                    key={item.codigo}
                    className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                  >
                    {/* Código */}
                    <TableCell className="py-4 px-4 text-xs font-mono font-medium text-foreground whitespace-nowrap">
                      {item.codigo}
                    </TableCell>

                    {/* Solicitud */}
                    <TableCell className="py-4 px-4 text-xs font-semibold text-foreground max-w-[220px]">
                      {item.solicitud}
                    </TableCell>

                    {/* Institución Solicitante */}
                    <TableCell className="py-4 px-4 text-xs text-muted-foreground">
                      {item.institucionSolicitante}
                    </TableCell>

                    {/* Institución Fuente */}
                    <TableCell className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {item.institucionFuente}
                    </TableCell>

                    {/* Estado con Badge UI */}
                    <TableCell className="py-4 px-4 whitespace-nowrap">
                      <Badge
                        tone="neutral"
                        appearance="soft"
                        size="sm"
                        className="font-medium gap-1.5 capitalize text-xs"
                      >
                        <span className="size-1.5 rounded-full bg-foreground" />
                        {item.estado}
                      </Badge>
                    </TableCell>

                    {/* Prioridad con Badge UI */}
                    <TableCell className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <span className="size-1.5 rounded-full bg-muted-foreground" />
                        {item.prioridad}
                      </span>
                    </TableCell>

                    {/* Última Actualización */}
                    <TableCell className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {item.ultimaActualizacion}
                    </TableCell>

                    {/* Acciones con Button UI */}
                    <TableCell className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          title="Ver detalles"
                          aria-label="Ver detalles"
                          onClick={() => router.push("/wireframes/solicitudes/detalle")}
                          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          title="Editar solicitud"
                          aria-label="Editar solicitud"
                          className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          title="Más opciones"
                          aria-label="Más opciones"
                          className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── Footer: Resultados & Paginación con Pagination UI Component ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground">
            Mostrando 1 a 7 de 24 resultados
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

              {[1, 2, 3, 4].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    className="size-8 rounded-lg text-xs"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < 4) setCurrentPage((p) => p + 1);
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
