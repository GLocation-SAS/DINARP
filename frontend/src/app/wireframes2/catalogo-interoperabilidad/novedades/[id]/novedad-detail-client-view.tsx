"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Building2,
  ShieldCheck,
  FolderArchive,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Lock,
  EyeOff,
  ExternalLink,
  Info,
  Layers,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WireframeDashboardLayout } from "../../../components/wireframe-dashboard-layout";
import { WireframeBreadcrumbs } from "../../../components/wireframe-breadcrumbs";
import { type NovedadCatalogo } from "../../data/catalogo-data";

interface NovedadDetailClientViewProps {
  initialNovedad: NovedadCatalogo;
}

export function NovedadDetailClientView({ initialNovedad }: NovedadDetailClientViewProps) {
  const [novedad, setNovedad] = useState<NovedadCatalogo>(initialNovedad);

  // Estados de interacción DGR
  const [conceptoLegal, setConceptoLegal] = useState(
    novedad.evaluacionDGR.conceptoLegal || "Procede la desactivación en el Catálogo SURI por derogatoria legal expresa."
  );
  const [conceptoFuncional, setConceptoFuncional] = useState(
    novedad.evaluacionDGR.conceptoFuncional || "No existen trámites de acceso pendientes para esta fuente. Se congela su disponibilidad para nuevas solicitudes."
  );

  const handleAplicarDictamen = () => {
    setNovedad(prev => ({
      ...prev,
      estado: "Aplicada (Fuente Desactivada)",
      evaluacionDGR: {
        procede: true,
        fechaDictamen: new Date().toLocaleDateString("es-EC"),
        responsable: "Dra. Valeria Paredes (DGR)",
        conceptoLegal: conceptoLegal,
        conceptoFuncional: conceptoFuncional
      },
      fuentesAfectadas: prev.fuentesAfectadas.map(fa => ({
        ...fa,
        estadoNuevo: "DESACTIVADO"
      }))
    }));
    alert("Dictamen DGR emitido. Las fuentes afectadas pasan al estado DESACTIVADO (conservando su historial inmutable).");
  };

  const handleNotificarFusion = () => {
    setNovedad(prev => ({
      ...prev,
      estado: "Fusión ejecutada y notificada",
      notificacionFusion: {
        requiereNotificacion: true,
        notificadoCoordinador: true,
        fechaNotificacion: new Date().toLocaleDateString("es-EC"),
        mensajeEnviado: "Notificación formal de fusión enviada a los Coordinadores SINARP institucionales."
      }
    }));
    alert("Notificación de fusión remitida exitosamente al Coordinador SINARP.");
  };

  return (
    <WireframeDashboardLayout
      activeMenu="novedades"
      breadcrumbs={[
        { label: "Catálogo de Interoperabilidad", href: "/wireframes2/catalogo-interoperabilidad" },
        { label: "Novedades", href: "/wireframes2/catalogo-interoperabilidad/novedades" },
        { label: novedad.nroTramite }
      ]}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Barra Superior */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/wireframes2/catalogo-interoperabilidad/novedades">
              <ArrowLeft className="size-4" />
              Volver a Novedades
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Badge tone="neutral" appearance="soft" size="sm">
              Trámite: {novedad.nroTramite}
            </Badge>
            <Badge tone="neutral" appearance="outline" size="sm">
              HU-INT-16 a 19
            </Badge>
          </div>
        </div>

        {/* Encabezado del Expediente de Novedad */}
        <div className="border border-border rounded-xl bg-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xs">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone="neutral" appearance="soft" size="sm">
                Tipo: {novedad.tipoNovedad}
              </Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-medium text-muted-foreground">{novedad.organismoSolicitante}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-mono text-muted-foreground">{novedad.documentoSoporteOficio.numeroOficio}</span>
            </div>

            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Requerimiento de {novedad.tipoNovedad} de Fuente
            </h1>

            <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
              Solicitud formal radicada mediante Oficio {novedad.documentoSoporteOficio.numeroOficio} con fecha {novedad.documentoSoporteOficio.fechaOficio}.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Estado:</span>
              <Badge tone="neutral" appearance="outline" size="sm" className="font-semibold text-xs">
                {novedad.estado}
              </Badge>
            </div>
            <div className="text-[11px] text-muted-foreground text-left md:text-right">
              <div>Radicación: {novedad.fechaRadicacion}</div>
            </div>
          </div>
        </div>

        {/* Alerta de Conservación Inmutable (Sin Borrado Físico) */}
        <div className="bg-surface border border-border rounded-xl p-4 flex items-start gap-4">
          <FolderArchive className="size-5 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground font-semibold">Principio de No Eliminación Física (HU-INT-18 / Res. 004):</strong>
            <p className="mt-0.5">
              Toda novedad de supresión o eliminación tramitada por DINARP actualiza el estado de la fuente a <code className="text-foreground font-mono">DESACTIVADO</code>. La fuente deja de estar disponible para nuevas consultas ciudadanas e interinstitucionales, pero su ficha técnica, histórico de consumos y auditoría se conservan permanentemente.
            </p>
          </div>
        </div>

        {/* Cuadrícula de Fuentes Afectadas y Dictamen DGR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Col 1: Fuentes Afectadas */}
          <Card size="sm" className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Layers className="size-4 text-muted-foreground" />
                  Fuentes de Datos Objeto de la Novedad
                </CardTitle>
                <Badge tone="neutral" appearance="soft" size="sm">
                  {novedad.fuentesAfectadas.length} {novedad.fuentesAfectadas.length === 1 ? "fuente" : "fuentes"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {novedad.fuentesAfectadas.map(fa => (
                <div key={fa.fuenteId} className="p-4 rounded-lg border border-border bg-surface flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground text-sm">{fa.fuenteNombre}</span>
                    <Badge tone="neutral" appearance="outline" size="sm">
                      {fa.estadoNuevo}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Código ID: <span className="font-mono text-foreground">{fa.fuenteId}</span></div>
                    <div>Institución: <span className="text-foreground">{fa.institucionNombre}</span></div>
                    <div>Estado Anterior: <span className="font-mono">{fa.estadoPrevio}</span></div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button variant="secondary" size="sm" asChild className="text-xs gap-1">
                      <Link href={`/wireframes2/catalogo-interoperabilidad/gestion/fuente/${fa.fuenteId}`}>
                        Ver Ficha Técnica en Gestión
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Col 2: Dictamen Legal y Funcional DGR (HU-INT-17) */}
          <Card size="sm" className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ShieldCheck className="size-4 text-muted-foreground" />
                  Concepto Legal y Funcional (DGR)
                </CardTitle>
                <Badge tone="neutral" appearance="soft" size="sm">
                  HU-INT-17
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Responsable DGR</Label>
                <Input
                  value={novedad.evaluacionDGR.responsable}
                  readOnly
                  className="text-xs bg-muted/30 text-foreground"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Concepto Legal *</Label>
                <Textarea
                  value={conceptoLegal}
                  onChange={e => setConceptoLegal(e.target.value)}
                  className="text-xs bg-background min-h-[70px]"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Concepto Funcional *</Label>
                <Textarea
                  value={conceptoFuncional}
                  onChange={e => setConceptoFuncional(e.target.value)}
                  className="text-xs bg-background min-h-[70px]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleAplicarDictamen}
                  className="gap-1.5 font-semibold text-xs"
                >
                  <CheckCircle2 className="size-4" />
                  Emitir Dictamen y Desactivar Fuente (HU-INT-18)
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Sección Especial para Fusión: Notificación al Coordinador SINARP (HU-INT-19) */}
        {novedad.tipoNovedad === "Fusión" && (
          <Card size="sm" className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Send className="size-4 text-muted-foreground" />
                  Notificación Formal al Coordinador SINARP (HU-INT-19)
                </CardTitle>
                <Badge tone="neutral" appearance={novedad.notificacionFusion?.notificadoCoordinador ? "soft" : "outline"} size="sm">
                  {novedad.notificacionFusion?.notificadoCoordinador ? "Notificado Formalmente" : "Pendiente de Notificación"}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                En caso de fusión de fuentes, el Sistema de Registro debe notificar formalmente a los Coordinadores SINARP de las instituciones involucradas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-lg bg-surface border border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div>
                  <div className="font-semibold text-foreground">Estado de la Notificación:</div>
                  <div className="text-muted-foreground text-[11px] mt-0.5">
                    {novedad.notificacionFusion?.mensajeEnviado || "Pendiente de envío a coordinadores institucionales de Registro Civil y ANT."}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!novedad.notificacionFusion?.notificadoCoordinador ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleNotificarFusion}
                      className="gap-1.5 text-xs font-semibold"
                    >
                      <Send className="size-3.5" />
                      Enviar Notificación de Fusión (HU-INT-19)
                    </Button>
                  ) : (
                    <Badge tone="neutral" appearance="soft" size="sm" className="gap-1">
                      <CheckCircle2 className="size-3 text-foreground" />
                      Notificación Entregada ({novedad.notificacionFusion.fechaNotificacion})
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </WireframeDashboardLayout>
  );
}
