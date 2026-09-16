"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";

function NuevaSolicitudContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fuenteParam = searchParams.get("fuente") || "registro-civil";
  const servicioParam = searchParams.get("servicio") || "datos-identidad";

  // Mock preselected fields
  const [institucionFuente] = useState("Registro Civil del Ecuador (DIGERCIC)");
  const [servicioSeleccionado] = useState("Datos de identidad (API REST)");
  const [nombreProyecto, setNombreProyecto] = useState("Validación biométrica y ciudadana para trámites en línea");
  const [finalidadUso, setFinalidadUso] = useState("Verificación de identidad ciudadana para trámites y emisión de salvoconductos en línea.");
  const [terminosAceptados, setTerminosAceptados] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const camposSeleccionadosMock = [
    "Número de identificación",
    "Nombres",
    "Apellidos",
    "Fecha de nacimiento",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccessModalOpen(true);
  };

  return (
    <WireframeDashboardLayout activeMenu="solicitudes">
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

        {/* ── 2. Header Title & Description ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
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

        {/* Alert informativa de datos preseleccionados */}
        <Alert
          variant="default"
          icon={<Info className="size-4 text-foreground" />}
          title="Datos preseleccionados desde el Catálogo de Fuentes"
        >
          Se cargaron automáticamente la institución fuente <strong>Registro Civil</strong>, el servicio <strong>Datos de identidad</strong> y los campos seleccionados en el catálogo.
        </Alert>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Institución Fuente y Servicio Preseleccionado */}
          <Card className="border-border bg-surface shadow-xs">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />
                <span>1. Institución Fuente y Servicio</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Origen de los datos y modalidad de interoperabilidad.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Institución Fuente</Label>
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
              </div>

              {/* Badges de Campos Preseleccionados */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs font-semibold text-foreground">
                  Campos y Atributos Preseleccionados ({camposSeleccionadosMock.length})
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
            </CardContent>
          </Card>

          {/* Card 2: Proyecto y Finalidad Legal */}
          <Card className="border-border bg-surface shadow-xs">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <span>2. Información del Proyecto y Justificación Legal</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Finalidad institucional del tratamiento de los datos.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4 text-left">
              <div className="space-y-1.5">
                <Label htmlFor="proyecto" className="text-xs font-semibold text-foreground">
                  Nombre del Proyecto / Sistema Institucional *
                </Label>
                <InputGroup className="bg-surface rounded-xl border-border">
                  <InputGroupInput
                    id="proyecto"
                    value={nombreProyecto}
                    onChange={(e) => setNombreProyecto(e.target.value)}
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
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  required
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <Label className="text-xs font-semibold text-foreground">Documentos de Respaldo</Label>
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

              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="terminos"
                  checked={terminosAceptados}
                  onCheckedChange={(checked) => setTerminosAceptados(!!checked)}
                />
                <label htmlFor="terminos" className="text-xs text-muted-foreground leading-snug cursor-pointer">
                  Declaro que la información solicitada será utilizada exclusivamente para el ejercicio de las competencias institucionales de acuerdo con la Ley Orgánica de Protección de Datos Personales y Ley de Registro de Datos Públicos.
                </label>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-2 border-t border-border/60 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/wireframes/catalogo-fuentes/registro-civil/datos-identidad")}
                className="h-10 px-4 rounded-xl text-xs font-semibold"
              >
                Volver al catálogo
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={!terminosAceptados}
                className="h-10 px-6 rounded-xl text-xs font-semibold gap-2 shadow-xs"
              >
                <Send className="size-4" />
                <span>Enviar solicitud</span>
              </Button>
            </CardFooter>
          </Card>
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

