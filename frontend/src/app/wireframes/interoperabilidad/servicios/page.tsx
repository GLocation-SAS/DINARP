"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  RotateCcw,
  Download,
  Eye,
  ArrowRight,
  Layers,
  ArrowLeftRight,
  Server,
  Filter,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  History,
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
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";

interface ServicioItem {
  id: string;
  servicio: string;
  fuente: string;
  consumidor: string;
  estado: "Activo" | "Suspendido" | "En revisión";
  vigencia: string;
  ultimaActualizacion: string;
  href: string;
}

const INITIAL_SERVICIOS_DATA: ServicioItem[] = [
  {
    id: "consulta-identidad",
    servicio: "Consulta de datos de identidad",
    fuente: "Registro Civil",
    consumidor: "MIES",
    estado: "Activo",
    vigencia: "01/01/26 - 31/12/26",
    ultimaActualizacion: "15/09/26",
    href: "/wireframes/interoperabilidad/servicios/consulta-identidad",
  },
  {
    id: "consulta-ruc",
    servicio: "Consulta de RUC",
    fuente: "SRI",
    consumidor: "Registro Civil",
    estado: "Activo",
    vigencia: "15/02/26 - 15/02/27",
    ultimaActualizacion: "14/09/26",
    href: "/wireframes/interoperabilidad/servicios/consulta-identidad",
  },
  {
    id: "titulos-bachiller",
    servicio: "Títulos de bachiller",
    fuente: "MINEDUC",
    consumidor: "Senescyt",
    estado: "Activo",
    vigencia: "01/03/26 - 01/03/27",
    ultimaActualizacion: "12/09/26",
    href: "/wireframes/interoperabilidad/servicios/consulta-identidad",
  },
  {
    id: "historial-aportes",
    servicio: "Historial de aportes",
    fuente: "IESS",
    consumidor: "MIES",
    estado: "Suspendido",
    vigencia: "01/01/26 - 30/06/26",
    ultimaActualizacion: "10/09/26",
    href: "/wireframes/interoperabilidad/servicios/consulta-identidad",
  },
  {
    id: "matriculacion-vehicular",
    servicio: "Matriculación vehicular",
    fuente: "ANT",
    consumidor: "Municipio de Guayaquil",
    estado: "Activo",
    vigencia: "01/04/26 - 01/04/27",
    ultimaActualizacion: "08/09/26",
    href: "/wireframes/interoperabilidad/servicios/consulta-identidad",
  },
  {
    id: "puntos-licencia",
    servicio: "Puntos de licencia",
    fuente: "ANT",
    consumidor: "Policía Nacional",
    estado: "En revisión",
    vigencia: "15/05/26 - 15/05/27",
    ultimaActualizacion: "05/09/26",
    href: "/wireframes/interoperabilidad/servicios/consulta-identidad",
  },
];

