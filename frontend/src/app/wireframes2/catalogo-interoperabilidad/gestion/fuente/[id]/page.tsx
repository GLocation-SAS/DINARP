import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Database,
  Building2,
  ShieldCheck,
  Server,
  Lock,
  Check,
  Eye,
  EyeOff,
  FolderArchive,
  Clock,
  FileText,
  CheckCircle2,
  ExternalLink,
  Info,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WireframeDashboardLayout } from "../../../../components/wireframe-dashboard-layout";
import { WireframeBreadcrumbs } from "../../../../components/wireframe-breadcrumbs";
import { INITIAL_INSTITUCIONES, type FuenteServicio, type FuenteEstado } from "../../../data/catalogo-data";

export function generateStaticParams() {
  const allFuentes = INITIAL_INSTITUCIONES.flatMap(inst => inst.fuentes);
  return allFuentes.map(fuente => ({
    id: fuente.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetalleFuenteAdminPage({ params }: PageProps) {
  const { id } = await params;

  // Buscar fuente en mock
  const allFuentes = INITIAL_INSTITUCIONES.flatMap(inst =>
    inst.fuentes.map(f => ({
      ...f,
      institucionObj: inst
    }))
  );

  const fuente = allFuentes.find(f => f.id === id);

  if (!fuente) {
    notFound();
  }

  const getEstadoBadge = (estado: FuenteEstado) => {
    switch (estado) {
      case "PUBLICADO":
        return (
          <Badge tone="neutral" appearance="soft" size="sm" className="gap-1.5 font-semibold">
            <Eye className="size-3.5" />
            PUBLICADO (Visible en Consulta)
          </Badge>
        );
      case "OCULTO":
        return (
          <Badge tone="neutral" appearance="outline" size="sm" className="gap-1.5 font-semibold border-dashed">
            <EyeOff className="size-3.5" />
            OCULTO (Inventario Interno)
          </Badge>
        );
      case "DESACTIVADO":
        return (
          <Badge tone="neutral" appearance="soft" size="sm" className="gap-1.5 opacity-80">
            <FolderArchive className="size-3.5" />
            DESACTIVADO (Histórico Preservado)
          </Badge>
        );
    }
  };

  return (
    <WireframeDashboardLayout
      activeMenu="gestion-catalogo"
      breadcrumbs={[
        { label: "Catálogo de Interoperabilidad", href: "/wireframes2/catalogo-interoperabilidad" },
        { label: "Gestión", href: "/wireframes2/catalogo-interoperabilidad/gestion" },
        { label: fuente.nombre }
      ]}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Barra Superior de Navegación */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/wireframes2/catalogo-interoperabilidad/gestion">
              <ArrowLeft className="size-4" />
              Volver a Gestión
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Badge tone="neutral" appearance="soft" size="sm">
              Ficha Técnica SURI
            </Badge>
            <Badge tone="neutral" appearance="outline" size="sm">
              HU-INT-07 / HU-INT-08 / HU-INT-13
            </Badge>
          </div>
        </div>

        {/* Encabezado de la Ficha Técnica */}
        <div className="border border-border rounded-xl bg-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xs">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                {fuente.codigoServicio}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-medium text-muted-foreground">
                {fuente.institucionNombre} ({fuente.institucionObj.sigla})
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-mono text-muted-foreground">{fuente.version}</span>
            </div>

            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {fuente.nombre}
            </h1>

            <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {fuente.descripcion}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div>{getEstadoBadge(fuente.estado)}</div>
            <div className="text-[11px] text-muted-foreground text-left md:text-right">
              <div>Fecha Integración: {fuente.fechaIntegracion}</div>
              <div>Última Actualización: {fuente.ultimaActualizacion}</div>
            </div>
          </div>
        </div>

        {/* Si la fuente está DESACTIVADA, mostrar alerta de conservación histórica */}
        {fuente.estado === "DESACTIVADO" && (
          <div className="bg-muted/40 border border-border rounded-xl p-5 flex items-start gap-4">
            <AlertCircle className="size-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">Fuente Desactivada (HU-INT-18 / Res. 004):</strong>
              <p className="mt-1">
                Esta fuente ha sido desactivada y retirada del catálogo de consulta para nuevas solicitudes. <strong>No ha sido eliminada físicamente de la base de datos</strong>; su expediente, metadatos, microservicio e historial inmutable se conservan para auditoría y trazabilidad legal.
              </p>
            </div>
          </div>
        )}

        {/* Cuadrícula de 3 Columnas: Metadatos Funcionales, DPI y DTD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Col 1: Responsabilidad Funcional (DGR) */}
          <Card size="sm" className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="size-4 text-muted-foreground" />
                  Responsabilidad Funcional (DGR)
                </CardTitle>
                <Badge tone="neutral" appearance="soft" size="sm">DGR</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Institución Emisora:</span>
                <span className="font-medium text-foreground">{fuente.institucionNombre}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Sector / RUC:</span>
                <span className="text-foreground">{fuente.institucionObj.sector} — {fuente.institucionObj.codigoInstitucion}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Base Legal Habilitante:</span>
                <span className="text-foreground">{fuente.baseLegal}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Responsable Funcional DGR:</span>
                <span className="font-medium text-foreground">{fuente.responsableDGR}</span>
              </div>
            </CardContent>
          </Card>

          {/* Col 2: Clasificación de Datos (DPI) */}
          <Card size="sm" className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ShieldCheck className="size-4 text-muted-foreground" />
                  Clasificación de Datos (DPI)
                </CardTitle>
                <Badge tone="neutral" appearance="soft" size="sm">HU-INT-08</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px]">Estado de Clasificación:</span>
                <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold">
                  {fuente.clasificacionDPI.clasificado ? "Certificado Oficial" : "Pendiente"}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Nro. Informe Técnico DPI:</span>
                <span className="font-mono font-medium text-foreground">{fuente.clasificacionDPI.nroInforme || "N/A"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Responsable DPI:</span>
                <span className="text-foreground">{fuente.clasificacionDPI.responsableDPI || "Mgs. Patricio Silva"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Documento de Dictamen:</span>
                <span className="text-foreground font-mono text-[11px] underline cursor-pointer">
                  {fuente.clasificacionDPI.archivoInforme || "Informe_DPI_Adjunto.pdf"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Col 3: Integración Técnica (DTD) */}
          <Card size="sm" className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Server className="size-4 text-muted-foreground" />
                  Arquitectura Técnica (DTD)
                </CardTitle>
                <Badge tone="neutral" appearance="soft" size="sm">HU-INT-09 / 13</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Microservicio Integrador:</span>
                <span className="font-mono font-medium text-foreground">{fuente.microservicio.nombre} ({fuente.microservicio.version})</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Endpoint Preproducción:</span>
                <span className="font-mono text-[10px] text-muted-foreground break-all">
                  {fuente.microservicio.endpointPre || "No desplegado"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Endpoint Producción:</span>
                <span className="font-mono text-[10px] text-foreground break-all">
                  {fuente.microservicio.endpointProd || "No disponible"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Responsable Técnico DTD:</span>
                <span className="text-foreground">{fuente.responsableDTD}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla Detallada de Campos y Clasificación */}
        <div className="border border-border rounded-xl bg-card overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="font-heading text-base font-bold text-foreground">
                Diccionario de Datos y Clasificación de Campos ({fuente.campos.length} campos)
              </h3>
              <p className="text-xs text-muted-foreground">
                Cada campo cuenta con su clasificación inmutable asignada por la Dirección de Protección de la Información.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Nombre del Campo</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Descripción Funcional</th>
                  <th className="py-3 px-4 text-center">Clasificación DPI</th>
                  <th className="py-3 px-4 text-center">Nivel de Protección</th>
                  <th className="py-3 px-4 text-center">Estado Revisión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fuente.campos.map((campo, idx) => (
                  <tr key={campo.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 text-muted-foreground font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-medium text-foreground">{campo.nombre}</td>
                    <td className="py-3 px-4">
                      <Badge tone="neutral" appearance="soft" size="sm">{campo.tipo}</Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground max-w-md">{campo.descripcion}</td>
                    <td className="py-3 px-4 text-center">
                      {campo.clasificacion === "Accesible" ? (
                        <Badge tone="neutral" appearance="soft" size="sm" className="gap-1 inline-flex">
                          <Check className="size-3" />
                          Accesible
                        </Badge>
                      ) : (
                        <Badge tone="neutral" appearance="outline" size="sm" className="gap-1 inline-flex font-semibold">
                          <Lock className="size-3" />
                          Confidencial
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-[11px] text-muted-foreground">
                      {campo.clasificacion === "Confidencial" ? "Exige Motivación Legal" : "Acceso General"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge tone="neutral" appearance="soft" size="sm">
                        <CheckCircle2 className="size-3 mr-1 text-foreground" />
                        {campo.estadoRevision || "Valido"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Historial y Trazabilidad de Novedades de la Fuente */}
        {fuente.historialNovedades && fuente.historialNovedades.length > 0 && (
          <div className="border border-border rounded-xl bg-card p-6 flex flex-col gap-4">
            <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              Bitácora de Novedades y Auditoría Regulatoria
            </h3>
            <div className="space-y-3">
              {fuente.historialNovedades.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-border bg-surface flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{item.tipo}</span>
                    <span className="text-muted-foreground font-mono text-[11px]">{item.fecha}</span>
                  </div>
                  <p className="text-muted-foreground">{item.detalle}</p>
                  <div className="text-[11px] text-muted-foreground pt-1">
                    Registrado por: <span className="font-medium text-foreground">{item.responsable}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </WireframeDashboardLayout>
  );
}
