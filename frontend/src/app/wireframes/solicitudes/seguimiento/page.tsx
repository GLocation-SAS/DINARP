"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Send,
  ShieldCheck,
  Check,
  Bell,
  RefreshCw,
  ArrowRight,
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
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { DetailList } from "@/components/ui/detail-list";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";

export default function WireframeSolicitudSeguimientoPage() {
  const router = useRouter();

  const solicitud = {
    codigo: "SOL-2025-0024",
    nombre: "Validación de identidad ciudadana",
    estado: "En revisión",
    prioridad: "Alta",
    ultimaActualizacion: "12 abr 2025 10:24",
    responsableActual: "Ing. Carlos Mendoza (Ministerio del Interior)",
    etapaActualIndex: 5, // 0-indexed: Subsanación de observaciones
  };

  const timelineSteps = [
    {
      id: "step-1",
      titulo: "Borrador creado",
      estado: "Completado",
      fecha: "08 abr 2025 09:15",
      responsable: "Ing. Carlos Mendoza",
      entidad: "Ministerio del Interior",
      descripcion:
        "Se completó la carga inicial del formulario de solicitud y la especificación de campos de interoperabilidad requeridos.",
      icon: Check,
      statusType: "completed",
    },
    {
      id: "step-2",
      titulo: "Solicitud enviada",
      estado: "Completado",
      fecha: "10 abr 2025 08:30",
      responsable: "Ing. Carlos Mendoza",
      entidad: "Ministerio del Interior",
      descripcion:
        "Envío formal y firma electrónica de los términos de referencia a la Dirección Nacional de Registros Públicos (DINARP).",
      icon: Send,
      statusType: "completed",
    },
    {
      id: "step-3",
      titulo: "Validación inicial de competencia",
      estado: "Completado",
      fecha: "10 abr 2025 14:20",
      responsable: "Abg. Lucía Morales",
      entidad: "DINARP - Asesoría Jurídica",
      descripcion:
        "Revisión de marco legal y competencia institucional. Trámite admitido por cumplir con la Ley Orgánica de Registro de Datos Públicos.",
      icon: ShieldCheck,
      statusType: "completed",
    },
    {
      id: "step-4",
      titulo: "Revisión técnica de arquitectura",
      estado: "Completado",
      fecha: "11 abr 2025 10:00",
      responsable: "Ing. Marcos Viteri",
      entidad: "DINARP - Infraestructura",
      descripcion:
        "Análisis de arquitectura REST/JSON, cálculo de consumo estimado (5,000 req/día) y preaprobación de canal seguro.",
      icon: CheckCircle2,
      statusType: "completed",
    },
    {
      id: "step-5",
      titulo: "Observación técnica registrada",
      estado: "Atendido",
      fecha: "11 abr 2025 15:40",
      responsable: "Ing. Roberto Alarcón",
      entidad: "Registro Civil - Seguridad",
      descripcion:
        "La entidad fuente solicitó adjuntar el certificado de homologación SSL/TLS y declarar las IPs públicas para el filtro perimetral.",
      icon: AlertCircle,
      statusType: "completed",
    },
    {
      id: "step-6",
      titulo: "Subsanación de observaciones",
      estado: "En proceso",
      fecha: "12 abr 2025 10:24",
      responsable: "Ing. Carlos Mendoza",
      entidad: "Ministerio del Interior",
      descripcion:
        "Etapa actual: El solicitante se encuentra cargando los anexos técnicos solicitados y validando el certificado digital.",
      icon: RefreshCw,
      statusType: "current",
    },
    {
      id: "step-7",
      titulo: "Aprobación final & emisión de credenciales",
      estado: "Pendiente",
      fecha: "Estimado: 15 abr 2025",
      responsable: "Dirección de Interoperabilidad",
      entidad: "DINARP",
      descripcion:
        "Generación de credenciales OAuth 2.0 y habilitación del servicio en el catálogo de producción.",
      icon: Clock,
      statusType: "pending",
    },
  ];

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
              <BreadcrumbLink asChild>
                <Link href="/wireframes/solicitudes/detalle" className="text-muted-foreground hover:text-foreground">
                  Detalle de solicitud
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Seguimiento
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header & Action Controls ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-muted/80 text-foreground">
                {solicitud.codigo}
              </span>
              <Badge tone="neutral" appearance="soft" size="sm" className="font-medium gap-1.5">
                <span className="size-1.5 rounded-full bg-foreground" />
                {solicitud.estado}
              </Badge>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium pl-1">
                <span className="size-1.5 rounded-full bg-muted-foreground" />
                Prioridad: <strong className="text-foreground">{solicitud.prioridad}</strong>
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-foreground">
              Seguimiento del Proceso
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              {solicitud.nombre}
            </p>
          </div>

          {/* Action button: Volver al detalle */}
          <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/wireframes/solicitudes/detalle")}
              className="h-10 px-4 rounded-xl text-xs font-semibold gap-2 border-border"
            >
              <ArrowLeft className="size-4" />
              <span>Volver al detalle</span>
            </Button>
          </div>
        </div>

        {/* ── 3. Grid: Timeline (Izquierda 2 cols) & Resumen de Estado (Derecha 1 col) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* 3.1 Timeline Vertical del Proceso (2 Columnas) */}
          <Card className="lg:col-span-2 border-border bg-surface shadow-xs">
            <CardHeader className="p-5 sm:p-6 pb-4 border-b border-border/60">
              <CardTitle className="text-lg font-heading font-bold text-foreground">
                Línea de Tiempo del Trámite
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Registro secuencial de eventos, revisiones y dictámenes técnicos.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 sm:p-8">
              <div className="flex flex-col w-full">
                {timelineSteps.map((step, idx) => {
                  const isLast = idx === timelineSteps.length - 1;
                  const Icon = step.icon;
                  const isCurrent = step.statusType === "current";
                  const isCompleted = step.statusType === "completed";

                  return (
                    <div
                      key={step.id}
                      className={`relative flex gap-4 sm:gap-6 ${!isLast ? "pb-8" : ""}`}
                    >
                      {/* Nodo del Icono y Línea de Conexión */}
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`relative z-10 flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-full border transition-all ${isCurrent
                            ? "bg-foreground text-background border-foreground shadow-md ring-4 ring-foreground/15"
                            : isCompleted
                              ? "bg-muted/80 text-foreground border-border"
                              : "bg-surface text-muted-foreground border-border/60"
                            }`}
                        >
                          <Icon className="size-4 sm:size-5 stroke-[2]" />
                        </div>

                        {!isLast && (
                          <div
                            className={`absolute top-11 sm:top-12 bottom-0 left-1/2 w-[2px] -translate-x-1/2 ${isCompleted ? "bg-foreground/40" : "bg-border/60"
                              }`}
                          />
                        )}
                      </div>

                      {/* Contenido del Evento */}
                      <div
                        className={`flex-1 rounded-2xl p-4 sm:p-5 border transition-all ${isCurrent
                          ? "bg-muted/40 border-foreground/30 shadow-xs"
                          : "bg-surface border-border/60"
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-heading font-bold text-sm sm:text-base text-foreground">
                              {step.titulo}
                            </h3>
                            {isCurrent && (
                              <Badge
                                tone="neutral"
                                appearance="solid"
                                size="sm"
                                className="font-extrabold text-[9px] uppercase tracking-wider"
                              >
                                Etapa Actual
                              </Badge>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground font-medium whitespace-nowrap">
                            {step.fecha}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mt-1">
                          {step.descripcion}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-border/40 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5 font-medium text-foreground/90">
                            <User className="size-3.5 text-muted-foreground" />
                            {step.responsable}
                          </span>
                          <span className="text-[11px]">
                            {step.entidad}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 3.2 Panel Lateral de Resumen & Próxima Acción (1 Columna) */}
          <div className="space-y-6">
            {/* Resumen de Estado Actual */}
            <Card className="border-border bg-surface shadow-xs">
              <CardHeader className="p-5 pb-3 border-b border-border/60">
                <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
                  <Info className="size-4" />
                  <span>Estado del Trámite</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <DetailList
                  columns={1}
                  items={[
                    {
                      label: "Estado Actual",
                      value: (
                        <Badge tone="neutral" appearance="soft" size="sm" className="font-medium gap-1.5">
                          <span className="size-1.5 rounded-full bg-foreground" />
                          {solicitud.estado}
                        </Badge>
                      ),
                    },
                    {
                      label: "Responsable Actual",
                      value: (
                        <span className="font-semibold text-foreground text-xs sm:text-sm">
                          {solicitud.responsableActual}
                        </span>
                      ),
                    },
                    {
                      label: "Última Actualización",
                      value: (
                        <span className="text-xs text-muted-foreground">
                          {solicitud.ultimaActualizacion}
                        </span>
                      ),
                    },
                  ]}
                />

                {/* Próxima Acción Destacada */}
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1.5 text-left">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Próxima Acción Requerida:
                  </span>
                  <p className="text-xs font-semibold text-foreground leading-snug">
                    Carga del certificado de homologación SSL/TLS y validación de IP por parte del solicitante.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Observaciones Recientes */}
            <Card className="border-border bg-surface shadow-xs">
              <CardHeader className="p-5 pb-3 border-b border-border/60">
                <CardTitle className="text-base font-heading font-bold text-foreground">
                  Observaciones Recientes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/20 border border-border/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Registro Civil (Seguridad)</span>
                    <span className="text-[10px] text-muted-foreground">11 abr 15:40</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Adjuntar certificado de homologación y definir IP pública.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border border-border/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">DINARP (Jurídico)</span>
                    <span className="text-[10px] text-muted-foreground">10 abr 14:20</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Dictamen favorable de admisibilidad de datos.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Registro de Notificaciones */}
            <Card className="border-border bg-surface shadow-xs">
              <CardHeader className="p-5 pb-3 border-b border-border/60">
                <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
                  <Bell className="size-4" />
                  <span>Notificaciones</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-2.5 text-xs">
                  <div className="size-2 rounded-full bg-foreground mt-1.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      Notificación de requerimiento enviada
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Enviado a carlos.mendoza@ministeriodelinterior.gob.ec (11 abr 2025 15:45)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs pt-2 border-t border-border/40">
                  <div className="size-2 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      Confirmación de radicado generada
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      SOL-2025-0024 registrada en el sistema (10 abr 2025 08:30)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </WireframeDashboardLayout>
  );
}

