"use client";

import { useState, useEffect, useCallback } from "react";

export type EstadoSolicitudIngreso = "Pendiente" | "Aprobada" | "Rechazada";

export interface SolicitudIngreso {
  id: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  iniciales: string;
  correo: string;
  institucion: string;
  fechaSolicitud: string;
  estado: EstadoSolicitudIngreso;
  fechaRevision?: string;
  revisor?: string;
  motivoRechazo?: string;
  documentos?: string[];
}

export const STORAGE_KEY_INGRESOS = "dinarp_solicitudes_ingreso_v2";

export const DEFAULT_DOCUMENTOS_SOLICITUD = [
  "Cambio de Coordinador institucional titular y/o suplente.pdf",
  "Acuerdo de Uso y Confidencialidad.pdf",
  "Solicitud de acceso al DINARP.pdf",
];

export const INITIAL_SOLICITUDES_INGRESO: SolicitudIngreso[] = [
  {
    id: "SOL-ING-001",
    cedula: "1799999999",
    nombres: "Juan Carlos",
    apellidos: "Pérez Gómez",
    nombreCompleto: "Juan Carlos Pérez Gómez",
    iniciales: "JP",
    correo: "juan.perez@msp.gob.ec",
    institucion: "Ministerio de Salud Pública",
    fechaSolicitud: "22/09/2026 14:35",
    estado: "Pendiente",
    documentos: DEFAULT_DOCUMENTOS_SOLICITUD,
  },
  {
    id: "SOL-ING-002",
    cedula: "1712345602",
    nombres: "Paula Andrea",
    apellidos: "Mendoza Zambrano",
    nombreCompleto: "Paula Andrea Mendoza Zambrano",
    iniciales: "PM",
    correo: "paula.mendoza@dinarp.gob.ec",
    institucion: "Dirección Nacional de Registros Públicos",
    fechaSolicitud: "20/09/2026 09:12",
    estado: "Aprobada",
    fechaRevision: "21/09/2026 11:20",
    revisor: "María Torres (Dirección de Gestión y Registro)",
    documentos: DEFAULT_DOCUMENTOS_SOLICITUD,
  },
  {
    id: "SOL-ING-003",
    cedula: "1788888888",
    nombres: "Carlos Alberto",
    apellidos: "Andrade Villacís",
    nombreCompleto: "Carlos Alberto Andrade Villacís",
    iniciales: "CA",
    correo: "carlos.andrade@educacion.gob.ec",
    institucion: "Ministerio de Educación",
    fechaSolicitud: "18/09/2026 16:40",
    estado: "Rechazada",
    fechaRevision: "19/09/2026 10:15",
    revisor: "María Torres (Dirección de Gestión y Registro)",
    motivoRechazo: "El correo electrónico institucional no concuerda con el dominio oficial del Ministerio ni se adjuntó justificación de contratación activa.",
    documentos: DEFAULT_DOCUMENTOS_SOLICITUD,
  },
  {
    id: "SOL-ING-004",
    cedula: "1724589632",
    nombres: "Lucía Fernanda",
    apellidos: "Navarrete Morales",
    nombreCompleto: "Lucía Fernanda Navarrete Morales",
    iniciales: "LN",
    correo: "lucia.navarrete@registrocivil.gob.ec",
    institucion: "Dirección General de Registro Civil",
    fechaSolicitud: "23/09/2026 08:22",
    estado: "Pendiente",
    documentos: DEFAULT_DOCUMENTOS_SOLICITUD,
  },
  {
    id: "SOL-ING-005",
    cedula: "1756321478",
    nombres: "Santiago Andrés",
    apellidos: "Cárdenas Viteri",
    nombreCompleto: "Santiago Andrés Cárdenas Viteri",
    iniciales: "SC",
    correo: "santiago.cardenas@sri.gob.ec",
    institucion: "Servicio de Rentas Internas",
    fechaSolicitud: "21/09/2026 18:05",
    estado: "Pendiente",
    documentos: DEFAULT_DOCUMENTOS_SOLICITUD,
  },
  {
    id: "SOL-ING-006",
    cedula: "0918745210",
    nombres: "Diana Patricia",
    apellidos: "Espinoza Valarezo",
    nombreCompleto: "Diana Patricia Espinoza Valarezo",
    iniciales: "DE",
    correo: "diana.espinoza@ant.gob.ec",
    institucion: "Agencia Nacional de Tránsito",
    fechaSolicitud: "15/09/2026 11:45",
    estado: "Aprobada",
    fechaRevision: "16/09/2026 09:30",
    revisor: "María Torres (Dirección de Gestión y Registro)",
    documentos: DEFAULT_DOCUMENTOS_SOLICITUD,
  }
];

