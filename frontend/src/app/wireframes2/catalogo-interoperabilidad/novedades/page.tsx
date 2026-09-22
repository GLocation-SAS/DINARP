"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  AlertTriangle,
  FolderArchive,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  Info,
  HelpCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";
import { WireframeBreadcrumbs } from "../../components/wireframe-breadcrumbs";
import { INITIAL_NOVEDADES, type NovedadCatalogo, type TipoNovedad } from "../data/catalogo-data";

export default function NovedadesListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("ALL");

  const novedadesFiltradas = useMemo(() => {
    return INITIAL_NOVEDADES.filter(nov => {
      const matchSearch =
        searchTerm === "" ||
        nov.nroTramite.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nov.organismoSolicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nov.documentoSoporteOficio.numeroOficio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nov.fuentesAfectadas.some(fa => fa.fuenteNombre.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchTipo = tipoFilter === "ALL" || nov.tipoNovedad === tipoFilter;

      return matchSearch && matchTipo;
    });
  }, [searchTerm, tipoFilter]);

  return (
    <WireframeDashboardLayout
      activeMenu="novedades"
      breadcrumbs={[
        { label: "Catálogo de Interoperabilidad", href: "/wireframes2/catalogo-interoperabilidad" },
        { label: "Novedades" }
      ]}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Trazabilidad Funcional & Banner */}
        <div className="bg-surface border border-border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-sm shrink-0">
              <FileText className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Catálogo de Interoperabilidad • Novedades del Catálogo
                </span>
                <Badge tone="neutral" appearance="soft" size="sm">
                  01b_novedades_catalogo.mmd
                </Badge>
                <Badge tone="neutral" appearance="outline" size="sm">
                  HU-INT-16 a HU-INT-19
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tratamiento legal y funcional de requerimientos de <strong>Eliminación, Supresión y Fusión</strong>. Las fuentes afectadas pasan al estado <code className="text-foreground font-mono">DESACTIVADO</code> conservando su historial (sin borrado físico).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/wireframes2/catalogo-interoperabilidad/gestion">
                <Layers className="size-4 mr-1.5" />
                Ver Gestión
              </Link>
            </Button>
          </div>
        </div>

        {/* Header Principal */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-border pb-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Novedades del Catálogo
            </h1>
            <p className="text-sm text-muted-foreground max-w-3xl">
              Recepción y resolución de trámites regulatorios solicitados por instituciones emisoras para modificar la disponibilidad de servicios en el catálogo.
            </p>
          </div>
        </div>

        {/* Tipos Confirmados vs. Propuesta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card size="sm" className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge tone="neutral" appearance="soft" size="sm">Confirmado</Badge>
              </div>
              <CardTitle className="text-sm font-semibold mt-1">Eliminación de Fuente</CardTitle>
            </CardHeader>
            <CardContent className="text-[11px] text-muted-foreground pt-0 leading-relaxed">
              Solicitud de retiro definitivo por cese legal de competencia o extinción del servicio.
            </CardContent>
          </Card>

          <Card size="sm" className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge tone="neutral" appearance="soft" size="sm">Confirmado</Badge>
              </div>
              <CardTitle className="text-sm font-semibold mt-1">Supresión de Fuente</CardTitle>
            </CardHeader>
            <CardContent className="text-[11px] text-muted-foreground pt-0 leading-relaxed">
              Baja operativa por sustitución de plataforma tecnológica o reemplazo de API.
            </CardContent>
          </Card>

          <Card size="sm" className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge tone="neutral" appearance="soft" size="sm">Confirmado</Badge>
              </div>
              <CardTitle className="text-sm font-semibold mt-1">Fusión de Fuentes</CardTitle>
            </CardHeader>
            <CardContent className="text-[11px] text-muted-foreground pt-0 leading-relaxed">
              Unificación de dos o más servicios. Dispara notificación formal al Coordinador SINARP (HU-INT-19).
            </CardContent>
          </Card>

          <Card size="sm" className="bg-muted/20 border-dashed border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge tone="neutral" appearance="outline" size="sm" className="text-[10px]">
                  Propuesta pendiente
                </Badge>
              </div>
              <CardTitle className="text-sm font-semibold mt-1 text-muted-foreground">Actualización de Esquema</CardTitle>
            </CardHeader>
            <CardContent className="text-[11px] text-muted-foreground pt-0 leading-relaxed">
              Propuesta UX para cambio de campos sin eliminar la fuente (Pendiente de validación normativa).
            </CardContent>
          </Card>
        </div>

        {/* Buscador y Filtro */}
        <Card size="sm" className="bg-card border-border">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número de trámite, oficio u organismo solicitante..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            <div className="w-full md:w-64">
              <select
                value={tipoFilter}
                onChange={e => setTipoFilter(e.target.value)}
                className="w-full text-xs h-9 px-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                <option value="ALL">Todos los Tipos de Novedad</option>
                <option value="Eliminación">Eliminación</option>
                <option value="Supresión">Supresión</option>
                <option value="Fusión">Fusión</option>
                <option value="Actualización de esquema (Propuesta)">Actualización de esquema (Propuesta)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Novedades */}
        <div className="border border-border rounded-xl bg-card overflow-hidden shadow-xs">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-heading text-base font-bold text-foreground">
                Requerimientos de Novedades Radicados
              </h2>
              <p className="text-xs text-muted-foreground">
                Mostrando {novedadesFiltradas.length} trámites de novedades
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Trámite / Fecha</th>
                  <th className="py-3 px-4">Tipo de Novedad</th>
                  <th className="py-3 px-4">Organismo Requirente</th>
                  <th className="py-3 px-4">Oficio Soporte</th>
                  <th className="py-3 px-4">Fuentes Afectadas</th>
                  <th className="py-3 px-4 text-center">Estado Dictamen</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {novedadesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No se encontraron requerimientos de novedades.
                    </td>
                  </tr>
                ) : (
                  novedadesFiltradas.map(nov => (
                    <tr key={nov.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono font-medium text-foreground">{nov.nroTramite}</span>
                          <span className="text-[11px] text-muted-foreground">{nov.fechaRadicacion}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge tone="neutral" appearance="soft" size="sm">
                          {nov.tipoNovedad}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        {nov.organismoSolicitante}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                        {nov.documentoSoporteOficio.numeroOficio}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          {nov.fuentesAfectadas.map(fa => (
                            <div key={fa.fuenteId} className="flex items-center gap-1.5 text-[11px]">
                              <span className="font-medium text-foreground">{fa.fuenteNombre}</span>
                              <Badge tone="neutral" appearance="outline" size="sm" className="text-[10px]">
                                {fa.estadoNuevo}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge tone="neutral" appearance="outline" size="sm" className="font-semibold">
                          {nov.estado}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button variant="secondary" size="sm" asChild className="text-xs gap-1">
                          <Link href={`/wireframes2/catalogo-interoperabilidad/novedades/${nov.id}`}>
                            Tratar Novedad
                            <ChevronRight className="size-3.5" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </WireframeDashboardLayout>
  );
}
