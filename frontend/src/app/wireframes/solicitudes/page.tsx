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
  CardDecorativeIcon,
} from "@/components/ui/card";
import { Search } from "@/components/ui/search";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

        {/* ── 1. Header Title, Description & Action ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
              Solicitudes
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
              Gestiona tus solicitudes de interoperabilidad, revisa su estado y crea nuevas solicitudes.
            </p>
          </div>

          {/* Botón Nueva Solicitud (CTA alineado a la derecha) */}
          <Button
            type="button"
            variant="primary"
            onClick={() => router.push("/wireframes/solicitudes/nueva")}
            className="h-11 px-5 rounded-xl font-semibold flex items-center gap-2 shrink-0 self-start sm:self-auto shadow-xs"
          >
            <FilePlus2 className="size-4 stroke-[2]" />
            <span>Nueva solicitud</span>
          </Button>
        </div>

        {/* ── 2. Zona Superior: Búsqueda UI Kit & Selectores DropdownMenu ── */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Input de Búsqueda UI Kit */}
          <div className="flex-1 min-w-[240px]">
            <Search
              placeholder="Buscar por nombre, código o institución..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              className="bg-surface rounded-xl border-border/80"
            />
          </div>

          {/* Selectores de Filtro con DropdownMenu */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            {/* Filtro Estado */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 px-3.5 flex items-center justify-between gap-2 bg-surface border-border/80 rounded-xl text-xs min-w-[130px]"
                >
                  <span className="text-muted-foreground font-normal">Estado:</span>
                  <span className="font-semibold text-foreground truncate">{selectedEstado}</span>
                  <ChevronDown className="size-3.5 text-muted-foreground shrink-0 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
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
                  className="h-11 px-3.5 flex items-center justify-between gap-2 bg-surface border-border/80 rounded-xl text-xs min-w-[130px]"
                >
                  <span className="text-muted-foreground font-normal">Tipo:</span>
                  <span className="font-semibold text-foreground truncate">{selectedTipo}</span>
                  <ChevronDown className="size-3.5 text-muted-foreground shrink-0 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
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
                  className="h-11 px-3.5 flex items-center justify-between gap-2 bg-surface border-border/80 rounded-xl text-xs min-w-[150px]"
                >
                  <span className="text-muted-foreground font-normal">Fuente:</span>
                  <span className="font-semibold text-foreground truncate">{selectedFuente}</span>
                  <ChevronDown className="size-3.5 text-muted-foreground shrink-0 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl">
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

        {/* ── Cards Resumen de Solicitudes con Featured Cards alineadas a la izquierda ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Borradores */}
          <Card
            variant="featured"
            className="bg-primary/10 hover:bg-primary/15 border border-primary/20 transition-colors"
            innerClassName="p-5 items-start text-left gap-1"
          >
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight block">
              4
            </span>
            <span className="text-xs font-semibold text-primary block">
              Borradores
            </span>
            <span className="text-[11px] text-muted-foreground font-normal">
              Solicitudes en edición
            </span>
            <CardDecorativeIcon>
              <FileText className="size-28 text-primary" />
            </CardDecorativeIcon>
          </Card>

          {/* 2. En revisión */}
          <Card
            variant="featured"
            className="bg-warning/10 hover:bg-warning/15 border border-warning/20 transition-colors"
            innerClassName="p-5 items-start text-left gap-1"
          >
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight block">
              5
            </span>
            <span className="text-xs font-semibold text-warning block">
              En revisión
            </span>
            <span className="text-[11px] text-muted-foreground font-normal">
              Pendientes de dictamen
            </span>
            <CardDecorativeIcon>
              <Clock className="size-28 text-warning" />
            </CardDecorativeIcon>
          </Card>

          {/* 3. Aprobadas */}
          <Card
            variant="featured"
            className="bg-success/10 hover:bg-success/15 border border-success/20 transition-colors"
            innerClassName="p-5 items-start text-left gap-1"
          >
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight block">
              12
            </span>
            <span className="text-xs font-semibold text-success block">
              Aprobadas
            </span>
            <span className="text-[11px] text-muted-foreground font-normal">
              Listas para interoperar
            </span>
            <CardDecorativeIcon>
              <CheckCircle2 className="size-28 text-success" />
            </CardDecorativeIcon>
          </Card>

          {/* 4. Observadas */}
          <Card
            variant="featured"
            className="bg-danger/10 hover:bg-danger/15 border border-danger/20 transition-colors"
            innerClassName="p-5 items-start text-left gap-1"
          >
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight block">
              3
            </span>
            <span className="text-xs font-semibold text-danger block">
              Observadas
            </span>
            <span className="text-[11px] text-muted-foreground font-normal">
              Requieren subsanación
            </span>
            <CardDecorativeIcon>
              <XCircle className="size-28 text-danger" />
            </CardDecorativeIcon>
          </Card>
        </div>

        {/* ── Tabla de Solicitudes con Table UI Component ── */}
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="font-bold">
                CÓDIGO
              </TableHead>
              <TableHead className="font-bold">
                SOLICITUD
              </TableHead>
              <TableHead className="font-bold">
                INSTITUCIÓN SOLICITANTE
              </TableHead>
              <TableHead className="font-bold">
                INSTITUCIÓN FUENTE
              </TableHead>
              <TableHead className="font-bold">
                ESTADO
              </TableHead>
              <TableHead className="font-bold">
                PRIORIDAD
              </TableHead>
              <TableHead className="font-bold">
                <span className="inline-flex items-center gap-1">
                  ÚLTIMA ACTUALIZACIÓN
                  <ArrowDown className="size-3" />
                </span>
              </TableHead>
              <TableHead className="text-right font-bold">
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
                >
                  {/* Código */}
                  <TableCell className="text-xs font-mono font-medium text-foreground whitespace-nowrap">
                    {item.codigo}
                  </TableCell>

                  {/* Solicitud */}
                  <TableCell className="text-xs font-semibold text-foreground max-w-[220px]">
                    {item.solicitud}
                  </TableCell>

                  {/* Institución Solicitante */}
                  <TableCell className="text-xs text-muted-foreground">
                    {item.institucionSolicitante}
                  </TableCell>

                  {/* Institución Fuente */}
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.institucionFuente}
                  </TableCell>

                  {/* Estado con Badge UI */}
                  <TableCell className="whitespace-nowrap">
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
                  <TableCell className="whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <span className="size-1.5 rounded-full bg-muted-foreground" />
                      {item.prioridad}
                    </span>
                  </TableCell>

                  {/* Última Actualización */}
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.ultimaActualizacion}
                  </TableCell>

                  {/* Acciones con Tooltip UI */}
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="inline-flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Ver detalles"
                            onClick={() => router.push("/wireframes/solicitudes/detalle")}
                            className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
                          >
                            <Eye className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Ver detalles</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Editar solicitud"
                            className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          >
                            <Pencil className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar solicitud</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Más opciones"
                            className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Más opciones</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

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
