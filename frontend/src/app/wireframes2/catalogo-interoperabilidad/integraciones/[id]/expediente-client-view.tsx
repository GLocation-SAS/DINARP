"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowLeftRight,
  Building2,
  FileText,
  Layers,
  ShieldCheck,
  Server,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Upload,
  RefreshCw,
  Lock,
  EyeOff,
  Eye,
  Check,
  X,
  MessageSquare,
  AlertTriangle,
  FileCheck,
  Sparkles,
  Info,
  ChevronRight,
  ExternalLink
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
  ROLES_CONFIG,
  ETAPAS_EXPEDIENTE_CONFIG,
  MOCK_USERS_BY_ROLE,
  type ExpedienteIntegracion,
  type UserRole,
  type EtapaExpediente,
  type CampoCatalogo,
  type EventoHistorial,
  type MockUser
} from "../../data/catalogo-data";

interface ExpedienteClientViewProps {
  initialExpediente: ExpedienteIntegracion;
}

export function ExpedienteClientView({ initialExpediente }: ExpedienteClientViewProps) {
  const [expediente, setExpediente] = useState<ExpedienteIntegracion>(initialExpediente);
  const [activeRole, setActiveRole] = useState<UserRole>(initialExpediente.responsableActualRol);

  // Estados de formularios contextuales
  // DGR Observaciones (Paso 2)
  const [obsTipo, setObsTipo] = useState<"campo" | "documento" | "informacion">("campo");
  const [obsElementoId, setObsElementoId] = useState("");
  const [obsTexto, setObsTexto] = useState("");
  const [mostrarModalObs, setMostrarModalObs] = useState(false);

  // Coordinador Corrección (Paso 3)
  const [correccionTexto, setCorreccionTexto] = useState("");

  // DPI Clasificación (Paso 5)
  const [dpiInformeNro, setDpiInformeNro] = useState("INF-DPI-2026-0044");
  const [dpiInformePdf, setDpiInformePdf] = useState("Informe_Tecnico_Clasificacion_DPI.pdf");
  const [dpiCampos, setDpiCampos] = useState<CampoCatalogo[]>(expediente.camposCandidatos);

  // DTD Despliegue Preproducción (Paso 5)
  const [dtdMicroservicio, setDtdMicroservicio] = useState("ms-rc-defunciones");
  const [dtdVersionPre, setDtdVersionPre] = useState("1.0.0-rc1");
  const [dtdEndpointPre, setDtdEndpointPre] = useState("https://pre-api.dinarp.gob.ec/v1/rc/defunciones");

  // DGR Validación Preproducción (Paso 6)
  const [validacionPreResultado, setValidacionPreResultado] = useState<"Favorable" | "No favorable">("Favorable");
  const [validacionPreErrores, setValidacionPreErrores] = useState("Error de timeout (504) al consultar con identificaciones mayores a 10 dígitos.");

  // DTD Corrección Error Loop (Paso 7)
  const [dtdSolucionError, setDtdSolucionError] = useState("Ajustado el pool de conexiones y validación de expresiones regulares en el microservicio.");
  const [dtdVersionNueva, setDtdVersionNueva] = useState("1.0.0-rc2");

  // DGR Aprobación Formulario (Paso 8)
  const [formularioNro, setFormularioNro] = useState("FORM-DGR-2026-089");
  const [formularioConclusiones, setFormularioConclusiones] = useState("Cumplidos todos los requisitos técnicos y documentales; integración validada favorablemente en preproducción.");

  // DTD Paso a Producción (Paso 9)
  const [endpointProd, setEndpointProd] = useState("https://api.dinarp.gob.ec/v1/rc/defunciones");
  const [versionProd, setVersionProd] = useState("1.0.0");

  // ==========================================
  // MANEJADORES DE TRANSICIÓN DE ETAPAS
  // ==========================================

  // Paso 2 -> 3: DGR emite observaciones
  const handleDgrSolicitarCorreccion = () => {
    if (!obsTexto.trim()) {
      alert("Ingrese la observación obligatoria.");
      return;
    }

    const nuevoEvento: EventoHistorial = {
      id: `h_${Date.now()}`,
      fecha: new Date().toLocaleDateString("es-EC"),
      hora: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      etapaNumero: 2,
      etapaNombre: "Revisión Documental y de Campos",
      actorRol: "DGR",
      actorNombre: "María Torres (DGR)",
      accion: `Solicitud de corrección en ${obsTipo}`,
      version: expediente.versionActual,
      observaciones: obsTexto,
      huRef: "HU-INT-04"
    };

    setExpediente(prev => ({
      ...prev,
      etapaActual: "ETAPA_3_CORRECCION_COORDINADOR",
      responsableActualRol: "COORDINADOR_SINARP",
      responsableActualNombre: "Andrea López (Coordinador SINARP)",
      estadoGeneral: "Con observaciones",
      ultimaActualizacion: "Justo ahora",
      historial: [nuevoEvento, ...prev.historial]
    }));

    setActiveRole("COORDINADOR_SINARP");
    setMostrarModalObs(false);
    setObsTexto("");
  };

  // Paso 2 -> 4: DGR aprueba requisitos iniciales y deriva a DTD
  const handleDgrAprobarRequisitos = () => {
    const nuevoEvento: EventoHistorial = {
      id: `h_${Date.now()}`,
      fecha: new Date().toLocaleDateString("es-EC"),
      hora: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      etapaNumero: 2,
      etapaNombre: "Revisión Documental y de Campos",
      actorRol: "DGR",
      actorNombre: "María Torres (DGR)",
      accion: "Aprobación documental y pase a validación técnica (Enlace A)",
      version: expediente.versionActual,
      detalles: "Requisitos documentales y pertinencia funcional conformes.",
      huRef: "HU-INT-04"
    };

    setExpediente(prev => ({
      ...prev,
      etapaActual: "ETAPA_4_VALIDACION_DTD",
      responsableActualRol: "DTD",
      responsableActualNombre: "Carlos Mena (DTD)",
      estadoGeneral: "En validación técnica DTD",
      ultimaActualizacion: "Justo ahora",
      historial: [nuevoEvento, ...prev.historial]
    }));

    setActiveRole("DTD");
  };

  // Paso 3 -> 2: Coordinador reenvía tras subsanar
  const handleCoordinadorReenviar = () => {
    const nuevoEvento: EventoHistorial = {
      id: `h_${Date.now()}`,
      fecha: new Date().toLocaleDateString("es-EC"),
      hora: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      etapaNumero: 3,
      etapaNombre: "Depuración y Subsanación",
      actorRol: "COORDINADOR_SINARP",
      actorNombre: "Andrea López (Coordinador SINARP)",
      accion: "Reenvío de información subsanada",
      version: "v1.0.1",
      detalles: correccionTexto || "Se subsanaron las observaciones sin reiniciar el trámite.",
      huRef: "HU-INT-05"
    };

    setExpediente(prev => ({
      ...prev,
      versionActual: "v1.0.1",
      etapaActual: "ETAPA_2_REVISION_DGR",
      responsableActualRol: "DGR",
      responsableActualNombre: "María Torres (DGR)",
      estadoGeneral: "En revisión DGR",
      ultimaActualizacion: "Justo ahora",
      historial: [nuevoEvento, ...prev.historial]
    }));

    setActiveRole("DGR");
    setCorreccionTexto("");
  };

  // Paso 4 -> 5: DTD valida técnicamente y pasa a OCULTO
  const handleDtdPasarOculto = () => {
    const nuevoEvento: EventoHistorial = {
      id: `h_${Date.now()}`,
      fecha: new Date().toLocaleDateString("es-EC"),
      hora: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      etapaNumero: 4,
      etapaNombre: "Validación Técnica e Ingreso a Catálogo",
      actorRol: "DTD",
      actorNombre: "Carlos Mena (DTD)",
      accion: "Validación técnica aprobada y registro en catálogo estado OCULTO",
      version: expediente.versionActual,
      detalles: "Fuente registrada internamente en estado OCULTO. Se inician actividades paralelas DPI y DTD.",
      huRef: "HU-INT-06 / HU-INT-07"
    };

    setExpediente(prev => ({
      ...prev,
      etapaActual: "ETAPA_5_PARALELO_DPI_DTD",
      responsableActualRol: "DPI",
      responsableActualNombre: "Daniela Ruiz (DPI) & Carlos Mena (DTD)",
      estadoGeneral: "En integración y clasificación",
      validacionTecnicaDTD: {
        aprobado: true,
        fecha: new Date().toLocaleDateString("es-EC"),
        responsable: "Carlos Mena (DTD)",
        estadoCatalogoAsignado: "OCULTO"
      },
      ultimaActualizacion: "Justo ahora",
      historial: [nuevoEvento, ...prev.historial]
    }));
  };

  // Paso 5: DPI clasifica campos
  const handleDpiGuardarClasificacion = () => {
    const nuevoEvento: EventoHistorial = {
      id: `h_${Date.now()}`,
      fecha: new Date().toLocaleDateString("es-EC"),
      hora: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      etapaNumero: 5,
      etapaNombre: "Clasificación de Campos DPI",
      actorRol: "DPI",
      actorNombre: "Daniela Ruiz (DPI)",
      accion: "Clasificación oficial de campos y carga de informe",
      version: expediente.versionActual,
      detalles: `Informe ${dpiInformeNro} adjuntado. Campos catalogados como Accesibles / Confidenciales.`,
      huRef: "HU-INT-08"
    };

    setExpediente(prev => ({
      ...prev,
      camposCandidatos: dpiCampos,
      clasificacionDPI: {
        completada: true,
        fecha: new Date().toLocaleDateString("es-EC"),
        responsable: "Daniela Ruiz (DPI)",
        numeroInforme: dpiInformeNro,
        informeAdjunto: dpiInformePdf
      },
      historial: [nuevoEvento, ...prev.historial]
    }));

    alert("Clasificación DPI guardada con éxito.");
  };

  // Paso 5: DTD registra despliegue en Preproducción y deriva a validación DGR (Paso 6)
  const handleDtdDesplegarPre = () => {
    const nuevoEvento: EventoHistorial = {
      id: `h_${Date.now()}`,
      fecha: new Date().toLocaleDateString("es-EC"),
      hora: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      etapaNumero: 5,
      etapaNombre: "Integración DTD en Preproducción",
      actorRol: "DTD",
      actorNombre: "Carlos Mena (DTD)",
      accion: "Microservicio desplegado en ambiente de preproducción",
      version: dtdVersionPre,
      detalles: `Endpoint: ${dtdEndpointPre}`,
      huRef: "HU-INT-09"
    };

    setExpediente(prev => ({
      ...prev,
      etapaActual: "ETAPA_6_VALIDACION_PRE_DGR",
      responsableActualRol: "DGR",
      responsableActualNombre: "María Torres (DGR)",
      estadoGeneral: "En validación preproducción",
      desplieguePreDTD: {
        completado: true,
        fecha: new Date().toLocaleDateString("es-EC"),
        responsable: "Carlos Mena (DTD)",
        microservicioNombre: dtdMicroservicio,
        version: dtdVersionPre,
        endpointPre: dtdEndpointPre
      },
      ultimaActualizacion: "Justo ahora",
      historial: [nuevoEvento, ...prev.historial]
    }));

    setActiveRole("DGR");
  };

  // Paso 6: DGR valida en Preproducción (Favorable -> Paso 8 | No Favorable -> Paso 7)
  const handleDgrValidarPre = () => {
    if (validacionPreResultado === "Favorable") {
      const nuevoEvento: EventoHistorial = {
        id: `h_${Date.now()}`,
        fecha: new Date().toLocaleDateString("es-EC"),
        hora: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
        etapaNumero: 6,
        etapaNombre: "Validación Funcional en Preproducción",
        actorRol: "DGR",
        actorNombre: "María Torres (DGR)",
        accion: "Resultado de validación FAVORABLE",
        version: expediente.versionActual,
        detalles: "Pruebas de consumo completadas sin incidencias. Se habilita formulario de aprobación.",
        huRef: "HU-INT-10"
      };

      setExpediente(prev => ({
        ...prev,
        etapaActual: "ETAPA_8_APROBACION_DGR",
        responsableActualRol: "DGR",
        responsableActualNombre: "María Torres (DGR)",
        estadoGeneral: "En validación preproducción",
        validacionPreDGR: {
          evaluada: true,
          resultado: "Favorable",
          fecha: new Date().toLocaleDateString("es-EC"),
          responsable: "María Torres (DGR)"
        },
        ultimaActualizacion: "Justo ahora",
        historial: [nuevoEvento, ...prev.historial]
      }));
    } else {
      // Loop de error -> DTD
      const nuevoEvento: EventoHistorial = {
        id: `h_${Date.now()}`,
        fecha: new Date().toLocaleDateString("es-EC"),
        hora: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
        etapaNumero: 6,
        etapaNombre: "Validación Funcional en Preproducción",
        actorRol: "DGR",
        actorNombre: "María Torres (DGR)",
        accion: "Resultado de validación NO FAVORABLE (Reporte de Error)",
        version: expediente.versionActual,
        observaciones: validacionPreErrores,
        huRef: "HU-INT-10"
      };

      setExpediente(prev => ({
        ...prev,
        etapaActual: "ETAPA_7_ERROR_TECNICO_LOOP",
        responsableActualRol: "DTD",
        responsableActualNombre: "Carlos Mena (DTD)",
        estadoGeneral: "En corrección técnica",
        validacionPreDGR: {
          evaluada: true,
          resultado: "No favorable",
          fecha: new Date().toLocaleDateString("es-EC"),
          responsable: "María Torres (DGR)",
          observacionesValidacion: validacionPreErrores
        },
        ultimaActualizacion: "Justo ahora",
        historial: [nuevoEvento, ...prev.historial]
      }));

      setActiveRole("DTD");
    }
  };

  // Paso 7: DTD solventa error técnico y redesplega (vuelve a Paso 6)
  const handleDtdSolventarError = () => {
    const nuevoEvento: EventoHistorial = {
      id: `h_${Date.now()}`,
      fecha: new Date().toLocaleDateString("es-EC"),
      hora: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      etapaNumero: 7,
      etapaNombre: "Corrección Técnica y Redespliegue",
      actorRol: "DTD",
      actorNombre: "Carlos Mena (DTD)",
      accion: "Error técnico solventado y nuevo despliegue",
      version: dtdVersionNueva,
      detalles: dtdSolucionError,
      huRef: "HU-INT-11"
    };

    setExpediente(prev => ({
      ...prev,
      versionActual: dtdVersionNueva,
      etapaActual: "ETAPA_6_VALIDACION_PRE_DGR",
      responsableActualRol: "DGR",
      responsableActualNombre: "María Torres (DGR)",
      estadoGeneral: "En validación preproducción",
      correccionTecnicaDTD: {
        atendida: true,
        fecha: new Date().toLocaleDateString("es-EC"),
        responsable: "Carlos Mena (DTD)",
        solucionAplicada: dtdSolucionError,
        nuevaVersion: dtdVersionNueva
      },
      ultimaActualizacion: "Justo ahora",
      historial: [nuevoEvento, ...prev.historial]
    }));

    setActiveRole("DGR");
  };

  // Paso 8: DGR aprueba la integración formalmente
  const handleDgrAprobarIntegracion = () => {
    const nuevoEvento: EventoHistorial = {
      id: `h_${Date.now()}`,
      fecha: new Date().toLocaleDateString("es-EC"),
      hora: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      etapaNumero: 8,
      etapaNombre: "Aprobación de la Integración",
      actorRol: "DGR",
      actorNombre: "María Torres (DGR)",
      accion: "Aprobación formal mediante formulario automatizado (Enlace C)",
      version: expediente.versionActual,
      detalles: `Formulario ${formularioNro} diligenciado. Pasa a DTD para paso a producción.`,
      huRef: "HU-INT-12"
    };

    setExpediente(prev => ({
      ...prev,
      etapaActual: "ETAPA_9_PRODUCCION_DTD",
      responsableActualRol: "DTD",
      responsableActualNombre: "Carlos Mena (DTD)",
      estadoGeneral: "Aprobada",
      aprobacionDGR: {
        aprobada: true,
        fecha: new Date().toLocaleDateString("es-EC"),
        responsable: "María Torres (DGR)",
        formularioAutomatizadoNro: formularioNro,
        conclusiones: formularioConclusiones
      },
      ultimaActualizacion: "Justo ahora",
      historial: [nuevoEvento, ...prev.historial]
    }));

    setActiveRole("DTD");
  };

  // Paso 9 -> 10: DTD registra paso a producción y notifica automáticamente
  const handleDtdPasoProduccion = () => {
    const eventoProd: EventoHistorial = {
      id: `h_${Date.now()}_prod`,
      fecha: new Date().toLocaleDateString("es-EC"),
      hora: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      etapaNumero: 9,
      etapaNombre: "Paso a Producción",
      actorRol: "DTD",
      actorNombre: "Carlos Mena (DTD)",
      accion: "Despliegue y pase a producción oficial",
      version: versionProd,
      detalles: `Endpoint Productivo: ${endpointProd}`,
      huRef: "HU-INT-13"
    };

    const eventoNotif: EventoHistorial = {
      id: `h_${Date.now()}_notif`,
      fecha: new Date().toLocaleDateString("es-EC"),
      hora: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      etapaNumero: 10,
      etapaNombre: "Notificación Automática de Cierre",
      actorRol: "COORDINADOR_SINARP",
      actorNombre: "Sistema Automatizado SURI / NOT",
      accion: "Correo electrónico enviado al Coordinador Titular y Suplente",
      version: versionProd,
      detalles: "Notificación automática: 'Fuente integrada y disponible en ambiente productivo'.",
      huRef: "HU-INT-14"
    };

    setExpediente(prev => ({
      ...prev,
      etapaActual: "ETAPA_10_NOTIFICACION_FINAL",
      responsableActualRol: "COORDINADOR_SINARP",
      responsableActualNombre: "Coordinador SINARP (Proceso Completado)",
      estadoGeneral: "Integrada",
      pasoProduccionDTD: {
        ejecutado: true,
        fecha: new Date().toLocaleDateString("es-EC"),
        responsable: "Carlos Mena (DTD)",
        endpointProd: endpointProd,
        versionProd: versionProd
      },
      notificacionFinal: {
        enviada: true,
        fecha: new Date().toLocaleDateString("es-EC"),
        destinatarios: ["andrea.lopez@registrocivil.gob.ec", "andrea.saltos@registrocivil.gob.ec"],
        asunto: `Fuente ${prev.nombreFuente} integrada exitosamente`
      },
      ultimaActualizacion: "Justo ahora",
      historial: [eventoNotif, eventoProd, ...prev.historial]
    }));

    setActiveRole("COORDINADOR_SINARP");
  };

  const etapaActualConfig = ETAPAS_EXPEDIENTE_CONFIG[expediente.etapaActual];
  const currentUser = MOCK_USERS_BY_ROLE[activeRole];

  return (
    <WireframeDashboardLayout
      activeMenu="integraciones"
      currentRole={activeRole}
      breadcrumbs={[
        { label: "Catálogo de Interoperabilidad", href: "/wireframes2/catalogo-interoperabilidad" },
        { label: "Integración de Fuentes", href: "/wireframes2/catalogo-interoperabilidad/integraciones" },
        { label: expediente.codigoExpediente }
      ]}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* Barra Superior */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/wireframes2/catalogo-interoperabilidad/integraciones">
              <ArrowLeft className="size-4" />
              Volver al Listado de Integraciones
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Badge tone="neutral" appearance="soft" size="sm">
              Expediente: {expediente.codigoExpediente}
            </Badge>
            <Badge tone="neutral" appearance="outline" size="sm">
              {expediente.versionActual}
            </Badge>
          </div>
        </div>

        {/* Simulador Interactivo de Roles */}
        <div className="bg-surface border-2 border-border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-sm shrink-0">
              <UserCheck className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Simulador de Rol Activo
                </span>
                <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold">
                  {currentUser.name} ({currentUser.roleTitle.split("(")[0].trim()})
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cambia de rol para interactuar con las acciones específicas autorizadas para cada actor según la Resolución 004-DN-2023.
              </p>
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
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
                    ? "bg-foreground text-background shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                >
                  <span className="font-mono text-[10px] opacity-80">{u.initials}</span>
                  <span>{u.name.split(" ")[0]} ({ROLES_CONFIG[roleKey].shortName})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Encabezado del Expediente */}
        <div className="border border-border rounded-xl bg-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xs">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone="neutral" appearance="soft" size="sm">
                {expediente.codigoExpediente}
              </Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-medium text-muted-foreground">{expediente.institucionNombre}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-mono text-muted-foreground">{expediente.codigoFuente}</span>
            </div>

            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {expediente.nombreFuente}
            </h1>

            <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {expediente.descripcion}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Estado General:</span>
              <Badge tone="neutral" appearance="outline" size="sm" className="font-semibold text-xs">
                {expediente.estadoGeneral}
              </Badge>
            </div>
            <div className="text-[11px] text-muted-foreground text-left md:text-right">
              <div>Radicación: {expediente.fechaRadicacion}</div>
              <div>Actualización: {expediente.ultimaActualizacion}</div>
            </div>
          </div>
        </div>

        {/* Stepper: Etapas del Expediente (Trazabilidad HU-INT y BPMN) */}
        <Card size="sm" className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                Etapas del Expediente (Trazabilidad HU-INT / Res. 004-DN-2023)
              </CardTitle>
              <Badge tone="neutral" appearance="soft" size="sm">
                Etapa {etapaActualConfig.numero} de 10: {etapaActualConfig.nombre}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Responsable actual: <strong className="text-foreground">{ROLES_CONFIG[expediente.responsableActualRol].name}</strong> ({expediente.responsableActualNombre})
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
              {Object.values(ETAPAS_EXPEDIENTE_CONFIG).map(etapa => {
                const isCurrent = etapa.id === expediente.etapaActual;
                const isPast = etapa.numero < etapaActualConfig.numero;

                return (
                  <div
                    key={etapa.id}
                    className={`p-2 rounded-lg border text-xs flex flex-col gap-1 transition-all ${isCurrent
                      ? "border-foreground bg-muted/60 font-semibold text-foreground shadow-xs"
                      : isPast
                        ? "border-border bg-muted/20 text-muted-foreground"
                        : "border-border/60 bg-surface/40 text-muted-foreground/60"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px]">Paso {etapa.numero}</span>
                      {isPast && <Check className="size-3 text-foreground" />}
                      {isCurrent && <div className="size-1.5 rounded-full bg-foreground animate-pulse" />}
                    </div>
                    <div className="text-[11px] leading-tight line-clamp-2">
                      {etapa.nombre}
                    </div>
                    <div className="text-[9px] font-mono text-muted-foreground">
                      {etapa.huRef}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* PANEL CONTEXTUAL DE ACCIONES SEGÚN ETAPA Y ROL ACTIVO */}
        <div className="border-2 border-foreground/30 rounded-xl bg-surface p-6 shadow-xs flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Bandeja de Acción Operativa
                </span>
                <Badge tone="neutral" appearance="soft" size="sm">
                  {etapaActualConfig.huRef}
                </Badge>
              </div>
              <h2 className="font-heading text-lg font-bold text-foreground mt-0.5">
                {etapaActualConfig.nombre}
              </h2>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-md border border-border">
              Rol autorizado: <strong className="text-foreground">{ROLES_CONFIG[etapaActualConfig.rolResponsable].shortName}</strong>
            </div>
          </div>

          {/* VISTA SEGÚN ETAPA ACTUAL */}

          {/* ETAPA 2: Revisión DGR (HU-INT-04) */}
          {expediente.etapaActual === "ETAPA_2_REVISION_DGR" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Como profesional de la <strong className="text-foreground">Dirección de Gestión y Registro (DGR)</strong>, revise la pertinencia de los documentos soporte y los campos candidatos. Si encuentra discrepancias, use la acción <em>Solicitar corrección</em> para emitir observaciones puntuales sin reiniciar el trámite.
              </p>

              {activeRole === "DGR" ? (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleDgrAprobarRequisitos}
                    className="gap-1.5 font-semibold"
                  >
                    <CheckCircle2 className="size-4" />
                    Aprobar Requisitos y Derivar a DTD (Enlace A)
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setMostrarModalObs(true)}
                    className="gap-1.5"
                  >
                    <AlertCircle className="size-4" />
                    Solicitar Corrección con Observaciones
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-muted/30 border border-border rounded-lg text-xs text-muted-foreground">
                  Acción reservada para la <strong>DGR</strong>. Cambia el rol a <strong>DGR (Funcional)</strong> en el simulador para interactuar.
                </div>
              )}

              {/* Modal / Panel de Observación DGR */}
              {mostrarModalObs && (
                <div className="p-4 rounded-lg border border-border bg-card space-y-3 mt-4">
                  <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Registrar Observación Puntual de Corrección</span>
                    <button type="button" onClick={() => setMostrarModalObs(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="size-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Elemento con Observación</Label>
                      <select
                        value={obsTipo}
                        onChange={e => setObsTipo(e.target.value as any)}
                        className="w-full text-xs h-9 px-2 rounded-md border border-border bg-background text-foreground"
                      >
                        <option value="campo">Campo Candidato</option>
                        <option value="documento">Documento Soporte</option>
                        <option value="informacion">Información General</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Identificador / Nombre del Elemento</Label>
                      <Input
                        placeholder="Ej. causaFallecimientoCIE10"
                        value={obsElementoId}
                        onChange={e => setObsElementoId(e.target.value)}
                        className="text-xs bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Descripción Detallada de la Observación *</Label>
                    <Textarea
                      placeholder="Explique claramente qué se debe corregir o aclarar..."
                      value={obsTexto}
                      onChange={e => setObsTexto(e.target.value)}
                      className="text-xs bg-background min-h-[70px]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setMostrarModalObs(false)} className="text-xs">
                      Cancelar
                    </Button>
                    <Button type="button" variant="primary" size="sm" onClick={handleDgrSolicitarCorreccion} className="text-xs">
                      Confirmar Observación y Devolver al Coordinador
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ETAPA 3: Corrección Coordinador (HU-INT-05) */}
          {expediente.etapaActual === "ETAPA_3_CORRECCION_COORDINADOR" && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/40 border border-border flex items-start gap-3">
                <AlertCircle className="size-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="text-xs space-y-1">
                  <strong className="text-foreground font-semibold">Observación emitida por DGR:</strong>
                  <p className="text-muted-foreground">
                    {expediente.historial[0]?.observaciones || "Por favor subsanar la especificación del campo observado conforme a la norma."}
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Como <strong className="text-foreground">Coordinador SINARP</strong>, corrija únicamente los elementos observados. <strong>No requiere empezar el trámite de nuevo</strong>.
              </p>

              {activeRole === "COORDINADOR_SINARP" ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Detalle de la Subsanación Realizada *</Label>
                    <Textarea
                      placeholder="Indique los ajustes realizados en el campo o documento observado..."
                      value={correccionTexto}
                      onChange={e => setCorreccionTexto(e.target.value)}
                      className="text-xs bg-background min-h-[70px]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleCoordinadorReenviar}
                      className="gap-1.5 font-semibold"
                    >
                      <Send className="size-4" />
                      Reenviar a Revisión DGR (HU-INT-05)
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-muted/30 border border-border rounded-lg text-xs text-muted-foreground">
                  Acción reservada para el <strong>Coordinador SINARP</strong>. Cambia el rol a <strong>Coordinador SINARP</strong> en el simulador para interactuar.
                </div>
              )}
            </div>
          )}

          {/* ETAPA 4: Validación Técnica DTD e Ingreso a Catálogo en Estado OCULTO (HU-INT-06 / 07) */}
          {expediente.etapaActual === "ETAPA_4_VALIDACION_DTD" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Como profesional de la <strong className="text-foreground">Dirección de Tecnología y Desarrollo (DTD)</strong>, verifique la viabilidad técnica de los datos. Al validar correctamente, la fuente ingresa al catálogo en estado <code className="text-foreground font-mono">OCULTO</code> (no visible a consumidores) para habilitar en paralelo la clasificación DPI y el desarrollo del microservicio.
              </p>

              {activeRole === "DTD" ? (
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleDtdPasarOculto}
                    className="gap-1.5 font-semibold"
                  >
                    <EyeOff className="size-4" />
                    Validar Técnicamente e Ingresar a Catálogo en Estado OCULTO (HU-INT-07)
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-muted/30 border border-border rounded-lg text-xs text-muted-foreground">
                  Acción reservada para la <strong>DTD</strong>. Cambia el rol a <strong>DTD (Técnica)</strong> en el simulador para interactuar.
                </div>
              )}
            </div>
          )}

          {/* ETAPA 5: Clasificación DPI + Integración DTD en Paralelo (HU-INT-08 & 09) */}
          {expediente.etapaActual === "ETAPA_5_PARALELO_DPI_DTD" && (
            <div className="space-y-6">

              {/* Alerta de Actividades Paralelas y Pendiente de Validación */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border flex items-start gap-3">
                <Info className="size-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="text-xs text-muted-foreground space-y-1 leading-relaxed">
                  <strong className="text-foreground font-semibold">Ejecución en Paralelo (BPMN / Res. 004):</strong>
                  <p>
                    DPI y DTD trabajan simultáneamente: DPI clasifica la sensibilidad de los campos y carga su informe técnico, mientras DTD genera y despliega el microservicio en preproducción.
                  </p>
                  <p className="font-semibold text-foreground pt-1">
                    * Pendiente de validación: ¿La validación funcional por DGR (Paso 6) requiere esperar síncronamente al informe DPI o avanza de forma asíncrona?
                  </p>
                </div>
              </div>

              {/* Subpanel A: Dirección de Protección de la Información (DPI) */}
              <Card size="sm" className="border-border bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <ShieldCheck className="size-4 text-muted-foreground" />
                      Actividad Paralela A: Clasificación Oficial de Campos (DPI)
                    </CardTitle>
                    <Badge tone="neutral" appearance="soft" size="sm">
                      {expediente.clasificacionDPI?.completada ? "Informe Emitido" : "En Clasificación"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Número de Informe Técnico DPI *</Label>
                      <Input
                        value={dpiInformeNro}
                        onChange={e => setDpiInformeNro(e.target.value)}
                        className="text-xs bg-background font-mono"
                        disabled={activeRole !== "DPI"}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Informe de Clasificación PDF *</Label>
                      <Input
                        value={dpiInformePdf}
                        onChange={e => setDpiInformePdf(e.target.value)}
                        className="text-xs bg-background font-mono"
                        disabled={activeRole !== "DPI"}
                      />
                    </div>
                  </div>

                  {/* Tabla de Clasificación de Campos */}
                  <div className="border border-border rounded-lg overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px]">
                        <tr>
                          <th className="py-2 px-3">Campo</th>
                          <th className="py-2 px-3">Tipo</th>
                          <th className="py-2 px-3">Clasificación Asignada DPI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {dpiCampos.map(c => (
                          <tr key={c.id}>
                            <td className="py-2 px-3 font-mono text-foreground font-medium">{c.nombre}</td>
                            <td className="py-2 px-3 text-muted-foreground">{c.tipo}</td>
                            <td className="py-2 px-3">
                              {activeRole === "DPI" ? (
                                <select
                                  value={c.clasificacion}
                                  onChange={e => {
                                    const val = e.target.value as any;
                                    setDpiCampos(prev => prev.map(item => item.id === c.id ? { ...item, clasificacion: val } : item));
                                  }}
                                  className="text-xs h-8 px-2 rounded border border-border bg-background text-foreground"
                                >
                                  <option value="Accesible">Accesible</option>
                                  <option value="Confidencial">Confidencial (Motivado)</option>
                                </select>
                              ) : (
                                <Badge tone="neutral" appearance={c.clasificacion === "Confidencial" ? "outline" : "soft"} size="sm">
                                  {c.clasificacion}
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {activeRole === "DPI" && (
                    <div className="flex justify-end">
                      <Button type="button" variant="secondary" size="sm" onClick={handleDpiGuardarClasificacion} className="text-xs gap-1.5">
                        <CheckCircle2 className="size-3.5" />
                        Guardar Dictamen de Clasificación DPI
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Subpanel B: Dirección de Tecnología y Desarrollo (DTD) */}
              <Card size="sm" className="border-border bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Server className="size-4 text-muted-foreground" />
                      Actividad Paralela B: Microservicio y Despliegue en Preproducción (DTD)
                    </CardTitle>
                    <Badge tone="neutral" appearance="soft" size="sm">
                      {expediente.desplieguePreDTD?.completado ? "Desplegado" : "Pendiente"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Nombre Microservicio</Label>
                      <Input
                        value={dtdMicroservicio}
                        onChange={e => setDtdMicroservicio(e.target.value)}
                        className="text-xs bg-background font-mono"
                        disabled={activeRole !== "DTD"}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Versión Preproducción</Label>
                      <Input
                        value={dtdVersionPre}
                        onChange={e => setDtdVersionPre(e.target.value)}
                        className="text-xs bg-background font-mono"
                        disabled={activeRole !== "DTD"}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Endpoint Preproducción</Label>
                      <Input
                        value={dtdEndpointPre}
                        onChange={e => setDtdEndpointPre(e.target.value)}
                        className="text-xs bg-background font-mono"
                        disabled={activeRole !== "DTD"}
                      />
                    </div>
                  </div>

                  {activeRole === "DTD" ? (
                    <div className="flex justify-end pt-2">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleDtdDesplegarPre}
                        className="gap-1.5 font-semibold text-xs"
                      >
                        <Upload className="size-3.5" />
                        Registrar Despliegue y Pasar a Validación DGR (Paso 6)
                      </Button>
                    </div>
                  ) : (
                    <div className="p-3 bg-muted/20 border border-border rounded-lg text-xs text-muted-foreground">
                      Para registrar el despliegue en preproducción, activa el rol <strong>DTD (Técnica)</strong> en el simulador.
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          )}

          {/* ETAPA 6: Validación Preproducción DGR (HU-INT-10) */}
          {expediente.etapaActual === "ETAPA_6_VALIDACION_PRE_DGR" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Como profesional de la <strong className="text-foreground">Dirección de Gestión y Registro (DGR)</strong>, realice pruebas funcionales de consumo sobre el endpoint de preproducción. Si la validación es <em>Favorable</em>, se habilita la aprobación; si es <em>No Favorable</em>, el proceso retorna a DTD para corrección técnica y redespliegue.
              </p>

              {activeRole === "DGR" ? (
                <div className="space-y-4 bg-card p-4 rounded-lg border border-border">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Resultado de la Validación Funcional *</Label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="resultadoVal"
                          checked={validacionPreResultado === "Favorable"}
                          onChange={() => setValidacionPreResultado("Favorable")}
                        />
                        <span className="font-semibold text-foreground">Validación Favorable (Sin errores)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="resultadoVal"
                          checked={validacionPreResultado === "No favorable"}
                          onChange={() => setValidacionPreResultado("No favorable")}
                        />
                        <span className="font-semibold text-foreground">Validación No Favorable (Con errores técnicos)</span>
                      </label>
                    </div>
                  </div>

                  {validacionPreResultado === "No favorable" && (
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Descripción de los Errores Detectados *</Label>
                      <Textarea
                        value={validacionPreErrores}
                        onChange={e => setValidacionPreErrores(e.target.value)}
                        className="text-xs bg-background min-h-[70px]"
                        placeholder="Describa el comportamiento anómalo o fallo técnico..."
                      />
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleDgrValidarPre}
                      className="gap-1.5 font-semibold text-xs"
                    >
                      <CheckCircle2 className="size-4" />
                      Registrar Resultado de Validación (HU-INT-10)
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-muted/30 border border-border rounded-lg text-xs text-muted-foreground">
                  Acción reservada para la <strong>DGR</strong>. Cambia el rol a <strong>DGR (Funcional)</strong> en el simulador para interactuar.
                </div>
              )}
            </div>
          )}

          {/* ETAPA 7: Error Técnico y Redespliegue DTD (HU-INT-11) */}
          {expediente.etapaActual === "ETAPA_7_ERROR_TECNICO_LOOP" && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/40 border border-border flex items-start gap-3">
                <AlertCircle className="size-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="text-xs space-y-1">
                  <strong className="text-foreground font-semibold">Incidencia reportada por DGR:</strong>
                  <p className="text-muted-foreground">
                    {expediente.validacionPreDGR?.observacionesValidacion || validacionPreErrores}
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Como profesional de la <strong className="text-foreground">Dirección de Tecnología y Desarrollo (DTD)</strong>, solvente el error técnico, incremente la versión y redespliegue en preproducción para devolver el expediente a validación DGR.
              </p>

              {activeRole === "DTD" ? (
                <div className="space-y-3 bg-card p-4 rounded-lg border border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Nueva Versión del Microservicio</Label>
                      <Input
                        value={dtdVersionNueva}
                        onChange={e => setDtdVersionNueva(e.target.value)}
                        className="text-xs bg-background font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Solución Técnica Aplicada *</Label>
                      <Input
                        value={dtdSolucionError}
                        onChange={e => setDtdSolucionError(e.target.value)}
                        className="text-xs bg-background"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleDtdSolventarError}
                      className="gap-1.5 font-semibold text-xs"
                    >
                      <RefreshCw className="size-4" />
                      Solventar Error y Redesplegar (Loop HU-INT-11)
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-muted/30 border border-border rounded-lg text-xs text-muted-foreground">
                  Acción reservada para la <strong>DTD</strong>. Cambia el rol a <strong>DTD (Técnica)</strong> en el simulador para interactuar.
                </div>
              )}
            </div>
          )}

          {/* ETAPA 8: Aprobación DGR mediante Formulario Automatizado (HU-INT-12) */}
          {expediente.etapaActual === "ETAPA_8_APROBACION_DGR" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Como profesional de la <strong className="text-foreground">Dirección de Gestión y Registro (DGR)</strong>, diligencie el formulario automatizado con los resultados precargados y emita la aprobación formal de la integración.
              </p>

              {activeRole === "DGR" ? (
                <div className="space-y-3 bg-card p-4 rounded-lg border border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Nro. Formulario Automatizado</Label>
                      <Input
                        value={formularioNro}
                        onChange={e => setFormularioNro(e.target.value)}
                        className="text-xs bg-background font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Dictamen de Aprobación</Label>
                      <Input
                        value="FAVORABLE - APTO PARA PRODUCCIÓN"
                        readOnly
                        className="text-xs bg-muted/30 font-semibold text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Conclusiones del Informe de Integración *</Label>
                    <Textarea
                      value={formularioConclusiones}
                      onChange={e => setFormularioConclusiones(e.target.value)}
                      className="text-xs bg-background min-h-[60px]"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleDgrAprobarIntegracion}
                      className="gap-1.5 font-semibold text-xs"
                    >
                      <CheckCircle2 className="size-4" />
                      Aprobar Integración y Derivar a DTD para Producción (Enlace C)
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-muted/30 border border-border rounded-lg text-xs text-muted-foreground">
                  Acción reservada para la <strong>DGR</strong>. Cambia el rol a <strong>DGR (Funcional)</strong> en el simulador para interactuar.
                </div>
              )}
            </div>
          )}

          {/* ETAPA 9: Paso a Producción DTD (HU-INT-13) */}
          {expediente.etapaActual === "ETAPA_9_PRODUCCION_DTD" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Como profesional de la <strong className="text-foreground">Dirección de Tecnología y Desarrollo (DTD)</strong>, registre el despliegue productivo del microservicio. Al completar este paso, el sistema disparará automáticamente la notificación al Coordinador SINARP.
              </p>

              {activeRole === "DTD" ? (
                <div className="space-y-3 bg-card p-4 rounded-lg border border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Endpoint Oficial de Producción *</Label>
                      <Input
                        value={endpointProd}
                        onChange={e => setEndpointProd(e.target.value)}
                        className="text-xs bg-background font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Versión Productiva Final</Label>
                      <Input
                        value={versionProd}
                        onChange={e => setVersionProd(e.target.value)}
                        className="text-xs bg-background font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleDtdPasoProduccion}
                      className="gap-1.5 font-semibold text-xs"
                    >
                      <Server className="size-4" />
                      Registrar Paso a Producción y Disparar Notificación (HU-INT-13)
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-muted/30 border border-border rounded-lg text-xs text-muted-foreground">
                  Acción reservada para la <strong>DTD</strong>. Cambia el rol a <strong>DTD (Técnica)</strong> en el simulador para interactuar.
                </div>
              )}
            </div>
          )}

          {/* ETAPA 10: Notificación Final y Proceso Concluido (HU-INT-14) */}
          {expediente.etapaActual === "ETAPA_10_NOTIFICACION_FINAL" && (
            <div className="space-y-4">
              <div className="p-5 rounded-lg bg-muted/40 border border-border flex items-start gap-4">
                <CheckCircle2 className="size-6 text-foreground shrink-0 mt-0.5" />
                <div className="text-xs space-y-1.5 leading-relaxed">
                  <strong className="text-foreground text-sm font-semibold">Fuente Integrada Exitosamente en el Ecosistema DINARP</strong>
                  <p className="text-muted-foreground">
                    El proceso de integración ha concluido. El sistema envió la notificación automática al Coordinador Titular (andrea.lopez@registrocivil.gob.ec) y Suplente.
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <Badge tone="neutral" appearance="soft" size="sm">
                      Endpoint: {expediente.pasoProduccionDTD?.endpointProd}
                    </Badge>
                    <Badge tone="neutral" appearance="outline" size="sm">
                      Versión: {expediente.pasoProduccionDTD?.versionProd}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="secondary" size="sm" asChild className="text-xs">
                  <Link href="/wireframes2/catalogo-interoperabilidad/gestion">
                    Ver en Gestión del Catálogo
                  </Link>
                </Button>
                <Button variant="primary" size="sm" asChild className="text-xs">
                  <Link href="/wireframes2/catalogo-interoperabilidad">
                    Ver en Catálogo de Servicios
                  </Link>
                </Button>
              </div>
            </div>
          )}

        </div>

        {/* Sección de Ficha de Datos del Trámite: Documentos y Campos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Documentos Soporte */}
          <Card size="sm" className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                Documentación Soporte Radicada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {expediente.documentosSoporte.map(doc => (
                <div key={doc.id} className="p-3 rounded-lg border border-border bg-surface flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="size-4 text-muted-foreground shrink-0" />
                    <div>
                      <div className="font-semibold text-foreground">{doc.nombre}</div>
                      <div className="text-[11px] font-mono text-muted-foreground">{doc.archivoNombre} ({doc.archivoTamano})</div>
                    </div>
                  </div>
                  <Badge tone="neutral" appearance="soft" size="sm">
                    {doc.estadoRevision}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Campos Registrados */}
          <Card size="sm" className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Layers className="size-4 text-muted-foreground" />
                Campos y Clasificación Actual ({expediente.camposCandidatos.length} campos)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px]">
                    <tr>
                      <th className="py-2 px-3">Campo</th>
                      <th className="py-2 px-3">Tipo</th>
                      <th className="py-2 px-3 text-center">Clasificación DPI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {expediente.camposCandidatos.map(c => (
                      <tr key={c.id}>
                        <td className="py-2 px-3 font-mono text-foreground font-medium">{c.nombre}</td>
                        <td className="py-2 px-3 text-muted-foreground">{c.tipo}</td>
                        <td className="py-2 px-3 text-center">
                          <Badge tone="neutral" appearance={c.clasificacion === "Confidencial" ? "outline" : "soft"} size="sm">
                            {c.clasificacion}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Historial y Bitácora Inmutable de Eventos */}
        <div className="border border-border rounded-xl bg-card p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                Historial Inmutable del Expediente
              </h3>
              <p className="text-xs text-muted-foreground">
                Trazabilidad de cambios, versiones, observaciones y devoluciones registradas en SURI.
              </p>
            </div>
            <Badge tone="neutral" appearance="outline" size="sm">
              {expediente.historial.length} Eventos Auditados
            </Badge>
          </div>

          <div className="space-y-3">
            {expediente.historial.map(item => (
              <div key={item.id} className="p-4 rounded-lg border border-border bg-surface flex flex-col gap-1.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <Badge tone="neutral" appearance="soft" size="sm" className="font-mono text-[10px]">
                      {item.version}
                    </Badge>
                    <span className="font-semibold text-foreground">{item.accion}</span>
                    <span className="text-muted-foreground text-[11px]">({item.huRef})</span>
                  </div>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {item.fecha} — {item.hora}
                  </span>
                </div>

                <div className="text-[11px] text-muted-foreground">
                  Responsable: <strong className="text-foreground">{item.actorNombre}</strong> ({ROLES_CONFIG[item.actorRol]?.shortName || item.actorRol})
                </div>

                {item.detalles && (
                  <p className="text-muted-foreground pt-0.5">{item.detalles}</p>
                )}

                {item.observaciones && (
                  <div className="p-2.5 rounded bg-muted/40 border border-border mt-1 text-[11px] text-foreground">
                    <strong>Observación registrada:</strong> {item.observaciones}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </WireframeDashboardLayout>
  );
}

