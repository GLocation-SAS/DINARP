"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Database,
  Building2,
  Filter,
  ShieldCheck,
  Lock,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Layers,
  X,
  Search as SearchIcon,
  Info,
  HelpCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDecorativeIcon } from "@/components/ui/card";
import { Search as SearchInput } from "@/components/ui/search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";
import { WireframeBreadcrumbs } from "../components/wireframe-breadcrumbs";
import { INITIAL_INSTITUCIONES, type CampoClasificacion, type FuenteServicio } from "./data/catalogo-data";
import { WireframeTour, type TourStep } from "../components/wireframe-tour";

function getTechnicalMetadata(fuente: FuenteServicio) {
  let tipo = "Servicio Web";
  let tecnologia = "REST";
  let formato = "JSON";

  if (fuente.tipoConsumo.includes("Batch") || fuente.tipoConsumo.includes("Intercambio Masivo")) {
    tipo = "Intercambio Masivo";
    tecnologia = "Batch";
    formato = "CSV/TXT";
  } else if (fuente.tipoConsumo.includes("SOAP") || fuente.tipoConsumo.includes("XML")) {
    tipo = "Servicio Web";
    tecnologia = "SOAP";
    formato = "XML";
  } else {
    tipo = "Servicio Web";
    tecnologia = "REST";
    formato = "JSON";
  }

  return {
    codigo: fuente.codigoServicio,
    version: fuente.version,
    tipo,
    tecnologia,
    formato
  };
}

