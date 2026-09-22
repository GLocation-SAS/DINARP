"use client";

import React, { useState } from "react";
import { useSimulatedRole } from "../../../catalogo-interoperabilidad/hooks/use-simulated-role";
import { WireframeDashboardLayout } from "../../../components/wireframe-dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { WireframeTour, TourStep } from "../../../components/wireframe-tour";
import { useEffect } from "react";

export default function DetalleSolicitudAccesoPage({ params }: { params: { id: string } }) {
  const [role, setRole] = useSimulatedRole("COORDINADOR_SINARP");
  const [activeTab, setActiveTab] = useState("resumen");
  const [estadoSolicitud, setEstadoSolicitud] = useState("Pendiente de pago");

  const [tourOpen, setTourOpen] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);

  useEffect(() => {
    // Si viene de la pantalla anterior y no ha visto el tour de id
    if (typeof window !== "undefined" && !localStorage.getItem("onboarding_id_visto")) {
      setTourOpen(true);
      localStorage.setItem("onboarding_id_visto", "true");
    }
  }, []);

  const tourSteps: TourStep[] = [
    {
      id: "step1",
      target: "#estado-superior",
      title: "Estado de la solicitud",
      description: "Aquí puedes identificar en qué etapa se encuentra actualmente la solicitud."
    },
    {
      id: "step2",
      target: "#tabs-container",
      title: "Pestañas de detalle",
      description: "Consulta el resumen, campos solicitados, justificaciones, documentos y seguimiento sin salir del expediente."
    },
    {
      id: "step3",
      target: "#accion-requerida",
      title: "Acción requerida",
      description: "Si la solicitud necesita una acción de tu parte, aparecerá destacada aquí."
    },
    {
      id: "step4",
      target: "#tab-content",
      title: "Seguimiento",
      description: "El historial conserva las validaciones, observaciones, correcciones y reenvíos realizados durante todo el proceso.",
      onBeforeStep: () => setActiveTab("seguimiento")
    }
  ];

  // Mock expediente data
  const expediente = {
    id: params.id,
    institucion: "Banco Pichincha",
    tipoInstitucion: "Privada",
    coordinador: "Andrea López",
    fechaCreacion: "2026-09-20",
    ultimaActualizacion: "2026-09-21",
    factura: {
      numero: "FAC-0028",
      fechaEmision: "2026-09-22",
      valor: "$ 150.00"
    },
    campos: [
      {
        fuente: "Registro Único de Contribuyentes (RUC)",
        institucion: "SRI",
        nombre: "estadoContribuyente",
        clasificacion: "Accesible",
        finalidad: "Validar estado crediticio",
        estado: "Aprobado"
      }
    ],
    seguimiento: [
      { fecha: "2026-09-20 10:00", evento: "Solicitud enviada", actor: "Coordinador SINARP" },
      { fecha: "2026-09-21 11:15", evento: "Solicitud aprobada", actor: "DGR" }
    ]
  };

  return (
    <WireframeDashboardLayout
      activeMenu="acceso-interoperabilidad"
      breadcrumbs={[
        { label: "Acceso a Interoperabilidad", href: "/wireframes2/acceso-interoperabilidad" },
        { label: "Gestión de solicitudes", href: "/wireframes2/acceso-interoperabilidad/solicitudes" },
        { label: expediente.id }
      ]}
      headerSlot={
        <div className="flex gap-2">
          <select
            className="h-8 text-xs px-2 py-1 rounded-md border border-border bg-surface text-foreground"
            value={estadoSolicitud}
            onChange={(e) => setEstadoSolicitud(e.target.value)}
          >
            <option value="En validación">Estado: En validación</option>
            <option value="Pendiente de pago">Estado: Pendiente de pago</option>
            <option value="Pago en validación">Estado: Pago en validación</option>
            <option value="Pago verificado">Estado: Pago verificado</option>
            <option value="Creación de paquetes">Estado: Creación de paquetes</option>
          </select>
          <select
            className="h-8 text-xs px-2 py-1 rounded-md border border-border bg-surface text-foreground"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
          >
            <option value="COORDINADOR_SINARP">Coordinador SINARP</option>
            <option value="DGR">Profesional DGR</option>
          </select>
          <Button variant="ghost" size="sm" onClick={() => { setTourOpen(true); setCurrentTourStep(0); }} className="h-8 px-2 text-xs">
            Ver guía
          </Button>
        </div>
      }
    >
      <WireframeTour
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
        steps={tourSteps}
        currentStep={currentTourStep}
        onStepChange={setCurrentTourStep}
      />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-xs flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">{expediente.id}</h1>
            <div className="text-sm text-muted-foreground mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <p>Institución: <strong className="text-foreground">{expediente.institucion}</strong></p>
              <p>Tipo: <strong className="text-foreground">{expediente.tipoInstitucion}</strong></p>
              <p>Coordinador: <strong className="text-foreground">{expediente.coordinador}</strong></p>
              <p>Fecha creación: {expediente.fechaCreacion}</p>
              <p>Última act.: {expediente.ultimaActualizacion}</p>
              {(estadoSolicitud === "Pendiente de pago" || estadoSolicitud === "Pago en validación" || estadoSolicitud === "Pago verificado") && (
                <p>Factura asociada: <strong className="text-foreground">{expediente.factura.numero}</strong> <Link href={`/wireframes2/acceso-interoperabilidad/solicitudes/${expediente.id}/facturacion`} className="text-primary hover:underline ml-2">[Ver factura]</Link></p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2" id="estado-superior">
            <Badge tone="neutral" appearance="soft">{estadoSolicitud}</Badge>
          </div>
        </div>

        {/* Acción Requerida */}
        <Card className="p-4 border-l-4 border-l-primary bg-primary/5" id="accion-requerida">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-sm font-bold text-foreground">Acción requerida</h2>
              
              {estadoSolicitud === "En validación" && (
                <p className="text-sm text-muted-foreground mt-1">
                  La solicitud está en revisión. No se requieren acciones de su parte en este momento.
                </p>
              )}
              
              {estadoSolicitud === "Pendiente de pago" && expediente.tipoInstitucion === "Privada" && (
                <div className="mt-2">
                  <p className="text-sm text-foreground font-medium mb-2">Pago requerido</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    La solicitud fue aprobada y cuenta con una factura pendiente de pago. 
                    Completa el proceso de facturación para continuar con la habilitación del servicio.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground bg-surface border border-border p-3 rounded-md mb-2">
                    <p>Factura: <strong>{expediente.factura.numero}</strong></p>
                    <p>Fecha emisión: <strong>{expediente.factura.fechaEmision}</strong></p>
                    <p>Valor total: <strong>{expediente.factura.valor}</strong></p>
                    <p>Estado pago: <strong><Badge tone="danger" appearance="soft">Pendiente de pago</Badge></strong></p>
                  </div>
                </div>
              )}

              {estadoSolicitud === "Pago en validación" && expediente.tipoInstitucion === "Privada" && (
                <div className="mt-2">
                  <p className="text-sm text-foreground font-medium mb-2">Pago en validación</p>
                  <p className="text-sm text-muted-foreground">
                    El pago ha sido reportado y se encuentra en proceso de validación por el área correspondiente.
                  </p>
                </div>
              )}

              {estadoSolicitud === "Pago verificado" && expediente.tipoInstitucion === "Privada" && (
                <div className="mt-2">
                  <p className="text-sm text-foreground font-medium mb-2">Pago verificado correctamente</p>
                  <p className="text-sm text-muted-foreground">
                    El pago fue verificado correctamente. La solicitud continuará con la creación y habilitación de los paquetes de consumo.
                  </p>
                </div>
              )}

              {estadoSolicitud === "Creación de paquetes" && role === "DGR" && (
                <div className="mt-2">
                  <p className="text-sm text-foreground font-medium mb-2">Solicitud lista para creación de paquete</p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground bg-surface border border-border p-3 rounded-md mb-2">
                    <p>Solicitud: <strong>{expediente.id}</strong></p>
                    <p>Institución: <strong>{expediente.institucion}</strong></p>
                    <p>Fuentes aprobadas: <strong>1</strong></p>
                    <p>Campos aprobados: <strong>1</strong></p>
                    <p>Formalización: <strong>Completada</strong></p>
                    {expediente.tipoInstitucion === "Privada" && (
                      <p>Pago: <strong>Verificado</strong></p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row shrink-0 gap-2">
              {estadoSolicitud === "En validación" && (
                <Button size="sm" variant="outline" disabled>En revisión</Button>
              )}
              {estadoSolicitud === "Pendiente de pago" && expediente.tipoInstitucion === "Privada" && (
                <Link href={`/wireframes2/acceso-interoperabilidad/solicitudes/${expediente.id}/facturacion`}>
                  <Button size="sm">Gestionar pago</Button>
                </Link>
              )}
              {estadoSolicitud === "Pago en validación" && expediente.tipoInstitucion === "Privada" && (
                <Link href={`/wireframes2/acceso-interoperabilidad/solicitudes/${expediente.id}/facturacion`}>
                  <Button size="sm" variant="outline">Ver factura</Button>
                </Link>
              )}
              {estadoSolicitud === "Pago verificado" && role === "DGR" && (
                <Button size="sm" onClick={() => setEstadoSolicitud("Creación de paquetes")}>Continuar a creación de paquetes</Button>
              )}
              {estadoSolicitud === "Creación de paquetes" && role === "DGR" && (
                <Link href="/wireframes2/acceso-interoperabilidad/paquetes">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">Crear paquete de consumo</Button>
                </Link>
              )}
              {estadoSolicitud === "Creación de paquetes" && (
                <Button size="sm" variant="outline" disabled>En proceso</Button>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-border" id="tabs-container">
          {["resumen", "campos", "seguimiento"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium capitalize transition-colors ${activeTab === tab ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4" id="tab-content">
          {activeTab === "resumen" && (
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Resumen General</h2>
              <p className="text-sm text-muted-foreground">La solicitud contempla {expediente.campos.length} campos en total.</p>
            </Card>
          )}

          {activeTab === "campos" && (
            <div className="flex flex-col gap-4">
              {expediente.campos.map((c, i) => (
                <Card key={i} className="p-4">
                  <p className="text-xs text-muted-foreground">{c.institucion} &gt; {c.fuente}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <h3 className="font-bold">{c.nombre}</h3>
                    <Badge tone="neutral" appearance="outline" size="sm">{c.clasificacion}</Badge>
                  </div>
                  <p className="text-sm mt-2 text-muted-foreground">Estado de revisión: <strong>{c.estado}</strong></p>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "seguimiento" && (
            <Card className="p-6">
              <div className="flex flex-col gap-8 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-border">
                {expediente.seguimiento.map((s, i) => (
                  <div key={i} className="flex gap-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-muted-foreground flex-shrink-0 border-4 border-card" />
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-foreground">{s.evento}</p>
                        <span className="text-xs font-mono text-muted-foreground">{s.fecha}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Responsable: <strong className="text-foreground">{s.actor}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </WireframeDashboardLayout>
  );
}
