"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Search,
  Plus,
  ChevronDown,
  RotateCcw,
  Eye,
  Server,
  Calendar,
  Filter,
  Download,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  FileSpreadsheet,
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { toast } from "sonner";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

interface BatchItem {
  codigo: string;
  proyecto: string;
  fuente: string;
  consumidor: string;
  tipoInformacion: string;
  estado: "En ejecución" | "Finalizado" | "En revisión" | "Aprobado" | "Suspendido" | "Rechazado";
  fechaCreacion: string;
  href: string;
}

const INITIAL_BATCH_DATA: BatchItem[] = [
  {
    codigo: "BATCH-001",
    proyecto: "Cruce masivo de beneficiarios sociales 2026",
    fuente: "Registro Civil",
    consumidor: "MIES",
    tipoInformacion: "Identificación, estado civil y defunciones",
    estado: "En ejecución",
    fechaCreacion: "15/09/26",
    href: "/wireframes/intercambios-masivos/BATCH-001",
  },
  {
    codigo: "BATCH-002",
    proyecto: "Validación de títulos universitarios docentes",
    fuente: "SENESCYT",
    consumidor: "Ministerio de Educación",
    tipoInformacion: "Títulos registrados de tercer y cuarto nivel",
    estado: "Finalizado",
    fechaCreacion: "12/09/26",
    href: "/wireframes/intercambios-masivos/BATCH-001",
  },
  {
    codigo: "BATCH-003",
    proyecto: "Depuración de beneficiarios Bono de Desarrollo",
    fuente: "SRI",
    consumidor: "MIES",
    tipoInformacion: "RUCs y declaraciones simplificadas",
    estado: "Finalizado",
    fechaCreacion: "10/09/26",
    href: "/wireframes/intercambios-masivos/BATCH-001",
  },
  {
    codigo: "BATCH-004",
    proyecto: "Matriz nacional de parque automotor escolar",
    fuente: "ANT",
    consumidor: "Ministerio de Educación",
    tipoInformacion: "Títulos habilitantes y transporte escolar",
    estado: "En revisión",
    fechaCreacion: "08/09/26",
    href: "/wireframes/intercambios-masivos/BATCH-001",
  },
  {
    codigo: "BATCH-005",
    proyecto: "Cruce de aportes y afiliaciones activas",
    fuente: "IESS",
    consumidor: "Ministerio de Salud Pública",
    tipoInformacion: "Base consolidada de asegurados",
    estado: "Aprobado",
    fechaCreacion: "05/09/26",
    href: "/wireframes/intercambios-masivos/BATCH-001",
  },
];

