"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Database, Search, Building2, Check, Lock, ChevronDown, ChevronUp, Layers, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search as SearchInput } from "@/components/ui/search";
import { WireframeDashboardLayout } from "@/app/wireframes2/components/wireframe-dashboard-layout";
import { INITIAL_INSTITUCIONES } from "../../../catalogo-interoperabilidad/data/catalogo-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WireframeTour, TourStep } from "../../../components/wireframe-tour";
import { useEffect } from "react";

export default function NuevaSolicitudAccesoPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Step 1 State
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedInstituciones, setExpandedInstituciones] = useState<Record<string, boolean>>({});
  const [expandedFuentes, setExpandedFuentes] = useState<Record<string, boolean>>({});
  const [selectedCampos, setSelectedCampos] = useState<Record<string, boolean>>({});
  
  // Step 2 State
  const [justificaciones, setJustificaciones] = useState<Record<string, { finalidad: string, fundamento: string }>>({});

  const toggleInstitucion = (id: string) => setExpandedInstituciones(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleFuente = (id: string) => setExpandedFuentes(prev => ({ ...prev, [id]: !prev[id] }));

  const institucionesPublicadas = useMemo(() => {
    return INITIAL_INSTITUCIONES.map(inst => ({
      ...inst,
      fuentes: inst.fuentes.filter(f => f.estado === "PUBLICADO")
    })).filter(inst => inst.fuentes.length > 0);
  }, []);

  const handleSelectCampo = (campoId: string, isSelected: boolean) => {
    setSelectedCampos(prev => ({
      ...prev,
      [campoId]: isSelected
    }));
  };

  const selectedCount = Object.values(selectedCampos).filter(Boolean).length;
  
  const selectedCamposDetails = useMemo(() => {
    const details: any[] = [];
    institucionesPublicadas.forEach(inst => {
      inst.fuentes.forEach(fuente => {
        fuente.campos.forEach(campo => {
          if (selectedCampos[campo.id]) {
            details.push({
              instId: inst.id,
              instNombre: inst.nombre,
              fuenteId: fuente.id,
              fuenteNombre: fuente.nombre,
              campo
            });
          }
        });
      });
    });
    return details;
  }, [selectedCampos, institucionesPublicadas]);

  const isStep2Valid = selectedCamposDetails.every(c => {
    const j = justificaciones[c.campo.id];
    if (!j) return false;
    if (!j.finalidad) return false;
    if (c.campo.clasificacion === "Confidencial" && !j.fundamento) return false;
    return true;
  });

  const nextStep = () => setStep(prev => prev < 3 ? prev + 1 : prev);
  const prevStep = () => setStep(prev => prev > 1 ? prev - 1 : prev);

  const [tourOpen, setTourOpen] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);

  useEffect(() => {
    // Si viene de la pantalla anterior y no ha visto el tour de nueva
    if (typeof window !== "undefined" && !localStorage.getItem("onboarding_nueva_visto")) {
      setTourOpen(true);
      localStorage.setItem("onboarding_nueva_visto", "true");
    }
  }, []);

  const tourSteps: TourStep[] = [
    {
      id: "step1",
      target: "#stepper-container",
      title: "Progreso de solicitud",
      description: "Esta solicitud se completa paso a paso. Puedes revisar tu progreso antes de enviarla."
    },
    {
      id: "step2",
      target: "#datos-documentos",
      title: "Datos y documentos",
      description: "Completa o verifica la información y documentación requerida para iniciar el trámite.",
      onBeforeStep: () => setStep(1)
    },
    {
      id: "step3",
      target: "#seleccion-info",
      title: "Selección de información",
      description: "Puedes explorar las instituciones fuente, servicios y campos publicados sin salir de la solicitud.",
      onBeforeStep: () => setStep(1)
    },
    {
      id: "step4",
      target: "#justificacion-step",
      title: "Justificación de campos",
      description: "Cada campo seleccionado debe quedar asociado a una justificación de uso. Cuando corresponda, el sistema también solicitará justificación jurídica.",
      onBeforeStep: () => setStep(2)
    },
    {
      id: "step5",
      target: "#resumen-step",
      title: "Revisar y enviar",
      description: "Antes de enviar, verifica los campos seleccionados, sus justificaciones y la documentación de la solicitud.",
      onBeforeStep: () => setStep(3)
    },
    {
      id: "step6",
      target: "#btn-enviar-solicitud",
      title: "Enviar solicitud",
      description: "Al enviar, la solicitud pasa a validación y podrás consultar todo su avance desde Gestión de solicitudes.",
      onBeforeStep: () => setStep(3)
    }
  ];

  return (
    <TooltipProvider>
    <WireframeDashboardLayout
      activeMenu="acceso-interoperabilidad"
      breadcrumbs={[
        { label: "Acceso a Interoperabilidad", href: "/wireframes2/acceso-interoperabilidad/solicitudes" },
        { label: "Nueva Solicitud" }
      ]}
      headerSlot={
        <Button variant="ghost" size="sm" onClick={() => { setTourOpen(true); setCurrentTourStep(0); }} className="h-8 px-2 text-xs">
          Ver guía
        </Button>
      }
    >
      <WireframeTour
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
        steps={tourSteps}
        currentStep={currentTourStep}
        onStepChange={setCurrentTourStep}
      />
      <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-foreground">Nueva solicitud de acceso a interoperabilidad</h1>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-4" id="stepper-container">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
            <div className="w-6 h-6 rounded-full bg-current flex items-center justify-center text-primary-foreground text-xs">1</div>
            Seleccionar información
          </div>
          <div className="w-12 h-px bg-border mx-2"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
            <div className="w-6 h-6 rounded-full bg-current flex items-center justify-center text-primary-foreground text-xs">2</div>
            Justificar campos
          </div>
          <div className="w-12 h-px bg-border mx-2"></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
            <div className="w-6 h-6 rounded-full bg-current flex items-center justify-center text-primary-foreground text-xs">3</div>
            Revisar y enviar
          </div>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="bg-card border border-border p-4 rounded-xl" id="datos-documentos">
              <SearchInput
                placeholder="Buscar por institución, fuente o campo..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-4" id="seleccion-info">
              {institucionesPublicadas.map(institucion => {
                const isInstExpanded = expandedInstituciones[institucion.id] ?? true;
                return (
                  <div key={institucion.id} className="border border-border rounded-xl bg-card overflow-hidden">
                    <div
                      onClick={() => toggleInstitucion(institucion.id)}
                      className="p-4 bg-muted/20 hover:bg-muted/40 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="size-5 text-muted-foreground" />
                        <h2 className="font-bold text-foreground">{institucion.nombre}</h2>
                      </div>
                      <ChevronDown className={`size-5 transition-transform ${isInstExpanded ? "rotate-180" : ""}`} />
                    </div>

                    {isInstExpanded && (
                      <div className="p-4 flex flex-col gap-4 border-t border-border">
                        {institucion.fuentes.map(fuente => {
                          const isFuenteExpanded = expandedFuentes[fuente.id] ?? false;
                          return (
                            <div key={fuente.id} className="border border-border/80 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-bold text-sm">{fuente.nombre}</h3>
                                  <p className="text-xs text-muted-foreground">{fuente.descripcion}</p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleFuente(fuente.id)}
                                >
                                  {isFuenteExpanded ? "Ocultar campos" : "Ver campos"}
                                </Button>
                              </div>

                              {isFuenteExpanded && (
                                <div className="mt-4 pt-4 border-t border-border">
                                  {fuente.campos.map(campo => (
                                    <label key={campo.id} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="mt-1"
                                        checked={!!selectedCampos[campo.id]}
                                        onChange={(e) => handleSelectCampo(campo.id, e.target.checked)}
                                      />
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">{campo.nombre}</span>
                                  {campo.clasificacion === "Accesible" ? (
                                    <Badge tone="neutral" appearance="outline" size="sm" className="gap-1"><Check className="size-3"/> Accesible</Badge>
                                  ) : (
                                    <Badge tone="neutral" appearance="outline" size="sm" className="gap-1"><Lock className="size-3"/> Confidencial</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">{campo.descripcion}</p>
                              </div>
                            </label>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Persistent bottom bar */}
            <div className="sticky bottom-0 bg-card border-t border-border p-4 flex items-center justify-between rounded-t-xl shadow-lg mt-4">
              <div>
                <span className="font-bold">Campos seleccionados: {selectedCount}</span>
              </div>
              <Button onClick={nextStep} disabled={selectedCount === 0}>
                Continuar con la justificación
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6" id="justificacion-step">
            {selectedCamposDetails.length === 0 ? (
              <p>No hay campos seleccionados.</p>
            ) : (
              selectedCamposDetails.map((item, index) => (
                <Card key={`${item.fuenteId}-${item.campo.id}`} className="p-4 flex flex-col gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">{item.instNombre} &gt; {item.fuenteNombre}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <h3 className="font-bold">{item.campo.nombre}</h3>
                      {item.campo.clasificacion === "Accesible" ? (
                        <Badge tone="neutral" appearance="outline" size="sm" className="gap-1"><Check className="size-3"/> Accesible</Badge>
                      ) : (
                        <Badge tone="neutral" appearance="outline" size="sm" className="gap-1"><Lock className="size-3"/> Confidencial</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.campo.descripcion}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold">Finalidad de uso</label>
                      <textarea
                        className="w-full mt-1 p-2 text-sm border border-border rounded-md bg-background"
                        rows={2}
                        placeholder="Describa para qué se utilizará este campo..."
                        value={justificaciones[item.campo.id]?.finalidad || ""}
                        onChange={(e) => setJustificaciones(prev => ({
                          ...prev,
                          [item.campo.id]: { ...prev[item.campo.id], finalidad: e.target.value }
                        }))}
                      />
                    </div>
                    {item.campo.clasificacion === "Confidencial" && (
                      <div>
                        <label className="text-xs font-semibold flex items-center gap-1">
                          <Lock className="size-3"/> Justificación jurídica requerida
                        </label>
                        <textarea
                          className="w-full mt-1 p-2 text-sm border border-border rounded-md bg-background"
                          rows={2}
                          placeholder="Fundamento legal que autoriza el acceso a este dato confidencial..."
                          value={justificaciones[item.campo.id]?.fundamento || ""}
                          onChange={(e) => setJustificaciones(prev => ({
                            ...prev,
                            [item.campo.id]: { ...prev[item.campo.id], fundamento: e.target.value }
                          }))}
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={prevStep}>Atrás</Button>
              <Button onClick={nextStep} disabled={!isStep2Valid}>Revisar y enviar</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6" id="resumen-step">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Resumen de la solicitud</h2>
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <p className="text-muted-foreground">Institución solicitante</p>
                  <p className="font-semibold">MIES</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Coordinador</p>
                  <p className="font-semibold">Andrea López</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fuentes seleccionadas</p>
                  <p className="font-semibold">{new Set(selectedCamposDetails.map(c => c.fuenteId)).size}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Número total de campos</p>
                  <p className="font-semibold">{selectedCamposDetails.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Campos accesibles</p>
                  <p className="font-semibold">{selectedCamposDetails.filter(c => c.campo.clasificacion === "Accesible").length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold flex items-center gap-1"><Lock className="size-3"/> Requieren justificación jurídica</p>
                  <p className="font-semibold text-foreground">{selectedCamposDetails.filter(c => c.campo.clasificacion === "Confidencial").length}</p>
                </div>
              </div>
            </Card>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={prevStep}>Volver a editar</Button>
              <Button onClick={() => router.push('/wireframes2/acceso-interoperabilidad/solicitudes')} id="btn-enviar-solicitud">Enviar solicitud</Button>
            </div>
          </div>
        )}
      </div>
    </WireframeDashboardLayout>
    </TooltipProvider>
  );
}
