"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
  ChevronDown,
  Eye,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Database,
  ArrowRight,
  Download,
  AlertTriangle,
  Send,
  User,
  Calendar,
  Layers,
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
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
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
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DetailList } from "@/components/ui/detail-list";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

interface SolicitudAprobacion {
  codigo: string;
  solicitud: string;
  institucionSolicitante: string;
  institucionFuente: string;
  tipoIntercambio: string;
  estado: "Pendiente" | "En revisión" | "Observada" | "Aprobada" | "Rechazada";
  prioridad: "Alta" | "Media" | "Baja";
  fecha: string;
  responsable: string;
  unidad: string;
  datosRequeridos: string[];
  finalidad: string;
  clasificacion: string;
  documentos: { nombre: string; tamano: string }[];
  observacionesPrevias: { autor: string; rol: string; fecha: string; texto: string }[];
  historial: { etapa: string; fecha: string; responsable: string }[];
}

const SOLICITUDES_DATA: SolicitudAprobacion[] = [
  {
    codigo: "SOL-2025-0024",
    solicitud: "Validación de identidad ciudadana",
    institucionSolicitante: "Ministerio del Interior",
    institucionFuente: "Registro Civil",
    tipoIntercambio: "Uno a uno (API REST)",
    estado: "En revisión",
    prioridad: "Alta",
    fecha: "12 abr 2025 10:24",
    responsable: "Ing. Carlos Mendoza",
    unidad: "Dirección de TI",
    datosRequeridos: ["Cédula", "Nombres Completos", "Fecha de Nacimiento", "Estado Civil", "Fotografía Facial"],
    finalidad: "Verificación de identidad ciudadana para trámites y emisión de salvoconductos en línea.",
    clasificacion: "Confidencial - Nivel 2 (Datos Personales)",
    documentos: [
      { nombre: "Terminos_Referencia_MINTEL.pdf", tamano: "2.4 MB" },
      { nombre: "Acuerdo_Confidencialidad.pdf", tamano: "1.1 MB" },
    ],
    observacionesPrevias: [
      {
        autor: "Abg. Lucía Morales",
        rol: "DINARP - Jurídico",
        fecha: "10 abr 14:20",
        texto: "Competencia institucional verificada favorablemente.",
      },
    ],
    historial: [
      { etapa: "Borrador creado", fecha: "08 abr 09:15", responsable: "Carlos Mendoza" },
      { etapa: "Solicitud enviada", fecha: "10 abr 08:30", responsable: "Carlos Mendoza" },
      { etapa: "Revisión técnica", fecha: "11 abr 10:00", responsable: "Marcos Viteri" },
    ],
  },
  {
    codigo: "SOL-2025-0023",
    solicitud: "Consulta de antecedentes penales",
    institucionSolicitante: "Consejo de la Judicatura",
    institucionFuente: "Policía Nacional",
    tipoIntercambio: "Uno a uno (API REST)",
    estado: "Pendiente",
    prioridad: "Alta",
    fecha: "10 abr 2025 16:12",
    responsable: "Dr. Jorge Paredes",
    unidad: "Dirección Nacional de Gestión Procesal",
    datosRequeridos: ["Cédula", "Nombres", "Estado Penal", "Historial de Causas"],
    finalidad: "Interoperabilidad para sustanciación de audiencias telemáticas en tiempo real.",
    clasificacion: "Reservada - Nivel 3 (Judicial)",
    documentos: [{ nombre: "Oficio_Judicatura_0842.pdf", tamano: "1.8 MB" }],
    observacionesPrevias: [],
    historial: [
      { etapa: "Borrador creado", fecha: "09 abr 11:00", responsable: "Jorge Paredes" },
      { etapa: "Solicitud enviada", fecha: "10 abr 16:12", responsable: "Jorge Paredes" },
    ],
  },
  {
    codigo: "SOL-2025-0022",
    solicitud: "Verificación de RUC y estado tributario",
    institucionSolicitante: "Municipio de Guayaquil",
    institucionFuente: "SRI",
    tipoIntercambio: "Batch / Masivo",
    estado: "Observada",
    prioridad: "Media",
    fecha: "08 abr 2025 14:30",
    responsable: "Ing. Andrea Salazar",
    unidad: "Dirección de Rentas Municipales",
    datosRequeridos: ["RUC", "Razón Social", "Estado Tributario", "Obligaciones Pendientes"],
    finalidad: "Cruce masivo para actualización de patentes municipales y tasas cantonales.",
    clasificacion: "Confidencial - Nivel 2",
    documentos: [{ nombre: "Convenio_SRI_Municipio.pdf", tamano: "3.2 MB" }],
    observacionesPrevias: [
      {
        autor: "Ing. Roberto Alarcón",
        rol: "SRI - Seguridad",
        fecha: "09 abr 10:15",
        texto: "Falta definir la frecuencia exacta y ventana horaria del batch nocturno.",
      },
    ],
    historial: [
      { etapa: "Solicitud enviada", fecha: "08 abr 14:30", responsable: "Andrea Salazar" },
      { etapa: "Observación registrada", fecha: "09 abr 10:15", responsable: "Roberto Alarcón" },
    ],
  },
  {
    codigo: "SOL-2025-0021",
    solicitud: "Consulta de información vehicular y matrículas",
    institucionSolicitante: "Agencia Metropolitana de Tránsito",
    institucionFuente: "ANT",
    tipoIntercambio: "Uno a uno (API REST)",
    estado: "Aprobada",
    prioridad: "Baja",
    fecha: "07 abr 2025 11:05",
    responsable: "Tclg. Mario Benítez",
    unidad: "Fiscalización Vial",
    datosRequeridos: ["Placa", "Chasis", "Marca", "Año", "Estado Matrícula", "Infracciones"],
    finalidad: "Control perimetral automatizado mediante cámaras OCR en accesos urbanos.",
    clasificacion: "Pública con Restricción",
    documentos: [{ nombre: "Plan_Seguridad_Vial_AMT.pdf", tamano: "4.5 MB" }],
    observacionesPrevias: [],
    historial: [
      { etapa: "Solicitud enviada", fecha: "05 abr 09:00", responsable: "Mario Benítez" },
      { etapa: "Revisión técnica", fecha: "06 abr 14:00", responsable: "Marcos Viteri" },
      { etapa: "Aprobada", fecha: "07 abr 11:05", responsable: "Dirección DINARP" },
    ],
  },
  {
    codigo: "SOL-2025-0020",
    solicitud: "Validación de títulos profesionales",
    institucionSolicitante: "Ministerio de Educación",
    institucionFuente: "DINARP",
    tipoIntercambio: "Uno a uno (API REST)",
    estado: "Aprobada",
    prioridad: "Media",
    fecha: "04 abr 2025 09:18",
    responsable: "Lic. Diana Flores",
    unidad: "Talento Humano Docente",
    datosRequeridos: ["Cédula", "Nivel de Formación", "Título", "Institución Educación Superior"],
    finalidad: "Verificación de idoneidad docente en concursos de méritos y oposición.",
    clasificacion: "Pública",
    documentos: [{ nombre: "Bases_Concurso_Docente.pdf", tamano: "1.4 MB" }],
    observacionesPrevias: [],
    historial: [
      { etapa: "Solicitud enviada", fecha: "02 abr 16:00", responsable: "Diana Flores" },
      { etapa: "Aprobada", fecha: "04 abr 09:18", responsable: "Dirección DINARP" },
    ],
  },
];

