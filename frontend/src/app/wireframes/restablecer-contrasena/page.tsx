"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WireframeAuthLayout } from "../components/wireframe-auth-layout";

export default function WireframeRestablecerContrasenaPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessModal(true);
  };

  return (
    <WireframeAuthLayout>
      {/* Título y subtítulo */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
          Restablecer contraseña
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">
          Crea una nueva contraseña para acceder al sistema
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Nueva contraseña */}
        <div className="flex flex-col gap-2 text-left">
          <label
            htmlFor="new-password"
            className="text-xs sm:text-sm font-semibold text-foreground"
          >
            Nueva contraseña
          </label>
          <InputGroup
            size="default"
            leftIcon={<Lock className="size-4 text-muted-foreground" />}
            className="bg-background"
          >
            <InputGroupInput
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              className="text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </InputGroupButton>
          </InputGroup>
        </div>

        {/* Confirmar contraseña */}
        <div className="flex flex-col gap-2 text-left">
          <label
            htmlFor="confirm-password"
            className="text-xs sm:text-sm font-semibold text-foreground"
          >
            Confirmar contraseña
          </label>
          <InputGroup
            size="default"
            leftIcon={<Lock className="size-4 text-muted-foreground" />}
            className="bg-background"
          >
            <InputGroupInput
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
              className="text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </InputGroupButton>
          </InputGroup>
          <p className="text-xs text-muted-foreground mt-0.5">
            La contraseña debe contener al menos 8 caracteres.
          </p>
        </div>

        {/* Botón Guardar nueva contraseña */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-3 font-semibold justify-center gap-2 h-12 text-sm sm:text-base rounded-full"
        >
          <span>Guardar nueva contraseña</span>
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

      {/* ── Modal Semántica de Éxito: Contraseña actualizada ── */}
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
              Contraseña actualizada
            </DialogTitle>
            <DialogDescription className="text-sm text-foreground/80 text-center leading-relaxed max-w-xs">
              Tu contraseña se ha cambiado correctamente. <br />
              Ahora puedes iniciar sesión en el sistema con tu nueva contraseña.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 w-full mt-6">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/wireframes/login");
              }}
              className="w-full font-semibold justify-center h-12 text-sm rounded-full"
            >
              Ir al inicio de sesión
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </WireframeAuthLayout>
  );
}