export default function WireframeIntercambiosMasivosPage() {
  const router = useRouter();

  const [batchList, setBatchList] = useState<BatchItem[]>(INITIAL_BATCH_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFuente, setFilterFuente] = useState("Todas");
  const [filterConsumidor, setFilterConsumidor] = useState("Todos");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const resetFilters = () => {
    setSearchQuery("");
    setFilterFuente("Todas");
    setFilterConsumidor("Todos");
    setFilterEstado("Todos");
    setFechaDesde("");
    setFechaHasta("");
    toast.info("Filtros restablecidos.");
  };

  const handleDownloadBatch = (codigo: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    toast.success(`Descargando reporte de ejecución para ${codigo}...`);
  };

  const handleToggleBatchState = (item: BatchItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newEstado = item.estado === "En ejecución" ? "Suspendido" : "En ejecución";
    setBatchList((prev) =>
      prev.map((b) => (b.codigo === item.codigo ? { ...b, estado: newEstado } : b))
    );
    if (newEstado === "Suspendido") {
      toast.warning(`Proceso ${item.codigo} pausado.`);
    } else {
      toast.success(`Proceso ${item.codigo} reanudado.`);
    }
  };

  const filteredData = useMemo(() => {
    return batchList.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.proyecto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fuente.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.consumidor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tipoInformacion.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFuente = filterFuente === "Todas" || item.fuente === filterFuente;
      const matchesConsumidor = filterConsumidor === "Todos" || item.consumidor === filterConsumidor;
      const matchesEstado = filterEstado === "Todos" || item.estado === filterEstado;

      return matchesSearch && matchesFuente && matchesConsumidor && matchesEstado;
    });
  }, [batchList, searchQuery, filterFuente, filterConsumidor, filterEstado]);

  return (
    <WireframeDashboardLayout activeMenu="batch">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Breadcrumbs ── */}
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
                Intercambios masivos
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header Title, Description & New Action ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
              Intercambios masivos / Excepcionalidades
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
              Gestiona y consulta solicitudes de intercambio masivo de datos por lote y acuerdos excepcionales.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={() => router.push("/wireframes/intercambios-masivos/nueva")}
            className="h-10 px-4 rounded-xl text-xs font-semibold gap-2 shrink-0 shadow-xs"
          >
            <Plus className="size-4" />
            <span>Nueva solicitud</span>
          </Button>
        </div>

        {/* ── 3. Buscador y Filtros ── */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
            {/* Buscador */}
            <div className="lg:col-span-2 min-w-[200px]">
              <InputGroup
                size="default"
                leftIcon={<Search className="size-4 text-muted-foreground" />}
                className="bg-surface h-11 rounded-xl border-border/80"
              >
                <InputGroupInput
                  placeholder="Buscar intercambios masivos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-xs sm:text-sm"
                />
              </InputGroup>
            </div>

            {/* Filtro Fuente */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 px-3 py-1.5 flex flex-col items-start justify-center bg-surface border-border/80 text-left w-full"
                >
                  <span className="text-[10px] font-medium text-muted-foreground leading-none">Fuente</span>
                  <div className="w-full flex items-center justify-between gap-1 mt-0.5">
                    <span className="text-xs font-semibold text-foreground truncate">{filterFuente}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel className="text-xs">Institución fuente</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterFuente} onValueChange={setFilterFuente}>
                  <DropdownMenuRadioItem value="Todas">Todas las fuentes</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Registro Civil">Registro Civil</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="SRI">SRI</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="DINARP">DINARP</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ANT">ANT</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="IESS">IESS</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filtro Consumidor */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 px-3 py-1.5 flex flex-col items-start justify-center bg-surface border-border/80 text-left w-full"
                >
                  <span className="text-[10px] font-medium text-muted-foreground leading-none">Consumidor</span>
                  <div className="w-full flex items-center justify-between gap-1 mt-0.5">
                    <span className="text-xs font-semibold text-foreground truncate">{filterConsumidor}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel className="text-xs">Entidad consumidora</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterConsumidor} onValueChange={setFilterConsumidor}>
                  <DropdownMenuRadioItem value="Todos">Todos</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="MIDUVI">MIDUVI</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="INEC">INEC</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="MIES">MIES</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Ministerio de Educación">Ministerio de Educación</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Ministerio de Salud Pública">Ministerio de Salud</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filtro Estado */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 px-3 py-1.5 flex flex-col items-start justify-center bg-surface border-border/80 text-left w-full"
                >
                  <span className="text-[10px] font-medium text-muted-foreground leading-none">Estado</span>
                  <div className="w-full flex items-center justify-between gap-1 mt-0.5">
                    <span className="text-xs font-semibold text-foreground truncate">{filterEstado}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuLabel className="text-xs">Estado</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterEstado} onValueChange={setFilterEstado}>
                  <DropdownMenuRadioItem value="Todos">Todos</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="En revisión">En revisión</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Aprobado">Aprobado</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Finalizado">Finalizado</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Rechazado">Rechazado</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Acciones de filtro */}
            <div className="flex items-center gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
                className="h-11 px-3.5 text-xs font-semibold gap-1.5 border-border w-full justify-center"
                title="Limpiar filtros"
              >
                <RotateCcw className="size-3.5" />
                <span>Limpiar</span>
              </Button>
            </div>
          </div>
        </div>

        {/* ── 4. Tabla de Intercambios Masivos ── */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                CÓDIGO
              </TableHead>
              <TableHead>
                SOLICITUD / PROYECTO
              </TableHead>
              <TableHead>
                FUENTE
              </TableHead>
              <TableHead>
                CONSUMIDOR
              </TableHead>
              <TableHead>
                TIPO DE INFORMACIÓN
              </TableHead>
              <TableHead>
                ESTADO
              </TableHead>
              <TableHead>
                FECHA CREACIÓN
              </TableHead>
              <TableHead className="text-right">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-sm">
                  No se encontraron solicitudes de intercambio masivo.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((b) => (
                <TableRow
                  key={b.codigo}
                  className="cursor-pointer"
                  onClick={() => router.push(b.href)}
                >
                  {/* Código */}
                  <TableCell className="font-mono font-bold text-foreground">
                    {b.codigo}
                  </TableCell>

                  {/* Proyecto */}
                  <TableCell className="font-semibold text-foreground">
                    {b.proyecto}
                  </TableCell>

                  {/* Fuente */}
                  <TableCell className="text-muted-foreground font-medium">
                    {b.fuente}
                  </TableCell>

                  {/* Consumidor */}
                  <TableCell className="text-muted-foreground font-medium">
                    {b.consumidor}
                  </TableCell>

                  {/* Tipo de Información */}
                  <TableCell className="text-muted-foreground font-medium max-w-[180px] truncate">
                    {b.tipoInformacion}
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <span className={cn(
                        "size-1.5 rounded-full shrink-0",
                        (b.estado === "Aprobado" || b.estado === "Finalizado") && "bg-foreground",
                        b.estado === "En revisión" && "bg-foreground",
                        b.estado === "Rechazado" && "bg-foreground"
                      )} />
                      {b.estado}
                    </span>
                  </TableCell>

                  {/* Fecha de Creación */}
                  <TableCell className="text-muted-foreground font-mono">
                    {b.fechaCreacion}
                  </TableCell>

                  {/* Acciones */}
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => router.push(b.href)}
                            className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
                            aria-label="Ver detalle"
                          >
                            <Eye className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Ver detalle</TooltipContent>
                      </Tooltip>

                      <DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
                                aria-label="Más opciones"
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent>Más opciones</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem onClick={() => router.push(b.href)}>
                            <Eye className="size-3.5 mr-2" />
                            <span>Ver bitácora de lote</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleDownloadBatch(b.codigo, e)}>
                            <Download className="size-3.5 mr-2" />
                            <span>Descargar reporte</span>
                          </DropdownMenuItem>
                          {(b.estado === "En ejecución" || b.estado === "Suspendido") && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => handleToggleBatchState(b, e)}>
                                {b.estado === "En ejecución" ? (
                                  <>
                                    <PauseCircle className="size-3.5 mr-2 text-foreground" />
                                    <span>Pausar ejecución</span>
                                  </>
                                ) : (
                                  <>
                                    <PlayCircle className="size-3.5 mr-2 text-foreground" />
                                    <span>Reanudar ejecución</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* ── 5. Paginación ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <p className="text-xs text-muted-foreground font-medium">
            Mostrando 1 a {filteredData.length} de {batchList.length} solicitudes de intercambio masivo
          </p>

          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent className="gap-1.5">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage((p) => p - 1);
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive className="size-9">
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </WireframeDashboardLayout>
  );
}

