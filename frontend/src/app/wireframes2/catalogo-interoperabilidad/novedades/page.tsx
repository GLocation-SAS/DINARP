"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  Info,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDecorativeIcon } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  INITIAL_NOVEDADES,
  INITIAL_INSTITUCIONES,
  MOCK_USERS_BY_ROLE,
  type NovedadCatalogo,
  type TipoNovedad,
  type EstadoNovedad
} from "../data/catalogo-data";

function NovedadesListContent() {
  const searchParams = useSearchParams();
  const preselectedFuenteId = searchParams.get("fuenteId");
  const openModalParam = searchParams.get("nueva") === "true" || !!preselectedFuenteId;

  const [novedades, setNovedades] = useState<NovedadCatalogo[]>(INITIAL_NOVEDADES);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("ALL");
  const [estadoFilter, setEstadoFilter] = useState<string>("ALL");
  const [organismoFilter, setOrganismoFilter] = useState<string>("ALL");

  // Modal Nueva Novedad
  const [isNewModalOpen, setIsNewModalOpen] = useState(openModalParam);
  const [newTipo, setNewTipo] = useState<TipoNovedad>("Supresión");
  const [newOrganismo, setNewOrganismo] = useState("");
  const [newFuenteId, setNewFuenteId] = useState(preselectedFuenteId || "FNT-001");
  const [newNroOficio, setNewNroOficio] = useState("");
  const [newFechaOficio, setNewFechaOficio] = useState(new Date().toLocaleDateString("es-EC"));
  const [newArchivoNombre, setNewArchivoNombre] = useState("Oficio_Requerimiento_2026.pdf");

  // Todas las fuentes disponibles para el selector
  const todasLasFuentes = useMemo(() => {
    return INITIAL_INSTITUCIONES.flatMap(inst =>
      inst.fuentes.map(f => ({
        id: f.id,
        nombre: f.nombre,
        institucionNombre: inst.nombre,
        codigoServicio: f.codigoServicio,
        estado: f.estado,
        cantidadCampos: f.campos.length
      }))
    );
  }, []);

  // Lista única de organismos solicitantes para el filtro
  const organismosList = useMemo(() => {
    return Array.from(new Set(novedades.map(n => n.organismoSolicitante)));
  }, [novedades]);

  // Novedades filtradas
  const novedadesFiltradas = useMemo(() => {
    return novedades.filter(nov => {
      const matchSearch =
        searchTerm === "" ||
        nov.nroTramite.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nov.organismoSolicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nov.documentoSoporteOficio.numeroOficio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nov.fuentesAfectadas.some(fa =>
          fa.fuenteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (fa.codigoServicio && fa.codigoServicio.toLowerCase().includes(searchTerm.toLowerCase()))
        );

      const matchTipo = tipoFilter === "ALL" || nov.tipoNovedad === tipoFilter;
      const matchEstado = estadoFilter === "ALL" || nov.estado === estadoFilter;
      const matchOrganismo = organismoFilter === "ALL" || nov.organismoSolicitante === organismoFilter;

      return matchSearch && matchTipo && matchEstado && matchOrganismo;
    });
  }, [novedades, searchTerm, tipoFilter, estadoFilter, organismoFilter]);

  // Contadores para cards
  const stats = useMemo(() => {
    return {
      total: novedades.length,
      enValidacion: novedades.filter(n => n.estado === "En validación").length,
      finalizadas: novedades.filter(n => n.estado === "Finalizada").length,
      noProceden: novedades.filter(n => n.estado === "No procede").length
    };
  }, [novedades]);

  const handleRadicarNovedad = (e: React.FormEvent) => {
    e.preventDefault();
    const fuenteSel = todasLasFuentes.find(f => f.id === newFuenteId);
    if (!fuenteSel || !newOrganismo.trim() || !newNroOficio.trim()) {
      alert("Por favor complete los campos obligatorios del requerimiento.");
      return;
    }

    const newId = `NOV-2026-00${novedades.length + 1}`;
    const today = new Date().toLocaleDateString("es-EC");

    const nuevaNov: NovedadCatalogo = {
      id: newId,
      nroTramite: newId,
      organismoSolicitante: newOrganismo,
      tipoNovedad: newTipo,
      fechaRadicacion: today,
      ultimaActualizacion: today,
      estado: "En validación",
      fuentesAfectadas: [
        {
          fuenteId: fuenteSel.id,
          fuenteNombre: fuenteSel.nombre,
          institucionNombre: fuenteSel.institucionNombre,
          codigoServicio: fuenteSel.codigoServicio,
          cantidadCampos: fuenteSel.cantidadCampos,
          estadoPrevio: fuenteSel.estado,
          estadoNuevo: fuenteSel.estado
        }
      ],
      documentoSoporteOficio: {
        numeroOficio: newNroOficio,
        fechaOficio: newFechaOficio,
        archivoPdf: newArchivoNombre,
        archivoTamano: "1.5 MB"
      },
      evaluacionDGR: {
        responsable: "María Torres (DGR)",
        conceptoLegal: "",
        conceptoFuncional: "",
        procede: undefined
      },
      historialEventos: [
        {
          fecha: today,
          hora: "10:00",
          actor: "María Torres",
          rol: "DGR",
          accion: "Novedad radicada",
          detalle: `Radicado requerimiento formal de ${newTipo.toLowerCase()} emitido por ${newOrganismo} (Oficio: ${newNroOficio}). Estado inicial: En validación.`
        }
      ]
    };

    setNovedades([nuevaNov, ...novedades]);
    setIsNewModalOpen(false);
    setNewOrganismo("");
    setNewNroOficio("");
  };

  const getBadgeEstado = (estado: EstadoNovedad) => {
    switch (estado) {
      case "En validación":
        return (
          <Badge tone="warning" appearance="soft" size="sm" className="font-medium gap-1">
            <Clock className="size-3" />
            En validación
          </Badge>
        );
      case "Finalizada":
        return (
          <Badge tone="success" appearance="soft" size="sm" className="font-medium gap-1">
            <CheckCircle2 className="size-3" />
            Finalizada
          </Badge>
        );
      case "No procede":
        return (
          <Badge tone="neutral" appearance="soft" size="sm" className="font-medium gap-1 text-muted-foreground">
            <XCircle className="size-3" />
            No procede
          </Badge>
        );
    }
  };

  const getBadgeTipo = (tipo: TipoNovedad) => {
    switch (tipo) {
      case "Eliminación":
        return <Badge tone="danger" appearance="soft" size="sm">{tipo}</Badge>;
      case "Supresión":
        return <Badge tone="warning" appearance="soft" size="sm">{tipo}</Badge>;
      case "Fusión":
        return <Badge tone="info" appearance="soft" size="sm">{tipo}</Badge>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

      {/* Contenedor Principal de Encabezado y Métricas */}
      <div className="border border-border rounded-xl bg-surface p-6 flex flex-col gap-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Novedades del Catálogo
              </h1>
              <Badge tone="neutral" appearance="outline" size="sm" className="text-xs">
                HU-INT-16 a 19
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Gestiona los requerimientos de eliminación, supresión o fusión que afectan fuentes existentes del catálogo.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsNewModalOpen(true)}
              className="gap-2 font-medium"
            >
              <Plus className="size-4" />
              Radicar novedad
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
              Total de novedades
            </span>
            <span className="text-[11px] text-muted-foreground font-normal">
              Requerimientos registrados
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
              {stats.enValidacion}
            </span>
            <span className="text-xs font-semibold text-amber-600 block">
              En validación
            </span>
            <span className="text-[11px] text-muted-foreground font-normal">
              Pendientes de dictamen DGR
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
              Aplicadas en catálogo
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
                    placeholder="Buscar por novedad..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 w-full h-10 bg-background rounded-xl border-border/80 text-sm"
                  />
                </div>
              </div>

              {/* Filtro Tipo */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap block">Tipo de novedad</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full h-10 justify-between text-xs sm:text-sm font-normal bg-background rounded-xl border-border/80 px-3.5 hover:bg-muted/40">
                      <span>{tipoFilter === "ALL" ? "Todos los tipos" : tipoFilter}</span>
                      <ChevronDown className="size-4 opacity-60 ml-2 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel className="text-xs">Tipo de requerimiento</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={tipoFilter} onValueChange={setTipoFilter}>
                      <DropdownMenuRadioItem value="ALL">Todos los tipos</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Eliminación">Eliminación</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Supresión">Supresión</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Fusión">Fusión</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Filtro Estado */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap block">Estado actual</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full h-10 justify-between text-xs sm:text-sm font-normal bg-background rounded-xl border-border/80 px-3.5 hover:bg-muted/40">
                      <span>{estadoFilter === "ALL" ? "Todos los estados" : estadoFilter}</span>
                      <ChevronDown className="size-4 opacity-60 ml-2 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel className="text-xs">Estado en DGR</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={estadoFilter} onValueChange={setEstadoFilter}>
                      <DropdownMenuRadioItem value="ALL">Todos los estados</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="En validación">En validación</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Finalizada">Finalizada (Aplicada)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="No procede">No procede</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Filtro Organismo */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap block">Organismo solicitante</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full h-10 justify-between text-xs sm:text-sm font-normal bg-background rounded-xl border-border/80 px-3.5 hover:bg-muted/40 truncate">
                      <span className="truncate">{organismoFilter === "ALL" ? "Todos los organismos" : organismoFilter}</span>
                      <ChevronDown className="size-4 opacity-60 ml-2 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuLabel className="text-xs">Entidad requirente</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={organismoFilter} onValueChange={setOrganismoFilter}>
                      <DropdownMenuRadioItem value="ALL">Todos los organismos</DropdownMenuRadioItem>
                      {organismosList.map(org => (
                        <DropdownMenuRadioItem key={org} value={org} className="text-xs">
                          {org}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Badges de filtros activos */}
            {(searchTerm || tipoFilter !== "ALL" || estadoFilter !== "ALL" || organismoFilter !== "ALL") && (
              <div className="flex items-center gap-2 pt-3 flex-wrap text-xs">
                <span className="text-muted-foreground font-medium">Filtros activos:</span>
                {searchTerm && (
                  <Badge tone="neutral" appearance="soft" size="sm">
                    Búsqueda: {searchTerm}
                  </Badge>
                )}
                {tipoFilter !== "ALL" && (
                  <Badge tone="neutral" appearance="soft" size="sm">
                    Tipo: {tipoFilter}
                  </Badge>
                )}
                {estadoFilter !== "ALL" && (
                  <Badge tone="neutral" appearance="soft" size="sm">
                    Estado: {estadoFilter}
                  </Badge>
                )}
                {organismoFilter !== "ALL" && (
                  <Badge tone="neutral" appearance="soft" size="sm">
                    Organismo: {organismoFilter}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSearchTerm("");
                    setTipoFilter("ALL");
                    setEstadoFilter("ALL");
                    setOrganismoFilter("ALL");
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
              Mostrando <strong className="text-foreground font-semibold">{novedadesFiltradas.length}</strong> de{" "}
              <strong className="text-foreground font-semibold">{novedades.length}</strong> novedades
            </span>
          </div>

          {/* Tabla de Novedades */}
          <div className="overflow-x-auto border-y border-border bg-card mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N.º de novedad</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fuente(s) afectada(s)</TableHead>
                  <TableHead>Organismo solicitante</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha radicación</TableHead>
                  <TableHead>Última actualización</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {novedadesFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    <FileText className="size-8 mx-auto mb-2 opacity-40" />
                    <p className="font-medium text-foreground">No se encontraron novedades</p>
                    <p className="text-xs mt-1">Ajusta los criterios de búsqueda o filtros seleccionados.</p>
                  </TableCell>
                </TableRow>
              ) : (
                novedadesFiltradas.map(nov => (
                  <TableRow key={nov.id}>
                    <TableCell className="font-mono font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        {nov.nroTramite}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getBadgeTipo(nov.tipoNovedad)}
                    </TableCell>
                    <TableCell className="max-w-xs whitespace-normal">
                      {nov.fuentesAfectadas.map((fa, i) => (
                        <div key={i} className="flex flex-col">
                          <span className="font-medium text-foreground text-xs line-clamp-1">
                            {fa.fuenteNombre}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono mt-0.5">
                            {fa.codigoServicio || fa.fuenteId}
                          </span>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs whitespace-normal">
                      <span className="line-clamp-2">{nov.organismoSolicitante}</span>
                    </TableCell>
                    <TableCell>
                      {getBadgeEstado(nov.estado)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {nov.fechaRadicacion}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {nov.ultimaActualizacion || nov.fechaRadicacion}
                    </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  asChild
                                  className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                                >
                                  <Link href={`/wireframes2/catalogo-interoperabilidad/novedades/${nov.id}`}>
                                    <Eye className="size-4" />
                                  </Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs">Ver detalle</p>
                              </TooltipContent>
                            </Tooltip>

                            {nov.fuentesAfectadas[0]?.fuenteId && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    asChild
                                    className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                                  >
                                    <Link href={`/wireframes2/catalogo-interoperabilidad/gestion/fuente/${nov.fuentesAfectadas[0].fuenteId}`}>
                                      <Layers className="size-4" />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="text-xs">Ver fuente en Gestión</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </TooltipProvider>
                        </div>
                      </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal Nueva Novedad */}
      <Dialog open={isNewModalOpen} onOpenChange={setIsNewModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleRadicarNovedad}>
            <DialogHeader>
              <DialogTitle className="text-xl font-heading font-bold">
                Radicar Nueva Novedad
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Registra un requerimiento formal emitido por un organismo gubernamental sobre fuentes existentes del catálogo.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              {/* Tipo de Novedad */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tipo-novedad" className="text-xs font-semibold text-foreground">
                  Tipo de novedad <span className="text-destructive">*</span>
                </Label>
                <select
                  id="tipo-novedad"
                  value={newTipo}
                  onChange={e => setNewTipo(e.target.value as TipoNovedad)}
                  className="h-10 text-sm border border-border rounded-lg bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Supresión">Supresión (Desactivación formal de fuente en desuso)</option>
                  <option value="Fusión">Fusión (Consolidación de dos o más fuentes de datos)</option>
                  <option value="Eliminación">Eliminación (Baja formal por revocatoria regulatoria)</option>
                </select>
              </div>

              {/* Organismo Solicitante */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="organismo-solicitante" className="text-xs font-semibold text-foreground">
                  Organismo solicitante <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="organismo-solicitante"
                  placeholder="Ej: Agencia Nacional de Tránsito (ANT)"
                  value={newOrganismo}
                  onChange={e => setNewOrganismo(e.target.value)}
                  className="h-10 text-sm"
                  required
                />
              </div>

              {/* Fuente Afectada */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fuente-afectada" className="text-xs font-semibold text-foreground">
                  Fuente afectada <span className="text-destructive">*</span>
                </Label>
                <select
                  id="fuente-afectada"
                  value={newFuenteId}
                  onChange={e => setNewFuenteId(e.target.value)}
                  className="h-10 text-sm border border-border rounded-lg bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {todasLasFuentes.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.nombre} ({f.codigoServicio}) — {f.institucionNombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Soporte del Requerimiento */}
              <div className="bg-muted/40 border border-border rounded-lg p-3.5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="size-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">
                    Soporte del requerimiento (Oficio formal)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="nro-oficio" className="text-[11px] text-muted-foreground font-medium">
                      Número de oficio / trámite <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="nro-oficio"
                      placeholder="Ej: ANT-DE-2026-0412-O"
                      value={newNroOficio}
                      onChange={e => setNewNroOficio(e.target.value)}
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="fecha-oficio" className="text-[11px] text-muted-foreground font-medium">
                      Fecha del oficio
                    </Label>
                    <Input
                      id="fecha-oficio"
                      type="text"
                      value={newFechaOficio}
                      onChange={e => setNewFechaOficio(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-surface border border-border rounded-md p-2.5">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="text-xs font-mono text-foreground">{newArchivoNombre}</span>
                  </div>
                  <Badge tone="neutral" appearance="outline" size="sm" className="text-[10px]">
                    PDF Oficial
                  </Badge>
                </div>
              </div>

              {/* Anotación de diseño */}
              <div className="bg-muted/30 border border-border/80 rounded-lg p-3 flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Anotación de proceso (HU-INT-16):</strong> Al radicar, el expediente se genera automáticamente en estado <code className="text-foreground font-mono">EN VALIDACIÓN</code> bajo la responsabilidad de la Dirección de Gestión y Registro (DGR).
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => setIsNewModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="default">
                Radicar novedad
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function NovedadesListPage() {
  return (
    <WireframeDashboardLayout
      activeMenu="novedades-catalogo"
      currentRole="DGR"
      currentUser={MOCK_USERS_BY_ROLE.DGR}
      breadcrumbs={[
        { label: "Catálogo de Interoperabilidad", href: "/wireframes2/catalogo-interoperabilidad" },
        { label: "Novedades" }
      ]}
    >
      <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Cargando novedades...</div>}>
        <NovedadesListContent />
      </Suspense>
    </WireframeDashboardLayout>
  );
}
