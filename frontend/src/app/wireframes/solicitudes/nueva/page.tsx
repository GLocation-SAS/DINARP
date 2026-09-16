"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FilePlus2,
  ArrowLeft,
  ArrowRight,
  Building2,
  Database,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Layers,
  Send,
  Info,
  ShieldCheck,
  Check,
} from "lucide-react";

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
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Stepper, Step } from "@/components/ui/stepper";
import { DetailList } from "@/components/ui/detail-list";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";

const FORM_STEPS: Step[] = [
  {
    id: "fuente-servicio",
    title: "Institución y Datos",
    icon: Database,
  },
  {
    id: "proyecto-justificacion",
    title: "Proyecto y Legal",
    icon: FileText,
  },
  {
    id: "revision-envio",
    title: "Revisión y Envío",
    icon: ShieldCheck,
  },
];

function NuevaSolicitudContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Mock preselected fields
  const [institucionFuente] = useState("Registro Civil del Ecuador (DIGERCIC)");
  const [servicioSeleccionado] = useState("Datos de identidad (API REST)");
  const [modalidadIntercambio] = useState("Uno a uno (Tiempo real - API REST)");
  const [frecuenciaEstimada] = useState("Transaccional (~ 5,000 consultas / día)");
  const [nombreProyecto, setNombreProyecto] = useState("Validación biométrica y ciudadana para trámites en línea");
  const [finalidadUso, setFinalidadUso] = useState("Verificación de identidad ciudadana para trámites y emisión de salvoconductos en línea.");
  const [baseLegal, setBaseLegal] = useState("Ley Orgánica del Sistema Nacional de Registro de Datos Públicos (Art. 14, 18).");
  const [terminosAceptados, setTerminosAceptados] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const camposSeleccionadosMock = [
    "Número de identificación",
    "Nombres",
    "Apellidos",
    "Fecha de nacimiento",
  ];

  const handleNextStep = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCompletedSteps((prev) => Array.from(new Set([...prev, currentStep])));
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (index: number) => {
    if (index <= Math.max(...completedSteps, 0) + 1) {
      setCurrentStep(index);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < FORM_STEPS.length - 1) {
      handleNextStep();
    } else {
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <WireframeDashboardLayout activeMenu="solicitudes">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8 max-w-5xl mx-auto">
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
              <BreadcrumbLink asChild>
                <Link href="/wireframes/solicitudes" className="text-muted-foreground hover:text-foreground">
                  Solicitudes
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Nueva solicitud
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header Title & Actions ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80 text-left">
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-foreground">
              Crear Solicitud de Interoperabilidad
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Completa la información requerida para formalizar la petición de acceso a datos institucionales.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/wireframes/solicitudes")}
            className="h-10 px-4 rounded-xl text-xs font-semibold gap-2 border-border shrink-0"
          >
            <ArrowLeft className="size-4" />
            <span>Cancelar</span>
          </Button>
        </div>

        {/* ── 3. Stepper Component ── */}
        <div className="p-5 sm:p-6 rounded-2xl border border-border/70 bg-surface/80 shadow-xs backdrop-blur-sm">
          <Stepper
            steps={FORM_STEPS}
            activeStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
            stepPrefix="Paso"
          />
        </div>

        {/* Alert informativa de datos preseleccionados */}
        {currentStep === 0 && (
          <Alert
            variant="default"
            icon={<Info className="size-4 text-foreground" />}
            title="Datos preseleccionados desde el Catálogo de Fuentes"
            className="text-left"
          >
            Se cargaron automáticamente la institución fuente <strong>Registro Civil</strong>, el servicio <strong>Datos de identidad</strong> y los 4 atributos técnicos preseleccionados.
          </Alert>
        )}

        {/* ── 4. Formulario con Animación por Pasos ── */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {/* ═══ PASO 1: FUENTE Y SERVICIO ═══ */}
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-border bg-surface shadow-xs" innerClassName="p-0 gap-0">
                  <CardHeader className="p-5 sm:p-6 pb-4 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-center text-foreground shrink-0">
                        <Building2 className="size-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-base font-heading font-bold text-foreground">
                          1. Institución Fuente y Servicio
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                          Origen de los datos y modalidad técnica de interoperabilidad.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 sm:p-6 space-y-6 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Institución Fuente (Custodia)</Label>
                        <InputGroup className="bg-muted/30 rounded-xl border-border">
                          <InputGroupInput value={institucionFuente} readOnly className="text-xs font-semibold text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Servicio Seleccionado</Label>
                        <InputGroup className="bg-muted/30 rounded-xl border-border">
                          <InputGroupInput value={servicioSeleccionado} readOnly className="text-xs font-semibold text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Modalidad de Intercambio</Label>
                        <InputGroup className="bg-muted/30 rounded-xl border-border">
                          <InputGroupInput value={modalidadIntercambio} readOnly className="text-xs font-medium text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Frecuencia Estimada</Label>
                        <InputGroup className="bg-muted/30 rounded-xl border-border">
                          <InputGroupInput value={frecuenciaEstimada} readOnly className="text-xs font-medium text-foreground" />
                        </InputGroup>
                      </div>
                    </div>

                    {/* Badges de Campos Preseleccionados */}
                    <div className="space-y-2.5 pt-3 border-t border-border/50 text-left">
                      <Label className="text-xs font-semibold text-foreground block">
                        Campos y Atributos Preseleccionados ({camposSeleccionadosMock.length})
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {camposSeleccionadosMock.map((campo, idx) => (
                          <Badge
                            key={idx}
                            tone="neutral"
                            appearance="outline"
                            size="md"
                            className="text-xs font-mono bg-background text-left"
                          >
                            {campo}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 sm:p-6 border-t border-border/60 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/wireframes/catalogo-fuentes/registro-civil/datos-identidad")}
                      className="h-10 px-4 rounded-xl text-xs font-semibold"
                    >
                      Volver al catálogo
                    </Button>

                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleNextStep}
                      className="h-10 px-5 rounded-xl text-xs font-semibold gap-2 shadow-xs cursor-pointer"
                    >
                      <span>Siguiente paso</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* ═══ PASO 2: PROYECTO Y JUSTIFICACIÓN LEGAL ═══ */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-border bg-surface shadow-xs" innerClassName="p-0 gap-0">
                  <CardHeader className="p-5 sm:p-6 pb-4 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-center text-foreground shrink-0">
                        <FileText className="size-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-base font-heading font-bold text-foreground">
                          2. Información del Proyecto y Justificación Legal
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                          Finalidad institucional y sustento normativo del tratamiento de los datos.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 sm:p-6 space-y-5 text-left">
                    <div className="space-y-1.5">
                      <Label htmlFor="proyecto" className="text-xs font-semibold text-foreground">
                        Nombre del Proyecto / Sistema Institucional *
                      </Label>
                      <InputGroup className="bg-surface rounded-xl border-border">
                        <InputGroupInput
                          id="proyecto"
                          value={nombreProyecto}
                          onChange={(e) => setNombreProyecto(e.target.value)}
                          placeholder="Ej: Sistema Nacional de Identificación..."
                          className="text-xs sm:text-sm font-medium"
                          required
                        />
                      </InputGroup>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="finalidad" className="text-xs font-semibold text-foreground">
                        Finalidad del Uso de los Datos *
                      </Label>
                      <textarea
                        id="finalidad"
                        rows={3}
                        value={finalidadUso}
                        onChange={(e) => setFinalidadUso(e.target.value)}
                        placeholder="Describe el propósito institucional del consumo..."
                        className="w-full rounded-xl border border-border bg-background p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 leading-relaxed"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="baseLegal" className="text-xs font-semibold text-foreground">
                        Base Legal y Marco Regulatorio *
                      </Label>
                      <InputGroup className="bg-surface rounded-xl border-border">
                        <InputGroupInput
                          id="baseLegal"
                          value={baseLegal}
                          onChange={(e) => setBaseLegal(e.target.value)}
                          placeholder="Ej: Ley Orgánica del SINARDAP..."
                          className="text-xs sm:text-sm font-medium"
                          required
                        />
                      </InputGroup>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <Label className="text-xs font-semibold text-foreground">Documentos de Respaldo (TDRs, Acuerdos)</Label>
                      <div className="p-6 rounded-2xl border-2 border-dashed border-border/80 bg-muted/10 text-center space-y-2">
                        <Upload className="size-6 text-muted-foreground mx-auto" />
                        <p className="text-xs font-medium text-foreground">
                          Arrastra aquí los términos de referencia o acuerdos de confidencialidad
                        </p>
                        <p className="text-[11px] text-muted-foreground">Archivos PDF hasta 10 MB</p>
                        <Button type="button" variant="outline" size="sm" className="h-8 text-xs font-semibold">
                          Explorar archivos
                        </Button>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 sm:p-6 border-t border-border/60 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      className="h-10 px-4 rounded-xl text-xs font-semibold gap-2"
                    >
                      <ArrowLeft className="size-4" />
                      <span>Anterior</span>
                    </Button>

                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleNextStep}
                      className="h-10 px-5 rounded-xl text-xs font-semibold gap-2 shadow-xs cursor-pointer"
                    >
                      <span>Siguiente paso</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* ═══ PASO 3: REVISIÓN Y ENVÍO ═══ */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card className="border-border bg-surface shadow-xs" innerClassName="p-0 gap-0">
                  <CardHeader className="p-5 sm:p-6 pb-4 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-center text-foreground shrink-0">
                        <ShieldCheck className="size-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-base font-heading font-bold text-foreground">
                          3. Resumen y Confirmación de Solicitud
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                          Verifica todos los datos antes de formalizar la emisión del trámite.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 sm:p-6 space-y-6 text-left">
                    <DetailList
                      columns={2}
                      items={[
                        {
                          label: "Institución Custodia",
                          value: <span className="font-semibold text-foreground">{institucionFuente}</span>,
                        },
                        {
                          label: "Servicio Seleccionado",
                          value: <span className="font-semibold text-foreground">{servicioSeleccionado}</span>,
                        },
                        {
                          label: "Modalidad de Intercambio",
                          value: modalidadIntercambio,
                        },
                        {
                          label: "Frecuencia Estimada",
                          value: frecuenciaEstimada,
                        },
                        {
                          label: "Proyecto Asociado",
                          colSpan: 2,
                          value: <span className="font-medium text-foreground">{nombreProyecto}</span>,
                        },
                        {
                          label: "Finalidad del Tratamiento",
                          colSpan: 2,
                          value: <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">{finalidadUso}</p>,
                        },
                        {
                          label: "Base Legal",
                          colSpan: 2,
                          value: <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{baseLegal}</p>,
                        },
                      ]}
                    />

                    {/* Badges de Campos */}
                    <div className="space-y-2 pt-3 border-t border-border/50 text-left">
                      <Label className="text-xs font-semibold text-foreground block">
                        Atributos que se consumirán ({camposSeleccionadosMock.length})
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {camposSeleccionadosMock.map((campo, idx) => (
                          <Badge
                            key={idx}
                            tone="neutral"
                            appearance="outline"
                            size="md"
                            className="text-xs font-mono bg-background"
                          >
                            {campo}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Declaración y Términos */}
                    <div className="p-4 rounded-xl bg-muted/20 border border-border/70 flex items-start gap-3 pt-3 text-left">
                      <Checkbox
                        id="terminos"
                        checked={terminosAceptados}
                        onCheckedChange={(checked) => setTerminosAceptados(!!checked)}
                        className="mt-0.5"
                      />
                      <label htmlFor="terminos" className="text-xs text-foreground/80 leading-relaxed cursor-pointer select-none">
                        Declaro que la información solicitada será utilizada exclusivamente para el ejercicio de las competencias institucionales de acuerdo con la <strong>Ley Orgánica de Protección de Datos Personales</strong> y <strong>Ley de Registro de Datos Públicos</strong>.
                      </label>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 sm:p-6 border-t border-border/60 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      className="h-10 px-4 rounded-xl text-xs font-semibold gap-2"
                    >
                      <ArrowLeft className="size-4" />
                      <span>Anterior</span>
                    </Button>

                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!terminosAceptados}
                      className="h-10 px-6 rounded-xl text-xs font-semibold gap-2 shadow-xs cursor-pointer"
                    >
                      <Send className="size-4" />
                      <span>Enviar solicitud</span>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Modal de Éxito al Enviar */}
        <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
          <DialogContent className="max-w-[460px] rounded-3xl p-6 sm:p-8 bg-surface border-border shadow-2xl text-center">
            <div className="size-14 rounded-2xl bg-muted/60 flex items-center justify-center text-foreground mb-3 mx-auto">
              <CheckCircle2 className="size-7 stroke-[2]" />
            </div>

            <DialogHeader className="text-center space-y-2">
              <DialogTitle className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                ¡Solicitud Registrada con Éxito!
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Se ha generado el radicado <strong>SOL-2025-0025</strong> para tu solicitud de interoperabilidad con el <strong>Registro Civil</strong>.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2.5 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/wireframes/solicitudes")}
                className="w-full h-11 rounded-xl text-xs font-semibold"
              >
                Ir a Mis Solicitudes
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => router.push("/wireframes/solicitudes/detalle")}
                className="w-full h-11 rounded-xl text-xs font-semibold"
              >
                Ver Detalle de Solicitud
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </WireframeDashboardLayout>
  );
}

export default function WireframeNuevaSolicitudPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-muted-foreground">Cargando formulario...</div>}>
      <NuevaSolicitudContent />
    </Suspense>
  );
}

