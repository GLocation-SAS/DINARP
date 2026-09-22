"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  PlusCircle,
  Search,
  Filter,
  Layers,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  Info,
  ShieldCheck,
  Server,
  Lock,
  Check,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";
import { WireframeBreadcrumbs } from "../../components/wireframe-breadcrumbs";
import {
  INITIAL_EXPEDIENTES,
  ETAPAS_EXPEDIENTE_CONFIG,
  ROLES_CONFIG,
  MOCK_USERS_BY_ROLE,
  type ExpedienteIntegracion,
  type UserRole,
  type MockUser
} from "../data/catalogo-data";

export default function IntegracionesListPage() {
  const [activeRole, setActiveRole] = useState<UserRole>("COORDINADOR_SINARP");
  const [searchTerm, setSearchTerm] = useState("");
  const [rolFilter, setRolFilter] = useState<string>("ALL");
  const [estadoFilter, setEstadoFilter] = useState<string>("ALL");

  const currentUser = MOCK_USERS_BY_ROLE[activeRole];

  const expedientesFiltrados = useMemo(() => {
    return INITIAL_EXPEDIENTES.filter(exp => {
      const matchSearch =
        searchTerm === "" ||
        exp.codigoExpediente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.nombreFuente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.institucionNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.institucionSigla.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRol = rolFilter === "ALL" || exp.responsableActualRol === rolFilter;
      const matchEstado = estadoFilter === "ALL" || exp.estadoGeneral === estadoFilter;

      return matchSearch && matchRol && matchEstado;
    });
  }, [searchTerm, rolFilter, estadoFilter]);

  // Permisos según el rol simulado
  const rolePermissions = {
    COORDINADOR_SINARP: {
      canCreate: true,
      allowed: [
        "Crear nueva solicitud de integración de fuente",
        "Registrar datos preliminares y campos candidatos",
        "Cargar documentación de soporte (Res. 004)",
        "Enviar expediente a revisión formal ante DINARP",
        "Corregir únicamente observaciones realizadas por DGR y reenviar",
        "Consultar estado del expediente, bitácora y notificaciones de cierre"
      ],
      restricted: [
        "No puede clasificar campos DPI (Accesible/Confidencial)",
        "No puede emitir aprobación funcional DGR",
        "No puede configurar microservicios ni endpoints DTD",
        "No puede ejecutar el paso a producción"
      ]
    },
    DGR: {
      canCreate: false,
      allowed: [
        "Revisar documentación y campos candidatos",
        "Aprobar revisión documental o solicitar correcciones específicas",
        "Registrar observaciones a nivel de campo o documento",
        "Validar pruebas funcionales en preproducción (Favorable / No Favorable)",
        "Registrar reporte de errores técnicos",
        "Aprobar formalmente la integración mediante formulario automatizado",
        "Consultar el expediente completo e historial inmutable"
      ],
      restricted: [
        "No puede radicar nuevas solicitudes en nombre de instituciones emisoras",
        "No puede realizar clasificación jurídica de datos DPI",
        "No puede configurar ni desplegar microservicios en infraestructura DTD"
      ]
    },
    DTD: {
      canCreate: false,
      allowed: [
        "Realizar validación técnica preliminar y registrar estado OCULTO",
        "Registrar y configurar microservicio integrador",
        "Registrar versión y endpoint en ambiente de preproducción",
        "Solventar incidencias técnicas reportadas por DGR y redesplegar",
        "Registrar endpoint productivo, versión final y ejecutar paso a producción",
        "Disparar notificación automática de cierre de integración"
      ],
      restricted: [
        "No puede radicar solicitudes iniciales",
        "No puede emitir dictámenes de clasificación de datos DPI",
        "No puede emitir la aprobación funcional y regulatoria DGR"
      ]
    },
    DPI: {
      canCreate: false,
      allowed: [
        "Revisar los atributos y campos de datos de la fuente candidata",
        "Clasificar cada campo de forma inmutable como Accesible o Confidencial",
        "Cargar el Informe Técnico Oficial de Clasificación de Datos (PDF)",
        "Consultar la información necesaria del expediente y base legal"
      ],
      restricted: [
        "No puede radicar nuevas fuentes",
        "No puede corregir documentación técnica ni funcional",
        "No puede aprobar la integración global (competencia DGR)",
        "No puede realizar despliegues ni configuración de microservicios (competencia DTD)"
      ]
    }
  };

  const currentPerms = rolePermissions[activeRole];

  return (
    <WireframeDashboardLayout
      activeMenu="integraciones"
      currentRole={activeRole}
      breadcrumbs={[
        { label: "Catálogo de Interoperabilidad", href: "/wireframes2/catalogo-interoperabilidad" },
        { label: "Integración de Fuentes" }
      ]}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Simulador Interactivo de Roles */}
        <div className="bg-surface border-2 border-border rounded-xl p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-sm shrink-0">
                <UserCheck className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Simulador de Rol Activo para Demostración
                  </span>
                  <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold">
                    {currentUser.name} ({currentUser.roleTitle.split("(")[0].trim()})
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cambia de usuario para simular dinámicamente permisos, botones habilitados, formularios y vistas sin recargar la página.
                </p>
              </div>
            </div>

            {/* Selector de 4 Actores */}
            <div className="flex flex-wrap items-center gap-1.5 shrink-0 bg-muted/40 p-1.5 rounded-lg border border-border">
              {(Object.keys(MOCK_USERS_BY_ROLE) as UserRole[]).map(roleKey => {
                const u = MOCK_USERS_BY_ROLE[roleKey];
                const isSelected = activeRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => setActiveRole(roleKey)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${isSelected
                      ? "bg-foreground text-background shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    <span className="font-mono text-[10px] opacity-80">{u.initials}</span>
                    <span>{u.name.split(" ")[0]} ({ROLES_CONFIG[roleKey].shortName})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resumen de Permisos del Rol Seleccionado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg border border-border bg-card space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <Check className="size-4 text-foreground" />
                Acciones y Permisos Habilitados ({currentUser.name})
              </div>
              <ul className="space-y-1 text-muted-foreground text-[11px]">
                {currentPerms.allowed.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-foreground font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                <X className="size-4 text-muted-foreground" />
                Restricciones Normativas del Rol
              </div>
              <ul className="space-y-1 text-muted-foreground text-[11px]">
                {currentPerms.restricted.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 opacity-90">
                    <span className="text-muted-foreground font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Header Principal con Botón Condicional */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-border pb-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Integración de Fuentes
            </h1>
            <p className="text-sm text-muted-foreground max-w-3xl">
              Gestión del ciclo de vida para incorporar nuevas fuentes al Catálogo Nacional de Interoperabilidad.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentPerms.canCreate ? (
              <Button variant="primary" size="sm" asChild>
                <Link href="/wireframes2/catalogo-interoperabilidad/integraciones/nueva">
                  <PlusCircle className="size-4 mr-1.5" />
                  Nueva Integración de Fuente
                </Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Badge tone="neutral" appearance="outline" size="sm" className="text-[11px] py-1 border-dashed">
                  Solo Coordinador SINARP puede radicar
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <Card size="sm" className="bg-card border-border">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código de expediente, fuente o institución..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
              <div className="w-full md:w-56">
                <select
                  value={rolFilter}
                  onChange={e => setRolFilter(e.target.value)}
                  className="w-full text-xs h-9 px-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                >
                  <option value="ALL">Todos los Responsables</option>
                  <option value="COORDINADOR_SINARP">Coordinador SINARP</option>
                  <option value="DGR">DGR (Gestión y Registro)</option>
                  <option value="DTD">DTD (Tecnología)</option>
                  <option value="DPI">DPI (Protección)</option>
                </select>
              </div>

              <div className="w-full md:w-52">
                <select
                  value={estadoFilter}
                  onChange={e => setEstadoFilter(e.target.value)}
                  className="w-full text-xs h-9 px-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                >
                  <option value="ALL">Todos los Estados</option>
                  <option value="En revisión DGR">En revisión DGR</option>
                  <option value="Con observaciones">Con observaciones</option>
                  <option value="En validación técnica DTD">En validación técnica DTD</option>
                  <option value="En integración y clasificación">En integración y clasificación</option>
                  <option value="En validación preproducción">En validación preproducción</option>
                  <option value="Aprobada">Aprobada</option>
                  <option value="Integrada">Integrada</option>
                </select>
              </div>

              {(searchTerm || rolFilter !== "ALL" || estadoFilter !== "ALL") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setRolFilter("ALL");
                    setEstadoFilter("ALL");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Limpiar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Expedientes */}
        <div className="border border-border rounded-xl bg-card overflow-hidden shadow-xs">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-heading text-base font-bold text-foreground">
                Expedientes en Trámite
              </h2>
              <p className="text-xs text-muted-foreground">
                Mostrando {expedientesFiltrados.length} expedientes activos
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Código / Trámite</th>
                  <th className="py-3 px-4">Institución Solicitante</th>
                  <th className="py-3 px-4">Fuente Propuesta</th>
                  <th className="py-3 px-4">Etapa del Expediente</th>
                  <th className="py-3 px-4">Responsable Actual</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4">Última Actualización</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {expedientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      No se encontraron expedientes con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  expedientesFiltrados.map(exp => {
                    const etapaConfig = ETAPAS_EXPEDIENTE_CONFIG[exp.etapaActual];
                    const isMyResponsibility = exp.responsableActualRol === activeRole;

                    return (
                      <tr key={exp.id} className={`transition-colors ${isMyResponsibility ? "bg-muted/30" : "hover:bg-muted/20"}`}>
                        <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                          {exp.codigoExpediente}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-foreground">{exp.institucionSigla}</span>
                            <span className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs">{exp.institucionNombre}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-foreground">{exp.nombreFuente}</span>
                            <span className="font-mono text-[11px] text-muted-foreground">{exp.codigoFuente}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-0.5 max-w-xs">
                            <span className="font-medium text-foreground">
                              Etapa {etapaConfig.numero}: {etapaConfig.nombre}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {etapaConfig.huRef}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-0.5">
                            <Badge tone="neutral" appearance={isMyResponsibility ? "soft" : "outline"} size="sm" className="w-fit">
                              {ROLES_CONFIG[exp.responsableActualRol].shortName}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground">{exp.responsableActualNombre}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Badge tone="neutral" appearance="outline" size="sm" className="font-semibold">
                            {exp.estadoGeneral}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-muted-foreground">
                          {exp.ultimaActualizacion}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant={isMyResponsibility ? "primary" : "secondary"}
                            size="sm"
                            asChild
                            className="text-xs gap-1"
                          >
                            <Link href={`/wireframes2/catalogo-interoperabilidad/integraciones/${exp.id}`}>
                              {isMyResponsibility ? "Gestionar Trámite" : "Ver Expediente"}
                              <ChevronRight className="size-3.5" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </WireframeDashboardLayout>
  );
}
