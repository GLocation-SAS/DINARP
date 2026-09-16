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
  ChevronLeft,
  ChevronRight,
  ArrowDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
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
      <main className="relative p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
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

        {/* ── Zona Superior: Botón Acción, Búsqueda & Comboboxes ── */}
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

          {/* Comboboxes de Filtro */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0">
            {/* Filtro Estado */}
            <div className="relative flex flex-col bg-surface border border-border/80 rounded-xl px-3 py-1.5 min-w-[120px]">
              <span className="text-[10px] font-medium text-muted-foreground leading-tight">Estado</span>
              <div className="flex items-center justify-between gap-1">
                <select
                  value={selectedEstado}
                  onChange={(e) => setSelectedEstado(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-foreground outline-none appearance-none cursor-pointer w-full"
                >
                  <option value="Todos">Todos</option>
                  <option value="Borrador">Borrador</option>
                  <option value="En revisión">En revisión</option>
                  <option value="Aprobada">Aprobada</option>
                  <option value="Observada">Observada</option>
                </select>
                <ChevronDown className="size-3.5 text-muted-foreground pointer-events-none shrink-0" />
              </div>
            </div>

            {/* Filtro Tipo */}
            <div className="relative flex flex-col bg-surface border border-border/80 rounded-xl px-3 py-1.5 min-w-[120px]">
              <span className="text-[10px] font-medium text-muted-foreground leading-tight">Tipo</span>
              <div className="flex items-center justify-between gap-1">
                <select
                  value={selectedTipo}
                  onChange={(e) => setSelectedTipo(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-foreground outline-none appearance-none cursor-pointer w-full"
                >
                  <option value="Todos">Todos</option>
                  <option value="Validación">Validación</option>
                  <option value="Consulta">Consulta</option>
                  <option value="Verificación">Verificación</option>
                </select>
                <ChevronDown className="size-3.5 text-muted-foreground pointer-events-none shrink-0" />
              </div>
            </div>

            {/* Filtro Institución fuente */}
            <div className="relative flex flex-col bg-surface border border-border/80 rounded-xl px-3 py-1.5 min-w-[140px]">
              <span className="text-[10px] font-medium text-muted-foreground leading-tight">Institución fuente</span>
              <div className="flex items-center justify-between gap-1">
                <select
                  value={selectedFuente}
                  onChange={(e) => setSelectedFuente(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-foreground outline-none appearance-none cursor-pointer w-full"
                >
                  <option value="Todos">Todos</option>
                  <option value="Registro Civil">Registro Civil</option>
                  <option value="Policía Nacional">Policía Nacional</option>
                  <option value="SRI">SRI</option>
                  <option value="ANT">ANT</option>
                  <option value="DINARP">DINARP</option>
                  <option value="MIDUVI">MIDUVI</option>
                </select>
                <ChevronDown className="size-3.5 text-muted-foreground pointer-events-none shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Cards Resumen de Solicitudes ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Borradores */}
          <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs">
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
          </div>

          {/* 2. En revisión */}
          <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs">
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
          </div>

          {/* 3. Aprobadas */}
          <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs">
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
          </div>

          {/* 4. Observadas */}
          <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs">
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
          </div>
        </div>

        {/* ── Tabla de Solicitudes ── */}
        <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
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

                      {/* Estado */}
                      <TableCell className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-muted/70 text-foreground">
                          <span className="size-1.5 rounded-full bg-foreground" />
                          {item.estado}
                        </span>
                      </TableCell>

                      {/* Prioridad */}
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

                      {/* Acciones */}
                      <TableCell className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            title="Ver detalles"
                            aria-label="Ver detalles"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            type="button"
                            title="Editar solicitud"
                            aria-label="Editar solicitud"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            type="button"
                            title="Más opciones"
                            aria-label="Más opciones"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                          >
                            <MoreVertical className="size-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ── Footer: Resultados & Paginación ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground">
            Mostrando 1 a 7 de 24 resultados
          </p>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="size-8 rounded-lg border-border text-muted-foreground"
              aria-label="Página anterior"
            >
              <ChevronLeft className="size-4" />
            </Button>

            {[1, 2, 3, 4].map((page) => (
              <Button
                key={page}
                type="button"
                variant={currentPage === page ? "primary" : "ghost"}
                size="icon-sm"
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "size-8 rounded-lg text-xs font-semibold",
                  currentPage === page ? "shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                {page}
              </Button>
            ))}

            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={currentPage === 4}
              onClick={() => setCurrentPage((p) => Math.min(4, p + 1))}
              className="size-8 rounded-lg border-border text-muted-foreground"
              aria-label="Página siguiente"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </main>
    </WireframeDashboardLayout>
  );
}
