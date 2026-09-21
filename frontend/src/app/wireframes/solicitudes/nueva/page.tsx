"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Database,
  FileText,
  ShieldCheck,
  Plus,
  Trash2,
  Info,
  CheckCircle2,
  Layers,
  Save,
  Send,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Stepper, Step } from "@/components/ui/stepper";
import { Multiselect } from "@/components/ui/multiselect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";
import {
  CATALOGO_EJEMPLO,
  ENTIDADES_SOLICITANTES_CATALOGO,
  saveStoredProject,
  getProjectById,
  type FuenteSolicitada,
  type ProyectoInteroperabilidad,
} from "../proyectos-store";

const WIZARD_STEPS: Step[] = [
  {
    id: "proyecto",
    title: "Proyecto",
    icon: FileText,
  },
  {
    id: "fuentes-campos",
    title: "Información requerida",
    icon: Database,
  },
  {
    id: "justificacion",
    title: "Justificación y condiciones",
    icon: Info,
  },
  {
    id: "revision",
    title: "Revisar y enviar",
    icon: ShieldCheck,
  },
];

function CrearProyectoWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [currentStep, setCurrentStep] = useState(0);

  // Paso 1: Proyecto
  const [nombreProyecto, setNombreProyecto] = useState("Validación ciudadana para trámites y servicios en línea");
  const [entidadesSolicitantes, setEntidadesSolicitantes] = useState<string[]>(["mintel"]);
  const [objetivoProyecto, setObjetivoProyecto] = useState(
    "Verificación ágil de la identidad de los solicitantes y consulta de su estado tributario para la emisión simplificada de salvoconductos y trámites digitales."
  );
  const [responsableContacto, setResponsableContacto] = useState("Ing. Carlos Mendoza - Director de TIC (carlos.mendoza@mintel.gob.ec)");

  // Paso 2: Fuentes e Información requerida (Multi-fuente) - Vacío por defecto
  const [fuentesSeleccionadas, setFuentesSeleccionadas] = useState<FuenteSolicitada[]>([]);

  // Modal guiado de selección de fuente y campos
  const [isFuenteModalOpen, setIsFuenteModalOpen] = useState(false);
  const [editingFuenteId, setEditingFuenteId] = useState<string | null>(null);
  const [selectedInstId, setSelectedInstId] = useState<string>("");
  const [selectedServId, setSelectedServId] = useState<string>("");
  const [selectedCampos, setSelectedCampos] = useState<string[]>([]);

  // Paso 3: Justificación
  const [justificacionUso, setJustificacionUso] = useState("");

  // Cargar borrador existente si viene por URL
  useEffect(() => {
    if (editId) {
      const p = getProjectById(editId);
      if (p) {
        setNombreProyecto(p.nombre);
        if (p.entidadesSolicitantes && p.entidadesSolicitantes.length > 0) {
          setEntidadesSolicitantes(p.entidadesSolicitantes);
        } else if (p.entidadSolicitante) {
          const found = ENTIDADES_SOLICITANTES_CATALOGO.filter(
            (e) =>
              p.entidadSolicitante.toLowerCase().includes(e.value) ||
              p.entidadSolicitante.includes(e.label)
          );
          if (found.length > 0) {
            setEntidadesSolicitantes(found.map((f) => f.value));
          } else {
            setEntidadesSolicitantes(["mintel"]);
          }
        }
        setObjetivoProyecto(p.objetivo);
        setResponsableContacto(p.responsable);
        setFuentesSeleccionadas(p.fuentes || []);
        setJustificacionUso(p.justificacion || "");
      }
    }
  }, [editId]);

  // Manejo guiado de fuentes en Paso 2
  const handleOpenAddFuente = () => {
    setEditingFuenteId(null);
    setSelectedInstId("");
    setSelectedServId("");
    setSelectedCampos([]);
    setIsFuenteModalOpen(true);
  };

  const handleOpenEditFuente = (fuente: FuenteSolicitada) => {
    setEditingFuenteId(fuente.id);
    setSelectedInstId(fuente.institucionId);
    setSelectedServId(fuente.servicioId);
    setSelectedCampos([...fuente.campos]);
    setIsFuenteModalOpen(true);
  };

  const handleSelectInstitution = (instId: string) => {
    setSelectedInstId(instId);
    const inst = CATALOGO_EJEMPLO.find((i) => i.id === instId);
    if (inst && inst.servicios.length > 0) {
      setSelectedServId(inst.servicios[0].id);
    } else {
      setSelectedServId("");
    }
    setSelectedCampos([]);
  };

  const handleSelectService = (servId: string) => {
    setSelectedServId(servId);
    setSelectedCampos([]);
  };

  const handleToggleModalCampo = (campoNombre: string) => {
    setSelectedCampos((prev) =>
      prev.includes(campoNombre)
        ? prev.filter((c) => c !== campoNombre)
        : [...prev, campoNombre]
    );
  };

  const handleSaveFuente = () => {
    const inst = CATALOGO_EJEMPLO.find((i) => i.id === selectedInstId);
    if (!inst) return;
    const serv = inst.servicios.find((s) => s.id === selectedServId);
    if (!serv) return;

    if (editingFuenteId) {
      setFuentesSeleccionadas((prev) =>
        prev.map((f) =>
          f.id === editingFuenteId
            ? {
                ...f,
                institucionId: inst.id,
                institucionNombre: `${inst.nombre} (${inst.siglas})`,
                servicioId: serv.id,
                servicioNombre: serv.nombre,
                campos: selectedCampos,
              }
            : f
        )
      );
      toast.success("Fuente actualizada correctamente");
    } else {
      const nueva: FuenteSolicitada = {
        id: `fuente-${Date.now()}`,
        institucionId: inst.id,
        institucionNombre: `${inst.nombre} (${inst.siglas})`,
        servicioId: serv.id,
        servicioNombre: serv.nombre,
        campos: selectedCampos,
      };
      setFuentesSeleccionadas((prev) => [...prev, nueva]);
      toast.success(`Fuente agregada: ${inst.siglas}`);
    }

    setIsFuenteModalOpen(false);
  };

  const handleRemoveFuente = (fuenteId: string) => {
    setFuentesSeleccionadas((prev) => prev.filter((f) => f.id !== fuenteId));
    toast.info("Fuente eliminada del proyecto");
  };

  // Guardar / Enviar
  const handleFinalizar = (estado: "Borrador" | "En revisión") => {
    const codigoGenerado = editId
      ? editId
      : `PRJ-2026-00${Math.floor(Math.random() * 89) + 10}`;

    const fechaHoy = new Date().toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const formatEntidadLabel = () => {
      if (entidadesSolicitantes.length === 0) return "Ministerio de Telecomunicaciones y Sociedad de la Información (MINTEL)";
      return entidadesSolicitantes
        .map((val) => ENTIDADES_SOLICITANTES_CATALOGO.find((e) => e.value === val)?.label || val)
        .join(", ");
    };

    const nuevoProyecto: ProyectoInteroperabilidad = {
      id: codigoGenerado,
      codigo: codigoGenerado,
      nombre: nombreProyecto.trim() || "Proyecto sin título",
      entidadSolicitante: formatEntidadLabel(),
      entidadesSolicitantes: entidadesSolicitantes,
      objetivo: objetivoProyecto.trim() || "Sin descripción de objetivo",
      responsable: responsableContacto.trim() || "Por definir en taller",
      justificacion: justificacionUso.trim(),
      fuentes: fuentesSeleccionadas,
      estado,
      ultimaActualizacion: fechaHoy,
      fechaCreacion: fechaHoy,
      historial: [
        {
          id: "hist-1",
          etapa: estado === "Borrador" ? "Borrador registrado" : "Enviado a revisión",
          fecha: fechaHoy,
          responsable: responsableContacto.split("-")[0].trim() || "Usuario Solicitante",
          entidad: entidadesSolicitantes.map(v => ENTIDADES_SOLICITANTES_CATALOGO.find(e => e.value === v)?.label.split("(")[0].trim() || v).join(", ") || "MINTEL",
          descripcion:
            estado === "Borrador"
              ? "Se guardó el borrador del proyecto de interoperabilidad con fuentes y campos definidos."
              : "Se envió el proyecto a DINARP para evaluación de viabilidad y autorizaciones con instituciones fuente.",
          completado: true,
        },
      ],
    };

    saveStoredProject(nuevoProyecto);

    if (estado === "Borrador") {
      toast.success("Borrador guardado exitosamente");
    } else {
      toast.success("Proyecto enviado para revisión institucional");
    }

    router.push("/wireframes/solicitudes");
  };

  return (
    <WireframeDashboardLayout activeMenu="solicitudes">
      <div className="flex-1 flex flex-col min-w-0 bg-background text-foreground pb-12">
        {/* ── Breadcrumb & Encabezado ── */}
        <div className="border-b border-border bg-surface/50 px-6 sm:px-8 py-5">
          <Breadcrumb className="mb-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/wireframes/dashboard">Inicio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/wireframes/solicitudes">Proyectos de interoperabilidad</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>Crear proyecto</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Crear proyecto de interoperabilidad
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
                Define la información requerida, selecciona las instituciones fuentes y estructura tu solicitud de intercambio.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="self-start sm:self-auto gap-2 border-border"
            >
              <Link href="/wireframes/solicitudes">
                <ArrowLeft className="size-4" />
                Volver a proyectos
              </Link>
            </Button>
          </div>
        </div>

        {/* ── Stepper Superior de 4 Pasos ── */}
        <div className="px-6 sm:px-8 pt-6 pb-2 w-full">
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs">
            <Stepper
              steps={WIZARD_STEPS}
              activeStep={currentStep}
              onStepClick={(stepIndex) => {
                if (stepIndex <= currentStep) setCurrentStep(stepIndex);
              }}
            />
          </div>
        </div>

        {/* ── Contenedor Principal de Formularios ── */}
        <div className="px-6 sm:px-8 py-6 w-full">
          <AnimatePresence mode="wait">
            {/* ══════════════════════════════════════════════════════════
                PASO 1: PROYECTO
               ══════════════════════════════════════════════════════════ */}
            {currentStep === 0 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold">1. Datos generales del proyecto</CardTitle>
                    <CardDescription>
                      Identifica la iniciativa o trámite para el cual requieres consumir información pública.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Nombre del Proyecto */}
                    <div className="space-y-2 text-left">
                      <Label htmlFor="nombre-proyecto" className="text-sm font-semibold">
                        Nombre del proyecto
                      </Label>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          id="nombre-proyecto"
                          value={nombreProyecto}
                          onChange={(e) => setNombreProyecto(e.target.value)}
                          placeholder="Ej. Validación biométrica y ciudadana para trámites en línea"
                        />
                      </InputGroup>
                    </div>

                    {/* Entidades Solicitantes (Multi-selección) */}
                    <div className="space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="entidades-solicitantes" className="text-sm font-semibold">
                          Entidades solicitantes
                        </Label>
                        <Badge appearance="outline" tone="neutral" className="text-[11px] font-normal border-border text-muted-foreground">
                          {entidadesSolicitantes.length} seleccionada{entidadesSolicitantes.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>

                      <Multiselect
                        options={ENTIDADES_SOLICITANTES_CATALOGO}
                        selected={entidadesSolicitantes}
                        onChange={(selected) => {
                          setEntidadesSolicitantes(selected);
                        }}
                        placeholder="Seleccionar una o varias entidades solicitantes..."
                        searchPlaceholder="Buscar institución pública..."
                        emptyText="No se encontró la institución."
                        className="w-full bg-background"
                      />

                      <p className="text-xs text-muted-foreground">
                        Puedes seleccionar múltiples instituciones participantes que requieren utilizar los datos en este proyecto.
                      </p>
                    </div>

                    {/* Objetivo del Proyecto */}
                    <div className="space-y-2 text-left">
                      <Label htmlFor="objetivo-proyecto" className="text-sm font-semibold">
                        Descripción breve del objetivo
                      </Label>
                      <textarea
                        id="objetivo-proyecto"
                        rows={3}
                        value={objetivoProyecto}
                        onChange={(e) => setObjetivoProyecto(e.target.value)}
                        placeholder="Describe el propósito del proyecto y en qué trámites o sistemas se utilizará..."
                        className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                      />
                    </div>

                    {/* Responsable o contacto propuesto */}
                    <div className="space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="responsable" className="text-sm font-semibold">
                          Responsable o contacto institucional
                        </Label>
                        <Badge appearance="outline" tone="neutral" className="text-[11px] font-normal border-border text-muted-foreground">
                          Dato propuesto para validar
                        </Badge>
                      </div>
                      <InputGroup className="bg-background">
                        <InputGroupInput
                          id="responsable"
                          value={responsableContacto}
                          onChange={(e) => setResponsableContacto(e.target.value)}
                          placeholder="Ej. Ing. Carlos Mendoza - Director de TIC (correo@entidad.gob.ec)"
                        />
                      </InputGroup>
                      <p className="text-xs text-muted-foreground">
                        Punto focal institucional para coordinaciones técnicas y administrativas.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex w-full !justify-end pt-4 border-t border-border">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="gap-2 ml-auto"
                      disabled={!nombreProyecto.trim()}
                    >
                      Continuar
                      <ArrowRight className="size-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════
                PASO 2: INFORMACIÓN REQUERIDA (MULTI-FUENTE)
               ══════════════════════════════════════════════════════════ */}
            {currentStep === 1 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Encabezado del paso */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border shadow-xs">
                  <div className="space-y-1 max-w-2xl">
                    <h2 className="text-lg font-bold text-foreground">2. Fuentes y campos solicitados</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Selecciona la institución que tiene los datos que necesitas y luego elige los campos que deseas solicitar.
                    </p>
                  </div>

                  {fuentesSeleccionadas.length > 0 && (
                    <Button
                      type="button"
                      onClick={handleOpenAddFuente}
                      className="gap-2 font-semibold shadow-xs shrink-0"
                    >
                      <Plus className="size-4" />
                      <span>Agregar fuente</span>
                    </Button>
                  )}
                </div>

                {/* Nota discreta de prototipo */}
                <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-xl border border-border/80 text-xs text-muted-foreground">
                  <Info className="size-4 shrink-0" />
                  <span>
                    <strong>Nota:</strong> Los nombres disponibles en los selectores son <em>datos de ejemplo del prototipo</em> para demostrar el flujo de solicitud.
                  </span>
                </div>

                {/* Estado Vacío o Lista de Fuentes Seleccionadas */}
                {fuentesSeleccionadas.length === 0 ? (
                  <div className="py-14 px-6 text-center border border-dashed border-border rounded-2xl bg-muted/20 max-w-xl mx-auto space-y-4">
                    <div className="size-14 rounded-3xl bg-muted/60 border border-border flex items-center justify-center text-foreground mx-auto shadow-xs">
                      <Database className="size-7 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-foreground">
                        No has agregado fuentes aún
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Selecciona la institución que tiene los datos que necesitas y luego elige los campos que deseas solicitar.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={handleOpenAddFuente}
                      className="gap-2 font-semibold shadow-sm h-11 px-5"
                    >
                      <Plus className="size-4" />
                      <span>Agregar fuente</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {fuentesSeleccionadas.map((fuente, index) => (
                      <Card key={fuente.id} className="border-border bg-card shadow-xs overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4 border-b border-border/60">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="size-8 rounded-xl bg-muted border border-border flex items-center justify-center font-bold text-xs">
                                {index + 1}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-sm text-foreground">{fuente.institucionNombre}</h3>
                                  <Badge appearance="outline" tone="neutral" className="text-[10px] font-normal border-border py-0">
                                    Fuente solicitada
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Servicio: <strong className="text-foreground">{fuente.servicioNombre}</strong>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEditFuente(fuente)}
                                className="text-xs h-8 px-2.5 text-muted-foreground hover:text-foreground"
                              >
                                Editar selección
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFuente(fuente.id)}
                                className="text-xs h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                              >
                                <Trash2 className="size-3.5" />
                                Quitar
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-semibold text-foreground">
                              Campos solicitados ({fuente.campos.length}):
                            </Label>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {fuente.campos.map((campo, i) => (
                              <Badge
                                key={i}
                                appearance="outline"
                                tone="neutral"
                                className="bg-background text-foreground border-border text-xs font-normal py-0.5 px-2.5"
                              >
                                {campo}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <div className="flex justify-center pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleOpenAddFuente}
                        className="gap-2 border-dashed border-border"
                      >
                        <Plus className="size-4" />
                        <span>Agregar otra fuente al proyecto</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Pie de navegación */}
                <div className="flex justify-between items-center w-full pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(0)}
                    className="gap-2"
                  >
                    <ArrowLeft className="size-4" />
                    Anterior
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="gap-2 ml-auto"
                    disabled={fuentesSeleccionadas.length === 0}
                  >
                    Continuar
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════
                PASO 3: JUSTIFICACIÓN Y CONDICIONES
               ══════════════════════════════════════════════════════════ */}
            {currentStep === 2 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold">3. Justificación y condiciones del uso</CardTitle>
                      <Badge appearance="outline" tone="neutral" className="text-xs font-normal border-border text-muted-foreground">
                        Punto de conversación para el taller
                      </Badge>
                    </div>
                    <CardDescription>
                      Espacio para documentar la finalidad del intercambio y acuerdos entre instituciones.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Campo de Finalidad (Opcional) */}
                    <div className="space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="justificacion-uso" className="text-sm font-semibold">
                          ¿Para qué se utilizarán los datos?
                        </Label>
                        <span className="text-xs text-muted-foreground font-medium">
                          Opcional en este prototipo
                        </span>
                      </div>
                      <textarea
                        id="justificacion-uso"
                        rows={4}
                        value={justificacionUso}
                        onChange={(e) => setJustificacionUso(e.target.value)}
                        placeholder="Explica brevemente la finalidad de uso de la información..."
                        className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                      />
                    </div>

                    {/* Nota Discreta del Taller */}
                    <div className="p-4 bg-muted/40 rounded-xl border border-border/70 flex items-start gap-3 text-xs text-muted-foreground">
                      <Info className="size-4 shrink-0 mt-0.5 text-foreground" />
                      <div>
                        <p className="font-semibold text-foreground">Definición durante el taller:</p>
                        <p className="mt-0.5">
                          Los requisitos, documentos de respaldo necesarios y condiciones legales se definirán formalmente con DINARP y las instituciones participantes durante la sesión de trabajo.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center w-full pt-4 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="gap-2"
                    >
                      <ArrowLeft className="size-4" />
                      Anterior
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="gap-2 ml-auto"
                    >
                      Continuar
                      <ArrowRight className="size-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════
                PASO 4: REVISAR Y ENVIAR
               ══════════════════════════════════════════════════════════ */}
            {currentStep === 3 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader className="pb-4 border-b border-border">
                    <CardTitle className="text-lg font-bold">4. Resumen del proyecto antes de guardar o enviar</CardTitle>
                    <CardDescription>
                      Verifica la información registrada. Puedes volver a editar cualquier paso si lo requieres.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Resumen Paso 1 */}
                    <div className="space-y-3 pb-5 border-b border-border/60">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Datos Generales
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep(0)}
                          className="text-xs h-7 px-2"
                        >
                          Editar
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-muted-foreground">Nombre del proyecto:</p>
                          <p className="font-semibold text-foreground text-sm mt-0.5">{nombreProyecto}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Entidades solicitantes:</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {entidadesSolicitantes.length === 0 ? (
                              <span className="font-semibold text-foreground text-sm">Ninguna seleccionada</span>
                            ) : (
                              entidadesSolicitantes.map((val) => {
                                const label = ENTIDADES_SOLICITANTES_CATALOGO.find((e) => e.value === val)?.label || val;
                                return (
                                  <Badge key={val} appearance="outline" tone="neutral" className="border-border bg-muted/40 text-xs py-0.5 px-2 font-medium">
                                    {label.split("(")[0].trim()}
                                  </Badge>
                                );
                              })
                            )}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-muted-foreground">Objetivo:</p>
                          <p className="font-medium text-foreground mt-0.5">{objetivoProyecto}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-muted-foreground">Responsable / Contacto:</p>
                          <p className="font-medium text-foreground mt-0.5">{responsableContacto}</p>
                        </div>
                      </div>
                    </div>

                    {/* Resumen Paso 2: Fuentes y Campos */}
                    <div className="space-y-3 pb-5 border-b border-border/60">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Fuentes y Campos Solicitados ({fuentesSeleccionadas.length})
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep(1)}
                          className="text-xs h-7 px-2"
                        >
                          Editar
                        </Button>
                      </div>

                      {fuentesSeleccionadas.length === 0 ? (
                        <div className="p-6 text-center border border-dashed border-border rounded-xl bg-muted/20 space-y-2">
                          <Database className="size-6 text-muted-foreground mx-auto mb-1 opacity-60" />
                          <p className="text-sm font-semibold text-foreground">
                            Todavía no has agregado datos para solicitar
                          </p>
                          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            Regresa al paso 2 para elegir las instituciones fuentes y los campos requeridos.
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentStep(1)}
                            className="text-xs gap-1.5 mt-2"
                          >
                            <Plus className="size-3.5" />
                            <span>Agregar fuentes y campos</span>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {fuentesSeleccionadas.map((fuente) => (
                            <div
                              key={fuente.id}
                              className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 text-xs"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <span className="font-bold text-foreground text-sm">{fuente.institucionNombre}</span>
                                <span className="text-muted-foreground">Servicio: {fuente.servicioNombre}</span>
                              </div>

                              <div className="pt-2">
                                <p className="text-muted-foreground mb-1.5 font-medium">Campos solicitados ({fuente.campos.length}):</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {fuente.campos.map((campo, i) => (
                                    <Badge
                                      key={i}
                                      appearance="outline"
                                      tone="neutral"
                                      className="bg-background text-foreground border-border text-[11px] font-normal"
                                    >
                                      {campo}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Resumen Paso 3: Justificación (si existe) */}
                    {justificacionUso && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Justificación de Uso
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentStep(2)}
                            className="text-xs h-7 px-2"
                          >
                            Editar
                          </Button>
                        </div>
                        <p className="text-xs text-foreground bg-muted/20 p-3 rounded-xl border border-border/50">
                          {justificacionUso}
                        </p>
                      </div>
                    )}
                  </CardContent>

                  {/* Acciones Finales: Guardar Borrador y Enviar para Revisión */}
                  <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="w-full sm:w-auto gap-2"
                    >
                      <ArrowLeft className="size-4" />
                      Anterior
                    </Button>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto ml-auto justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleFinalizar("Borrador")}
                        className="flex-1 sm:flex-none gap-2 border-border"
                      >
                        <Save className="size-4" />
                        Guardar borrador
                      </Button>

                      <Button
                        type="button"
                        onClick={() => handleFinalizar("En revisión")}
                        className="flex-1 sm:flex-none gap-2 font-semibold"
                      >
                        <Send className="size-4" />
                        Enviar para revisión
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          MODAL GUIADO: AGREGAR / EDITAR FUENTE (1 -> 2 -> 3)
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={isFuenteModalOpen} onOpenChange={setIsFuenteModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingFuenteId ? "Editar fuente y campos" : "Agregar institución fuente"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Selecciona la institución que tiene los datos que necesitas y luego elige los campos que deseas solicitar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* ── 1. Elegir la institución fuente ── */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  1. Institución fuente
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  Ejemplos del prototipo
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CATALOGO_EJEMPLO.map((inst) => {
                  const isSelected = selectedInstId === inst.id;
                  return (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() => handleSelectInstitution(inst.id)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-foreground bg-muted/80 shadow-xs ring-1 ring-foreground/20"
                          : "border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs text-foreground">{inst.siglas}</span>
                        {isSelected && <CheckCircle2 className="size-4 text-foreground" />}
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                        {inst.nombre}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 2. Elegir el servicio o conjunto de datos disponible ── */}
            {selectedInstId && (
              <div className="space-y-2 pt-3 border-t border-border/60">
                <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  2. Servicio o conjunto de datos
                </Label>
                {(() => {
                  const currentInst = CATALOGO_EJEMPLO.find((i) => i.id === selectedInstId);
                  return (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {currentInst?.servicios.map((serv) => {
                          const isSelected = selectedServId === serv.id;
                          return (
                            <Button
                              key={serv.id}
                              type="button"
                              variant={isSelected ? "neutral" : "outline"}
                              size="sm"
                              onClick={() => handleSelectService(serv.id)}
                              className="text-xs h-8 rounded-xl"
                            >
                              {serv.nombre}
                            </Button>
                          );
                        })}
                      </div>
                      {(() => {
                        const currServ = currentInst?.servicios.find((s) => s.id === selectedServId);
                        if (currServ?.descripcion) {
                          return (
                            <p className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/50">
                              {currServ.descripcion}
                            </p>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ── 3. Marcar explícitamente los campos que se quieren solicitar ── */}
            {selectedServId && (
              <div className="space-y-2.5 pt-3 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    3. Campos específicos a solicitar
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    {selectedCampos.length} seleccionados
                  </span>
                </div>

                {(() => {
                  const currentInst = CATALOGO_EJEMPLO.find((i) => i.id === selectedInstId);
                  const currServ = currentInst?.servicios.find((s) => s.id === selectedServId);
                  const camposDisponibles = currServ?.camposDisponibles || [];

                  return (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {camposDisponibles.map((campo) => {
                          const isChecked = selectedCampos.includes(campo.nombre);
                          return (
                            <label
                              key={campo.id}
                              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                                isChecked
                                  ? "bg-muted/80 border-foreground/30 font-medium text-foreground"
                                  : "bg-background border-border text-muted-foreground hover:border-foreground/20"
                              }`}
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => handleToggleModalCampo(campo.nombre)}
                              />
                              <span className="truncate">{campo.nombre}</span>
                            </label>
                          );
                        })}
                      </div>
                      {selectedCampos.length === 0 && (
                        <p className="text-[11px] text-muted-foreground italic pt-1">
                          Marca las casillas de los campos que deseas solicitar en tu proyecto.
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between items-center w-full pt-4 border-t border-border gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFuenteModalOpen(false)}
              className="text-xs"
            >
              Cancelar
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleSaveFuente}
              disabled={!selectedInstId || !selectedServId || selectedCampos.length === 0}
              className="text-xs font-semibold gap-1.5 ml-auto"
            >
              <CheckCircle2 className="size-3.5" />
              <span>{editingFuenteId ? "Guardar cambios" : "Agregar fuente al proyecto"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WireframeDashboardLayout>
  );
}

export default function NuevaSolicitudPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Cargando asistente...</div>}>
      <CrearProyectoWizard />
    </Suspense>
  );
}
