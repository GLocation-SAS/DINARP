"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  Calendar as CalendarIcon,
  Eye,
  Download,
  MoreHorizontal,
  FileText,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
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
  DropdownMenuItem,
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

interface FacturaItem {
  numero: string;
  proyecto: string;
  entidad: string;
  servicio: string;
  fechaEmision: string;
  valor: number;
  estado: "Emitida" | "Pendiente" | "Anulada";
  href: string;
}

const FACTURAS_DATA: FacturaItem[] = [
  {
    numero: "F-2026-00125",
    proyecto: "Proyecto Identidad",
    entidad: "Registro Civil",
    servicio: "Consulta de datos",
    fechaEmision: "15/09/2026",
    valor: 1250.0,
    estado: "Emitida",
    href: "/wireframes/facturacion/F-2026-00125",
  },
  {
    numero: "F-2026-00124",
    proyecto: "SRI Integración",
    entidad: "SRI",
    servicio: "Validación de RUC",
    fechaEmision: "10/09/2026",
    valor: 850.0,
    estado: "Pendiente",
    href: "/wireframes/facturacion/F-2026-00125",
  },
  {
    numero: "F-2026-00123",
    proyecto: "Educación Datos",
    entidad: "Ministerio de Educación",
    servicio: "Consulta de títulos",
    fechaEmision: "05/09/2026",
    valor: 2300.0,
    estado: "Emitida",
    href: "/wireframes/facturacion/F-2026-00125",
  },
  {
    numero: "F-2026-00122",
    proyecto: "Proyecto Salud",
    entidad: "Ministerio de Salud",
    servicio: "Intercambio masivo",
    fechaEmision: "28/08/2026",
    valor: 4500.0,
    estado: "Anulada",
    href: "/wireframes/facturacion/F-2026-00125",
  },
  {
    numero: "F-2026-00121",
    proyecto: "Catastro Nacional",
    entidad: "Ministerio de Desarrollo Urbano",
    servicio: "Consulta de catastros",
    fechaEmision: "20/08/2026",
    valor: 1100.0,
    estado: "Emitida",
    href: "/wireframes/facturacion/F-2026-00125",
  },
];

export default function WireframeListadoFacturacionPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return FACTURAS_DATA.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.proyecto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.entidad.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.servicio.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEstado = filterEstado === "Todos" || item.estado === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [searchQuery, filterEstado]);

  const getBadgeVariant = (estado: FacturaItem["estado"]) => {
    switch (estado) {
      case "Emitida":
        return { tone: "success" as const, appearance: "soft" as const };
      case "Pendiente":
        return { tone: "warning" as const, appearance: "soft" as const };
      case "Anulada":
      default:
        return { tone: "neutral" as const, appearance: "soft" as const };
    }
  };

  return (
    <WireframeDashboardLayout activeMenu="facturacion">
      <main className="relative p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Header Title & Description ── */}
        <div className="space-y-1">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
            Facturación
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
            Consulta y gestiona las facturas asociadas a tus servicios de interoperabilidad.
          </p>
        </div>

        {/* ── 2. Buscador y Filtros ── */}
        <div className="space-y-3">
          {/* Input de Búsqueda */}
          <div className="w-full max-w-lg">
            <InputGroup
              size="default"
              leftIcon={<Search className="size-4 text-muted-foreground" />}
              className="bg-surface h-11 rounded-xl border-border/80"
            >
              <InputGroupInput
                placeholder="Buscar por número, proyecto, servicio o entidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </InputGroup>
          </div>

          {/* Barra de Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end max-w-3xl">
            {/* Estado */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-medium text-muted-foreground block pl-1">Estado</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 px-3 flex items-center justify-between bg-surface border-border/80 rounded-xl text-left w-full text-xs font-semibold"
                  >
                    <span className="truncate">{filterEstado}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel className="text-xs">Estado de factura</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={filterEstado} onValueChange={setFilterEstado}>
                    <DropdownMenuRadioItem value="Todos">Todos</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Emitida">Emitida</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Pendiente">Pendiente</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Anulada">Anulada</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Fecha Desde */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-medium text-muted-foreground block pl-1">Fecha desde</span>
              <InputGroup
                size="default"
                rightIcon={<CalendarIcon className="size-3.5 text-muted-foreground" />}
                className="bg-surface h-11 rounded-xl border-border/80"
              >
                <InputGroupInput
                  placeholder="dd/mm/aaaa"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="text-xs font-mono"
                />
              </InputGroup>
            </div>

            {/* Fecha Hasta */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-medium text-muted-foreground block pl-1">Fecha hasta</span>
              <InputGroup
                size="default"
                rightIcon={<CalendarIcon className="size-3.5 text-muted-foreground" />}
                className="bg-surface h-11 rounded-xl border-border/80"
              >
                <InputGroupInput
                  placeholder="dd/mm/aaaa"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="text-xs font-mono"
                />
              </InputGroup>
            </div>

            {/* Botón Buscar */}
            <Button
              type="button"
              variant="primary"
              className="h-11 px-6 rounded-xl text-xs font-semibold shadow-xs justify-center"
            >
              Buscar
            </Button>
          </div>
        </div>

        {/* ── 3. Tabla de Facturas ── */}
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
          <Table className="w-full border-spacing-0">
            <TableHeader>
              <TableRow className="border-b border-border/80 bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  N° DE FACTURA
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  PROYECTO / SOLICITUD
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  ENTIDAD
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  SERVICIO
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  FECHA DE EMISIÓN
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  VALOR (USD)
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  ESTADO
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-center">
                  ACCIONES
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-sm">
                    No se encontraron facturas con los filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => {
                  const badgeProps = getBadgeVariant(row.estado);
                  return (
                    <TableRow
                      key={row.numero}
                      className="border-b border-border/40 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => router.push(row.href)}
                    >
                      {/* N° de factura */}
                      <TableCell className="py-4 px-4 text-xs font-mono font-bold text-foreground whitespace-nowrap">
                        {row.numero}
                      </TableCell>

                      {/* Proyecto / Solicitud */}
                      <TableCell className="py-4 px-4 text-xs font-semibold text-foreground max-w-[180px]">
                        {row.proyecto}
                      </TableCell>

                      {/* Entidad */}
                      <TableCell className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {row.entidad}
                      </TableCell>

                      {/* Servicio */}
                      <TableCell className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {row.servicio}
                      </TableCell>

                      {/* Fecha de emisión */}
                      <TableCell className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap font-mono">
                        {row.fechaEmision}
                      </TableCell>

                      {/* Valor (USD) */}
                      <TableCell className="py-4 px-4 text-xs font-mono font-bold text-foreground whitespace-nowrap">
                        {row.valor.toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>

                      {/* Estado */}
                      <TableCell className="py-4 px-4 whitespace-nowrap">
                        <Badge
                          tone={badgeProps.tone}
                          appearance={badgeProps.appearance}
                          size="sm"
                          className="font-medium text-xs"
                        >
                          {row.estado}
                        </Badge>
                      </TableCell>

                      {/* Acciones */}
                      <TableCell className="py-4 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => router.push(row.href)}>
                              <Eye className="size-3.5 mr-2" />
                              <span>Ver detalle</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="size-3.5 mr-2" />
                              <span>Descargar PDF</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── 4. Paginación ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground">
            Mostrando 1 a {filteredData.length} de 32 facturas
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
                <PaginationLink href="#" className="size-8 rounded-lg text-xs">
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="size-8 rounded-lg text-xs">
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" className="size-8 rounded-lg text-xs">
                  4
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
      </main>
    </WireframeDashboardLayout>
  );
}

