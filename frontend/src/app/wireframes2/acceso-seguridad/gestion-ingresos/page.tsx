"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Building2,
  User,
  ArrowUpDown,
  Search as SearchIcon,
  AlertTriangle,
  Info,
  ArrowLeft,
  FileText,
  SlidersHorizontal,
  Download,
  Check,
  Calendar,
  Mail,
  CreditCard,
  FileCheck2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDecorativeIcon } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "@/components/ui/search";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";
import { MOCK_USERS_BY_ROLE } from "../../catalogo-interoperabilidad/data/catalogo-data";
import {
  useSolicitudesIngresoStore,
  type SolicitudIngreso,
  type EstadoSolicitudIngreso,
} from "../data/gestion-ingresos-store";
import { AprobarSolicitudDialog } from "./components/aprobar-solicitud-dialog";
import { RechazarSolicitudDialog } from "./components/rechazar-solicitud-dialog";

const ITEMS_PER_PAGE = 6;

const REQUISITOS_DOCUMENTALES = [
  {
    id: "coordinador",
    titulo: "Cambio de Coordinador institucional titular y/o suplente",
    descripcion: "Oficio formal firmado electrónicamente por la máxima autoridad institucional.",
    archivoDefecto: "Cambio_Coordinador_Institucional_Titular.pdf",
    tamano: "1.4 MB",
    autoridad: "Banco Central del Ecuador (BCE)",
  },
  {
    id: "confidencialidad",
    titulo: "Acuerdo de Uso y Confidencialidad",
    descripcion: "Acuerdo suscrito de observancia estricta a la confidencialidad de la información.",
    archivoDefecto: "Acuerdo_Uso_Confidencialidad_Firmado.pdf",
    tamano: "890 KB",
    autoridad: "Security Data S.A.",
  },
  {
    id: "solicitud",
    titulo: "Solicitud de acceso al DINARP",
    descripcion: "Formulario oficial de petición y justificación técnica de interoperabilidad.",
    archivoDefecto: "Solicitud_Oficial_Acceso_DINARP.pdf",
    tamano: "1.1 MB",
    autoridad: "Banco Central del Ecuador (BCE)",
  },
];

