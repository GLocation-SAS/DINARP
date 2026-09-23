"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, ShieldCheck, User, Building2, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { type SolicitudIngreso } from "../../data/gestion-ingresos-store";

interface AprobarSolicitudDialogProps {
  solicitud: SolicitudIngreso | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (solicitud: SolicitudIngreso) => void;
}

export function AprobarSolicitudDialog({
  solicitud,
  open,
  onOpenChange,
  onConfirm,
}: AprobarSolicitudDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!solicitud) return null;

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm(solicitud);
      onOpenChange(false);
      toast.success("Solicitud aprobada correctamente.", {
        description: `Se notificó a ${solicitud.correo} con enlace de acceso a la plataforma.`
      });
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="space-y-2">
          <div className="size-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1">
            <CheckCircle2 className="size-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Aprobar solicitud de acceso
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Al aprobar esta solicitud, el usuario será autorizado para ingresar a la plataforma y recibirá una notificación en su correo electrónico.
          </DialogDescription>
        </DialogHeader>

        {/* Resumen del Usuario */}
        <div className="my-2 p-3.5 bg-muted/40 rounded-xl border border-border/70 space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <User className="size-3.5 text-muted-foreground" /> Usuario:
            </span>
            <span className="font-bold text-foreground text-right">{solicitud.nombreCompleto}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <CreditCard className="size-3.5 text-muted-foreground" /> Cédula:
            </span>
            <span className="font-mono font-medium text-foreground">{solicitud.cedula}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <Mail className="size-3.5 text-muted-foreground" /> Correo:
            </span>
            <span className="font-medium text-foreground truncate max-w-[220px]">{solicitud.correo}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <Building2 className="size-3.5 text-muted-foreground" /> Institución:
            </span>
            <span className="font-medium text-foreground truncate max-w-[220px] text-right">{solicitud.institucion}</span>
          </div>
        </div>

        {/* Mensaje Informativo de Correo Simulado */}
        <div className="p-3 bg-muted/20 rounded-xl border border-border/50 text-[11px] text-muted-foreground flex items-start gap-2">
          <Mail className="size-4 text-primary shrink-0 mt-0.5" />
          <span>
            Se enviará un correo con el enlace directo al acceso de la plataforma para que el usuario inicie sesión con su cédula, contraseña y autenticación 2FA.
          </span>
        </div>

        <DialogFooter className="gap-2 sm:gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
            className="text-xs font-semibold"
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            onClick={handleApprove}
            className="text-xs font-semibold gap-1.5 shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Aprobando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-3.5" />
                <span>Aprobar acceso</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
