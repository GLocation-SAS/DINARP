"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  FileText,
  Plus,
  Trash2,
  Upload,
  Info,
  CheckCircle2,
  Save,
  Send,
  HelpCircle,
  AlertCircle,
  UserCheck,
  Check,
  X,
  Lock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WireframeDashboardLayout } from "../../../components/wireframe-dashboard-layout";
import { WireframeBreadcrumbs } from "../../../components/wireframe-breadcrumbs";
import {
  INITIAL_INSTITUCIONES,
  ROLES_CONFIG,
  MOCK_USERS_BY_ROLE,
  type CampoCatalogo,
  type DocumentoSoporte,
  type UserRole
} from "../../data/catalogo-data";

export default function NuevaIntegracionPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<UserRole>("COORDINADOR_SINARP");

  const currentUser = MOCK_USERS_BY_ROLE[activeRole];
  const isCoordinador = activeRole === "COORDINADOR_SINARP";

  // Paso 1: Datos de la Institución y Fuente
  const [selectedInstId, setSelectedInstId] = useState("INST-001");
  const [nombreFuente, setNombreFuente] = useState("");
  const [codigoSugerido, setCodigoSugerido] = useState("");
  const [descripcionFuente, setDescripcionFuente] = useState("");
  const [baseLegal, setBaseLegal] = useState("");
  const [tipoConsumo, setTipoConsumo] = useState("REST / JSON (Sincrónico)");

  // Documentos Soporte (Res. 004 Art. 12)
  const [documentos, setDocumentos] = useState<DocumentoSoporte[]>([
    {
      id: "DOC-01",
      nombre: "Oficio formal de solicitud de alta de fuente",
      tipoRequerido: "Oficio Institucional (PDF Firmado Electrónicamente)",
      archivoNombre: "Oficio_Solicitud_Alta_RC_2026.pdf",
      fechaCarga: "22/09/2026",
      estadoRevision: "Pendiente",
      esReferencial: true,
    },
    {
      id: "DOC-02",
      nombre: "Diccionario técnico preliminar y especificación OpenAPI / WSDL",
      tipoRequerido: "Especificación Técnica (JSON / YAML / WSDL)",
      archivoNombre: "Especificacion_Tecnica_DatosIdentidad.json",
      fechaCarga: "22/09/2026",
      estadoRevision: "Pendiente",
      esReferencial: true,
    },
    {
      id: "DOC-03",
      nombre: "Matriz de justificación legal por atributo de dato (Borrador)",
      tipoRequerido: "Matriz Legal (PDF / Excel)",
      archivoNombre: "",
      estadoRevision: "Pendiente",
      esReferencial: true,
    },
    {
      id: "DOC-04",
      nombre: "Designación formal del Coordinador SINARP (Titular / Suplente)",
      tipoRequerido: "Acto Administrativo de Designación (PDF)",
      archivoNombre: "Resolucion_Designacion_Coordinador.pdf",
      fechaCarga: "22/09/2026",
      estadoRevision: "Pendiente",
      esReferencial: true,
    }
  ]);

  // Campos Candidatos
  const [campos, setCampos] = useState<Array<{ id: string; nombre: string; tipo: string; descripcion: string }>>([
    { id: "c1", nombre: "cedula", tipo: "String (10)", descripcion: "Número único de cédula de ciudadanía" },
    { id: "c2", nombre: "nombresCompletos", tipo: "String (150)", descripcion: "Nombres y apellidos completos del titular" },
    { id: "c3", nombre: "fechaNacimiento", tipo: "Date (YYYY-MM-DD)", descripcion: "Fecha de nacimiento registrada en el tomo" },
  ]);

  const [nuevoCampoNombre, setNuevoCampoNombre] = useState("");
  const [nuevoCampoTipo, setNuevoCampoTipo] = useState("String");
  const [nuevoCampoDesc, setNuevoCampoDesc] = useState("");

  const handleAgregarCampo = () => {
    if (!nuevoCampoNombre.trim() || !isCoordinador) return;
    setCampos(prev => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        nombre: nuevoCampoNombre.trim(),
        tipo: nuevoCampoTipo,
        descripcion: nuevoCampoDesc.trim() || "Sin descripción",
      }
    ]);
    setNuevoCampoNombre("");
    setNuevoCampoDesc("");
  };

  const handleEliminarCampo = (id: string) => {
    if (!isCoordinador) return;
    setCampos(prev => prev.filter(c => c.id !== id));
  };

  const handleRadicar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCoordinador) {
      alert("Acción no permitida: Solo el Coordinador SINARP puede radicar una nueva fuente.");
      return;
    }
    alert("Expediente radicado formalmente ante DINARP. Se ha generado el trámite EXP-2026-003 y notificado a la Dirección de Gestión y Registro (DGR) para revisión documental (HU-INT-04).");
    router.push("/wireframes2/catalogo-interoperabilidad/integraciones");
  };

  return (
    <WireframeDashboardLayout
      activeMenu="integraciones"
      currentRole={activeRole}
      breadcrumbs={[
        { label: "Catálogo de Interoperabilidad", href: "/wireframes2/catalogo-interoperabilidad" },
        { label: "Integración de Fuentes", href: "/wireframes2/catalogo-interoperabilidad/integraciones" },
        { label: "Nueva Integración" }
      ]}
    >
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Barra Superior de Retorno */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/wireframes2/catalogo-interoperabilidad/integraciones">
              <ArrowLeft className="size-4" />
              Volver a Integración de Fuentes
            </Link>
          </Button>

          <Badge tone="neutral" appearance="soft" size="sm">
            HU-INT-01 a HU-INT-03
          </Badge>
        </div>

        {/* Simulador Interactivo de Roles */}
        <div className="bg-surface border-2 border-border rounded-xl p-4 flex flex-col gap-3 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <UserCheck className="size-5 text-foreground shrink-0" />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Simulador de Rol en Formulario
                </span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-xs font-bold text-foreground">
                  {currentUser.name} ({currentUser.roleTitle.split("(")[0].trim()})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 shrink-0 bg-muted/40 p-1 rounded-lg border border-border">
              {(Object.keys(MOCK_USERS_BY_ROLE) as UserRole[]).map(roleKey => {
                const u = MOCK_USERS_BY_ROLE[roleKey];
                const isSelected = activeRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => setActiveRole(roleKey)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
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

          {!isCoordinador && (
            <div className="p-3 bg-muted/30 border border-border rounded-lg flex items-start gap-2.5 text-xs text-muted-foreground">
              <Lock className="size-4 text-foreground mt-0.5 shrink-0" />
              <div>
                <strong className="text-foreground font-semibold">Modo Solo Lectura ({currentUser.roleTitle}):</strong>
                <p className="mt-0.5">
                  Este actor no tiene facultades para crear ni radicar solicitudes de alta de fuentes. Solo el <strong className="text-foreground">Coordinador SINARP (Andrea López)</strong> puede editar y enviar este formulario inicial.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Encabezado del Trámite */}
        <div className="border border-border rounded-xl bg-card p-6 flex flex-col gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <Badge tone="neutral" appearance="soft" size="sm">
              Etapa 1: Solicitud de Alta de Fuente
            </Badge>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-mono text-muted-foreground">Borrador de Expediente</span>
          </div>

          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Registro de Nueva Fuente de Interoperabilidad
          </h1>

          <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
            Formulario institucional para la radicación formal de una fuente de datos o servicio digital de consulta. El Coordinador SINARP aporta la información preliminar, adjunta los documentos habilitantes y define los campos candidatos a interoperar.
          </p>
        </div>

        {/* Advertencia Legal sobre Documentos Soporte */}
        <div className="bg-surface border border-border rounded-xl p-4 flex items-start gap-4">
          <Info className="size-5 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground font-semibold">Aviso sobre Requisitos Documentales (Res. 004-DN-2023):</strong>
            <p className="mt-0.5">
              Los documentos de soporte listados corresponden a la práctica operativa referencial de DINARP. <span className="font-semibold text-foreground">El listado exacto y definitivo de adjuntos obligatorios se encuentra pendiente de validación formal</span> por la Dirección de Gestión y Registro.
            </p>
          </div>
        </div>

        <form onSubmit={handleRadicar} className="space-y-6">

          {/* Bloque 1: Identificación Institucional y de la Fuente */}
          <Card size="sm" className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />
                1. Datos de la Institución y Fuente Solicitada
              </CardTitle>
              <CardDescription className="text-xs">
                Información general del servicio digital que se integrará al Sistema Nacional de Registro de Datos Públicos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <fieldset disabled={!isCoordinador} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-foreground">Institución Emisora *</Label>
                    <select
                      value={selectedInstId}
                      onChange={e => setSelectedInstId(e.target.value)}
                      className="w-full text-xs h-9 px-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-60"
                      required
                    >
                      {INITIAL_INSTITUCIONES.map(inst => (
                        <option key={inst.id} value={inst.id}>
                          {inst.sigla} — {inst.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-foreground">Código Sugerido del Servicio</Label>
                    <Input
                      placeholder="Ej. RC-DAT-IDENT-001"
                      value={codigoSugerido}
                      onChange={e => setCodigoSugerido(e.target.value)}
                      className="text-xs bg-background font-mono disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-foreground">Nombre Oficial de la Fuente / Servicio *</Label>
                  <Input
                    placeholder="Ej. Consulta de Datos de Identidad y Registro Civil"
                    value={nombreFuente}
                    onChange={e => setNombreFuente(e.target.value)}
                    className="text-xs bg-background disabled:opacity-60"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-foreground">Descripción y Propósito Funcional *</Label>
                  <Textarea
                    placeholder="Describa el objetivo de la fuente, a qué trámites o consultas ciudadanas servirá y la naturaleza de los registros provistos..."
                    value={descripcionFuente}
                    onChange={e => setDescripcionFuente(e.target.value)}
                    className="text-xs bg-background min-h-[75px] disabled:opacity-60"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-foreground">Base Legal Habilitante *</Label>
                    <Input
                      placeholder="Ej. Ley Orgánica de Gestión de la Identidad y Datos Civiles Art. 85"
                      value={baseLegal}
                      onChange={e => setBaseLegal(e.target.value)}
                      className="text-xs bg-background disabled:opacity-60"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-foreground">Tipo / Modalidad de Consumo Propuesto *</Label>
                    <select
                      value={tipoConsumo}
                      onChange={e => setTipoConsumo(e.target.value)}
                      className="w-full text-xs h-9 px-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-60"
                    >
                      <option value="REST / JSON (Sincrónico)">Servicio Web REST / JSON (Sincrónico)</option>
                      <option value="SOAP / XML (Sincrónico)">Servicio Web SOAP / XML (Sincrónico)</option>
                      <option value="Intercambio Masivo (Batch / SFTP)">Intercambio Masivo Asincrónico (Batch / SFTP)</option>
                    </select>
                  </div>
                </div>
              </fieldset>
            </CardContent>
          </Card>

          {/* Bloque 2: Documentación de Soporte */}
          <Card size="sm" className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                2. Documentación Habilitante de Soporte
              </CardTitle>
              <CardDescription className="text-xs">
                Archivos obligatorios y referenciales para la revisión formal por parte de DGR y DTD.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Requisito Documental</th>
                      <th className="py-2.5 px-3">Formato Esperado</th>
                      <th className="py-2.5 px-3">Archivo Adjunto</th>
                      <th className="py-2.5 px-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {documentos.map(doc => (
                      <tr key={doc.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-medium text-foreground">
                          {doc.nombre}
                          {doc.esReferencial && (
                            <span className="block text-[10px] text-muted-foreground font-normal">
                              (Referencial • sujeto a validación DGR)
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">{doc.tipoRequerido}</td>
                        <td className="py-2.5 px-3">
                          {doc.archivoNombre ? (
                            <span className="font-mono text-foreground font-medium flex items-center gap-1.5">
                              <FileText className="size-3 text-muted-foreground" />
                              {doc.archivoNombre}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">No cargado</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={!isCoordinador}
                            className="text-[11px] h-7 gap-1"
                            onClick={() => {
                              if (!isCoordinador) return;
                              setDocumentos(prev =>
                                prev.map(d =>
                                  d.id === doc.id
                                    ? { ...d, archivoNombre: `Archivo_${doc.id}_Adjunto.pdf`, fechaCarga: "22/09/2026" }
                                    : d
                                )
                              );
                            }}
                          >
                            <Upload className="size-3" />
                            {doc.archivoNombre ? "Reemplazar" : "Cargar"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Bloque 3: Estructura de Campos Candidatos */}
          <Card size="sm" className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    3. Definición de Campos Candidatos a Interoperar ({campos.length})
                  </CardTitle>
                  <CardDescription className="text-xs">
                    El Coordinador SINARP define los campos técnicos y su descripción funcional. La clasificación (Accesible/Confidencial) la realizará la DPI en la Etapa 5.
                  </CardDescription>
                </div>
                <Badge tone="neutral" appearance="outline" size="sm">
                  Clasificación por DPI en Etapa 5
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Nombre del Campo</th>
                      <th className="py-2.5 px-3">Tipo de Dato</th>
                      <th className="py-2.5 px-3">Descripción Funcional</th>
                      <th className="py-2.5 px-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {campos.map(c => (
                      <tr key={c.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-mono font-medium text-foreground">{c.nombre}</td>
                        <td className="py-2.5 px-3">
                          <Badge tone="neutral" appearance="soft" size="sm">
                            {c.tipo}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">{c.descripcion}</td>
                        <td className="py-2.5 px-3 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={!isCoordinador}
                            onClick={() => handleEliminarCampo(c.id)}
                            className="text-muted-foreground hover:text-foreground h-7 px-2"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Formulario para Añadir Nuevo Campo */}
              {isCoordinador && (
                <div className="p-3 rounded-lg border border-dashed border-border bg-muted/20 flex flex-col md:flex-row items-end gap-3">
                  <div className="flex-1 w-full space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Nombre del Campo</Label>
                    <Input
                      placeholder="Ej. direccionDomicilio"
                      value={nuevoCampoNombre}
                      onChange={e => setNuevoCampoNombre(e.target.value)}
                      className="text-xs bg-background font-mono h-8"
                    />
                  </div>
                  <div className="w-full md:w-36 space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Tipo de Dato</Label>
                    <select
                      value={nuevoCampoTipo}
                      onChange={e => setNuevoCampoTipo(e.target.value)}
                      className="w-full text-xs h-8 px-2 rounded-md border border-border bg-background text-foreground"
                    >
                      <option value="String">String</option>
                      <option value="Number">Number</option>
                      <option value="Date">Date</option>
                      <option value="Boolean">Boolean</option>
                      <option value="Object / Array">Object / Array</option>
                    </select>
                  </div>
                  <div className="flex-1 w-full space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Descripción</Label>
                    <Input
                      placeholder="Ej. Dirección de residencia habitual"
                      value={nuevoCampoDesc}
                      onChange={e => setNuevoCampoDesc(e.target.value)}
                      className="text-xs bg-background h-8"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAgregarCampo}
                    className="h-8 text-xs shrink-0 gap-1"
                  >
                    <Plus className="size-3.5" />
                    Agregar Campo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botonera de Envío y Guardado */}
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              Al radicar, el expediente avanza a la <strong className="text-foreground">Etapa 2 (Revisión DGR)</strong> sin reiniciar números de trámite.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Button type="button" variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
                <Link href="/wireframes2/catalogo-interoperabilidad/integraciones">
                  Cancelar
                </Link>
              </Button>
              {isCoordinador ? (
                <>
                  <Button type="button" variant="secondary" size="sm" className="text-xs gap-1.5">
                    <Save className="size-3.5" />
                    Guardar Borrador
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="text-xs gap-1.5 font-semibold">
                    <Send className="size-3.5" />
                    Radicar Expediente ante DINARP (HU-INT-03)
                  </Button>
                </>
              ) : (
                <Badge tone="neutral" appearance="outline" size="sm" className="py-1.5 px-3 text-xs border-dashed">
                  Acción bloqueada para {currentUser.roleTitle.split("(")[0].trim()}
                </Badge>
              )}
            </div>
          </div>

        </form>

      </div>
    </WireframeDashboardLayout>
  );
}
