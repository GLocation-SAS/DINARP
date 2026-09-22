"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Database,
  Search,
  Eye,
  EyeOff,
  FolderArchive,
  Info,
  HelpCircle,
  ChevronDown,
  Building2,
  X,
  FileText,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardDecorativeIcon } from "@/components/ui/card";
import { Search as SearchInput } from "@/components/ui/search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";
import { CatalogoTour, type TourStep } from "../components/catalogo-tour";
import { INITIAL_INSTITUCIONES, MOCK_USERS_BY_ROLE, type FuenteEstado } from "../data/catalogo-data";

export default function GestionCatalogoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string>("ALL");
  const [institucionFilter, setInstitucionFilter] = useState<string>("ALL");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Estados del Onboarding Tour
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Comprobar si es la primera visita para abrir automáticamente el tour
  useEffect(() => {
    if (typeof window !== "undefined") {
      const tourShown = localStorage.getItem("dinarp_gestion_tour_completed_v1");
      if (!tourShown) {
        const timer = setTimeout(() => {
          setIsTourOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleCloseTour = () => {
    setIsTourOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("dinarp_gestion_tour_completed_v1", "true");
    }
  };

  const handleStartTour = () => {
    setTourStep(0);
    setIsTourOpen(true);
  };

  // Pasos del recorrido guiado para Gestión del Catálogo
  const tourSteps: TourStep[] = useMemo(() => [
    {
      id: "step-resumen",
      target: '[data-tour="tour-resumen"]',
      title: "Resumen del catálogo",
      description: "Consulta rápidamente cuántas fuentes están publicadas, ocultas o desactivadas.",
      placement: "bottom"
    },
    {
      id: "step-filtros",
      target: '[data-tour="tour-filtros"]',
      title: "Buscar y filtrar",
      description: "Encuentra una fuente por nombre, institución o estado.",
      placement: "bottom"
    },
    {
      id: "step-estado",
      target: '[data-tour="tour-estado"]',
      title: "Revisar estado",
      description: "Identifica si una fuente está publicada, oculta o desactivada.",
      placement: "bottom"
    },
    {
      id: "step-detalle",
      target: '[data-tour="tour-ver-detalle"]',
      title: "Ver detalle",
      description: "Consulta la información administrativa, técnica y la trazabilidad de una fuente.",
      placement: "bottom"
    },
    {
      id: "step-novedades",
      target: '[data-tour="tour-novedades"]',
      title: "Gestionar novedades",
      description: "Accede a los requerimientos de eliminación, supresión o fusión de fuentes.",
      placement: "bottom"
    }
  ], []);

  // Aplanar todas las fuentes para la tabla de administración DINARP
  const allFuentes = useMemo(() => {
    return INITIAL_INSTITUCIONES.flatMap(inst =>
      inst.fuentes.map(f => ({
        ...f,
        institucionSigla: inst.sigla,
        institucionNombreCompleto: inst.nombre,
        institucionSector: inst.sector
      }))
    );
  }, []);

  const stats = useMemo(() => {
    const total = allFuentes.length;
    const publicadas = allFuentes.filter(f => f.estado === "PUBLICADO").length;
    const ocultas = allFuentes.filter(f => f.estado === "OCULTO").length;
    const desactivadas = allFuentes.filter(f => f.estado === "DESACTIVADO").length;
    return { total, publicadas, ocultas, desactivadas };
  }, [allFuentes]);

  const fuentesFiltradas = useMemo(() => {
    return allFuentes.filter(f => {
      const matchSearch =
        searchTerm === "" ||
        f.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.codigoServicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.institucionNombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.institucionSigla.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEstado = estadoFilter === "ALL" || f.estado === estadoFilter;
      const matchInst = institucionFilter === "ALL" || f.institucionId === institucionFilter;

      return matchSearch && matchEstado && matchInst;
    });
  }, [allFuentes, searchTerm, estadoFilter, institucionFilter]);

  const hasActiveFilters = searchTerm !== "" || estadoFilter !== "ALL" || institucionFilter !== "ALL";

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const getEstadoBadge = (estado: FuenteEstado) => {
    switch (estado) {
      case "PUBLICADO":
        return (
          <Badge tone="neutral" appearance="soft" size="sm" className="gap-1 font-medium">
            <Eye className="size-3 text-muted-foreground" />
            Publicado
          </Badge>
        );
      case "OCULTO":
        return (
          <Badge tone="neutral" appearance="outline" size="sm" className="gap-1 font-medium border-dashed text-muted-foreground">
            <EyeOff className="size-3 text-muted-foreground" />
            Oculto
          </Badge>
        );
      case "DESACTIVADO":
        return (
          <Badge tone="neutral" appearance="soft" size="sm" className="gap-1 font-medium bg-muted/40 text-muted-foreground/80">
            <FolderArchive className="size-3 text-muted-foreground" />
            Desactivado
          </Badge>
        );
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <WireframeDashboardLayout
        activeMenu="gestion-catalogo"
        currentRole="DGR"
        currentUser={MOCK_USERS_BY_ROLE.DGR}
        breadcrumbs={[
          { label: "Catálogo de Interoperabilidad", href: "/wireframes2/catalogo-interoperabilidad" },
          { label: "Gestión" }
        ]}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

          {/* Encabezado y Acciones Principales */}
          <div className="border border-border rounded-xl bg-surface p-6 flex flex-col gap-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Gestión del Catálogo
                </h1>
                <p className="text-sm text-muted-foreground">
                  Administra las fuentes del catálogo, sus estados, metadatos, responsables y trazabilidad.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartTour}
                  className="text-xs gap-1.5 border-border shadow-2xs hover:bg-muted"
                >
                  <HelpCircle className="size-3.5" />
                  <span>Ver recorrido</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  asChild
                  className="text-xs gap-1.5 shadow-xs"
                  data-tour="tour-novedades"
                >
                  <Link href="/wireframes2/catalogo-interoperabilidad/novedades">
                    <FileText className="size-3.5" />
                    <span>Gestionar novedades</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Cards de Resumen Compactas */}
            <div data-tour="tour-resumen" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total de fuentes */}
              <Card size="sm" className="bg-card border-border/80 shadow-2xs">
                <CardHeader className="pb-1.5">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-xs font-medium text-muted-foreground">
                      Total de fuentes
                    </CardDescription>
                    <CardDecorativeIcon tone="neutral" size="sm">
                      <Database className="size-3.5" />
                    </CardDecorativeIcon>
                  </div>
                  <CardTitle className="text-2xl font-bold font-mono tracking-tight text-foreground">
                    {stats.total}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[11px] text-muted-foreground pt-0">
                  Inventario total registrado en el catálogo.
                </CardContent>
              </Card>

              {/* Publicadas */}
              <Card size="sm" className="bg-card border-border/80 shadow-2xs">
                <CardHeader className="pb-1.5">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-xs font-medium text-muted-foreground">
                      Publicadas
                    </CardDescription>
                    <CardDecorativeIcon tone="neutral" size="sm">
                      <Eye className="size-3.5" />
                    </CardDecorativeIcon>
                  </div>
                  <CardTitle className="text-2xl font-bold font-mono tracking-tight text-foreground">
                    {stats.publicadas}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[11px] text-muted-foreground pt-0">
                  Visibles para consulta.
                </CardContent>
              </Card>

              {/* Ocultas */}
              <Card size="sm" className="bg-card border-border/80 shadow-2xs">
                <CardHeader className="pb-1.5">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-xs font-medium text-muted-foreground">
                      Ocultas
                    </CardDescription>
                    <CardDecorativeIcon tone="neutral" size="sm">
                      <EyeOff className="size-3.5" />
                    </CardDecorativeIcon>
                  </div>
                  <CardTitle className="text-2xl font-bold font-mono tracking-tight text-foreground">
                    {stats.ocultas}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[11px] text-muted-foreground pt-0">
                  No visibles para consumidores.
                </CardContent>
              </Card>

              {/* Desactivadas */}
              <Card size="sm" className="bg-card border-border/80 shadow-2xs">
                <CardHeader className="pb-1.5">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-xs font-medium text-muted-foreground">
                      Desactivadas
                    </CardDescription>
                    <CardDecorativeIcon tone="neutral" size="sm">
                      <FolderArchive className="size-3.5" />
                    </CardDecorativeIcon>
                  </div>
                  <CardTitle className="text-2xl font-bold font-mono tracking-tight text-foreground">
                    {stats.desactivadas}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[11px] text-muted-foreground pt-0">
                  Fuera de nuevas solicitudes, conservan su historial.
                </CardContent>
              </Card>
            </div>

            {/* Anotación Funcional de Publicación */}
            <div className="bg-muted/20 border border-border/60 rounded-lg px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-muted-foreground">
              <Info className="size-4 shrink-0 text-muted-foreground/80" />
              <p className="leading-relaxed">
                <strong className="text-foreground font-medium">Nota funcional:</strong> Pendiente de validación: definir si la publicación ocurre automáticamente después de producción o mediante acción manual de DGR.
              </p>
            </div>
          </div>

          {/* Bloque de Inventario: Filtros y Tabla */}
          <div className="border border-border rounded-xl bg-surface p-6 flex flex-col gap-6 shadow-xs">
            
            {/* Barra de Filtros */}
            <div data-tour="tour-filtros" className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                {/* Búsqueda */}
                <div className="sm:col-span-12 lg:col-span-5 flex flex-col gap-1.5">
                  <label htmlFor="search-fuentes" className="text-xs font-medium text-muted-foreground">
                    Búsqueda de fuentes
                  </label>
                  <SearchInput
                    id="search-fuentes"
                    placeholder="Buscar por fuente, código o institución..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onClear={() => setSearchTerm("")}
                    className="w-full bg-background"
                  />
                </div>

                {/* Filtro por Estado */}
                <div className="sm:col-span-6 lg:col-span-3 flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Estado
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-10 justify-between text-xs sm:text-sm font-normal bg-background rounded-xl border-border/80 px-3.5 hover:bg-muted/40"
                      >
                        <span className="truncate flex items-center gap-1.5">
                          {estadoFilter === "ALL" && "Todos los estados"}
                          {estadoFilter === "PUBLICADO" && (
                            <>
                              <Eye className="size-3.5 text-muted-foreground" />
                              Publicado
                            </>
                          )}
                          {estadoFilter === "OCULTO" && (
                            <>
                              <EyeOff className="size-3.5 text-muted-foreground" />
                              Oculto
                            </>
                          )}
                          {estadoFilter === "DESACTIVADO" && (
                            <>
                              <FolderArchive className="size-3.5 text-muted-foreground" />
                              Desactivado
                            </>
                          )}
                        </span>
                        <ChevronDown className="size-4 opacity-60 ml-2 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      <DropdownMenuLabel className="text-xs">Estado en el catálogo</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={estadoFilter}
                        onValueChange={setEstadoFilter}
                      >
                        <DropdownMenuRadioItem value="ALL" className="text-xs">
                          Todos los estados
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="PUBLICADO" className="text-xs">
                          <Eye className="size-3.5 mr-1.5 text-muted-foreground" />
                          Publicado
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="OCULTO" className="text-xs">
                          <EyeOff className="size-3.5 mr-1.5 text-muted-foreground" />
                          Oculto
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="DESACTIVADO" className="text-xs">
                          <FolderArchive className="size-3.5 mr-1.5 text-muted-foreground" />
                          Desactivado
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Filtro por Institución */}
                <div className="sm:col-span-6 lg:col-span-4 flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Institución
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-10 justify-between text-xs sm:text-sm font-normal bg-background rounded-xl border-border/80 px-3.5 hover:bg-muted/40"
                      >
                        <span className="truncate flex items-center gap-1.5">
                          {institucionFilter === "ALL"
                            ? "Todas las instituciones"
                            : INITIAL_INSTITUCIONES.find(i => i.id === institucionFilter)?.sigla || institucionFilter}
                        </span>
                        <ChevronDown className="size-4 opacity-60 ml-2 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 max-h-72 overflow-y-auto">
                      <DropdownMenuLabel className="text-xs">Institución proveedora</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={institucionFilter}
                        onValueChange={setInstitucionFilter}
                      >
                        <DropdownMenuRadioItem value="ALL" className="text-xs">
                          Todas las instituciones
                        </DropdownMenuRadioItem>
                        {INITIAL_INSTITUCIONES.map(inst => (
                          <DropdownMenuRadioItem key={inst.id} value={inst.id} className="text-xs">
                            <span className="font-medium mr-1.5">{inst.sigla}</span>
                            <span className="text-muted-foreground truncate">{inst.nombre}</span>
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Fila de Filtros Activos */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
                  <span className="text-xs text-muted-foreground font-medium mr-1">Filtros aplicados:</span>

                  {searchTerm && (
                    <Badge
                      tone="neutral"
                      appearance="soft"
                      className="pl-2.5 pr-1 py-0.5 rounded-full text-[11px] h-7 gap-1.5 font-medium bg-muted text-foreground border border-border"
                    >
                      <span className="flex items-center gap-1">
                        <Search className="size-3 text-muted-foreground" />
                        Texto: <strong className="font-semibold text-foreground">"{searchTerm}"</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="p-0.5 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        aria-label="Eliminar filtro de búsqueda"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  )}

                  {estadoFilter !== "ALL" && (
                    <Badge
                      tone="neutral"
                      appearance="soft"
                      className="pl-2.5 pr-1 py-0.5 rounded-full text-[11px] h-7 gap-1.5 font-medium bg-muted text-foreground border border-border"
                    >
                      <span className="flex items-center gap-1">
                        Estado: <strong className="font-semibold text-foreground">{estadoFilter}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setEstadoFilter("ALL")}
                        className="p-0.5 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        aria-label="Eliminar filtro de estado"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  )}

                  {institucionFilter !== "ALL" && (
                    <Badge
                      tone="neutral"
                      appearance="soft"
                      className="pl-2.5 pr-1 py-0.5 rounded-full text-[11px] h-7 gap-1.5 font-medium bg-muted text-foreground border border-border"
                    >
                      <span className="flex items-center gap-1">
                        <Building2 className="size-3 text-muted-foreground" />
                        Institución: <strong className="font-semibold text-foreground">{INITIAL_INSTITUCIONES.find(i => i.id === institucionFilter)?.sigla || institucionFilter}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setInstitucionFilter("ALL")}
                        className="p-0.5 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        aria-label="Eliminar filtro de institución"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setEstadoFilter("ALL");
                      setInstitucionFilter("ALL");
                    }}
                    className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  >
                    Limpiar todos
                  </Button>
                </div>
              )}
            </div>

            {/* Encabezado de Resultados y Conteo */}
            <div className="flex items-center justify-between border-t border-border/60 pt-4">
              <span className="text-xs text-muted-foreground">
                Mostrando <strong className="text-foreground font-semibold">{fuentesFiltradas.length}</strong> de{" "}
                <strong className="text-foreground font-semibold">{allFuentes.length}</strong> fuentes registradas
              </span>
            </div>

            {/* Tabla Simplificada de Fuentes */}
            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="px-4 py-3 min-w-[220px]">Fuente</th>
                    <th className="px-4 py-3 min-w-[180px]">Institución</th>
                    <th className="px-4 py-3 min-w-[140px]" data-tour="tour-estado">
                      <div className="flex items-center gap-1.5">
                        <span>Estado</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="inline-flex cursor-help focus:outline-hidden">
                              <Info className="size-3 text-muted-foreground hover:text-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={6} className="w-72 p-3 text-left space-y-2.5">
                            <p className="font-semibold text-xs text-foreground">Estados en el Catálogo</p>
                            <div className="space-y-2 text-xs">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 font-medium text-foreground">
                                  <Eye className="size-3 text-muted-foreground" />
                                  <span>PUBLICADO</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed pl-4.5">
                                  Disponible para consulta y selección.
                                </p>
                              </div>

                              <div className="border-t border-border/60" />

                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 font-medium text-foreground">
                                  <EyeOff className="size-3 text-muted-foreground" />
                                  <span>OCULTO</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed pl-4.5">
                                  Registrado internamente, pero aún no visible para consumidores.
                                </p>
                              </div>

                              <div className="border-t border-border/60" />

                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 font-medium text-foreground">
                                  <FolderArchive className="size-3 text-muted-foreground" />
                                  <span>DESACTIVADO</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed pl-4.5">
                                  Ya no está disponible para nuevas solicitudes, pero conserva historial y trazabilidad.
                                </p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[90px]">Campos</th>
                    <th className="px-4 py-3 min-w-[140px]">Última actualización</th>
                    <th className="px-4 py-3 text-right min-w-[130px]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {fuentesFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                        No se encontraron fuentes bajo los criterios de búsqueda o filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    fuentesFiltradas.map((fuente, idx) => (
                      <tr key={fuente.id} className="hover:bg-muted/30 transition-colors">
                        {/* Fuente: Nombre y Código */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-foreground text-sm leading-snug">
                              {fuente.nombre}
                            </span>
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {fuente.codigoServicio}
                            </span>
                          </div>
                        </td>

                        {/* Institución */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-foreground">
                              {fuente.institucionSigla}
                            </span>
                            <span className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs">
                              {fuente.institucionNombreCompleto}
                            </span>
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="px-4 py-3.5">
                          {getEstadoBadge(fuente.estado)}
                        </td>

                        {/* Campos */}
                        <td className="px-4 py-3.5 text-center">
                          <Badge
                            tone="neutral"
                            appearance="outline"
                            size="sm"
                            className="font-mono text-[11px] font-normal border-border/80 bg-muted/30 text-muted-foreground px-2 py-0.5"
                          >
                            {fuente.campos.length}
                          </Badge>
                        </td>

                        {/* Última actualización */}
                        <td className="px-4 py-3.5 text-muted-foreground text-xs font-mono">
                          {fuente.ultimaActualizacion}
                        </td>

                        {/* Acciones */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="secondary"
                              size="sm"
                              asChild
                              className="text-xs h-8 px-3"
                              data-tour={idx === 0 ? "tour-ver-detalle" : undefined}
                            >
                              <Link href={`/wireframes2/catalogo-interoperabilidad/gestion/fuente/${fuente.id}`}>
                                Ver detalle
                              </Link>
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="size-8 p-0 text-muted-foreground hover:text-foreground"
                                  aria-label="Más acciones"
                                >
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild className="text-xs cursor-pointer">
                                  <Link href={`/wireframes2/catalogo-interoperabilidad/gestion/fuente/${fuente.id}`}>
                                    <ExternalLink className="size-3.5 mr-2 text-muted-foreground" />
                                    Ver ficha completa
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="text-xs cursor-pointer">
                                  <Link href="/wireframes2/catalogo-interoperabilidad/novedades">
                                    <FileText className="size-3.5 mr-2 text-muted-foreground" />
                                    Gestionar novedad
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleCopyCode(fuente.codigoServicio)}
                                  className="text-xs cursor-pointer"
                                >
                                  {copiedCode === fuente.codigoServicio ? (
                                    <>
                                      <Check className="size-3.5 mr-2 text-foreground" />
                                      <span>Código copiado</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="size-3.5 mr-2 text-muted-foreground" />
                                      <span>Copiar código</span>
                                    </>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>

        {/* Componente del Recorrido Guiado (Onboarding Tour) */}
        <CatalogoTour
          isOpen={isTourOpen}
          onClose={handleCloseTour}
          steps={tourSteps}
          currentStep={tourStep}
          onStepChange={setTourStep}
        />
      </WireframeDashboardLayout>
    </TooltipProvider>
  );
}