export default function WireframeAprobacionesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudAprobacion[]>(SOLICITUDES_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("Todos");
  const [selectedPrioridad, setSelectedPrioridad] = useState("Todos");
  const [selectedFuente, setSelectedFuente] = useState("Todos");
  const [selectedTipo, setSelectedTipo] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);

  // Solicitud activa seleccionada para revisión
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudAprobacion | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Modales de acción del aprobador
  const [modalType, setModalType] = useState<"aprobar" | "observar" | "rechazar" | null>(null);
  const [motivoTexto, setMotivoTexto] = useState("");
  const [motivoError, setMotivoError] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Filtrado
  const filteredSolicitudes = useMemo(() => {
    return solicitudes.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.solicitud.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institucionSolicitante.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institucionFuente.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.responsable.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEstado = selectedEstado === "Todos" || item.estado === selectedEstado;
      const matchesPrioridad = selectedPrioridad === "Todos" || item.prioridad === selectedPrioridad;
      const matchesFuente = selectedFuente === "Todos" || item.institucionFuente === selectedFuente;
      const matchesTipo = selectedTipo === "Todos" || item.tipoIntercambio.includes(selectedTipo);

      return matchesSearch && matchesEstado && matchesPrioridad && matchesFuente && matchesTipo;
    });
  }, [solicitudes, searchQuery, selectedEstado, selectedPrioridad, selectedFuente, selectedTipo]);

  // Contadores
  const countPendientes = useMemo(() => solicitudes.filter((s) => s.estado === "Pendiente").length, [solicitudes]);
  const countRevision = useMemo(() => solicitudes.filter((s) => s.estado === "En revisión").length, [solicitudes]);
  const countObservadas = useMemo(() => solicitudes.filter((s) => s.estado === "Observada").length, [solicitudes]);
  const countAprobadas = useMemo(() => solicitudes.filter((s) => s.estado === "Aprobada").length, [solicitudes]);

  // Abrir panel de revisión
  const handleOpenReview = (sol: SolicitudAprobacion) => {
    setSelectedSolicitud(sol);
    setIsSheetOpen(true);
  };

  // Abrir modal de acción
  const handleOpenActionModal = (type: "aprobar" | "observar" | "rechazar") => {
    setModalType(type);
    setMotivoTexto("");
    setMotivoError(false);
  };

  // Confirmar acción del aprobador
  const handleConfirmAction = () => {
    if ((modalType === "observar" || modalType === "rechazar") && !motivoTexto.trim()) {
      setMotivoError(true);
      return;
    }

    if (!selectedSolicitud || !modalType) return;

    let nuevoEstado: "Aprobada" | "Observada" | "Rechazada" = "Aprobada";
    let mensaje = "";

    if (modalType === "aprobar") {
      nuevoEstado = "Aprobada";
      mensaje = `Solicitud ${selectedSolicitud.codigo} aprobada exitosamente. Se ha emitido la autorización institucional.`;
    } else if (modalType === "observar") {
      nuevoEstado = "Observada";
      mensaje = `Solicitud ${selectedSolicitud.codigo} devuelta con observaciones. Se notificó al solicitante.`;
    } else if (modalType === "rechazar") {
      nuevoEstado = "Rechazada";
      mensaje = `Solicitud ${selectedSolicitud.codigo} rechazada formalmente.`;
    }

    // Actualizar estado en memoria
    setSolicitudes((prev) =>
      prev.map((item) =>
        item.codigo === selectedSolicitud.codigo ? { ...item, estado: nuevoEstado } : item
      )
    );

    setModalType(null);
    setIsSheetOpen(false);
    setActionSuccessMessage(mensaje);
    setTimeout(() => setActionSuccessMessage(null), 5000);
  };

  return (
    <WireframeDashboardLayout activeMenu="aprobaciones">
      <main className="relative p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
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
              <BreadcrumbPage className="font-semibold text-foreground">
                Aprobaciones y permisos
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header Title & Description ── */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold">
              Bandeja Revisor / Aprobador
            </Badge>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
            Aprobaciones y permisos
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
            Revisa, observa, aprueba o rechaza solicitudes de interoperabilidad.
          </p>
        </div>

        {/* Mensaje de confirmación temporal */}
        {actionSuccessMessage && (
          <div className="p-4 rounded-xl border border-border bg-surface flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-foreground">
              <CheckCircle2 className="size-4 text-foreground" />
              <span>{actionSuccessMessage}</span>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setActionSuccessMessage(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <XCircle className="size-4" />
            </Button>
          </div>
        )}

        {/* ── 3. Zona Superior: Buscador & Filtros ── */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Input de Búsqueda */}
          <div className="flex-1 min-w-[240px]">
            <InputGroup
              size="default"
              leftIcon={<Search className="size-4 text-muted-foreground" />}
              className="bg-surface h-11 rounded-xl border-border/80"
            >
              <InputGroupInput
                placeholder="Buscar por código, solicitud, institución o responsable..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </InputGroup>
          </div>

          {/* Selectores de Filtros con DropdownMenu */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
            {/* Filtro Estado */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 px-3 py-1.5 flex flex-col items-start justify-center bg-surface border-border/80 rounded-xl min-w-[110px] text-left"
                >
                  <span className="text-[10px] font-medium text-muted-foreground leading-none">Estado</span>
                  <div className="w-full flex items-center justify-between gap-1 mt-0.5">
                    <span className="text-xs font-semibold text-foreground truncate">{selectedEstado}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs">Estado</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={selectedEstado} onValueChange={setSelectedEstado}>
                  <DropdownMenuRadioItem value="Todos">Todos</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Pendiente">Pendiente</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="En revisión">En revisión</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Observada">Observada</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Aprobada">Aprobada</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Rechazada">Rechazada</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filtro Prioridad */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 px-3 py-1.5 flex flex-col items-start justify-center bg-surface border-border/80 rounded-xl min-w-[110px] text-left"
                >
                  <span className="text-[10px] font-medium text-muted-foreground leading-none">Prioridad</span>
                  <div className="w-full flex items-center justify-between gap-1 mt-0.5">
                    <span className="text-xs font-semibold text-foreground truncate">{selectedPrioridad}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel className="text-xs">Prioridad</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={selectedPrioridad} onValueChange={setSelectedPrioridad}>
                  <DropdownMenuRadioItem value="Todos">Todos</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Alta">Alta</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Media">Media</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Baja">Baja</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filtro Institución Fuente */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 px-3 py-1.5 flex flex-col items-start justify-center bg-surface border-border/80 rounded-xl min-w-[130px] text-left"
                >
                  <span className="text-[10px] font-medium text-muted-foreground leading-none">Institución fuente</span>
                  <div className="w-full flex items-center justify-between gap-1 mt-0.5">
                    <span className="text-xs font-semibold text-foreground truncate">{selectedFuente}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">Institución fuente</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={selectedFuente} onValueChange={setSelectedFuente}>
                  <DropdownMenuRadioItem value="Todos">Todos</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Registro Civil">Registro Civil</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Policía Nacional">Policía Nacional</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="SRI">SRI</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ANT">ANT</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="DINARP">DINARP</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filtro Tipo de Intercambio */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 px-3 py-1.5 flex flex-col items-start justify-center bg-surface border-border/80 rounded-xl min-w-[130px] text-left"
                >
                  <span className="text-[10px] font-medium text-muted-foreground leading-none">Tipo intercambio</span>
                  <div className="w-full flex items-center justify-between gap-1 mt-0.5">
                    <span className="text-xs font-semibold text-foreground truncate">{selectedTipo}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">Tipo de intercambio</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={selectedTipo} onValueChange={setSelectedTipo}>
                  <DropdownMenuRadioItem value="Todos">Todos</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Uno a uno">Uno a uno (API REST)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Batch">Batch / Masivo</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ── 4. Cards Resumen: Pendientes, En revisión, Observadas, Aprobadas ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pendientes */}
          <Card className="border-border bg-surface shadow-xs">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="size-12 rounded-xl bg-muted/60 flex items-center justify-center text-foreground shrink-0">
                <Clock className="size-6 stroke-[1.75]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-2xl text-foreground leading-tight">
                  {countPendientes}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Pendientes por revisar
                </span>
              </div>
            </CardContent>
          </Card>

          {/* En revisión */}
          <Card className="border-border bg-surface shadow-xs">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="size-12 rounded-xl bg-muted/60 flex items-center justify-center text-foreground shrink-0">
                <ShieldCheck className="size-6 stroke-[1.75]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-2xl text-foreground leading-tight">
                  {countRevision}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  En revisión técnica
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Observadas */}
          <Card className="border-border bg-surface shadow-xs">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="size-12 rounded-xl bg-muted/60 flex items-center justify-center text-foreground shrink-0">
                <AlertCircle className="size-6 stroke-[1.75]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-2xl text-foreground leading-tight">
                  {countObservadas}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Observadas
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Aprobadas */}
          <Card className="border-border bg-surface shadow-xs">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="size-12 rounded-xl bg-muted/60 flex items-center justify-center text-foreground shrink-0">
                <CheckCircle2 className="size-6 stroke-[1.75]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-2xl text-foreground leading-tight">
                  {countAprobadas}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Aprobadas
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── 5. Tabla de Solicitudes para Aprobación ── */}
        <Card className="rounded-2xl border-border bg-surface overflow-hidden shadow-xs">
          <CardContent className="p-0 overflow-x-auto">
            <Table className="w-full border-spacing-0">
              <TableHeader>
                <TableRow className="border-b border-border/80 bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                    CÓDIGO
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                    SOLICITUD
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                    INSTITUCIÓN SOLICITANTE
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                    INSTITUCIÓN FUENTE
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                    ESTADO
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                    PRIORIDAD
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                    FECHA
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                    RESPONSABLE
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-right">
                    ACCIONES
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSolicitudes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10 text-muted-foreground text-sm">
                      No hay solicitudes pendientes con los filtros seleccionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSolicitudes.map((item) => (
                    <TableRow
                      key={item.codigo}
                      className="border-b border-border/40 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => handleOpenReview(item)}
                    >
                      {/* Código */}
                      <TableCell className="py-4 px-4 text-xs font-mono font-medium text-foreground whitespace-nowrap">
                        {item.codigo}
                      </TableCell>

                      {/* Solicitud */}
                      <TableCell className="py-4 px-4 text-xs font-semibold text-foreground max-w-[200px]">
                        {item.solicitud}
                      </TableCell>

                      {/* Institución Solicitante */}
                      <TableCell className="py-4 px-4 text-xs text-muted-foreground">
                        {item.institucionSolicitante}
                      </TableCell>

                      {/* Institución Fuente */}
                      <TableCell className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {item.institucionFuente}
                      </TableCell>

                      {/* Estado */}
                      <TableCell className="py-4 px-4 whitespace-nowrap">
                        <Badge
                          tone="neutral"
                          appearance="soft"
                          size="sm"
                          className="font-medium gap-1.5 capitalize text-xs"
                        >
                          <span className="size-1.5 rounded-full bg-foreground" />
                          {item.estado}
                        </Badge>
                      </TableCell>

                      {/* Prioridad */}
                      <TableCell className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <span className="size-1.5 rounded-full bg-muted-foreground" />
                          {item.prioridad}
                        </span>
                      </TableCell>

                      {/* Fecha */}
                      <TableCell className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {item.fecha}
                      </TableCell>

                      {/* Responsable */}
                      <TableCell className="py-4 px-4 text-xs text-foreground/80 whitespace-nowrap">
                        {item.responsable}
                      </TableCell>

                      {/* Acciones */}
                      <TableCell className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenReview(item)}
                          className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 border-border"
                        >
                          <Eye className="size-3.5" />
                          <span>Revisar</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* ── 6. Paginación ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground">
            Mostrando {filteredSolicitudes.length} de {solicitudes.length} solicitudes registradas
          </p>

          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage((p) => p - 1);
                  }}
                  className="size-8 rounded-lg border border-border"
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive className="size-8 rounded-lg text-xs">
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="size-8 rounded-lg border border-border"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* ══════════════════════════════════════════════════
            7. PANEL LATERAL DE REVISIÓN (Sheet Drawer)
           ══════════════════════════════════════════════════ */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-2xl p-0 overflow-y-auto bg-surface border-l border-border flex flex-col">
            {selectedSolicitud && (
              <>
                {/* Header del Panel */}
                <div className="p-6 border-b border-border space-y-2 shrink-0 bg-muted/20">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-foreground">
                      {selectedSolicitud.codigo}
                    </span>
                    <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold">
                      {selectedSolicitud.estado}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium">
                      Prioridad: <strong>{selectedSolicitud.prioridad}</strong>
                    </span>
                  </div>
                  <SheetTitle className="font-heading font-bold text-xl sm:text-2xl text-foreground text-left">
                    {selectedSolicitud.solicitud}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground text-left">
                    Revisión de solicitud de interoperabilidad institucional.
                  </SheetDescription>
                </div>

                {/* Contenido del Panel */}
                <div className="p-6 space-y-6 flex-1 text-left">
                  {/* Entidades y Modalidad */}
                  <Card className="border-border bg-background/50 shadow-xs">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Información Institucional & Modalidad
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                      <DetailList
                        columns={2}
                        items={[
                          {
                            label: "Institución Solicitante",
                            value: (
                              <span className="font-semibold text-foreground">
                                {selectedSolicitud.institucionSolicitante}
                              </span>
                            ),
                          },
                          {
                            label: "Institución Fuente",
                            value: (
                              <span className="font-semibold text-foreground">
                                {selectedSolicitud.institucionFuente}
                              </span>
                            ),
                          },
                          {
                            label: "Responsable Técnico",
                            value: selectedSolicitud.responsable,
                          },
                          {
                            label: "Tipo de Intercambio",
                            value: selectedSolicitud.tipoIntercambio,
                          },
                        ]}
                      />
                    </CardContent>
                  </Card>

                  {/* Datos Requeridos */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                      Datos & Atributos Requeridos:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedSolicitud.datosRequeridos.map((dato, i) => (
                        <Badge
                          key={i}
                          tone="neutral"
                          appearance="outline"
                          size="md"
                          className="font-mono text-xs normal-case bg-background"
                        >
                          {dato}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Finalidad & Clasificación */}
                  <Card className="border-border bg-background/50 shadow-xs">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Finalidad de Uso & Clasificación
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-1 space-y-3">
                      <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                        {selectedSolicitud.finalidad}
                      </p>
                      <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-xs">
                        <span className="font-medium text-muted-foreground">Nivel de Seguridad:</span>
                        <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold">
                          {selectedSolicitud.clasificacion}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Documentos Adjuntos */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                      Documentos Adjuntos ({selectedSolicitud.documentos.length})
                    </span>
                    <div className="space-y-2">
                      {selectedSolicitud.documentos.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl border border-border bg-background/80"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="size-4 text-muted-foreground shrink-0" />
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold text-foreground truncate">
                                {doc.nombre}
                              </span>
                              <span className="text-[10px] text-muted-foreground">{doc.tamano}</span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            title="Descargar documento"
                            className="text-muted-foreground hover:text-foreground shrink-0"
                          >
                            <Download className="size-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observaciones Previas */}
                  {selectedSolicitud.observacionesPrevias.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                        Observaciones Registradas
                      </span>
                      <div className="space-y-2">
                        {selectedSolicitud.observacionesPrevias.map((obs, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-muted/20 border border-border/60 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-foreground">{obs.autor}</span>
                              <span className="text-[10px] text-muted-foreground">{obs.fecha}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground block leading-none">{obs.rol}</span>
                            <p className="text-foreground/80 pt-1 leading-relaxed">{obs.texto}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Historial Básico */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                      Historial Básico del Proceso
                    </span>
                    <div className="p-3 rounded-xl border border-border bg-background/50 space-y-2 text-xs">
                      {selectedSolicitud.historial.map((hist, i) => (
                        <div key={i} className="flex items-center justify-between text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-foreground" />
                            <span className="font-medium text-foreground">{hist.etapa}</span>
                          </div>
                          <span className="text-[11px]">{hist.fecha} • {hist.responsable}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer del Panel: Acciones del Aprobador */}
                <div className="p-4 sm:p-6 border-t border-border bg-surface shrink-0 space-y-3">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block text-left">
                    Dictamen del Revisor / Aprobador:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Botón Devolver con Observación */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenActionModal("observar")}
                      className="h-11 rounded-xl text-xs font-semibold gap-1.5 border-border text-foreground hover:bg-muted/30 justify-center"
                    >
                      <AlertTriangle className="size-3.5" />
                      <span>Devolver obs.</span>
                    </Button>

                    {/* Botón Rechazar */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenActionModal("rechazar")}
                      className="h-11 rounded-xl text-xs font-semibold gap-1.5 border-border/80 text-foreground hover:bg-muted/30 justify-center"
                    >
                      <XCircle className="size-3.5" />
                      <span>Rechazar</span>
                    </Button>

                    {/* Botón Aprobar */}
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => handleOpenActionModal("aprobar")}
                      className="h-11 rounded-xl text-xs font-semibold gap-1.5 shadow-xs justify-center"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>Aprobar</span>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* ══════════════════════════════════════════════════
            8. MODALES DE CONFIRMACIÓN & OBSERVACIÓN
           ══════════════════════════════════════════════════ */}
        <Dialog open={modalType !== null} onOpenChange={(open) => !open && setModalType(null)}>
          <DialogContent className="max-w-[480px] rounded-3xl p-6 sm:p-8 bg-surface border-border shadow-2xl">
            {modalType === "aprobar" && (
              <>
                <div className="size-12 rounded-2xl bg-muted/60 flex items-center justify-center text-foreground mb-2 mx-auto">
                  <CheckCircle2 className="size-6 stroke-[2]" />
                </div>
                <DialogHeader className="text-center space-y-2">
                  <DialogTitle className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                    ¿Confirmar aprobación de la solicitud?
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Se generará la autorización institucional para <strong>{selectedSolicitud?.codigo}</strong> ({selectedSolicitud?.solicitud}) y se notificará a las partes para la entrega de credenciales.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2.5 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalType(null)}
                    className="w-full h-11 rounded-xl text-xs font-semibold"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleConfirmAction}
                    className="w-full h-11 rounded-xl text-xs font-semibold"
                  >
                    Confirmar aprobación
                  </Button>
                </DialogFooter>
              </>
            )}

            {modalType === "observar" && (
              <>
                <div className="size-12 rounded-2xl bg-muted/60 flex items-center justify-center text-foreground mb-2 mx-auto">
                  <AlertTriangle className="size-6 stroke-[2]" />
                </div>
                <DialogHeader className="text-center space-y-1">
                  <DialogTitle className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                    Devolver con observación
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Solicitud <strong>{selectedSolicitud?.codigo}</strong>. Ingresa el motivo técnico o legal para que el solicitante realice la subsanación.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 text-left my-4">
                  <Label htmlFor="motivo-obs" className="text-xs font-semibold text-foreground">
                    Motivo de la observación <span className="text-muted-foreground">*</span>
                  </Label>
                  <textarea
                    id="motivo-obs"
                    rows={4}
                    value={motivoTexto}
                    onChange={(e) => {
                      setMotivoTexto(e.target.value);
                      if (motivoError) setMotivoError(false);
                    }}
                    placeholder="Describe de forma clara los requerimientos o ajustes que debe cumplir el solicitante..."
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                  {motivoError && (
                    <p className="text-xs text-muted-foreground font-medium">
                      El motivo de observación es obligatorio.
                    </p>
                  )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2.5 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalType(null)}
                    className="w-full h-11 rounded-xl text-xs font-semibold"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleConfirmAction}
                    className="w-full h-11 rounded-xl text-xs font-semibold"
                  >
                    Enviar observación
                  </Button>
                </DialogFooter>
              </>
            )}

            {modalType === "rechazar" && (
              <>
                <div className="size-12 rounded-2xl bg-muted/60 flex items-center justify-center text-foreground mb-2 mx-auto">
                  <XCircle className="size-6 stroke-[2]" />
                </div>
                <DialogHeader className="text-center space-y-1">
                  <DialogTitle className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                    Rechazar solicitud
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Solicitud <strong>{selectedSolicitud?.codigo}</strong>. Esta acción finalizará el trámite negando el acceso.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 text-left my-4">
                  <Label htmlFor="motivo-rechazo" className="text-xs font-semibold text-foreground">
                    Causal de rechazo <span className="text-muted-foreground">*</span>
                  </Label>
                  <textarea
                    id="motivo-rechazo"
                    rows={4}
                    value={motivoTexto}
                    onChange={(e) => {
                      setMotivoTexto(e.target.value);
                      if (motivoError) setMotivoError(false);
                    }}
                    placeholder="Explica la causal técnica o jurídica por la cual no es procedente la solicitud..."
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                  {motivoError && (
                    <p className="text-xs text-muted-foreground font-medium">
                      Debes ingresar la causal obligatoria de rechazo.
                    </p>
                  )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2.5 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalType(null)}
                    className="w-full h-11 rounded-xl text-xs font-semibold"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleConfirmAction}
                    className="w-full h-11 rounded-xl text-xs font-semibold"
                  >
                    Confirmar rechazo
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </WireframeDashboardLayout>
  );
}

