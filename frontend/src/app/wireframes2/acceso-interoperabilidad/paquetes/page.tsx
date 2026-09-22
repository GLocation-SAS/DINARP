"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
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

const mockPaquetes = [
  {
    id: "PKG-2026-001",
    solicitud: "SOL-2026-004",
    institucion: "MIES",
    fuente: "Registro Civil",
    campos: 5,
    estado: "Disponible para consumo",
    responsable: "Coordinador SINARP",
    ultimaActualizacion: "2026-09-06"
  },
  {
    id: "PKG-2026-002",
    solicitud: "SOL-2026-005",
    institucion: "Banco Pichincha",
    fuente: "SRI",
    campos: 2,
    estado: "Validación técnica requerida",
    responsable: "DSI",
    ultimaActualizacion: "2026-09-22"
  },
  {
    id: "PKG-2026-003",
    solicitud: "SOL-2026-001",
    institucion: "MIES",
    fuente: "Registro Civil",
    campos: 15,
    estado: "Validado",
    responsable: "DGR",
    ultimaActualizacion: "2026-09-21"
  }
];

export default function PaquetesConsumoPage() {
  const [role, setRole] = useSimulatedRole("COORDINADOR_SINARP");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPaquetes = mockPaquetes.filter(
    (p) =>
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.institucion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.solicitud.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <WireframeDashboardLayout
      activeMenu="paquetes-consumo"
      breadcrumbs={[
        { label: "Acceso a Interoperabilidad" },
        { label: "Paquetes de consumo" }
      ]}
      headerSlot={
        <select
          className="h-8 text-xs px-2 py-1 rounded-md border border-border bg-surface text-foreground"
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
        >
          <option value="COORDINADOR_SINARP">Coordinador SINARP</option>
          <option value="DGR">Profesional DGR</option>
          <option value="DSI">DSI / Tecnología</option>
        </select>
      }
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Paquetes de consumo
            </h1>
            <p className="text-sm text-muted-foreground">
              Consulta y gestiona los paquetes habilitados para el consumo de información.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar paquete, solicitud o institución..."
              className="w-full pl-9 pr-4 h-10 bg-background border border-border/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto border-y border-border bg-card mt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código de paquete</TableHead>
                <TableHead>Solicitud relacionada</TableHead>
                <TableHead>Institución</TableHead>
                <TableHead>Fuente / servicio</TableHead>
                <TableHead>Campos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Responsable actual</TableHead>
                <TableHead>Última actualización</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPaquetes.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground">{p.id}</TableCell>
                  <TableCell>{p.solicitud}</TableCell>
                  <TableCell>{p.institucion}</TableCell>
                  <TableCell>{p.fuente}</TableCell>
                  <TableCell>{p.campos}</TableCell>
                  <TableCell>
                    <Badge tone="neutral" appearance="outline" className="bg-background">
                      {p.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>{p.responsable}</TableCell>
                  <TableCell className="text-muted-foreground">{p.ultimaActualizacion}</TableCell>
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
                              <Link href={`/wireframes2/acceso-interoperabilidad/paquetes/${p.id}`}>
                                <Eye className="size-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">Ver detalle</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPaquetes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center text-muted-foreground">
                    No se encontraron paquetes.
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