export default function GestionIngresosPage() {
  const currentUser = MOCK_USERS_BY_ROLE.DGR;

  const {
    solicitudes,
    isLoaded,
    aprobarSolicitud,
    rechazarSolicitud,
  } = useSolicitudesIngresoStore();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("Todos");
  const [filterInstitucion, setFilterInstitucion] = useState<string>("Todas");
  const [filterFecha, setFilterFecha] = useState<string>("Todas");
  const [sortOrder, setSortOrder] = useState<
    | "fecha-desc"
    | "fecha-asc"
    | "nombre-asc"
    | "nombre-desc"
    | "institucion-asc"
    | "institucion-desc"
    | "cedula-asc"
    | "cedula-desc"
    | "estado-prioridad"
  >("fecha-desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Selected item for full Detail View
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudIngreso | null>(null);

  // Dialogs for Approve & Reject
  const [solicitudToApprove, setSolicitudToApprove] = useState<SolicitudIngreso | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [solicitudToReject, setSolicitudToReject] = useState<SolicitudIngreso | null>(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // Document preview modal
  const [previewDoc, setPreviewDoc] = useState<{
    titulo: string;
    archivo: string;
    tamano: string;
    autoridad: string;
  } | null>(null);

  // Helper date parser (DD/MM/YYYY HH:mm)
  const parseFechaSolicitud = (fechaStr: string) => {
    const [datePart, timePart] = fechaStr.split(" ");
    if (!datePart) return 0;
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes] = (timePart || "00:00").split(":").map(Number);
    return new Date(year, (month || 1) - 1, day || 1, hours || 0, minutes || 0).getTime();
  };

  // Institution options from data
  const institucionesList = useMemo(() => {
    const set = new Set<string>();
    solicitudes.forEach((s) => set.add(s.institucion));
    return Array.from(set);
  }, [solicitudes]);

  // KPIs
  const kpis = useMemo(() => {
    const pendientes = solicitudes.filter((s) => s.estado === "Pendiente").length;
    const aprobadas = solicitudes.filter((s) => s.estado === "Aprobada").length;
    const rechazadas = solicitudes.filter((s) => s.estado === "Rechazada").length;
    return { pendientes, aprobadas, rechazadas };
  }, [solicitudes]);

  // Filter & Sort
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let result = solicitudes.filter((item) => {
      const matchesSearch =
        q === "" ||
        item.cedula.toLowerCase().includes(q) ||
        item.nombreCompleto.toLowerCase().includes(q) ||
        item.correo.toLowerCase().includes(q) ||
        item.institucion.toLowerCase().includes(q);

      const matchesEstado =
        filterEstado === "Todos" || item.estado === filterEstado;

      const matchesInstitucion =
        filterInstitucion === "Todas" || item.institucion === filterInstitucion;

      const matchesFecha = (() => {
        if (filterFecha === "Todas") return true;
        const time = parseFechaSolicitud(item.fechaSolicitud);
        const now = new Date(2026, 8, 23).getTime();
        const diffDays = (now - time) / (1000 * 60 * 60 * 24);
        if (filterFecha === "7dias") return diffDays <= 7 && diffDays >= 0;
        if (filterFecha === "30dias") return diffDays <= 30 && diffDays >= 0;
        return true;
      })();

      return matchesSearch && matchesEstado && matchesInstitucion && matchesFecha;
    });

    // Sorting según columnas de la tabla
    result.sort((a, b) => {
      if (sortOrder === "fecha-desc") {
        return parseFechaSolicitud(b.fechaSolicitud) - parseFechaSolicitud(a.fechaSolicitud);
      }
      if (sortOrder === "fecha-asc") {
        return parseFechaSolicitud(a.fechaSolicitud) - parseFechaSolicitud(b.fechaSolicitud);
      }
      if (sortOrder === "nombre-asc") {
        return a.nombreCompleto.localeCompare(b.nombreCompleto);
      }
      if (sortOrder === "nombre-desc") {
        return b.nombreCompleto.localeCompare(a.nombreCompleto);
      }
      if (sortOrder === "institucion-asc") {
        return a.institucion.localeCompare(b.institucion);
      }
      if (sortOrder === "institucion-desc") {
        return b.institucion.localeCompare(a.institucion);
      }
      if (sortOrder === "cedula-asc") {
        return a.cedula.localeCompare(b.cedula);
      }
      if (sortOrder === "cedula-desc") {
        return b.cedula.localeCompare(a.cedula);
      }
      if (sortOrder === "estado-prioridad") {
        const priority: Record<string, number> = { Pendiente: 1, Aprobada: 2, Rechazada: 3 };
        return (priority[a.estado] || 99) - (priority[b.estado] || 99);
      }
      return 0;
    });

    return result;
  }, [solicitudes, searchQuery, filterEstado, filterInstitucion, filterFecha, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handleOpenApprove = (sol: SolicitudIngreso) => {
    setSolicitudToApprove(sol);
    setIsApproveOpen(true);
  };

  const handleOpenReject = (sol: SolicitudIngreso) => {
    setSolicitudToReject(sol);
    setIsRejectOpen(true);
  };

  const handleConfirmApprove = (sol: SolicitudIngreso) => {
    aprobarSolicitud(sol.id, `${currentUser.name} (Dirección de Gestión y Registro)`);
    if (selectedSolicitud && selectedSolicitud.id === sol.id) {
      setSelectedSolicitud({
        ...selectedSolicitud,
        estado: "Aprobada",
        revisor: `${currentUser.name} (Dirección de Gestión y Registro)`,
        fechaRevision: "Ahora mismo",
      });
    }
  };

  const handleConfirmReject = (sol: SolicitudIngreso, motivo: string) => {
    rechazarSolicitud(sol.id, motivo, `${currentUser.name} (Dirección de Gestión y Registro)`);
    if (selectedSolicitud && selectedSolicitud.id === sol.id) {
      setSelectedSolicitud({
        ...selectedSolicitud,
        estado: "Rechazada",
        revisor: `${currentUser.name} (Dirección de Gestión y Registro)`,
        motivoRechazo: motivo,
        fechaRevision: "Ahora mismo",
      });
    }
  };

  // State Badge Helper
  const renderEstadoBadge = (estado: EstadoSolicitudIngreso) => {
    switch (estado) {
      case "Aprobada":
        return (
          <Badge tone="success" appearance="soft" size="sm" className="font-semibold gap-1 text-xs">
            <CheckCircle2 className="size-3" />
            Aprobada
          </Badge>
        );
      case "Rechazada":
        return (
          <Badge tone="danger" appearance="soft" size="sm" className="font-semibold gap-1 text-xs">
            <XCircle className="size-3" />
            Rechazada
          </Badge>
        );
      case "Pendiente":
      default:
        return (
          <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold gap-1 text-xs">
            <Clock className="size-3" />
            Pendiente
          </Badge>
        );
    }
  };

  // Breadcrumbs based on current view (List vs Detail)
  const breadcrumbItems = useMemo(() => {
    if (!selectedSolicitud) {
      return [
        { label: "Acceso y seguridad" },
        { label: "Gestión de ingresos" },
      ];
    }
    return [
      { label: "Acceso y seguridad" },
      { label: "Gestión de ingresos", href: "/wireframes2/acceso-seguridad/gestion-ingresos" },
      { label: `Detalle: ${selectedSolicitud.id}` },
    ];
  }, [selectedSolicitud]);

  return (
    <WireframeDashboardLayout
      activeMenu="gestion-ingresos"
      currentRole="DGR"
      currentUser={currentUser}
      breadcrumbs={breadcrumbItems}
    >
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ══════════════════════════════════════════════════════════
            VISTA 1: DETALLE DE SOLICITUD (BREADCRUMB + APROBAR / RECHAZAR)
           ══════════════════════════════════════════════════════════ */}
        {selectedSolicitud ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Cabecera de Detalle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSolicitud(null)}
                  className="h-9 px-3 gap-1.5 text-xs font-semibold rounded-xl"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Volver al listado</span>
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-foreground">
                      Solicitud {selectedSolicitud.id}
                    </h1>
                    {renderEstadoBadge(selectedSolicitud.estado)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Registrada el {selectedSolicitud.fechaSolicitud} · {selectedSolicitud.institucion}
                  </p>
                </div>
              </div>

              {/* Botones de acción en la cabecera (Aprobar o Rechazar) */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {selectedSolicitud.estado === "Pendiente" ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenReject(selectedSolicitud)}
                      className="h-9 px-3.5 text-xs font-semibold gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 border-rose-300 dark:border-rose-900/50 rounded-xl"
                    >
                      <XCircle className="size-4" />
                      <span>Rechazar</span>
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenApprove(selectedSolicitud)}
                      className="h-9 px-3.5 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                    >
                      <CheckCircle2 className="size-4" />
                      <span>Aprobar acceso</span>
                    </Button>
                  </>
                ) : selectedSolicitud.estado === "Aprobada" ? (
                  <Badge tone="success" appearance="soft" size="lg" className="gap-1.5 text-xs font-semibold py-1 px-3">
                    <CheckCircle2 className="size-3.5" />
                    Acceso autorizado
                  </Badge>
                ) : (
                  <Badge tone="danger" appearance="soft" size="lg" className="gap-1.5 text-xs font-semibold py-1 px-3">
                    <XCircle className="size-3.5" />
                    Solicitud rechazada
                  </Badge>
                )}
              </div>
            </div>

            {/* Banners contextuales según estado */}
            {selectedSolicitud.estado === "Aprobada" && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Acceso institucional concedido</span>
                </div>
                <p className="text-xs mt-1 leading-relaxed opacity-90">
                  El usuario fue validado y tiene credenciales activas en la plataforma.
                </p>
                <div className="pt-2 mt-2 border-t border-emerald-500/20 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-muted-foreground">Fecha de aprobación: </span>
                    <strong className="text-foreground">{selectedSolicitud.fechaRevision || "Reciente"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revisado por: </span>
                    <strong className="text-foreground">{selectedSolicitud.revisor || "Dirección de Gestión y Registro"}</strong>
                  </div>
                </div>
              </div>
            )}

            {selectedSolicitud.estado === "Rechazada" && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-950 dark:text-rose-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-rose-700 dark:text-rose-300">
                  <XCircle className="size-4 shrink-0" />
                  <span>Solicitud denegada</span>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-rose-500/20 text-xs">
                  <span className="font-semibold text-rose-600 dark:text-rose-400 block mb-1">
                    Motivo registrado:
                  </span>
                  <p className="text-foreground leading-relaxed">
                    {selectedSolicitud.motivoRechazo || "No se especificó motivo de rechazo."}
                  </p>
                </div>
                <div className="pt-2 border-t border-rose-500/20 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-muted-foreground">Fecha de rechazo: </span>
                    <strong className="text-foreground">{selectedSolicitud.fechaRevision || "Reciente"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revisado por: </span>
                    <strong className="text-foreground">{selectedSolicitud.revisor || "Dirección de Gestión y Registro"}</strong>
                  </div>
                </div>
              </div>
            )}

            {selectedSolicitud.estado === "Pendiente" && (
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 flex items-start gap-2.5 text-xs text-muted-foreground">
                <Clock className="size-4 text-foreground mt-0.5 shrink-0" />
                <span>
                  Esta solicitud se encuentra <strong className="text-foreground">pendiente de revisión</strong>. Verifica los datos personales y los 3 documentos habilitantes cargados por el usuario para decidir la aprobación o el rechazo.
                </span>
              </div>
            )}

            {/* Cuadrícula de Información */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna Izquierda: Datos y Documentos (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                {/* 1. Datos Personales e Institucionales */}
                <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                      <User className="size-4 text-primary" />
                      1. Datos del Solicitante e Institución
                    </h2>
                    <Badge tone="neutral" appearance="soft" size="sm">
                      Validado en Registro Civil
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <span className="text-muted-foreground text-[11px] block mb-1">Cédula de Identidad</span>
                      <span className="font-mono font-bold text-foreground text-sm">{selectedSolicitud.cedula}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <span className="text-muted-foreground text-[11px] block mb-1">Nombre Completo</span>
                      <span className="font-bold text-foreground text-sm">{selectedSolicitud.nombreCompleto}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <span className="text-muted-foreground text-[11px] block mb-1 flex items-center gap-1">
                        <Mail className="size-3 text-muted-foreground" />
                        Correo Electrónico Institucional
                      </span>
                      <span className="font-semibold text-foreground break-all">{selectedSolicitud.correo}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                      <span className="text-muted-foreground text-[11px] block mb-1 flex items-center gap-1">
                        <Building2 className="size-3 text-muted-foreground" />
                        Institución Pública
                      </span>
                      <span className="font-semibold text-foreground">{selectedSolicitud.institucion}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Documentación Habilitante Requerida (Los 3 documentos obligatorios) */}
                <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div>
                      <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                        <FileCheck2 className="size-4 text-emerald-600" />
                        2. Documentos Habilitantes Cargados
                      </h2>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Los 3 documentos obligatorios suscritos y enviados en formato PDF.
                      </p>
                    </div>
                    <Badge tone="success" appearance="soft" size="sm" className="font-semibold gap-1">
                      <Check className="size-3" />
                      3 de 3 completados
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {REQUISITOS_DOCUMENTALES.map((doc, idx) => {
                      const docFileName =
                        selectedSolicitud.documentos && selectedSolicitud.documentos[idx]
                          ? selectedSolicitud.documentos[idx]
                          : doc.archivoDefecto;

                      return (
                        <div
                          key={doc.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                              <FileText className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-xs text-foreground">
                                  {idx + 1}. {doc.titulo}
                                </span>
                                <Badge tone="success" appearance="soft" size="sm" className="text-[10px] h-4.5 px-1.5 gap-1">
                                  <Check className="size-2.5" />
                                  Firma válida
                                </Badge>
                              </div>
                              <p className="font-mono text-[11px] text-muted-foreground truncate mt-0.5">
                                {docFileName} · {doc.tamano}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setPreviewDoc({
                                  titulo: doc.titulo,
                                  archivo: docFileName,
                                  tamano: doc.tamano,
                                  autoridad: doc.autoridad,
                                })
                              }
                              className="h-8 px-2.5 text-xs font-semibold gap-1.5"
                            >
                              <Eye className="size-3.5" />
                              <span>Ver documento</span>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Requisitos de Seguridad Verificados */}
                <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                      <ShieldCheck className="size-4 text-primary" />
                      3. Parámetros de Credenciales Registradas
                    </h2>
                    <Badge tone="success" appearance="soft" size="sm">
                      Checklist Aprobado
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    La contraseña registrada por el usuario durante el paso 2 de prerregistro cumple los estándares criptográficos institucionales:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      "Mínimo 8 caracteres",
                      "Una letra mayúscula",
                      "Un dígito numérico",
                      "Un carácter especial",
                    ].map((rule) => (
                      <div
                        key={rule}
                        className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold"
                      >
                        <Check className="size-3 text-emerald-600 shrink-0" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Decisión y Auditoría (1 col) */}
              <div className="space-y-6">
                {/* Caja de Decisión Rápida (únicamente si está pendiente de revisión) */}
                {selectedSolicitud.estado === "Pendiente" && (
                  <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
                    <h3 className="text-sm font-bold font-heading text-foreground">
                      Dictamen de Autorización
                    </h3>

                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Como funcionario de la Dirección de Gestión y Registro, confirma la pertinencia de la institución y autoriza o deniega el acceso:
                      </p>

                      <div className="flex flex-col gap-2 pt-1">
                        <Button
                          type="button"
                          variant="primary"
                          onClick={() => handleOpenApprove(selectedSolicitud)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10 gap-2 rounded-xl shadow-xs"
                        >
                          <CheckCircle2 className="size-4" />
                          <span>Aprobar acceso institucional</span>
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleOpenReject(selectedSolicitud)}
                          className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 border-rose-300 dark:border-rose-900/50 font-semibold text-xs h-10 gap-2 rounded-xl"
                        >
                          <XCircle className="size-4" />
                          <span>Rechazar solicitud</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trazabilidad del trámite */}
                <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
                  <h3 className="text-sm font-bold font-heading text-foreground">
                    Trazabilidad del Trámite
                  </h3>

                  <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border/60">
                    {/* Hito 1 */}
                    <div className="relative flex items-start gap-3 text-xs">
                      <span className="size-7 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <Check className="size-3.5" />
                      </span>
                      <div>
                        <p className="font-bold text-foreground">1. Prerregistro completado</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Datos y contraseña registrados el {selectedSolicitud.fechaSolicitud}.
                        </p>
                      </div>
                    </div>

                    {/* Hito 2 */}
                    <div className="relative flex items-start gap-3 text-xs">
                      <span className="size-7 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <Check className="size-3.5" />
                      </span>
                      <div>
                        <p className="font-bold text-foreground">2. Carga de 3 documentos</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Coordinador, Confidencialidad y Solicitud adjuntados con firma.
                        </p>
                      </div>
                    </div>

                    {/* Hito 3 */}
                    <div className="relative flex items-start gap-3 text-xs">
                      <span
                        className={`size-7 rounded-full flex items-center justify-center shrink-0 border ${
                          selectedSolicitud.estado === "Aprobada"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : selectedSolicitud.estado === "Rechazada"
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {selectedSolicitud.estado === "Aprobada" ? (
                          <Check className="size-3.5" />
                        ) : selectedSolicitud.estado === "Rechazada" ? (
                          <XCircle className="size-3.5" />
                        ) : (
                          <Clock className="size-3.5" />
                        )}
                      </span>
                      <div>
                        <p className="font-bold text-foreground">
                          3. Dictamen DGR:{" "}
                          <span
                            className={
                              selectedSolicitud.estado === "Aprobada"
                                ? "text-emerald-600"
                                : selectedSolicitud.estado === "Rechazada"
                                ? "text-rose-600"
                                : "text-muted-foreground"
                            }
                          >
                            {selectedSolicitud.estado}
                          </span>
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {selectedSolicitud.estado === "Pendiente"
                            ? "En espera de tu decisión o revisión."
                            : `Revisado por ${selectedSolicitud.revisor || "DGR"}.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════
              VISTA 2: LISTADO DE SOLICITUDES (TABLA CON ACCIÓN "GESTIONAR")
             ══════════════════════════════════════════════════════════ */
          <div className="border border-border/80 rounded-2xl bg-card p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
            {/* ── 1. Encabezado Principal ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground">
                  Gestión de ingresos
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
                  Revisa y gestiona las solicitudes de acceso a la plataforma enviadas por los usuarios.
                </p>
              </div>
            </div>

            {/* ── 2. Resumen Superior (KPIs) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Pendientes */}
              <Card
                variant="featured"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setFilterEstado(filterEstado === "Pendiente" ? "Todos" : "Pendiente");
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFilterEstado(filterEstado === "Pendiente" ? "Todos" : "Pendiente");
                    setCurrentPage(1);
                  }
                }}
                className={`cursor-pointer transition-all border ${
                  filterEstado === "Pendiente"
                    ? "bg-card border-foreground/50 ring-2 ring-foreground/20 shadow-sm"
                    : "bg-card hover:bg-muted/40 border-border shadow-xs"
                }`}
                innerClassName="p-5 items-start text-left gap-1"
              >
                <span className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight block">
                  {kpis.pendientes}
                </span>
                <span className="text-xs font-semibold text-foreground block">
                  Pendientes
                </span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  por revisar
                </span>
                <CardDecorativeIcon>
                  <Clock className="size-24 text-muted-foreground" />
                </CardDecorativeIcon>
              </Card>

              {/* Aprobadas */}
              <Card
                variant="featured"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setFilterEstado(filterEstado === "Aprobada" ? "Todos" : "Aprobada");
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFilterEstado(filterEstado === "Aprobada" ? "Todos" : "Aprobada");
                    setCurrentPage(1);
                  }
                }}
                className={`cursor-pointer transition-all border ${
                  filterEstado === "Aprobada"
                    ? "bg-card border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-sm"
                    : "bg-card hover:bg-muted/40 border-border shadow-xs"
                }`}
                innerClassName="p-5 items-start text-left gap-1"
              >
                <span className="font-heading font-extrabold text-3xl sm:text-4xl text-emerald-600 tracking-tight block">
                  {kpis.aprobadas}
                </span>
                <span className="text-xs font-semibold text-emerald-600 block">
                  Aprobadas
                </span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  autorizadas
                </span>
                <CardDecorativeIcon>
                  <CheckCircle2 className="size-24 text-muted-foreground" />
                </CardDecorativeIcon>
              </Card>

              {/* Rechazadas */}
              <Card
                variant="featured"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setFilterEstado(filterEstado === "Rechazada" ? "Todos" : "Rechazada");
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFilterEstado(filterEstado === "Rechazada" ? "Todos" : "Rechazada");
                    setCurrentPage(1);
                  }
                }}
                className={`cursor-pointer transition-all border ${
                  filterEstado === "Rechazada"
                    ? "bg-card border-rose-500/60 ring-2 ring-rose-500/20 shadow-sm"
                    : "bg-card hover:bg-muted/40 border-border shadow-xs"
                }`}
                innerClassName="p-5 items-start text-left gap-1"
              >
                <span className="font-heading font-extrabold text-3xl sm:text-4xl text-rose-600 tracking-tight block">
                  {kpis.rechazadas}
                </span>
                <span className="text-xs font-semibold text-rose-600 block">
                  Rechazadas
                </span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  denegadas
                </span>
                <CardDecorativeIcon>
                  <XCircle className="size-24 text-muted-foreground" />
                </CardDecorativeIcon>
              </Card>
            </div>

            {/* ── Línea divisoria debajo de las cards ── */}
            <div className="border-b border-border/80" />

            {/* ── 3. Buscador y Filtros ── */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full sm:max-w-md">
                  <Search
                    placeholder="Buscar por cédula, nombre, correo o institución..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    onClear={() => setSearchQuery("")}
                    className="bg-surface rounded-full border-border/80 shadow-xs h-11"
                  />
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  {/* Filtro Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-11 px-4 text-xs font-semibold gap-2 border-border/80 bg-surface rounded-full hover:bg-muted/40 shadow-xs w-full sm:w-auto"
                      >
                        <Filter className="size-3.5 text-muted-foreground" />
                        <span>Filtros</span>
                        {(filterEstado !== "Todos" || filterInstitucion !== "Todas" || filterFecha !== "Todas") && (
                          <span className="size-2 rounded-full bg-primary" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2">
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <DropdownMenuLabel className="p-0 text-xs font-semibold">Filtros de tabla</DropdownMenuLabel>
                        {(filterEstado !== "Todos" || filterInstitucion !== "Todas" || filterFecha !== "Todas") && (
                          <button
                            type="button"
                            onClick={() => {
                              setFilterEstado("Todos");
                              setFilterInstitucion("Todas");
                              setFilterFecha("Todas");
                              setCurrentPage(1);
                            }}
                            className="text-[11px] text-primary hover:underline font-medium"
                          >
                            Restablecer
                          </button>
                        )}
                      </div>
                      <DropdownMenuSeparator />

                      {/* Filtrar por Estado */}
                      <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 pt-1 uppercase tracking-wider">
                        Estado
                      </DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={filterEstado}
                        onValueChange={(val) => {
                          setFilterEstado(val);
                          setCurrentPage(1);
                        }}
                      >
                        <DropdownMenuRadioItem value="Todos" className="text-xs">
                          Todos los estados
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Pendiente" className="text-xs">
                          <span className="size-2 rounded-full bg-foreground mr-2 shrink-0" />
                          Pendiente
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Aprobada" className="text-xs">
                          <span className="size-2 rounded-full bg-emerald-500 mr-2 shrink-0" />
                          Aprobada
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Rechazada" className="text-xs">
                          <span className="size-2 rounded-full bg-rose-500 mr-2 shrink-0" />
                          Rechazada
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>

                      <DropdownMenuSeparator />

                      {/* Filtrar por Institución */}
                      <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 pt-1 uppercase tracking-wider">
                        Institución
                      </DropdownMenuLabel>
                      <div className="max-h-44 overflow-y-auto">
                        <DropdownMenuRadioGroup
                          value={filterInstitucion}
                          onValueChange={(val) => {
                            setFilterInstitucion(val);
                            setCurrentPage(1);
                          }}
                        >
                          <DropdownMenuRadioItem value="Todas" className="text-xs">
                            Todas las instituciones
                          </DropdownMenuRadioItem>
                          {institucionesList.map((inst) => (
                            <DropdownMenuRadioItem key={inst} value={inst} className="text-xs truncate">
                              {inst}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </div>

                      <DropdownMenuSeparator />

                      {/* Filtrar por Fecha */}
                      <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 pt-1 uppercase tracking-wider">
                        Fecha de solicitud
                      </DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={filterFecha}
                        onValueChange={(val) => {
                          setFilterFecha(val);
                          setCurrentPage(1);
                        }}
                      >
                        <DropdownMenuRadioItem value="Todas" className="text-xs">
                          Todas las fechas
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="7dias" className="text-xs">
                          Últimos 7 días
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="30dias" className="text-xs">
                          Últimos 30 días
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Ordenamiento Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-11 px-4 text-xs font-semibold gap-2 border-border/80 bg-surface rounded-full hover:bg-muted/40 shrink-0 shadow-xs"
                        aria-label="Ordenar solicitudes"
                      >
                        <ArrowUpDown className="size-3.5 text-muted-foreground" />
                        <span>Ordenar</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-1">
                      <DropdownMenuLabel className="text-xs font-semibold px-2 py-1.5">
                        Criterio de ordenación
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 pt-1 uppercase tracking-wider">
                        Fecha de solicitud
                      </DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={sortOrder}
                        onValueChange={(val) => setSortOrder(val as any)}
                      >
                        <DropdownMenuRadioItem value="fecha-desc" className="text-xs">
                          Más recientes primero
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="fecha-asc" className="text-xs">
                          Más antiguas primero
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 pt-1 uppercase tracking-wider">
                        Usuario / Nombre
                      </DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={sortOrder}
                        onValueChange={(val) => setSortOrder(val as any)}
                      >
                        <DropdownMenuRadioItem value="nombre-asc" className="text-xs">
                          Nombre (A - Z)
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="nombre-desc" className="text-xs">
                          Nombre (Z - A)
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 pt-1 uppercase tracking-wider">
                        Institución
                      </DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={sortOrder}
                        onValueChange={(val) => setSortOrder(val as any)}
                      >
                        <DropdownMenuRadioItem value="institucion-asc" className="text-xs">
                          Institución (A - Z)
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="institucion-desc" className="text-xs">
                          Institución (Z - A)
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 pt-1 uppercase tracking-wider">
                        Cédula
                      </DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={sortOrder}
                        onValueChange={(val) => setSortOrder(val as any)}
                      >
                        <DropdownMenuRadioItem value="cedula-asc" className="text-xs">
                          Cédula (0 - 9)
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="cedula-desc" className="text-xs">
                          Cédula (9 - 0)
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 pt-1 uppercase tracking-wider">
                        Estado
                      </DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={sortOrder}
                        onValueChange={(val) => setSortOrder(val as any)}
                      >
                        <DropdownMenuRadioItem value="estado-prioridad" className="text-xs">
                          Pendientes primero
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Filtros Activos Chips */}
              {(Boolean(searchQuery) || filterEstado !== "Todos" || filterInstitucion !== "Todas" || filterFecha !== "Todas") && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-muted-foreground font-medium text-[11px]">Filtros aplicados:</span>
                  {searchQuery && (
                    <Badge tone="neutral" appearance="soft" size="sm" className="gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-normal normal-case">
                      Búsqueda: &ldquo;{searchQuery}&rdquo;
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setCurrentPage(1);
                        }}
                        className="ml-1 hover:text-foreground inline-flex items-center"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  )}
                  {filterEstado !== "Todos" && (
                    <Badge tone="neutral" appearance="soft" size="sm" className="gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-normal normal-case">
                      Estado: {filterEstado}
                      <button
                        type="button"
                        onClick={() => {
                          setFilterEstado("Todos");
                          setCurrentPage(1);
                        }}
                        className="ml-1 hover:text-foreground inline-flex items-center"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  )}
                  {filterInstitucion !== "Todas" && (
                    <Badge tone="neutral" appearance="soft" size="sm" className="gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-normal normal-case max-w-[280px]">
                      <span className="truncate">Institución: {filterInstitucion}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFilterInstitucion("Todas");
                          setCurrentPage(1);
                        }}
                        className="ml-1 hover:text-foreground shrink-0 inline-flex items-center"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  )}
                  {filterFecha !== "Todas" && (
                    <Badge tone="neutral" appearance="soft" size="sm" className="gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-normal normal-case">
                      Fecha: {filterFecha === "7dias" ? "Últimos 7 días" : "Últimos 30 días"}
                      <button
                        type="button"
                        onClick={() => {
                          setFilterFecha("Todas");
                          setCurrentPage(1);
                        }}
                        className="ml-1 hover:text-foreground inline-flex items-center"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setFilterEstado("Todos");
                      setFilterInstitucion("Todas");
                      setFilterFecha("Todas");
                      setCurrentPage(1);
                    }}
                    className="text-[11px] text-primary hover:underline font-medium ml-1"
                  >
                    Limpiar todo
                  </button>
                </div>
              )}
            </div>

            {/* ── 4. Tabla de Solicitudes de Acceso ── */}
            <div className="rounded-2xl border border-border/80 bg-surface overflow-hidden shadow-2xs">
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableHead className="w-[12%] px-2.5 first:pl-4 font-bold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      CÉDULA
                    </TableHead>
                    <TableHead className="w-[22%] px-2.5 font-bold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      USUARIO
                    </TableHead>
                    <TableHead className="w-[21%] px-2.5 font-bold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      CORREO INSTITUCIONAL
                    </TableHead>
                    <TableHead className="w-[19%] px-2.5 font-bold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      INSTITUCIÓN
                    </TableHead>
                    <TableHead className="w-[12%] px-2.5 font-bold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      FECHA SOLICITUD
                    </TableHead>
                    <TableHead className="w-[10%] px-2.5 font-bold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      ESTADO
                    </TableHead>
                    <TableHead className="w-[4%] px-2.5 last:pr-4 text-right font-bold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      ACCIONES
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-2">
                          <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mb-1">
                            <SearchIcon className="size-6" />
                          </div>
                          <h3 className="font-heading font-bold text-base text-foreground">
                            No hay solicitudes de acceso
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Las nuevas solicitudes realizadas desde el prerregistro aparecerán aquí para su revisión.
                          </p>
                          {(searchQuery || filterEstado !== "Todos" || filterInstitucion !== "Todas" || filterFecha !== "Todas") && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSearchQuery("");
                                setFilterEstado("Todos");
                                setFilterInstitucion("Todas");
                                setFilterFecha("Todas");
                              }}
                              className="mt-2 text-xs font-semibold rounded-full"
                            >
                              Limpiar filtros
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((row) => (
                      <TableRow
                        key={row.id}
                        className="cursor-pointer transition-colors hover:bg-muted/40"
                        onClick={() => setSelectedSolicitud(row)}
                      >
                        {/* Cédula */}
                        <TableCell className="px-2.5 first:pl-4 font-mono text-xs font-semibold text-foreground whitespace-nowrap truncate">
                          {row.cedula}
                        </TableCell>

                        {/* Usuario con Avatar */}
                        <TableCell className="px-2.5 min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="size-8 rounded-full bg-muted text-foreground font-bold text-xs flex items-center justify-center shrink-0 border border-border/80">
                              {row.iniciales}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-foreground text-xs leading-tight truncate">
                                {row.nombreCompleto}
                              </span>
                              <span className="font-mono text-[10px] text-muted-foreground truncate">
                                {row.id}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Correo institucional */}
                        <TableCell className="px-2.5 text-muted-foreground text-xs font-medium min-w-0">
                          <span className="truncate block" title={row.correo}>
                            {row.correo}
                          </span>
                        </TableCell>

                        {/* Institución */}
                        <TableCell className="px-2.5 text-muted-foreground text-xs font-medium min-w-0">
                          <span className="truncate block" title={row.institucion}>
                            {row.institucion}
                          </span>
                        </TableCell>

                        {/* Fecha de solicitud */}
                        <TableCell className="px-2.5 text-muted-foreground font-mono text-xs whitespace-nowrap min-w-0">
                          <span className="block truncate">{row.fechaSolicitud}</span>
                        </TableCell>

                        {/* Estado */}
                        <TableCell className="px-2.5 whitespace-nowrap min-w-0">
                          {renderEstadoBadge(row.estado)}
                        </TableCell>

                        {/* Columna Acciones */}
                        <TableCell className="px-2.5 last:pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSolicitud(row);
                                  }}
                                  className="size-8 text-primary hover:text-primary hover:bg-primary/10 rounded-lg"
                                  aria-label={`Gestionar solicitud ${row.id}`}
                                >
                                  <SlidersHorizontal className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Gestionar solicitud</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* ── 5. Paginación Estandarizada ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
              <p className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
                Mostrando <span className="font-bold text-foreground">{paginatedData.length}</span> de{" "}
                <span className="font-bold text-foreground">{filteredData.length}</span> solicitudes
              </p>

              {totalPages > 1 && (
                <div className="order-1 sm:order-2">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={currentPage <= 1 ? "pointer-events-none opacity-40" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage >= totalPages ? "pointer-events-none opacity-40" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Modal de Vista Previa de Documento ── */}
        <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
          <DialogContent className="max-w-md p-6">
            {previewDoc && (
              <>
                <DialogHeader className="space-y-2">
                  <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
                    <FileText className="size-5" />
                  </div>
                  <DialogTitle className="text-base font-bold text-foreground">
                    {previewDoc.titulo}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Documento habilitante reglamentario cargado por el solicitante en formato PDF.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-2 text-xs">
                  <div className="p-3 bg-muted/40 rounded-xl border border-border/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Nombre del archivo:</span>
                      <span className="font-mono font-bold text-foreground">{previewDoc.archivo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tamaño:</span>
                      <span className="font-semibold text-foreground">{previewDoc.tamano}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Firma digital:</span>
                      <Badge tone="success" appearance="soft" size="sm" className="gap-1 text-[10px]">
                        <Check className="size-2.5" />
                        Válida y Vigente
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Entidad certificadora:</span>
                      <span className="font-semibold text-foreground">{previewDoc.autoridad}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-start gap-2">
                    <ShieldCheck className="size-4 shrink-0 mt-0.5 text-emerald-600" />
                    <span>
                      La firma electrónica cumple con las especificaciones técnicas del esquema gubernamental de interoperabilidad y cuenta con estampa cronológica (timestamp).
                    </span>
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPreviewDoc(null)}
                    className="text-xs font-semibold"
                  >
                    Cerrar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      toast.success(`Descarga iniciada: ${previewDoc.archivo}`);
                    }}
                    className="text-xs font-semibold gap-1.5"
                  >
                    <Download className="size-3.5" />
                    <span>Descargar PDF</span>
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Modales de Acción (Aprobar y Rechazar) ── */}
        <AprobarSolicitudDialog
          solicitud={solicitudToApprove}
          open={isApproveOpen}
          onOpenChange={setIsApproveOpen}
          onConfirm={handleConfirmApprove}
        />

        <RechazarSolicitudDialog
          solicitud={solicitudToReject}
          open={isRejectOpen}
          onOpenChange={setIsRejectOpen}
          onConfirm={handleConfirmReject}
        />
      </main>
    </WireframeDashboardLayout>
  );
}
