"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Layers,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Eye,
  FileCheck2,
  ChevronDown,
  ChevronRight,
  Info,
  Building2,
  ArrowLeftRight,
  AlertCircle,
  UserCheck,
  HelpCircle,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDecorativeIcon } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";
import { WireframeBreadcrumbs } from "../../components/wireframe-breadcrumbs";
import { WireframeTour, type TourStep } from "../../components/wireframe-tour";
import { useSimulatedRole } from "../hooks/use-simulated-role";
import {
  INITIAL_EXPEDIENTES,
  ETAPAS_EXPEDIENTE_CONFIG,
  ROLES_CONFIG,
  MOCK_USERS_BY_ROLE,
  type ExpedienteIntegracion,
  type UserRole,
  type MockUser
} from "../data/catalogo-data";

export default function IntegracionesListPage() {
  const [activeRole, setActiveRole] = useSimulatedRole("COORDINADOR_SINARP");
  const [searchTerm, setSearchTerm] = useState("");
  const [institucionFilter, setInstitucionFilter] = useState<string>("ALL");
  const [estadoFilter, setEstadoFilter] = useState<string>("ALL");
  const [responsableFilter, setResponsableFilter] = useState<string>("ALL");

  // Estado del Product Tour
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const currentUser = MOCK_USERS_BY_ROLE[activeRole];

  // Lista única de instituciones presentes en expedientes
  const institucionesList = useMemo(() => {
    const map = new Map<string, string>();
    INITIAL_EXPEDIENTES.forEach(exp => {
      map.set(exp.institucionSigla, exp.institucionNombre);
    });
    return Array.from(map.entries()).map(([sigla, nombre]) => ({ sigla, nombre }));
  }, []);

  // Filtrado de expedientes
  const expedientesFiltrados = useMemo(() => {
    return INITIAL_EXPEDIENTES.filter(exp => {
      const matchSearch =
        searchTerm === "" ||
        exp.codigoExpediente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.nombreFuente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.institucionNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.institucionSigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.codigoFuente && exp.codigoFuente.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchInst = institucionFilter === "ALL" || exp.institucionSigla === institucionFilter;
      const matchEstado = estadoFilter === "ALL" || exp.estadoGeneral === estadoFilter;
      const matchResponsable = responsableFilter === "ALL" || exp.responsableActualRol === responsableFilter;

      return matchSearch && matchInst && matchEstado && matchResponsable;
    });
  }, [searchTerm, institucionFilter, estadoFilter, responsableFilter]);

  // Contadores para las cards
  const stats = useMemo(() => {
    return {
      total: INITIAL_EXPEDIENTES.length,
      enRevisionDGR: INITIAL_EXPEDIENTES.filter(e => e.estadoGeneral === "En revisión DGR").length,
      enProceso: INITIAL_EXPEDIENTES.filter(e =>
        e.estadoGeneral === "En validación técnica DTD" ||
        e.estadoGeneral === "En integración y clasificación" ||
        e.estadoGeneral === "En validación preproducción" ||
        e.estadoGeneral === "En corrección técnica"
      ).length,
      conObservaciones: INITIAL_EXPEDIENTES.filter(e => e.estadoGeneral === "Con observaciones").length,
      finalizadas: INITIAL_EXPEDIENTES.filter(e =>
        e.estadoGeneral === "Aprobada" ||
        e.estadoGeneral === "En producción" ||
        e.estadoGeneral === "Integrada"
      ).length
    };
  }, []);

  // Definición de pasos para el Product Tour
  const tourSteps: TourStep[] = [
    {
      id: "step-bandeja",
      target: "[data-tour='tour-bandeja']",
      title: "1. Bandeja de Integraciones",
      description: "Consulta las fuentes que están siendo incorporadas al catálogo por parte de los organismos emisores.",
      placement: "bottom"
    },
    {
      id: "step-etapas",
      target: "[data-tour='tour-etapas']",
      title: "2. Etapa y Responsable",
      description: "Identifica en qué parte del proceso está cada integración y qué dirección o actor tiene la tarea actual.",
      placement: "top"
    },
    {
      id: "step-roles",
      target: "[data-tour='tour-roles']",
      title: "3. Demostración por Rol",
      description: "Cambia de rol para comprobar cómo las acciones disponibles se ajustan dinámicamente según el perfil (Coordinador, DGR, DTD o DPI).",
      placement: "bottom"
    },
    {
      id: "step-expediente",
      target: "[data-tour='tour-expediente']",
      title: "4. Expediente de Integración",
      description: "Accede al expediente consolidado para revisar metadatos, campos, documentos y dictámenes de validación.",
      placement: "top"
    },
    {
      id: "step-historial",
      target: "[data-tour='tour-historial']",
      title: "5. Historial y Trazabilidad",
      description: "Consulta devoluciones, correcciones, validaciones y cambios registrados durante todo el ciclo de incorporación.",
      placement: "top"
    }
  ];

  const handleStartTour = () => {
    setTourStep(0);
    setIsTourOpen(true);
  };

  const getBadgeEstadoGeneral = (estado: string) => {
    switch (estado) {
      case "En revisión DGR":
      case "En validación preproducción":
        return <Badge tone="info" appearance="soft" size="sm">{estado}</Badge>;
      case "Con observaciones":
      case "En corrección técnica":
        return <Badge tone="warning" appearance="soft" size="sm">{estado}</Badge>;
      case "En validación técnica DTD":
      case "En integración y clasificación":
        return <Badge tone="neutral" appearance="soft" size="sm">{estado}</Badge>;
      case "Aprobada":
      case "En producción":
      case "Integrada":
        return <Badge tone="success" appearance="soft" size="sm">{estado}</Badge>;
      default:
        return <Badge tone="neutral" appearance="soft" size="sm">{estado}</Badge>;
    }
  };

  const getEtapaNombreCorto = (etapaKey: string) => {
    const config = ETAPAS_EXPEDIENTE_CONFIG[etapaKey as keyof typeof ETAPAS_EXPEDIENTE_CONFIG];
    return config ? config.nombre : etapaKey;
  };

  return (
    <WireframeDashboardLayout
      activeMenu="integracion-fuentes"
      currentRole={activeRole}
      currentUser={currentUser}
      breadcrumbs={[
        { label: "Catálogo de Interoperabilidad", href: "/wireframes2/catalogo-interoperabilidad" },
        { label: "Integración de Fuentes" }
      ]}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Contenedor Principal de Encabezado y Métricas */}
        <div className="border border-border rounded-xl bg-surface p-6 flex flex-col gap-6 shadow-xs">
          <div data-tour="tour-bandeja" className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Integración de Fuentes
                </h1>
                <Badge tone="neutral" appearance="outline" size="sm" className="text-xs">
                  HU-INT-03 a 15
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Gestiona la incorporación de nuevas fuentes y campos al Catálogo de Interoperabilidad.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 border-border shadow-2xs hover:bg-muted"
                onClick={handleStartTour}
              >
                <HelpCircle className="size-3.5" />
                <span>Ver recorrido</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                asChild
                className="gap-2 font-medium"
              >
                <Link href="/wireframes2/catalogo-interoperabilidad/integraciones/nueva">
                  <Plus className="size-4" />
                  Nueva integración
                </Link>
              </Button>
            </div>
          </div>

          {/* Cards de Resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card
              variant="featured"
              className="bg-card hover:bg-muted/40 border border-border shadow-xs transition-all"
              innerClassName="p-5 items-start text-left gap-1"
            >
              <span className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight block">
                {stats.total}
              </span>
              <span className="text-xs font-semibold text-foreground block">
                Total de integraciones
              </span>
              <span className="text-[11px] text-muted-foreground font-normal">
                Todas las solicitudes registradas
              </span>
              <CardDecorativeIcon>
                <Layers className="size-24 text-muted-foreground" />
              </CardDecorativeIcon>
            </Card>

            <Card
              variant="featured"
              className="bg-card hover:bg-muted/40 border border-border shadow-xs transition-all"
              innerClassName="p-5 items-start text-left gap-1"
            >
              <span className="font-heading font-extrabold text-3xl sm:text-4xl text-amber-600 tracking-tight block">
                {stats.conObservaciones + stats.enRevisionDGR + stats.enProceso}
              </span>
              <span className="text-xs font-semibold text-amber-600 block">
                En proceso
              </span>
              <span className="text-[11px] text-muted-foreground font-normal">
                Revisiones, observaciones o validaciones técnicas
              </span>
              <CardDecorativeIcon>
                <Clock className="size-24 text-muted-foreground" />
              </CardDecorativeIcon>
            </Card>

            <Card
              variant="featured"
              className="bg-card hover:bg-muted/40 border border-border shadow-xs transition-all"
              innerClassName="p-5 items-start text-left gap-1"
            >
              <span className="font-heading font-extrabold text-3xl sm:text-4xl text-emerald-600 tracking-tight block">
                {stats.finalizadas}
              </span>
              <span className="text-xs font-semibold text-emerald-600 block">
                Finalizadas
              </span>
              <span className="text-[11px] text-muted-foreground font-normal">
                Aprobadas y desplegadas en catálogo
              </span>
              <CardDecorativeIcon>
                <CheckCircle2 className="size-24 text-muted-foreground" />
              </CardDecorativeIcon>
            </Card>
          </div>
        </div>

        {/* Bloque de Inventario: Filtros y Tabla */}
        <div className="border border-border rounded-xl bg-surface p-6 flex flex-col gap-6 shadow-xs">
          {/* Barra de Filtros */}
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 items-end">
              {/* Búsqueda general */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap block">Búsqueda general</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por integración..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 w-full h-10 bg-background rounded-xl border-border/80 text-sm"
                  />
                </div>
              </div>

              {/* Filtro Estado */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap block">Estado de integración</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full h-10 justify-between text-xs sm:text-sm font-normal bg-background rounded-xl border-border/80 px-3.5 hover:bg-muted/40">
                      <span>{estadoFilter === "ALL" ? "Todos los estados" : estadoFilter}</span>
                      <ChevronDown className="size-4 opacity-60 ml-2 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel className="text-xs">Estado de integración</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={estadoFilter} onValueChange={setEstadoFilter}>
                      <DropdownMenuRadioItem value="ALL">Todos los estados</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="En revisión DGR">En revisión DGR</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Con observaciones">Con observaciones</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="En validación técnica DTD">En validación técnica DTD</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="En integración y clasificación">En integración y clasificación</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="En validación preproducción">En validación preproducción</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Aprobada">Aprobada</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="En producción">En producción</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Filtro Institución */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap block">Institución emisora</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full h-10 justify-between text-xs sm:text-sm font-normal bg-background rounded-xl border-border/80 px-3.5 hover:bg-muted/40 truncate">
                      <span className="truncate">{institucionFilter === "ALL" ? "Todas las instituciones" : institucionFilter}</span>
                      <ChevronDown className="size-4 opacity-60 ml-2 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuLabel className="text-xs">Institución emisora</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={institucionFilter} onValueChange={setInstitucionFilter}>
                      <DropdownMenuRadioItem value="ALL">Todas las instituciones</DropdownMenuRadioItem>
                      {institucionesList.map(inst => (
                        <DropdownMenuRadioItem key={inst.sigla} value={inst.sigla} className="text-xs">
                          {inst.nombre} ({inst.sigla})
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Filtro Responsable */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap block">Responsable actual</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full h-10 justify-between text-xs sm:text-sm font-normal bg-background rounded-xl border-border/80 px-3.5 hover:bg-muted/40">
                      <span>{responsableFilter === "ALL" ? "Todos los responsables" : ROLES_CONFIG[responsableFilter as UserRole]?.shortName || responsableFilter}</span>
                      <ChevronDown className="size-4 opacity-60 ml-2 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel className="text-xs">Responsable actual</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={responsableFilter} onValueChange={setResponsableFilter}>
                      <DropdownMenuRadioItem value="ALL">Todos los responsables</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="COORDINADOR_SINARP">Coordinador SINARP</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="DGR">DGR (Gestión y Registro)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="DTD">DTD (Tecnología)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="DPI">DPI (Protección)</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Badges de filtros activos */}
            {(searchTerm || institucionFilter !== "ALL" || estadoFilter !== "ALL" || responsableFilter !== "ALL") && (
              <div className="flex items-center gap-2 pt-3 flex-wrap text-xs">
                <span className="text-muted-foreground font-medium">Filtros activos:</span>
                {searchTerm && (
                  <Badge tone="neutral" appearance="soft" size="sm">
                    Búsqueda: {searchTerm}
                  </Badge>
                )}
                {estadoFilter !== "ALL" && (
                  <Badge tone="neutral" appearance="soft" size="sm">
                    Estado: {estadoFilter}
                  </Badge>
                )}
                {institucionFilter !== "ALL" && (
                  <Badge tone="neutral" appearance="soft" size="sm">
                    Institución: {institucionFilter}
                  </Badge>
                )}
                {responsableFilter !== "ALL" && (
                  <Badge tone="neutral" appearance="soft" size="sm">
                    Responsable: {ROLES_CONFIG[responsableFilter as UserRole]?.shortName || responsableFilter}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSearchTerm("");
                    setInstitucionFilter("ALL");
                    setEstadoFilter("ALL");
                    setResponsableFilter("ALL");
                  }}
                >
                  <X className="size-3.5 mr-1" /> Limpiar todos
                </Button>
              </div>
            )}
          </div>

          {/* Encabezado de Resultados y Conteo */}
          <div className="flex items-center justify-between border-t border-border/60 pt-4">
            <span className="text-xs text-muted-foreground">
              Mostrando <strong className="text-foreground font-semibold">{expedientesFiltrados.length}</strong> de{" "}
              <strong className="text-foreground font-semibold">{INITIAL_EXPEDIENTES.length}</strong> integraciones
            </span>
          </div>

          {/* Tabla de Integraciones */}
          <div data-tour="tour-etapas" className="overflow-x-auto border-y border-border bg-card mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N.º integración</TableHead>
                  <TableHead>Fuente</TableHead>
                  <TableHead>Institución</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Etapa actual</TableHead>
                  <TableHead>Responsable actual</TableHead>
                  <TableHead>Última actualización</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expedientesFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                      <ArrowLeftRight className="size-8 mx-auto mb-2 opacity-40" />
                      <p className="font-medium text-foreground">No se encontraron integraciones</p>
                      <p className="text-xs mt-1">Ajusta los filtros o criterios de búsqueda.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  expedientesFiltrados.map(exp => {
                    const isMyTask = exp.responsableActualRol === activeRole;

                    return (
                      <TableRow
                        key={exp.id}
                        className={isMyTask ? "bg-muted/30 dark:bg-muted/10 font-medium" : ""}
                      >
                        <TableCell className="font-mono font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <Layers className="size-4 text-muted-foreground" />
                            {exp.codigoExpediente}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs whitespace-normal">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground text-xs line-clamp-1">
                              {exp.nombreFuente}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono mt-0.5">
                              {exp.codigoFuente} • {exp.camposCandidatos.length} campos
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[180px] whitespace-normal">
                          <span className="line-clamp-1 font-medium text-foreground">{exp.institucionSigla}</span>
                          <span className="text-[11px] text-muted-foreground/80 line-clamp-1 mt-0.5">
                            {exp.institucionNombre}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getBadgeEstadoGeneral(exp.estadoGeneral)}
                        </TableCell>
                        <TableCell className="text-xs max-w-[200px] whitespace-normal">
                          <div className="flex flex-col">
                            <span className="text-foreground line-clamp-1 font-medium">
                              {getEtapaNombreCorto(exp.etapaActual)}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
                              {ETAPAS_EXPEDIENTE_CONFIG[exp.etapaActual]?.huRef}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-1.5">
                            <Badge
                              tone={isMyTask ? "warning" : "neutral"}
                              appearance="soft"
                              size="sm"
                              className="text-[11px]"
                            >
                              {ROLES_CONFIG[exp.responsableActualRol]?.shortName || exp.responsableActualRol}
                            </Badge>
                            {isMyTask && (
                              <span className="size-2 rounded-full bg-amber-500 shrink-0 shadow-sm" title="Tarea activa asignada a tu perfil" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {exp.ultimaActualizacion}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5" data-tour="tour-expediente">
                            <TooltipProvider delayDuration={0}>
                              {isMyTask ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="primary"
                                      size="icon-sm"
                                      asChild
                                      className="size-8 rounded-lg shadow-sm font-semibold"
                                    >
                                      <Link href={`/wireframes2/catalogo-interoperabilidad/integraciones/${exp.id}`}>
                                        <ArrowRight className="size-4" />
                                      </Link>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p className="text-xs">Continuar trámite</p>
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      asChild
                                      className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                                    >
                                      <Link href={`/wireframes2/catalogo-interoperabilidad/integraciones/${exp.id}`}>
                                        <Eye className="size-4" />
                                      </Link>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p className="text-xs">Ver detalle</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}

                              {exp.validacionTecnicaDTD?.estadoCatalogoAsignado === "OCULTO" && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      asChild
                                      className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                                    >
                                      <Link href={`/wireframes2/catalogo-interoperabilidad/gestion`}>
                                        <Layers className="size-4" />
                                      </Link>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p className="text-xs">Ver en Gestión</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Product Tour Modal Component */}
        <WireframeTour
          isOpen={isTourOpen}
          onClose={() => setIsTourOpen(false)}
          steps={tourSteps}
          currentStep={tourStep}
          onStepChange={setTourStep}
        />
      </div>
    </WireframeDashboardLayout>
  );
}