export default function WireframeServiciosHabilitadosPage() {
  const router = useRouter();

  const [serviciosList, setServiciosList] = useState<ServicioItem[]>(INITIAL_SERVICIOS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFuente, setFilterFuente] = useState("Todas");
  const [filterConsumidor, setFilterConsumidor] = useState("Todos");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);

  const resetFilters = () => {
    setSearchQuery("");
    setFilterFuente("Todas");
    setFilterConsumidor("Todos");
    setFilterEstado("Todos");
    toast.info("Filtros restablecidos.");
  };

  const handleToggleEstadoServicio = (servicio: ServicioItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newEstado = servicio.estado === "Activo" ? "Suspendido" : "Activo";
    setServiciosList((prev) =>
      prev.map((s) => (s.id === servicio.id ? { ...s, estado: newEstado, ultimaActualizacion: "Hoy" } : s))
    );
    if (newEstado === "Suspendido") {
      toast.warning(`Servicio "${servicio.servicio}" suspendido temporalmente.`);
    } else {
      toast.success(`Servicio "${servicio.servicio}" reactivado con éxito.`);
    }
  };

  const filteredServicios = useMemo(() => {
    return serviciosList.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.servicio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fuente.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.consumidor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFuente = filterFuente === "Todas" || item.fuente === filterFuente;
      const matchesConsumidor = filterConsumidor === "Todos" || item.consumidor === filterConsumidor;
      const matchesEstado = filterEstado === "Todos" || item.estado === filterEstado;

      return matchesSearch && matchesFuente && matchesConsumidor && matchesEstado;
    });
  }, [serviciosList, searchQuery, filterFuente, filterConsumidor, filterEstado]);

  return (
    <WireframeDashboardLayout activeMenu="servicios">
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
                Interoperabilidad / Servicios
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header Title, Description & Export Button ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
              Interoperabilidad / Servicios
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
              Consulta, administra y monitorea los servicios de interoperabilidad habilitados y acuerdos de intercambio.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-10 px-4 text-xs font-semibold gap-2 border-border shrink-0 shadow-xs"
          >
            <Download className="size-4" />
            <span>Exportar</span>
          </Button>
        </div>

        {/* ── 3. Buscador & Filtros ── */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            {/* Buscador */}
            <div className="lg:col-span-1 min-w-[200px]">
              <InputGroup
                size="default"
                leftIcon={<Search className="size-4 text-muted-foreground" />}
                className="bg-surface h-11 rounded-xl border-border/80"
              >
                <InputGroupInput
                  placeholder="Buscar servicios..."
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
                  <DropdownMenuRadioItem value="MINEDUC">MINEDUC</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="IESS">IESS</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ANT">ANT</DropdownMenuRadioItem>
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
                  <DropdownMenuRadioItem value="Todos">Todos los consumidores</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Ministerio de Gobierno">Ministerio de Gobierno</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Ministerio de Economía">Ministerio de Economía</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Senescyt">Senescyt</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="MIES">MIES</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Municipio de Guayaquil">Municipio de Guayaquil</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Policía Nacional">Policía Nacional</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filtro Estado & Botón Limpiar */}
            <div className="flex items-center gap-2 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 px-3 py-1.5 flex flex-col items-start justify-center bg-surface border-border/80 text-left flex-1"
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
                    <DropdownMenuRadioItem value="Activo">Activo</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Inactivo">Inactivo</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Suspendido">Suspendido</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="En revisión">En revisión</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
                className="h-11 px-3.5 text-xs font-semibold gap-1.5 border-border shrink-0"
                title="Limpiar filtros"
              >
                <RotateCcw className="size-3.5" />
                <span className="hidden sm:inline">Limpiar filtros</span>
              </Button>
            </div>
          </div>
        </div>

        {/* ── 4. Tabla de Servicios Habilitados ── */}
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
          <Table className="w-full border-spacing-0">
            <TableHeader>
              <TableRow className="border-b border-border/80 bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  SERVICIO
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  FUENTE
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  CONSUMIDOR
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  ESTADO
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  VIGENCIA
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  ÚLTIMA ACTUALIZACIÓN
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-right">
                  ACCIONES
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServicios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-sm">
                    No se encontraron servicios habilitados con los criterios de búsqueda.
                  </TableCell>
                </TableRow>
              ) : (
                filteredServicios.map((s) => (
                  <TableRow
                    key={s.id}
                    className="border-b border-border/40 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => router.push(s.href)}
                  >
                    {/* Servicio */}
                    <TableCell className="py-4 px-4 text-xs font-bold text-foreground max-w-[200px]">
                      {s.servicio}
                    </TableCell>

                    {/* Fuente */}
                    <TableCell className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {s.fuente}
                    </TableCell>

                    {/* Consumidor */}
                    <TableCell className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {s.consumidor}
                    </TableCell>

                    {/* Estado */}
                    <TableCell className="py-4 px-4 whitespace-nowrap">
                      <Badge
                        tone="neutral"
                        appearance={s.estado === "Activo" ? "solid" : "outline"}
                        size="sm"
                        className="font-medium gap-1.5 text-xs capitalize"
                      >
                        <span className="size-1.5 rounded-full bg-foreground" />
                        {s.estado}
                      </Badge>
                    </TableCell>

                    {/* Vigencia */}
                    <TableCell className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap font-mono">
                      {s.vigencia}
                    </TableCell>

                    {/* Última actualización */}
                    <TableCell className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {s.ultimaActualizacion}
                    </TableCell>

                    {/* Acciones */}
                    <TableCell className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => router.push(s.href)}
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
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => router.push(s.href)}>
                              <Eye className="size-3.5 mr-2" />
                              <span>Ver información</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`${s.href}/historial`)}>
                              <History className="size-3.5 mr-2" />
                              <span>Ver historial de consumo</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => handleToggleEstadoServicio(s, e)}>
                              {s.estado === "Activo" ? (
                                <>
                                  <PauseCircle className="size-3.5 mr-2 text-foreground" />
                                  <span>Suspender servicio</span>
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="size-3.5 mr-2 text-foreground" />
                                  <span>Reactivar servicio</span>
                                </>
                              )}
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

        {/* ── 5. Paginación ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground">
            Mostrando 1 a {filteredServicios.length} de {INITIAL_SERVICIOS_DATA.length} servicios registrados
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

