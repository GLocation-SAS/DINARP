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
import {
  Combobox,
  ComboboxSelectTrigger,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";

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

  const institucionOptions = useMemo(() => [
    { value: "ALL", label: "Todas las instituciones" },
    ...INITIAL_INSTITUCIONES.map(inst => ({
      value: inst.id,
      label: `${inst.sigla} — ${inst.nombre}`
    }))
  ], []);

  const clasificacionOptions = useMemo(() => [
    { value: "ALL", label: "Todas las clasificaciones" },
    { value: "Accesible", label: "Accesible" },
    { value: "Confidencial", label: "Confidencial" }
  ], []);

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

  // Auto-lanzar al ingresar a la ruta
  useEffect(() => {
    try {
      const hasSeenTour = localStorage.getItem("catalogo-consulta-tour-v2");
      if (!hasSeenTour) {
        const timer = setTimeout(() => {
          setIsTourOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleCloseTour = () => {
    setIsTourOpen(false);
    try {
      localStorage.setItem("catalogo-consulta-tour-v2", "true");
    } catch {}
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
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6">
        
        {/* Contenedor Principal de Encabezado y Métricas */}
        <div className="border border-border rounded-xl bg-surface p-6 sm:p-8 flex flex-col gap-5 sm:gap-6 shadow-xs">
          <div className="flex flex-col gap-1 min-w-0">
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Consulta de Fuentes de Datos
            </h1>
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              Explora las instituciones, fuentes y campos publicados disponibles en el Catálogo de Interoperabilidad.
            </p>
          </div>

          {/* Featured Cards para las 3 Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Instituciones */}
            <Card
              variant="featured"
              className="bg-card hover:bg-muted/40 border border-border shadow-none transition-all"
              innerClassName="p-4 items-start text-left gap-1"
            >
              <span className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight block">
                {totalInstitucionesPublicadoras}
              </span>
              <span className="text-sm font-semibold text-foreground block">
                Instituciones
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                Entidades con información publicada
              </span>
              <CardDecorativeIcon className="opacity-10 right-[-10px] bottom-[-10px] [&>svg]:size-24">
                <Building2 />
              </CardDecorativeIcon>
            </Card>

            {/* 2. Fuentes publicadas */}
            <Card
              variant="featured"
              className="bg-card hover:bg-muted/40 border border-border shadow-none transition-all"
              innerClassName="p-4 items-start text-left gap-1"
            >
              <span className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight block">
                {totalFuentesPublicadas}
              </span>
              <span className="text-sm font-semibold text-foreground block">
                Fuentes publicadas
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                Fuentes disponibles en el catálogo
              </span>
              <CardDecorativeIcon className="opacity-10 right-[-10px] bottom-[-10px] [&>svg]:size-24">
                <Database />
              </CardDecorativeIcon>
            </Card>

            {/* 3. Campos disponibles */}
            <Card
              variant="featured"
              className="bg-card hover:bg-muted/40 border border-border shadow-none transition-all"
              innerClassName="p-4 items-start text-left gap-1"
            >
              <span className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight block">
                {totalCamposClasificados}
              </span>
              <span className="text-sm font-semibold text-foreground block">
                Campos disponibles
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                Clasificados como accesibles o confidenciales
              </span>
              <CardDecorativeIcon className="opacity-10 right-[-10px] bottom-[-10px] [&>svg]:size-24">
                <Layers />
              </CardDecorativeIcon>
            </Card>
          </div>

          <div className="border-t border-border/80 my-2 w-full"></div>

          {/* Bloque: Barra de Filtros y Búsqueda */}
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4 items-end">
              <div data-tour="tour-search" className="sm:col-span-12 lg:col-span-5 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap block">Búsqueda general</label>
                <SearchInput
                  placeholder="Buscar por institución, fuente o campo..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onClear={() => setSearchTerm("")}
                  className="w-full h-10 bg-background rounded-full border-border/80"
                />
              </div>

              <div data-tour="tour-filters" className="sm:col-span-6 lg:col-span-4 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap block">Institución proveedora</label>
                <Combobox
                  items={institucionOptions}
                  value={institucionOptions.find(i => i.value === selectedInstitucion) || institucionOptions[0]}
                  onValueChange={(val) => {
                    if (val) setSelectedInstitucion(val.value);
                  }}
                >
                  <ComboboxSelectTrigger className="w-full h-10 justify-between text-xs sm:text-sm font-normal bg-background rounded-xl border-border/80 px-3.5 hover:bg-muted/40 shadow-none">
                    <span className="truncate">
                      {institucionOptions.find(i => i.value === selectedInstitucion)?.label || "Todas las instituciones"}
                    </span>
                  </ComboboxSelectTrigger>
                  <ComboboxContent align="start" className="w-80 max-w-[90vw]">
                    <ComboboxList>
                      {institucionOptions.map((opt) => (
                        <ComboboxItem key={opt.value} value={opt} className="text-xs">
                          {opt.label}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              <div className="sm:col-span-6 lg:col-span-3 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap block">Clasificación del campo</label>
                <Combobox
                  items={clasificacionOptions}
                  value={clasificacionOptions.find(c => c.value === selectedClasificacion) || clasificacionOptions[0]}
                  onValueChange={(val) => {
                    if (val) setSelectedClasificacion(val.value as any);
                  }}
                >
                  <ComboboxSelectTrigger className="w-full h-10 justify-between text-xs sm:text-sm font-normal bg-background rounded-xl border-border/80 px-3.5 hover:bg-muted/40 shadow-none">
                    <span className="truncate">
                      {clasificacionOptions.find(c => c.value === selectedClasificacion)?.label || "Todas las clasificaciones"}
                    </span>
                  </ComboboxSelectTrigger>
                  <ComboboxContent align="end" className="w-56">
                    <ComboboxList>
                      {clasificacionOptions.map((opt) => (
                        <ComboboxItem key={opt.value} value={opt} className="text-xs">
                          {opt.label}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
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

          {/* Bloque Inferior: Resultados (Instituciones) */}
          <div className="divide-y divide-border">
            {institucionesFiltradas.length === 0 ? (
              <div className="p-12 sm:p-16 flex flex-col items-center justify-center text-center gap-4 max-w-xl mx-auto">
                <div className="size-16 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground shadow-2xs">
                  <SearchIcon className="size-7 stroke-[1.75]" />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                    {searchTerm ? `No encontramos resultados para "${searchTerm}".` : "No se encontraron resultados."}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md">
                    Intenta buscar por institución, fuente o campo.
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
                          <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
                            <span className="text-xs font-semibold text-foreground">
                              {institucion.sigla}
                            </span>
                            <span className="text-muted-foreground/60 text-xs">•</span>
                            <Badge appearance="soft" tone="neutral" className="h-5 px-1.5 text-[10px] uppercase tracking-wider font-semibold">
                              Sector {institucion.sector.toLowerCase().includes("público") ? "público" : "privado"}
                            </Badge>
                            {institucion.sector.includes("-") && (
                              <>
                                <span className="text-muted-foreground/60 text-xs">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {institucion.sector.split("-")[1].trim()}
                                </span>
                              </>
                            )}
                            <span className="text-muted-foreground/60 text-xs">•</span>
                            <span className="text-xs text-muted-foreground">
                              RUC {institucion.codigoInstitucion}
                            </span>
                          </div>
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

                    {/* Nivel 2: FUENTE */}
                    {isInstExpanded && (
                      <div className="p-4 sm:p-6 flex flex-col gap-8 bg-card border-t border-border">
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
                              className="flex flex-col gap-4 border-l-[3px] border-primary/30 pl-4 sm:pl-5"
                            >
                              {/* Identificador de Fuente */}
                              <div className="flex flex-col gap-3">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                  <div className="space-y-1.5 min-w-0">
                                    <h3 className="font-heading text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                                      <Database className="size-4.5 text-muted-foreground" />
                                      Fuente: {fuente.nombre}
                                    </h3>
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
                                      className="text-xs h-8 gap-1.5 font-medium border-border/80 hover:bg-muted text-foreground"
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

                                {/* Metadatos Técnicos Reducidos */}
                                <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border/40">
                                  <Badge appearance="outline" tone="neutral" className="h-5 px-1.5 text-[10px] font-mono font-medium text-foreground bg-background">
                                    {meta.codigo}
                                  </Badge>
                                  <Badge appearance="outline" tone="neutral" className="h-5 px-1.5 text-[10px] font-mono font-medium text-foreground bg-background">
                                    {meta.version}
                                  </Badge>
                                  <span className="text-border/80 hidden sm:inline">•</span>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="cursor-help underline decoration-dotted underline-offset-2 opacity-80 hover:opacity-100 flex items-center gap-1">
                                        Ficha técnica <Info className="size-2.5" />
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" sideOffset={6} className="w-[260px] p-3 shadow-xl">
                                      <div className="space-y-3">
                                        <div className="font-semibold text-sm pb-2 border-b border-current/10">Detalles de integración</div>
                                        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                          <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-wider opacity-70">Tipo</p>
                                            <p className="font-medium text-xs">{meta.tipo}</p>
                                          </div>
                                          <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-wider opacity-70">Tecnología</p>
                                            <p className="font-medium text-xs">{meta.tecnologia}</p>
                                          </div>
                                          <div className="space-y-1 col-span-2 border-t border-current/10 pt-2">
                                            <p className="text-[10px] uppercase tracking-wider opacity-70">Formato</p>
                                            <p className="font-medium text-xs break-words">{meta.formato}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>

                                  <span className="text-border/80 hidden sm:inline">•</span>
                                  <span>Marco normativo: <strong className="text-foreground/90 font-normal">{fuente.baseLegal}</strong></span>
                                  <span className="text-border/80 hidden sm:inline">•</span>
                                  <span>
                                    <strong>{fuente.campos.length}</strong> campos
                                  </span>
                                </div>
                              </div>

                              {/* Nivel 3: TABLA DE CAMPOS DESPLEGABLE */}
                              {isFuenteExpanded && (
                                <div className="mt-2 overflow-hidden shadow-xs rounded-lg border border-border bg-surface">
                                  {/* Vista Desktop: Tabla */}
                                  <div className="hidden sm:block overflow-x-auto">
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
                                                  <TooltipContent side="top" sideOffset={6} className="w-[280px] p-3 shadow-xl">
                                                    <div className="space-y-3">
                                                      <div className="font-semibold text-sm pb-2 border-b border-current/10">Criterios de Clasificación</div>
                                                      <div className="space-y-3">
                                                        <div className="flex gap-2.5">
                                                          <div className="mt-0.5 opacity-70 shrink-0">
                                                            <Check className="size-3.5" />
                                                          </div>
                                                          <div className="space-y-0.5">
                                                            <p className="font-medium text-xs">Accesible</p>
                                                            <p className="text-[11px] leading-relaxed opacity-80">
                                                              Información que no tiene carácter confidencial conforme al ordenamiento jurídico.
                                                            </p>
                                                          </div>
                                                        </div>
                                                        <div className="border-t border-current/10" />
                                                        <div className="flex gap-2.5">
                                                          <div className="mt-0.5 opacity-70 shrink-0">
                                                            <Lock className="size-3.5" />
                                                          </div>
                                                          <div className="space-y-0.5">
                                                            <p className="font-medium text-xs">Confidencial</p>
                                                            <p className="text-[11px] leading-relaxed opacity-80">
                                                              Este campo requiere condiciones adicionales de legitimidad para su consumo.
                                                            </p>
                                                          </div>
                                                        </div>
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

                                    {/* Vista Mobile: Cards */}
                                    <div className="sm:hidden flex flex-col divide-y divide-border/60">
                                      {camposFiltrados.length === 0 ? (
                                        <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                                          No hay campos que coincidan con la clasificación o búsqueda seleccionada.
                                        </div>
                                      ) : (
                                        camposFiltrados.map((campo, cIdx) => (
                                          <div key={cIdx} className="flex flex-col gap-2.5 p-4 hover:bg-muted/30 transition-colors">
                                            <div className="flex items-start justify-between gap-2">
                                              <span className="font-medium font-mono text-xs text-foreground break-all">
                                                {campo.nombre}
                                              </span>
                                              {campo.clasificacion === "Accesible" ? (
                                                <Badge
                                                  tone="neutral"
                                                  appearance="soft"
                                                  className="text-[10px] font-medium gap-1 bg-muted/80 text-foreground border border-border shrink-0"
                                                >
                                                  <Check className="size-2.5 text-muted-foreground" />
                                                  <span>Accesible</span>
                                                </Badge>
                                              ) : (
                                                <Badge
                                                  tone="neutral"
                                                  appearance="soft"
                                                  className="text-[10px] font-medium gap-1 bg-muted/80 text-foreground border border-border shrink-0"
                                                >
                                                  <Lock className="size-2.5 text-muted-foreground" />
                                                  <span>Confidencial</span>
                                                </Badge>
                                              )}
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                              {campo.descripcion}
                                            </p>
                                            <div>
                                              <Badge
                                                tone="neutral"
                                                appearance="outline"
                                                size="sm"
                                                className="font-mono text-[10px] font-normal border-border/80 bg-muted/40 text-muted-foreground px-2 py-0.5"
                                              >
                                                {campo.tipo}
                                              </Badge>
                                            </div>
                                          </div>
                                        ))
                                      )}
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
