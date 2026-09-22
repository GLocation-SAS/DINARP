"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, FileText, Eye, Edit, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";
import { useSimulatedRole } from "../../catalogo-interoperabilidad/hooks/use-simulated-role";
import { WireframeTour, TourStep } from "../../components/wireframe-tour";
import { useEffect } from "react";

// Mock data
const mockSolicitudes = [
  {
    id: "SOL-2026-001",
    fecha: "2026-09-20",
    institucion: "MIES",
    fuentes: 2,
    campos: 15,
    estado: "En validación",
    responsable: "DGR",
    ultimaActualizacion: "2026-09-21"
  },
  {
    id: "SOL-2026-002",
    fecha: "2026-09-18",
    institucion: "MIES",
    fuentes: 1,
    campos: 3,
    estado: "Con observaciones",
    responsable: "Coordinador SINARP",
    ultimaActualizacion: "2026-09-19"
  },
  {
    id: "SOL-2026-003",
    fecha: "2026-09-10",
    institucion: "MIES",
    fuentes: 3,
    campos: 20,
    estado: "Revisión jurídica",
    responsable: "DPI",
    ultimaActualizacion: "2026-09-15"
  },
  {
    id: "SOL-2026-004",
    fecha: "2026-09-01",
    institucion: "MIES",
    fuentes: 1,
    campos: 5,
    estado: "Aprobada",
    responsable: "Coordinador SINARP",
    ultimaActualizacion: "2026-09-05"
  },
  {
    id: "SOL-2026-005",
    fecha: "2026-09-22",
    institucion: "Banco Pichincha",
    fuentes: 2,
    campos: 2,
    estado: "Pendiente de pago",
    responsable: "Coordinador SINARP",
    ultimaActualizacion: "2026-09-22"
  }
];

