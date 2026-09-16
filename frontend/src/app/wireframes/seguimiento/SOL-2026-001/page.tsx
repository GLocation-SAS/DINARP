"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  FileText,
  Paperclip,
  PenLine,
  Plus,
  Clock,
  Building2,
  Database,
  Download,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
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

export default function WireframeDetalleSeguimientoPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("trazabilidad");
  const [comentarioTexto, setComentarioTexto] = useState("");
  const [comentariosList, setComentariosList] = useState([
    {
      id: "1",
      autor: "Carlos Núñez (DINARP)",
      fecha: "16 sep 2026 11:45",
      texto: "Se solicita ampliar la justificación técnica del proyecto indicando el marco legal que faculta la consulta directa.",
    },
    {
      id: "2",
      autor: "María López (Ministerio de Gobierno)",
      fecha: "15 sep 2026 09:20",
      texto: "Se adjuntó el documento complementario Justificación_actualizada.pdf con la base legal solicitada.",
    },
  ]);

  const handleAddComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comentarioTexto.trim()) return;

    setComentariosList((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        autor: "Paula Rozo (Revisora)",
        fecha: "Hoy 13:30",
        texto: comentarioTexto.trim(),
      },
    ]);
    setComentarioTexto("");
  };

  return (
    <WireframeDashboardLayout activeMenu="seguimiento">
      <main className="relative p-4 sm:p-8 lg:p-10 max-w-6xl w-full mx-auto space-y-6 sm:space-y-8">
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
                <Link href="/wireframes/seguimiento" className="text-muted-foreground hover:text-foreground">
                  Seguimiento
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                SOL-2026-001
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header & Return Button ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight font-mono">
                SOL-2026-001
              </h1>
              <Badge tone="info" appearance="soft" size="md" className="font-semibold text-xs gap-1.5">
                <span className="size-2 rounded-full bg-info" />
                En revisión
              </Badge>
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              Proyecto Identidad Digital
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/wireframes/seguimiento")}
            className="h-10 px-4 rounded-xl text-xs font-semibold gap-2 border-border shrink-0"
          >
            <ArrowLeft className="size-4" />
            <span>Volver al listado</span>
          </Button>
        </div>

        {/* ── 3. Resumen Superior (6 Columnas) ── */}
        <Card className="rounded-2xl border-border bg-surface shadow-xs overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
              <div className="space-y-1 pt-2 lg:pt-0">
                <span className="text-[11px] text-muted-foreground block font-medium">Institución solicitante</span>
                <p className="text-xs font-bold text-foreground leading-tight">Ministerio de Gobierno</p>
              </div>

              <div className="space-y-1 pt-2 lg:pt-0 lg:pl-4">
                <span className="text-[11px] text-muted-foreground block font-medium">Fuente</span>
                <p className="text-xs font-bold text-foreground leading-tight">Registro Civil</p>
              </div>

              <div className="space-y-1 pt-2 lg:pt-0 lg:pl-4">
                <span className="text-[11px] text-muted-foreground block font-medium">Consumidor</span>
                <p className="text-xs font-bold text-foreground leading-tight">Ministerio de Gobierno</p>
              </div>

              <div className="space-y-1 pt-2 lg:pt-0 lg:pl-4">
                <span className="text-[11px] text-muted-foreground block font-medium">Responsable actual</span>
                <p className="text-xs font-bold text-foreground leading-tight">María López</p>
              </div>

              <div className="space-y-1 pt-2 lg:pt-0 lg:pl-4">
                <span className="text-[11px] text-muted-foreground block font-medium">Fecha de creación</span>
                <p className="text-xs font-bold text-foreground leading-tight">10 sep 2026</p>
              </div>

              <div className="space-y-1 pt-2 lg:pt-0 lg:pl-4">
                <span className="text-[11px] text-muted-foreground block font-medium">Última actualización</span>
                <p className="text-xs font-bold text-foreground leading-tight">16 sep 2026 10:32</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── 4. Tabs de Contenido ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/40 p-1 rounded-xl border border-border h-11 w-full sm:w-auto inline-flex">
            <TabsTrigger value="trazabilidad" className="rounded-lg text-xs font-semibold px-4">
              Trazabilidad
            </TabsTrigger>
            <TabsTrigger value="informacion" className="rounded-lg text-xs font-semibold px-4">
              Información general
            </TabsTrigger>
            <TabsTrigger value="documentos" className="rounded-lg text-xs font-semibold px-4">
              Documentos
            </TabsTrigger>
            <TabsTrigger value="comentarios" className="rounded-lg text-xs font-semibold px-4">
              Comentarios
            </TabsTrigger>
          </TabsList>

          {/* ── Tab Content: Trazabilidad (Timeline) ── */}
          <TabsContent value="trazabilidad" className="space-y-6">
            <Card className="rounded-2xl border-border bg-surface p-6 sm:p-8 shadow-xs">
              <div className="relative pl-24 sm:pl-32 space-y-10 before:absolute before:left-24 sm:before:left-32 before:top-4 before:bottom-4 before:w-[2px] before:bg-border before:-translate-x-1/2">

                {/* Evento 1: Solicitud enviada */}
                <div className="relative">
                  {/* Fecha y Hora Izquierda */}
                  <div className="absolute -left-24 sm:-left-32 top-1 text-right w-20 sm:w-28 pr-4">
                    <span className="text-xs font-bold text-foreground block leading-none">16 sep 2026</span>
                    <span className="text-[11px] text-muted-foreground font-mono">10:32</span>
                  </div>

                  {/* Nodo Icono */}
                  <div className="absolute -left-4 sm:-left-4 top-0.5 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center -translate-x-1/2 shadow-xs ring-4 ring-background">
                    <Send className="size-4" />
                  </div>

                  {/* Detalle */}
                  <div className="pl-6 space-y-1">
                    <h3 className="text-sm font-bold text-foreground">Solicitud enviada</h3>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground font-medium">Responsable:</strong> María López (Ministerio de Gobierno)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground font-medium">Estado:</strong> Borrador → En revisión
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground font-medium">Observación:</strong> Solicitud enviada para validación.
                    </p>
                  </div>
                </div>

                {/* Evento 2: Solicitud revisada */}
                <div className="relative">
                  {/* Fecha y Hora Izquierda */}
                  <div className="absolute -left-24 sm:-left-32 top-1 text-right w-20 sm:w-28 pr-4">
                    <span className="text-xs font-bold text-foreground block leading-none">16 sep 2026</span>
                    <span className="text-[11px] text-muted-foreground font-mono">11:45</span>
                  </div>

                  {/* Nodo Icono */}
                  <div className="absolute -left-4 sm:-left-4 top-0.5 size-8 rounded-full bg-muted-foreground/30 text-foreground flex items-center justify-center -translate-x-1/2 shadow-xs ring-4 ring-background">
                    <FileText className="size-4" />
                  </div>

                  {/* Detalle */}
                  <div className="pl-6 space-y-1">
                    <h3 className="text-sm font-bold text-foreground">Solicitud revisada</h3>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground font-medium">Responsable:</strong> Carlos Núñez (DINARP)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground font-medium">Estado:</strong> En revisión → Requiere ajustes
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground font-medium">Observación:</strong> Se solicita ampliar la justificación del proyecto.
                    </p>
                  </div>
                </div>

                {/* Evento 3: Ajustes realizados con adjunto */}
                <div className="relative">
                  {/* Fecha y Hora Izquierda */}
                  <div className="absolute -left-24 sm:-left-32 top-1 text-right w-20 sm:w-28 pr-4">
                    <span className="text-xs font-bold text-foreground block leading-none">15 sep 2026</span>
                    <span className="text-[11px] text-muted-foreground font-mono">09:20</span>
                  </div>

                  {/* Nodo Icono */}
                  <div className="absolute -left-4 sm:-left-4 top-0.5 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center -translate-x-1/2 shadow-xs ring-4 ring-background">
                    <PenLine className="size-4" />
                  </div>

                  {/* Detalle */}
                  <div className="pl-6 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-foreground">Ajustes realizados</h3>
                        <p className="text-xs text-muted-foreground">
                          <strong className="text-foreground font-medium">Responsable:</strong> María López (Ministerio de Gobierno)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <strong className="text-foreground font-medium">Estado:</strong> Requiere ajustes → En revisión
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <strong className="text-foreground font-medium">Observación:</strong> Se adjunta información complementaria.
                        </p>
                      </div>

                      {/* Attachment Pill Right */}
                      <div className="flex items-center gap-2 p-2.5 px-3 rounded-xl border border-border bg-background hover:bg-muted/30 transition-colors shrink-0">
                        <Paperclip className="size-3.5 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-foreground">Justificación_actualizada.pdf</span>
                          <span className="text-[10px] text-muted-foreground">245 KB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evento 4: Solicitud creada */}
                <div className="relative">
                  {/* Fecha y Hora Izquierda */}
                  <div className="absolute -left-24 sm:-left-32 top-1 text-right w-20 sm:w-28 pr-4">
                    <span className="text-xs font-bold text-foreground block leading-none">10 sep 2026</span>
                    <span className="text-[11px] text-muted-foreground font-mono">14:10</span>
                  </div>

                  {/* Nodo Icono */}
                  <div className="absolute -left-4 sm:-left-4 top-0.5 size-8 rounded-full bg-muted-foreground/30 text-foreground flex items-center justify-center -translate-x-1/2 shadow-xs ring-4 ring-background">
                    <Plus className="size-4" />
                  </div>

                  {/* Detalle */}
                  <div className="pl-6 space-y-1">
                    <h3 className="text-sm font-bold text-foreground">Solicitud creada</h3>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground font-medium">Responsable:</strong> María López (Ministerio de Gobierno)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground font-medium">Estado:</strong> - → Borrador
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground font-medium">Observación:</strong> Creación inicial de la solicitud.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* ── Tab Content: Información General ── */}
          <TabsContent value="informacion" className="space-y-6">
            <Card className="rounded-2xl border-border bg-surface p-6 shadow-xs">
              <DetailList
                columns={2}
                items={[
                  {
                    label: "Código del proyecto",
                    value: <span className="font-mono font-bold text-foreground">SOL-2026-001</span>,
                  },
                  {
                    label: "Nombre del proyecto",
                    value: "Proyecto Identidad Digital",
                  },
                  {
                    label: "Tipo de interoperabilidad",
                    value: "Servicio Web en línea (API REST JSON)",
                  },
                  {
                    label: "Frecuencia estimada",
                    value: "Transaccional en tiempo real (200 req/min)",
                  },
                  {
                    label: "Base legal y justificación",
                    value: "Decreto Ejecutivo Nro. 452 sobre modernización y simplificación de trámites ciudadanos en el marco del Gobierno Digital.",
                  },
                  {
                    label: "Clasificación de seguridad",
                    value: "Confidencial / Datos personales regulados",
                  },
                ]}
              />
            </Card>
          </TabsContent>

          {/* ── Tab Content: Documentos ── */}
          <TabsContent value="documentos" className="space-y-6">
            <Card className="rounded-2xl border-border bg-surface p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-muted-foreground shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">Justificación_actualizada.pdf</span>
                    <span className="text-[10px] text-muted-foreground">PDF · 245 KB · Cargado el 15 sep 2026</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
                  <Download className="size-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-muted-foreground shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">Solicitud_Oficial_MIDUVI.pdf</span>
                    <span className="text-[10px] text-muted-foreground">PDF · 1.2 MB · Cargado el 10 sep 2026</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
                  <Download className="size-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* ── Tab Content: Comentarios ── */}
          <TabsContent value="comentarios" className="space-y-6">
            <Card className="rounded-2xl border-border bg-surface p-6 shadow-xs space-y-4">
              <div className="space-y-3">
                {comentariosList.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl border border-border bg-background/50 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{c.autor}</span>
                      <span className="text-[10px] text-muted-foreground">{c.fecha}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{c.texto}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComentario} className="space-y-3 pt-2">
                <textarea
                  rows={3}
                  placeholder="Escribe un comentario o nota de seguimiento..."
                  value={comentarioTexto}
                  onChange={(e) => setComentarioTexto(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!comentarioTexto.trim()}
                    className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
                  >
                    <Send className="size-3.5" />
                    <span>Enviar comentario</span>
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </WireframeDashboardLayout>
  );
}

