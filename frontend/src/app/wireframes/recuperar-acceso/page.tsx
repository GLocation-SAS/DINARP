"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WireframeAuthLayout } from "../components/wireframe-auth-layout";

export default function WireframeRecuperarAccesoPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessModal(true);
  };

  const handleResend = () => {
    // Mock reenviar enlace
    setShowSuccessModal(false);
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 300);
  };

  return (
    <WireframeAuthLayout>
      {/* Título y subtítulo */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
          Recuperar acceso
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">
          Ingresa tu correo institucional para restablecer tu contraseña
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Campo Correo institucional */}
        <div className="flex flex-col gap-2 text-left">
          <label
            htmlFor="recovery-email"
            className="text-xs sm:text-sm font-semibold text-foreground"
          >
            Correo institucional
          </label>
          <InputGroup
            size="default"
            leftIcon={<Mail className="size-4 text-muted-foreground" />}
            className="bg-background"
          >
            <InputGroupInput
              id="recovery-email"
              type="email"
              placeholder="tu.correo@institucion.gob.ec"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          <p className="text-xs text-muted-foreground mt-0.5">
            Te enviaremos un enlace para crear una nueva contraseña.
          </p>
        </div>

        {/* Botón Enviar enlace */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2 font-semibold justify-center gap-2 h-12 text-sm sm:text-base rounded-full"
        >
          <span>Enviar enlace</span>
          <ArrowRight className="size-4 shrink-0" />
        </Button>

        {/* Botón Volver al inicio de sesión */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/wireframes/login")}
          className="w-full font-semibold justify-center h-12 text-sm sm:text-base rounded-full border-border/80 text-foreground hover:bg-muted/30"
        >
          Volver al inicio de sesión
        </Button>
      </form>

      {/* ── Modal Semántica de Éxito: Revisa tu correo ── */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent
          variant="standard"
          className="max-w-[440px] rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center bg-surface border-border shadow-xl"
        >
          {/* Icono de check en círculo gris suave */}
          <div className="size-16 rounded-full bg-muted/60 flex items-center justify-center text-foreground mb-4">
            <Check className="size-8 stroke-[2.5]" />
          </div>

          <DialogHeader className="flex flex-col items-center p-0 space-y-3">
            <DialogTitle className="font-heading font-bold text-2xl sm:text-3xl text-foreground text-center">
              Revisa tu correo
            </DialogTitle>
            <DialogDescription className="text-sm text-foreground/80 text-center leading-relaxed">
              Hemos enviado un enlace de recuperación a tu correo institucional. Úsalo para crear una nueva contraseña.
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-muted-foreground text-center mt-3 mb-6">
            Si no lo encuentras, revisa tu carpeta de spam o solicita un nuevo enlace.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/wireframes/restablecer-contrasena");
              }}
              className="w-full font-semibold justify-center h-12 text-sm rounded-full"
            >
              Entendido
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleResend}
              className="w-full font-semibold justify-center h-12 text-sm rounded-full border-border/80 text-foreground hover:bg-muted/30"
            >
              Reenviar enlace
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </WireframeAuthLayout>
  );
}