export function getStoredSolicitudesIngreso(): SolicitudIngreso[] {
  if (typeof window === "undefined") return INITIAL_SOLICITUDES_INGRESO;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INGRESOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_INGRESOS, JSON.stringify(INITIAL_SOLICITUDES_INGRESO));
      return INITIAL_SOLICITUDES_INGRESO;
    }
    let parsed: SolicitudIngreso[] = JSON.parse(raw);
    let updatedNeeded = false;
    const has02 = parsed.some((s) => s.cedula === "1712345602");
    if (!has02) {
      const idxOld = parsed.findIndex((s) => s.cedula === "1712345678");
      if (idxOld >= 0) {
        parsed[idxOld].cedula = "1712345602";
        parsed[idxOld].estado = "Aprobada";
      } else {
        parsed.unshift(INITIAL_SOLICITUDES_INGRESO[1]);
      }
      updatedNeeded = true;
    }
    if (updatedNeeded) {
      localStorage.setItem(STORAGE_KEY_INGRESOS, JSON.stringify(parsed));
    }
    return parsed.map((item) => ({
      ...item,
      documentos: item.documentos && item.documentos.length > 0 ? item.documentos : DEFAULT_DOCUMENTOS_SOLICITUD,
    }));
  } catch {
    return INITIAL_SOLICITUDES_INGRESO;
  }
}

export function saveStoredSolicitudesIngreso(items: SolicitudIngreso[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_INGRESOS, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("dinarp_ingresos_updated", { detail: items }));
  } catch {
    // Ignore storage issues
  }
}

export function useSolicitudesIngresoStore() {
  const [solicitudes, setSolicitudes] = useState<SolicitudIngreso[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSolicitudes(getStoredSolicitudesIngreso());
    setIsLoaded(true);

    const handleUpdate = (e: CustomEvent<SolicitudIngreso[]>) => {
      if (e.detail) {
        setSolicitudes(e.detail);
      }
    };

    window.addEventListener("dinarp_ingresos_updated", handleUpdate as EventListener);
    return () => {
      window.removeEventListener("dinarp_ingresos_updated", handleUpdate as EventListener);
    };
  }, []);

  const aprobarSolicitud = useCallback((id: string, revisor: string = "María Torres (Dirección de Gestión y Registro)") => {
    setSolicitudes((prev) => {
      const now = new Date();
      const fechaStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const updated = prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            estado: "Aprobada" as EstadoSolicitudIngreso,
            fechaRevision: fechaStr,
            revisor,
            motivoRechazo: undefined
          };
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  const rechazarSolicitud = useCallback((id: string, motivo: string, revisor: string = "María Torres (Dirección de Gestión y Registro)") => {
    setSolicitudes((prev) => {
      const now = new Date();
      const fechaStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const updated = prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            estado: "Rechazada" as EstadoSolicitudIngreso,
            fechaRevision: fechaStr,
            revisor,
            motivoRechazo: motivo.trim()
          };
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  const agregarPreregistro = useCallback((data: {
    cedula: string;
    nombres: string;
    apellidos: string;
    email: string;
    institucion: string;
  }) => {
    setSolicitudes((prev) => {
      const now = new Date();
      const fechaStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const cleanNombre = `${data.nombres.trim()} ${data.apellidos.trim()}`;
      const initials = `${data.nombres.trim().charAt(0)}${data.apellidos.trim().charAt(0)}`.toUpperCase();

      const existingIndex = prev.findIndex((s) => s.cedula === data.cedula);
      if (existingIndex >= 0) {
        // Reset to pending
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          nombres: data.nombres.trim(),
          apellidos: data.apellidos.trim(),
          nombreCompleto: cleanNombre,
          correo: data.email.trim(),
          institucion: data.institucion.trim(),
          fechaSolicitud: fechaStr,
          estado: "Pendiente",
          fechaRevision: undefined,
          revisor: undefined,
          motivoRechazo: undefined
        };
        saveStoredSolicitudesIngreso(updated);
        return updated;
      }

      const nextNum = prev.length + 1;
      const newSol: SolicitudIngreso = {
        id: `SOL-ING-${String(nextNum).padStart(3, "0")}`,
        cedula: data.cedula.trim(),
        nombres: data.nombres.trim(),
        apellidos: data.apellidos.trim(),
        nombreCompleto: cleanNombre,
        iniciales: initials,
        correo: data.email.trim(),
        institucion: data.institucion.trim(),
        fechaSolicitud: fechaStr,
        estado: "Pendiente"
      };

      const updated = [newSol, ...prev];
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  const resetStore = useCallback(() => {
    saveStoredSolicitudesIngreso(INITIAL_SOLICITUDES_INGRESO);
    setSolicitudes(INITIAL_SOLICITUDES_INGRESO);
  }, []);

  return {
    solicitudes,
    isLoaded,
    aprobarSolicitud,
    rechazarSolicitud,
    agregarPreregistro,
    resetStore
  };
}