export default function CatalogoConsultaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstitucion, setSelectedInstitucion] = useState<string>("ALL");
  const [selectedClasificacion, setSelectedClasificacion] = useState<string>("ALL");
  const [expandedInstituciones, setExpandedInstituciones] = useState<Record<string, boolean>>({
    "INST-001": true,
    "INST-002": true,
    "INST-003": true
  });
  const [expandedFuentes, setExpandedFuentes] = useState<Record<string, boolean>>({
    "FNT-001": true
  });

  const toggleInstitucion = (id: string) => {
    setExpandedInstituciones(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFuente = (id: string) => {
    setExpandedFuentes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtrar estrictamente solo fuentes en estado PUBLICADO (excluye OCULTO y DESACTIVADO)
  const institucionesFiltradas = useMemo(() => {
    return INITIAL_INSTITUCIONES.map(inst => {
      const fuentesPublicadas = inst.fuentes.filter(f => f.estado === "PUBLICADO");

      const fuentesFiltradas = fuentesPublicadas.filter(f => {
        const matchSearch =
          searchTerm === "" ||
          f.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inst.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.campos.some(c => c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || c.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchClasificacion =
          selectedClasificacion === "ALL" ||
          f.campos.some(c => c.clasificacion === selectedClasificacion);

        return matchSearch && matchClasificacion;
      });

      return {
        ...inst,
        fuentes: fuentesFiltradas
      };
    }).filter(inst => {
      const matchInst = selectedInstitucion === "ALL" || inst.id === selectedInstitucion;
      return matchInst && inst.fuentes.length > 0;
    });
  }, [searchTerm, selectedInstitucion, selectedClasificacion]);

  const totalInstitucionesPublicadoras = useMemo(() => {
    return INITIAL_INSTITUCIONES.filter(i => i.fuentes.some(f => f.estado === "PUBLICADO")).length;
  }, []);

  const totalFuentesPublicadas = useMemo(() => {
    return INITIAL_INSTITUCIONES.flatMap(i => i.fuentes).filter(f => f.estado === "PUBLICADO").length;
  }, []);

  const totalCamposClasificados = useMemo(() => {
    return INITIAL_INSTITUCIONES.flatMap(i => i.fuentes)
      .filter(f => f.estado === "PUBLICADO")
      .reduce((acc, f) => acc + f.campos.length, 0);
  }, []);

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Auto-lanzar solo en primera visita
  useEffect(() => {
    try {
      const hasSeenTour = localStorage.getItem("dinarp_catalogo_tour_seen");
      if (!hasSeenTour) {
        const timer = setTimeout(() => {
          setIsTourOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback si localStorage no está disponible
    }
  }, []);

  const handleCloseTour = () => {
    setIsTourOpen(false);
    try {
      localStorage.setItem("dinarp_catalogo_tour_seen", "true");
    } catch {}
  };

  const handleStartTour = () => {
    setTourStep(0);
    setExpandedInstituciones(prev => ({ ...prev, "INST-001": true }));
    setExpandedFuentes(prev => ({ ...prev, "FNT-001": true }));
    setIsTourOpen(true);
  };

  const tourSteps: TourStep[] = useMemo(() => [
    {
      id: "step-search",
      target: '[data-tour="tour-search"]',
      title: "Buscar información",
      description: "Busca por institución, fuente o campo.",
      placement: "bottom"
    },
    {
      id: "step-filters",
      target: '[data-tour="tour-filters"]',
      title: "Filtrar resultados",
      description: "Filtra por institución o clasificación.",
      placement: "bottom"
    },
    {
      id: "step-institution",
      target: '[data-tour="tour-institution-toggle"]',
      title: "Explorar una institución",
      description: "Despliega una institución para consultar sus fuentes publicadas.",
      placement: "bottom",
      onBeforeStep: () => {
        setExpandedInstituciones(prev => ({ ...prev, "INST-001": true }));
      }
    },
    {
      id: "step-fuente",
      target: '[data-tour="tour-fuente-card"]',
      title: "Consultar una fuente",
      description: "Revisa su descripción y metadatos técnicos.",
      placement: "bottom",
      onBeforeStep: () => {
        setExpandedInstituciones(prev => ({ ...prev, "INST-001": true }));
      }
    },
    {
      id: "step-campos",
      target: '[data-tour="tour-ver-campos"]',
      title: "Ver campos disponibles",
      description: "Consulta los campos, tipo de dato y clasificación DPI.",
      placement: "bottom",
      onBeforeStep: () => {
        setExpandedInstituciones(prev => ({ ...prev, "INST-001": true }));
        setExpandedFuentes(prev => ({ ...prev, "FNT-001": true }));
      }
    }
  ], []);

  return (
    <TooltipProvider delayDuration={100}>
      <WireframeDashboardLayout
        activeMenu="catalogo-interoperabilidad"
        breadcrumbs={[
          { label: "Catálogo de Interoperabilidad", href: "/wireframes2/catalogo-interoperabilidad" },
          { label: "Consulta" }
        ]}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        
        {/* Contenedor Principal de Encabezado y Métricas */}
        <div className="border border-border rounded-xl bg-surface p-6 flex flex-col gap-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
              <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Consulta de Servicios Digitales
              </h1>
              <p className="text-sm text-muted-foreground whitespace-nowrap">
                Explora las instituciones, fuentes, servicios y campos publicados disponibles en el Catálogo de Interoperabilidad.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleStartTour}
              className="text-xs gap-1.5 self-start sm:self-center shrink-0 border-border shadow-2xs hover:bg-muted"
            >
              <HelpCircle className="size-3.5" />
              <span>Ver recorrido</span>
            </Button>
          </div>

          {/* Featured Cards para las 3 Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Instituciones */}
            <Card
              variant="featured"
              className="bg-card hover:bg-muted/40 border border-border shadow-xs transition-all"
              innerClassName="p-5 items-start text-left gap-1"
            >
              <span className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight block">
                {totalInstitucionesPublicadoras}
              </span>
              <span className="text-xs font-semibold text-foreground block">
                Instituciones
              </span>
              <span className="text-[11px] text-muted-foreground font-normal">
                Entidades con servicios publicados
              </span>
              <CardDecorativeIcon>
                <Building2 className="size-24 text-muted-foreground" />
              </CardDecorativeIcon>
            </Card>

            {/* 2. Fuentes publicadas */}
            <Card
              variant="featured"
              className="bg-card hover:bg-muted/40 border border-border shadow-xs transition-all"
              innerClassName="p-5 items-start text-left gap-1"
            >
              <span className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight block">
                {totalFuentesPublicadas}
              </span>
              <span className="text-xs font-semibold text-foreground block">
                Fuentes publicadas
              </span>
              <span className="text-[11px] text-muted-foreground font-normal">
                Servicios disponibles en catálogo
              </span>
              <CardDecorativeIcon>
                <Database className="size-24 text-muted-foreground" />
              </CardDecorativeIcon>
            </Card>

            {/* 3. Campos clasificados */}
            <Card
              variant="featured"
              className="bg-card hover:bg-muted/40 border border-border shadow-xs transition-all"
              innerClassName="p-5 items-start text-left gap-1"
            >
              <span className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight block">
                {totalCamposClasificados}
              </span>
              <span className="text-xs font-semibold text-foreground block">
                Campos clasificados
              </span>
              <span className="text-[11px] text-muted-foreground font-normal">
                Definidos por DPI (Accesible / Confidencial)
              </span>
              <CardDecorativeIcon>
                <Layers className="size-24 text-muted-foreground" />
              </CardDecorativeIcon>
            </Card>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            CONTENEDOR UNIFICADO: BÚSQUEDA/FILTROS + LÍNEA + RESULTADOS
           ═══════════════════════════════════════════════════════════ */}
        <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-xs">
          {/* Bloque Superior: Barra de Filtros y Búsqueda */}
          <div className="p-4 sm:p-5 bg-card flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4 items-end">
              <div data-tour="tour-search" className="sm:col-span-12 lg:col-span-5 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap block">Búsqueda general</label>
                <SearchInput
                  placeholder="Buscar por institución, fuente o campo..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onClear={() => setSearchTerm("")}
                  className="w-full h-10 bg-background rounded-xl border-border/80"
                />
              </div>

              <div data-tour="tour-filters" className="sm:col-span-6 lg:col-span-4 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap block">Institución proveedora</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-10 justify-between text-xs sm:text-sm font-normal bg-background rounded-xl border-border/80 px-3.5 hover:bg-muted/40"
                    >
                      <span className="truncate">
                        {selectedInstitucion === "ALL"
                          ? "Todas las instituciones"
                          : INITIAL_INSTITUCIONES.find(i => i.id === selectedInstitucion)?.sigla +
                            " — " +
                            INITIAL_INSTITUCIONES.find(i => i.id === selectedInstitucion)?.nombre}
                      </span>
                      <ChevronDown className="size-4 opacity-60 ml-2 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-80 max-w-[90vw]">
                    <DropdownMenuLabel className="text-xs">Seleccionar Institución</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={selectedInstitucion}
                      onValueChange={setSelectedInstitucion}
                    >
                      <DropdownMenuRadioItem value="ALL" className="text-xs">
                        Todas las instituciones
                      </DropdownMenuRadioItem>
                      {INITIAL_INSTITUCIONES.map(inst => (
                        <DropdownMenuRadioItem key={inst.id} value={inst.id} className="text-xs">
                          <span className="font-semibold">{inst.sigla}</span>
                          <span className="text-muted-foreground ml-1.5 truncate max-w-[200px]">
                            {inst.nombre}
                          </span>
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="sm:col-span-6 lg:col-span-3 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap block">Clasificación del campo</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-10 justify-between text-xs sm:text-sm font-normal bg-background rounded-xl border-border/80 px-3.5 hover:bg-muted/40"
                    >
                      <span className="truncate flex items-center gap-1.5">
                        {selectedClasificacion === "ALL" && "Todas las clasificaciones"}
                        {selectedClasificacion === "Accesible" && (
                          <>
                            <Check className="size-3.5 text-muted-foreground" />
                            Accesible
                          </>
                        )}
                        {selectedClasificacion === "Confidencial" && (
                          <>
                            <Lock className="size-3.5 text-muted-foreground" />
                            Confidencial
                          </>
                        )}
                      </span>
                      <ChevronDown className="size-4 opacity-60 ml-2 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="text-xs">Clasificación DPI</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={selectedClasificacion}
                      onValueChange={setSelectedClasificacion}
                    >
                      <DropdownMenuRadioItem value="ALL" className="text-xs">
                        Todas las clasificaciones
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Accesible" className="text-xs">
                        <Check className="size-3.5 mr-1.5 text-muted-foreground" />
                        Accesible
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Confidencial" className="text-xs">
                        <Lock className="size-3.5 mr-1.5 text-muted-foreground" />
                        Confidencial
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Badges de Filtros Activos (UI Kit pattern) */}
            {(searchTerm || selectedInstitucion !== "ALL" || selectedClasificacion !== "ALL") && (
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/60 w-full">
                <span className="text-[12px] font-semibold text-muted-foreground mr-1">Filtros activos:</span>

                {searchTerm && (
                  <Badge
                    tone="neutral"
                    appearance="soft"
                    className="pl-2.5 pr-1 py-0.5 rounded-full text-[11px] h-7 gap-1.5 font-medium bg-muted text-foreground border border-border"
                  >
                    <span>Búsqueda: <strong className="font-semibold text-foreground">"{searchTerm}"</strong></span>
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

                {selectedInstitucion !== "ALL" && (
                  <Badge
                    tone="neutral"
                    appearance="soft"
                    className="pl-2.5 pr-1 py-0.5 rounded-full text-[11px] h-7 gap-1.5 font-medium bg-muted text-foreground border border-border"
                  >
                    <span className="flex items-center gap-1">
                      <Building2 className="size-3 text-muted-foreground" />
                      Institución: <strong className="font-semibold text-foreground">{selectedInstitucion}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedInstitucion("ALL")}
                      className="p-0.5 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      aria-label="Eliminar filtro de institución"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                )}

                {selectedClasificacion !== "ALL" && (
                  <Badge
                    tone="neutral"
                    appearance="soft"
                    className="pl-2.5 pr-1 py-0.5 rounded-full text-[11px] h-7 gap-1.5 font-medium bg-muted text-foreground border border-border"
                  >
                    <span className="flex items-center gap-1">
                      {selectedClasificacion === "Accesible" ? <Check className="size-3 text-muted-foreground" /> : <Lock className="size-3 text-muted-foreground" />}
                      Clasificación: <strong className="font-semibold text-foreground">{selectedClasificacion}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedClasificacion("ALL")}
                      className="p-0.5 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      aria-label="Eliminar filtro de clasificación"
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
                    setSelectedInstitucion("ALL");
                    setSelectedClasificacion("ALL");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground h-7 px-2.5 ml-auto"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>

          {/* Línea divisoria entre filtros/búsqueda y resultados */}
          <div className="border-t border-border" />

          {/* Bloque Inferior: Resultados (Instituciones) */}
          <div className="divide-y divide-border">
            {institucionesFiltradas.length === 0 ? (
              <div className="p-12 sm:p-16 flex flex-col items-center justify-center text-center gap-4 max-w-xl mx-auto">
                <div className="size-16 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground shadow-2xs">
                  <SearchIcon className="size-7 stroke-[1.75]" />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                    No se encontraron fuentes publicadas
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md">
                    No existen fuentes ni servicios disponibles que coincidan con el término de búsqueda o filtros seleccionados.
                  </p>
                </div>

                {(searchTerm || selectedInstitucion !== "ALL" || selectedClasificacion !== "ALL") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedInstitucion("ALL");
                      setSelectedClasificacion("ALL");
                    }}
                    className="mt-2 text-xs gap-1.5 font-medium border-border shadow-2xs hover:bg-muted"
                  >
                    <X className="size-3.5" />
                    <span>Restablecer búsqueda y filtros</span>
                  </Button>
                )}
              </div>
            ) : (
              institucionesFiltradas.map(institucion => {
                const isInstExpanded = expandedInstituciones[institucion.id] ?? true;

                return (
                  <div key={institucion.id} className="bg-card">
                    {/* Nivel 1: INSTITUCIÓN (Fila horizontal, compacta y escaneable) */}
                    <div
                      data-tour={institucion.id === "INST-001" ? "tour-institution-toggle" : undefined}
                      onClick={() => toggleInstitucion(institucion.id)}
                      className="p-4 sm:p-5 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="size-9 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0 shadow-2xs">
                          <Building2 className="size-4.5 text-foreground" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="font-heading text-base font-bold text-foreground truncate">
                            {institucion.nombre}
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {institucion.sigla} · {institucion.sector.replace(" - ", " · ")} · RUC {institucion.codigoInstitucion}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span className="text-xs font-medium text-muted-foreground hidden sm:inline-block">
                          {isInstExpanded
                            ? "Ocultar fuentes"
                            : `Ver ${institucion.fuentes.length} ${institucion.fuentes.length === 1 ? "fuente publicada" : "fuentes publicadas"}`}
                        </span>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={isInstExpanded ? "Ocultar fuentes de esta institución" : "Ver fuentes publicadas de esta institución"}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleInstitucion(institucion.id);
                              }}
                              className="size-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80 shadow-2xs"
                            >
                              {isInstExpanded ? (
                                <ChevronUp className="size-4" />
                              ) : (
                                <ChevronDown className="size-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={6}>
                            <p>
                              {isInstExpanded
                                ? "Ocultar fuentes de esta institución"
                                : "Ver fuentes publicadas de esta institución"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    {/* Nivel 2: FUENTE / SERVICIO */}
                    {isInstExpanded && (
                      <div className="p-4 sm:p-6 flex flex-col gap-5 bg-muted/10 border-t border-border">
                        {institucion.fuentes.map(fuente => {
                          const isFuenteExpanded = (expandedFuentes[fuente.id] ?? false) || searchTerm.trim().length > 0 || selectedClasificacion !== "ALL";
                          const camposAccesibles = fuente.campos.filter(c => c.clasificacion === "Accesible").length;
                          const camposConfidenciales = fuente.campos.filter(c => c.clasificacion === "Confidencial").length;
                          const meta = getTechnicalMetadata(fuente);

                          const camposFiltrados = fuente.campos.filter(c => {
                            const matchClasif = selectedClasificacion === "ALL" || c.clasificacion === selectedClasificacion;
                            const matchSearch =
                              searchTerm === "" ||
                              fuente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              institucion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              c.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
                            return matchClasif && matchSearch;
                          });

                          return (
                            <div
                              key={fuente.id}
                              data-tour={fuente.id === "FNT-001" ? "tour-fuente-card" : undefined}
                              className="border border-border/80 rounded-xl bg-card overflow-hidden shadow-xs hover:border-border transition-colors"
                            >
                              {/* Cabecera de la Fuente */}
                              <div className="p-4 sm:p-5 flex flex-col gap-3">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                  <div className="space-y-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-heading text-sm sm:text-base font-bold text-foreground">
                                        {fuente.nombre}
                                      </h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      {fuente.descripcion}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      data-tour={fuente.id === "FNT-001" ? "tour-ver-campos" : undefined}
                                      onClick={() => toggleFuente(fuente.id)}
                                      className="text-xs h-8 gap-1.5 font-medium border-border/80 hover:bg-muted"
                                    >
                                      <Layers className="size-3.5 text-muted-foreground" />
                                      <span>{isFuenteExpanded ? "Ocultar campos" : "Ver campos"}</span>
                                      {isFuenteExpanded ? (
                                        <ChevronUp className="size-3 text-muted-foreground" />
                                      ) : (
                                        <ChevronDown className="size-3 text-muted-foreground" />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                {/* Metadatos Técnicos (Badges secundarios sutiles con Tooltips ⓘ) */}
                                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                  {/* Código */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        tone="neutral"
                                        appearance="soft"
                                        className="h-5 px-1.5 text-[10.5px] gap-1 font-normal rounded-md border border-border/40 bg-muted/30 text-muted-foreground hover:text-foreground transition-colors cursor-help"
                                      >
                                        <span className="opacity-75 font-sans">Código:</span>
                                        <span className="font-mono font-medium text-foreground/80">{meta.codigo}</span>
                                        <Info className="size-2.5 opacity-40 ml-0.5" />
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" sideOffset={6}>
                                      <p>Identificador único de la fuente o servicio.</p>
                                    </TooltipContent>
                                  </Tooltip>

                                  {/* Versión */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        tone="neutral"
                                        appearance="soft"
                                        className="h-5 px-1.5 text-[10.5px] gap-1 font-normal rounded-md border border-border/40 bg-muted/30 text-muted-foreground hover:text-foreground transition-colors cursor-help"
                                      >
                                        <span className="opacity-75">Versión:</span>
                                        <span className="font-medium text-foreground/80">{meta.version}</span>
                                        <Info className="size-2.5 opacity-40 ml-0.5" />
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" sideOffset={6}>
                                      <p>Versión vigente de la integración.</p>
                                    </TooltipContent>
                                  </Tooltip>

                                  {/* Tipo */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        tone="neutral"
                                        appearance="soft"
                                        className="h-5 px-1.5 text-[10.5px] gap-1 font-normal rounded-md border border-border/40 bg-muted/30 text-muted-foreground hover:text-foreground transition-colors cursor-help"
                                      >
                                        <span className="opacity-75">Tipo:</span>
                                        <span className="font-medium text-foreground/80">{meta.tipo}</span>
                                        <Info className="size-2.5 opacity-40 ml-0.5" />
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" sideOffset={6}>
                                      <p>Forma en que la fuente expone la información.</p>
                                    </TooltipContent>
                                  </Tooltip>

                                  {/* Tecnología */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        tone="neutral"
                                        appearance="soft"
                                        className="h-5 px-1.5 text-[10.5px] gap-1 font-normal rounded-md border border-border/40 bg-muted/30 text-muted-foreground hover:text-foreground transition-colors cursor-help"
                                      >
                                        <span className="opacity-75">Tecnología:</span>
                                        <span className="font-medium text-foreground/80">{meta.tecnologia}</span>
                                        <Info className="size-2.5 opacity-40 ml-0.5" />
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" sideOffset={6}>
                                      <p>Mecanismo utilizado para la integración.</p>
                                    </TooltipContent>
                                  </Tooltip>

                                  {/* Formato */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        tone="neutral"
                                        appearance="soft"
                                        className="h-5 px-1.5 text-[10.5px] gap-1 font-normal rounded-md border border-border/40 bg-muted/30 text-muted-foreground hover:text-foreground transition-colors cursor-help"
                                      >
                                        <span className="opacity-75">Formato:</span>
                                        <span className="font-medium text-foreground/80">{meta.formato}</span>
                                        <Info className="size-2.5 opacity-40 ml-0.5" />
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" sideOffset={6}>
                                      <p>Estructura en la que se intercambian los datos.</p>
                                    </TooltipContent>
                                  </Tooltip>

                                  <div className="h-3 w-px bg-border/60 mx-1 hidden sm:block" />

                                  {/* Resumen de Campos */}
                                  <span className="text-xs text-muted-foreground">
                                    <strong>{fuente.campos.length}</strong> campos ·{" "}
                                    <span className="text-foreground font-medium">{camposAccesibles} accesibles</span> ·{" "}
                                    <span className="text-foreground font-medium">{camposConfidenciales} confidenciales</span>
                                  </span>
                                </div>

                                {/* Información secundaria: Base Legal y Última Actualización */}
                                <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between text-[11px] text-muted-foreground gap-2">
                                  <span>Base legal: <strong className="text-foreground/90 font-normal">{fuente.baseLegal}</strong></span>
                                  <span>Última actualización: {fuente.ultimaActualizacion}</span>
                                </div>
                              </div>

                              {/* Nivel 3: TABLA DE CAMPOS DESPLEGABLE */}
                              {isFuenteExpanded && (
                                <div className="border-t border-border bg-muted/20 p-4 sm:p-5">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                      <Database className="size-3.5 text-muted-foreground" />
                                      <span>Campos disponibles ({camposFiltrados.length})</span>
                                    </h4>

                                    {/* Leyenda general con tooltips para evitar repetir en cada fila */}
                                    <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                                      <span className="text-[11px] font-medium text-muted-foreground/80">Clasificación:</span>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button type="button" className="flex items-center gap-1 hover:text-foreground transition-colors cursor-help">
                                            <Check className="size-3 text-muted-foreground" />
                                            <span>Accesible</span>
                                            <Info className="size-3 opacity-60" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" sideOffset={6}>
                                          <p>Campo identificado como disponible para consulta dentro del catálogo.</p>
                                        </TooltipContent>
                                      </Tooltip>

                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button type="button" className="flex items-center gap-1 hover:text-foreground transition-colors cursor-help">
                                            <Lock className="size-3 text-muted-foreground" />
                                            <span>Confidencial</span>
                                            <Info className="size-3 opacity-60" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" sideOffset={6}>
                                          <p>Campo identificado con restricciones de acceso o validación adicional.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                  </div>

                                  <div className="overflow-x-auto rounded-lg border border-border bg-surface">
                                    <table className="w-full text-xs text-left">
                                      <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border">
                                        <tr>
                                          <th className="px-3.5 py-2.5">Campo</th>
                                          <th className="px-3.5 py-2.5">Tipo de dato</th>
                                          <th className="px-3.5 py-2.5">
                                            <div className="flex items-center gap-1.5">
                                              <span>Clasificación</span>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <button type="button" className="inline-flex cursor-help focus:outline-hidden">
                                                    <Info className="size-3 text-muted-foreground hover:text-foreground" />
                                                  </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top" sideOffset={6} className="w-72 p-3 text-left space-y-2.5">
                                                  <p className="font-semibold text-xs text-foreground">Criterios de Clasificación</p>
                                                  <div className="space-y-2 text-xs">
                                                    <div className="space-y-0.5">
                                                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                                                        <Check className="size-3 text-muted-foreground" />
                                                        <span>Accesible</span>
                                                      </div>
                                                      <p className="text-[11px] text-muted-foreground leading-relaxed pl-4.5">
                                                        Disponible para consulta directa dentro del catálogo.
                                                      </p>
                                                    </div>

                                                    <div className="border-t border-border/60" />

                                                    <div className="space-y-0.5">
                                                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                                                        <Lock className="size-3 text-muted-foreground" />
                                                        <span>Confidencial</span>
                                                      </div>
                                                      <p className="text-[11px] text-muted-foreground leading-relaxed pl-4.5">
                                                        Restricciones de acceso o validación adicional por DPI.
                                                      </p>
                                                    </div>
                                                  </div>
                                                </TooltipContent>
                                              </Tooltip>
                                            </div>
                                          </th>
                                          <th className="px-3.5 py-2.5">Descripción</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-border/60">
                                        {camposFiltrados.length === 0 ? (
                                          <tr>
                                            <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                                              No hay campos que coincidan con la clasificación o búsqueda seleccionada.
                                            </td>
                                          </tr>
                                        ) : (
                                          camposFiltrados.map((campo, cIdx) => (
                                            <tr key={cIdx} className="hover:bg-muted/30 transition-colors">
                                              <td className="px-3.5 py-2.5 font-medium font-mono text-foreground">
                                                {campo.nombre}
                                              </td>
                                               <td className="px-3.5 py-2.5">
                                                 <Badge
                                                   tone="neutral"
                                                   appearance="outline"
                                                   size="sm"
                                                   className="font-mono text-[11px] font-normal border-border/80 bg-muted/40 text-muted-foreground px-2 py-0.5"
                                                 >
                                                   {campo.tipo}
                                                 </Badge>
                                               </td>
                                              <td className="px-3.5 py-2.5">
                                                {campo.clasificacion === "Accesible" ? (
                                                  <Badge
                                                    tone="neutral"
                                                    appearance="soft"
                                                    className="text-[11px] font-medium gap-1 bg-muted/80 text-foreground border border-border"
                                                  >
                                                    <Check className="size-2.5 text-muted-foreground" />
                                                    <span>Accesible</span>
                                                  </Badge>
                                                ) : (
                                                  <Badge
                                                    tone="neutral"
                                                    appearance="soft"
                                                    className="text-[11px] font-medium gap-1 bg-muted/80 text-foreground border border-border"
                                                  >
                                                    <Lock className="size-2.5 text-muted-foreground" />
                                                    <span>Confidencial</span>
                                                  </Badge>
                                                )}
                                              </td>
                                              <td className="px-3.5 py-2.5 text-muted-foreground max-w-sm leading-relaxed">
                                                {campo.descripcion}
                                              </td>
                                            </tr>
                                          ))
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Product Tour Onboarding */}
        <WireframeTour
          isOpen={isTourOpen}
          onClose={handleCloseTour}
          steps={tourSteps}
          currentStep={tourStep}
          onStepChange={setTourStep}
        />

      </div>
      </WireframeDashboardLayout>
    </TooltipProvider>
  );
}
