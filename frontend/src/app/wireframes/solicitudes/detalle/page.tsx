"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Activity,
  FileText,
  Download,
  Building2,
  Database,
  ShieldAlert,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  ExternalLink,
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

export default function WireframeSolicitudDetallePage() {
  const router = useRouter();

  // Datos mock de la solicitud detallada
  const solicitud = {
    codigo: "SOL-2025-0024",
    nombre: "Validación de identidad ciudadana",
    estado: "En revisión",
    prioridad: "Alta",
    ultimaActualizacion: "12 abr 2025 10:24",
    fechaCreacion: "10 abr 2025 08:30",
    solicitante: {
      institucion: "Ministerio del Interior",
      unidad: "Dirección de Tecnologías de la Información y Comunicación",
      responsable: "Ing. Carlos Mendoza",
      cargo: "Director de TI",
      correo: "carlos.mendoza@ministeriodelinterior.gob.ec",
      proyecto: "Sistema Nacional de Identificación Digital y Control de Salvoconductos",
    },
    fuente: {
      institucion: "Dirección General de Registro Civil, Identificación y Cedulación",
      servicio: "Servicio Web de Consulta de Cédula y Datos Biográficos",
      tipoIntercambio: "Uno a uno (Tiempo real - API REST)",
      protocolo: "HTTPS / REST (JSON) - Autenticación OAuth 2.0 Mutual TLS",
      frecuencia: "Transaccional (~ 5,000 consultas / día)",
      datosSolicitados: [
        "Número de Cédula",
        "Nombres y Apellidos Completos",
        "Fecha de Nacimiento",
        "Estado Civil",
        "Condición de Ciudadano",
        "Fotografía Facial (Base64)",
      ],
    },
    finalidad: {
      proposito:
        "Validación y verificación de identidad ciudadana en tiempo real para trámites institucionales, control de seguridad en puntos de emisión de salvoconductos y validación de licencias oficiales.",
      baseLegal:
        "Ley Orgánica del Sistema Nacional de Registro de Datos Públicos (Art. 14, 18) y Decreto Ejecutivo N° 824 sobre Interoperabilidad Gubernamental.",
      clasificacion: "Confidencial - Nivel 2 (Datos Personales Regulados)",
    },
    observaciones: [
      {
        id: 1,
        autor: "Abg. Lucía Morales (DINARP)",
        rol: "Analista Jurídico de Interoperabilidad",
        fecha: "12 abr 2025 10:24",
        texto:
          "Se verificó la competencia legal de la institución solicitante. Solicitud admitida a trámite técnico.",
      },
      {
        id: 2,
        autor: "Ing. Roberto Alarcón (Registro Civil)",
        rol: "Oficial de Seguridad de la Información",
        fecha: "11 abr 2025 15:40",
        texto:
          "Se requiere adjuntar el certificado de homologación del endpoint de consumo y la IP pública autorizada para la lista blanca del WAF.",
      },
    ],
    documentos: [
      {
        id: "doc-1",
        nombre: "Terminos_de_Referencia_Tecnica_MINTEL.pdf",
        tamano: "2.4 MB",
        fecha: "10 abr 2025",
      },
      {
        id: "doc-2",
        nombre: "Acuerdo_Confidencialidad_NDA_Firmado.pdf",
        tamano: "1.1 MB",
        fecha: "10 abr 2025",
      },
      {
        id: "doc-3",
        nombre: "Arquitectura_Seguridad_Interoperabilidad_v2.pdf",
        tamano: "3.8 MB",
        fecha: "10 abr 2025",
      },
    ],
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
                Detalle de solicitud
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
              {solicitud.nombre}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                Radicado: {solicitud.fechaCreacion}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                Última actualización: {solicitud.ultimaActualizacion}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/wireframes/solicitudes")}
              className="h-10 px-4 rounded-xl text-xs font-semibold gap-2 border-border"
            >
              <ArrowLeft className="size-4" />
              <span>Volver al listado</span>
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => router.push("/wireframes/solicitudes/seguimiento")}
              className="h-10 px-5 rounded-xl text-xs font-semibold gap-2 shadow-xs cursor-pointer"
            >
              <Activity className="size-4" />
              <span>Ver seguimiento</span>
            </Button>
          </div>
        </div>

        {/* ── 3. Contenido Principal en Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda / Central (2 Columnas) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 3.1 Información General del Proyecto y Solicitante */}
            <Card className="border-border bg-surface shadow-xs">
              <CardHeader className="p-5 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-muted/60 flex items-center justify-center text-foreground">
                    <Building2 className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-heading font-bold text-foreground">
                      Institución Solicitante y Proyecto
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Datos institucionales y contextuales de la entidad requirente.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <DetailList
                  columns={2}
                  items={[
                    {
                      label: "Institución Solicitante",
                      value: (
                        <span className="font-semibold text-foreground">
                          {solicitud.solicitante.institucion}
                        </span>
                      ),
                    },
                    {
                      label: "Unidad Responsable",
                      value: solicitud.solicitante.unidad,
                    },
                    {
                      label: "Responsable Técnico",
                      value: (
                        <div className="flex items-center gap-2">
                          <User className="size-3.5 text-muted-foreground" />
                          <span>{solicitud.solicitante.responsable}</span>
                        </div>
                      ),
                    },
                    {
                      label: "Correo Electrónico",
                      value: solicitud.solicitante.correo,
                    },
                    {
                      label: "Proyecto Asociado",
                      colSpan: 2,
                      value: (
                        <span className="font-medium text-foreground">
                          {solicitud.solicitante.proyecto}
                        </span>
                      ),
                    },
                  ]}
                />
              </CardContent>
            </Card>

            {/* 3.2 Institución Fuente, Intercambio y Datos Solicitados */}
            <Card className="border-border bg-surface shadow-xs">
              <CardHeader className="p-5 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-muted/60 flex items-center justify-center text-foreground">
                    <Database className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-heading font-bold text-foreground">
                      Institución Fuente y Especificación de Datos
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Detalle técnico del origen de la información y atributos requeridos.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <DetailList
                  columns={2}
                  items={[
                    {
                      label: "Institución Custodia (Fuente)",
                      value: (
                        <span className="font-semibold text-foreground">
                          {solicitud.fuente.institucion}
                        </span>
                      ),
                    },
                    {
                      label: "Servicio / Catálogo",
                      value: solicitud.fuente.servicio,
                    },
                    {
                      label: "Modalidad de Intercambio",
                      value: solicitud.fuente.tipoIntercambio,
                    },
                    {
                      label: "Frecuencia Estimada",
                      value: solicitud.fuente.frecuencia,
                    },
                    {
                      label: "Protocolo & Seguridad",
                      colSpan: 2,
                      value: solicitud.fuente.protocolo,
                    },
                  ]}
                />

                <div className="pt-3 border-t border-border/50">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2.5">
                    Campos y Atributos Solicitados:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {solicitud.fuente.datosSolicitados.map((campo, idx) => (
                      <Badge
                        key={idx}
                        tone="neutral"
                        appearance="outline"
                        size="md"
                        className="font-mono text-xs normal-case bg-background/50"
                      >
                        {campo}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3.3 Finalidad de Uso y Clasificación Legal */}
            <Card className="border-border bg-surface shadow-xs">
              <CardHeader className="p-5 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-muted/60 flex items-center justify-center text-foreground">
                    <ShieldAlert className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-heading font-bold text-foreground">
                      Finalidad de Uso & Marco Regulatorio
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Sustento legal y nivel de confidencialidad de la interoperabilidad.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <DetailList
                  columns={1}
                  items={[
                    {
                      label: "Propósito Institucional",
                      value: (
                        <p className="text-sm text-foreground/90 leading-relaxed font-normal">
                          {solicitud.finalidad.proposito}
                        </p>
                      ),
                    },
                    {
                      label: "Base Legal",
                      value: (
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {solicitud.finalidad.baseLegal}
                        </p>
                      ),
                    },
                    {
                      label: "Clasificación de Seguridad de la Información",
                      value: (
                        <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold">
                          {solicitud.finalidad.clasificacion}
                        </Badge>
                      ),
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha (1 Columna: Observaciones & Documentos) */}
          <div className="space-y-6">
            {/* 3.4 Observaciones Registradas */}
            <Card className="border-border bg-surface shadow-xs">
              <CardHeader className="p-5 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-muted/60 flex items-center justify-center text-foreground">
                    <MessageSquare className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-heading font-bold text-foreground">
                      Observaciones
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Registro de notas y dictámenes de revisión.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {solicitud.observaciones.map((obs) => (
                  <div
                    key={obs.id}
                    className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2 text-left"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-foreground leading-tight">
                        {obs.autor}
                      </span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {obs.fecha}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium block leading-none">
                      {obs.rol}
                    </span>
                    <p className="text-xs text-foreground/80 leading-relaxed pt-1">
                      {obs.texto}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 3.5 Documentos Adjuntos */}
            <Card className="border-border bg-surface shadow-xs">
              <CardHeader className="p-5 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-muted/60 flex items-center justify-center text-foreground">
                    <Paperclip className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-heading font-bold text-foreground">
                      Documentos Adjuntos
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Archivos respaldatorios y anexos técnicos.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {solicitud.documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-background/50 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="size-4 text-muted-foreground shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {doc.nombre}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {doc.tamano} • {doc.fecha}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      title="Descargar documento"
                      aria-label="Descargar documento"
                      className="text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <Download className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </WireframeDashboardLayout>
  );
}