export default function AccesoInteroperabilidadPage() {
  const [role, setRole] = useSimulatedRole("COORDINADOR_SINARP");
  const [searchTerm, setSearchTerm] = useState("");

  let visibleSolicitudes = mockSolicitudes;

  if (role === "DPI") {
    visibleSolicitudes = mockSolicitudes.filter(s => s.estado === "Revisión jurídica");
  }

  const filteredSolicitudes = visibleSolicitudes.filter(
    (s) =>
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.institucion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [showWelcome, setShowWelcome] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("onboarding_solicitudes_visto")) {
      setShowWelcome(true);
    }
  }, []);

  const startTour = () => {
    setShowWelcome(false);
    setTourOpen(true);
    setCurrentStep(0);
    if (typeof window !== "undefined") {
      localStorage.setItem("onboarding_solicitudes_visto", "true");
    }
  };

  const skipTour = () => {
    setShowWelcome(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("onboarding_solicitudes_visto", "true");
    }
  };

  const getSteps = (): TourStep[] => {
    if (role === "COORDINADOR_SINARP") {
      return [
        {
          id: "step1",
          target: "#header-title",
          title: "Gestión de solicitudes",
          description: "Aquí puedes consultar todas las solicitudes de acceso de tu institución y revisar en qué etapa se encuentra cada una."
        },
        {
          id: "step2",
          target: "#btn-nueva-solicitud",
          title: "Nueva solicitud",
          description: "Desde aquí puedes iniciar una nueva solicitud para consumir información disponible en el Catálogo de Interoperabilidad."
        },
        {
          id: "step3",
          target: "#toolbar-filtros",
          title: "Búsqueda y filtros",
          description: "Utiliza los filtros para localizar solicitudes y consultar rápidamente las que requieren tu atención."
        },
        {
          id: "step4",
          target: "#role-selector-tour",
          title: "Selector de rol",
          description: "En este prototipo puedes cambiar el rol para visualizar cómo participa cada responsable durante el proceso."
        }
      ];
    } else if (role === "DGR") {
      return [
        {
          id: "step1",
          target: "#table-solicitudes",
          title: "Solicitudes a validar",
          description: "Aquí puedes consultar las solicitudes que requieren validación por parte de la Dirección de Gestión y Registro."
        }
      ];
    } else if (role === "DPI") {
      return [
        {
          id: "step1",
          target: "#table-solicitudes",
          title: "Revisión jurídica",
          description: "Aquí se muestran las solicitudes que requieren revisión de justificación jurídica."
        }
      ];
    }
    return [];
  };

  const steps = getSteps();

  return (
    <WireframeDashboardLayout
      activeMenu="acceso-interoperabilidad"
      breadcrumbs={[
        { label: "Acceso a Interoperabilidad", href: "/wireframes2/acceso-interoperabilidad/solicitudes" },
        { label: "Gestión de solicitudes" }
      ]}
      headerSlot={
        <div className="flex items-center gap-2" id="role-selector-tour">
          <select
            className="h-8 text-xs px-2 py-1 rounded-md border border-border bg-surface text-foreground"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
          >
            <option value="COORDINADOR_SINARP">Coordinador SINARP</option>
            <option value="DGR">Profesional DGR</option>
            <option value="DPI">Profesional DPI</option>
            <option value="DSI">DSI / Tecnología</option>
          </select>
          <Button variant="ghost" size="sm" onClick={() => setTourOpen(true)} className="h-8 px-2 text-xs">
            Ver guía
          </Button>
        </div>
      }
    >
      {/* Welcome Dialog */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl max-w-md shadow-2xl flex flex-col gap-4">
            <h2 className="text-xl font-bold">Conoce el proceso de Acceso a Interoperabilidad</h2>
            <p className="text-sm text-muted-foreground">
              Te mostraremos cómo crear, revisar y dar seguimiento a una solicitud de acceso a información.
            </p>
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={skipTour}>Omitir</Button>
              <Button onClick={startTour}>Comenzar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Tour Component */}
      <WireframeTour
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1" id="header-title">
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Gestión de solicitudes
            </h1>
            <p className="text-sm text-muted-foreground">
              Consulta, revisa y da seguimiento a las solicitudes de acceso a interoperabilidad.
            </p>
          </div>
          {role === "COORDINADOR_SINARP" && (
            <Link href="/wireframes2/acceso-interoperabilidad/solicitudes/nueva">
              <Button className="gap-2 shrink-0" id="btn-nueva-solicitud">
                <Plus className="size-4" />
                Nueva solicitud
              </Button>
            </Link>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3" id="toolbar-filtros">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar solicitud..."
              className="w-full pl-9 pr-4 h-10 bg-background border border-border/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-card mt-2" id="table-solicitudes">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Institución</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Fuentes</TableHead>
                <TableHead>Campos</TableHead>
                <TableHead>Etapa / estado</TableHead>
                <TableHead>Responsable actual</TableHead>
                <TableHead>Última actualización</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSolicitudes.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-foreground">{s.id}</TableCell>
                  <TableCell>{s.institucion}</TableCell>
                  <TableCell className="text-muted-foreground">{s.fecha}</TableCell>
                  <TableCell>{s.fuentes}</TableCell>
                  <TableCell>{s.campos}</TableCell>
                  <TableCell>
                    <Badge tone="neutral" appearance="outline" className="bg-background">
                      {s.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>{s.responsable}</TableCell>
                  <TableCell className="text-muted-foreground">{s.ultimaActualizacion}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              asChild
                              className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                              <Link href={`/wireframes2/acceso-interoperabilidad/solicitudes/${s.id}`}>
                                <Eye className="size-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">Ver detalle</p>
                          </TooltipContent>
                        </Tooltip>

                        {role === "COORDINADOR_SINARP" && s.estado === "Con observaciones" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                asChild
                                className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                              >
                                <Link href={`/wireframes2/acceso-interoperabilidad/solicitudes/${s.id}?edit=true`}>
                                  <Edit className="size-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">Corregir solicitud</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSolicitudes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center text-muted-foreground">
                    No se encontraron solicitudes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </WireframeDashboardLayout>
  );
}
