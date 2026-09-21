"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAssetPath } from "@/lib/utils";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { ThemeToggle } from "@/components/theme-toggle";
import { WireframeAuthLayout } from "../components/wireframe-auth-layout";

export default function WireframeLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailState, setEmailState] = useState<"default" | "success" | "error">("default");
  const [hasInteracted, setHasInteracted] = useState(false);

  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!val.trim()) {
      setEmailState("default");
      return;
    }

    if (isEmailValid(val)) {
      setEmailState("success");
    } else if (hasInteracted) {
      setEmailState("error");
    }
  };

  const handleEmailBlur = () => {
    setHasInteracted(true);
    if (!email.trim()) {
      setEmailState("default");
      return;
    }

    if (isEmailValid(email)) {
      setEmailState("success");
    } else {
      setEmailState("error");
    }
  };

  const isFormValid = email.trim() !== "" && isEmailValid(email) && password.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid(email)) {
      setEmailState("error");
      setHasInteracted(true);
      return;
    }
    router.push("/wireframes/dashboard");
  };

  const handleGoogleLogin = () => {
    toast.info("Función en evaluación de diseño UX/UI", {
      className: "!w-auto !max-w-none whitespace-nowrap",
    });
  };

  return (
    <WireframeAuthLayout>
      {/* ── Cabecera Superior del Formulario: Logo DINARP + Modo Claro/Oscuro ── */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-border/60">
        <div className="flex items-center gap-3">
          <img
            src={getAssetPath("/logotipo.png")}
            alt="Logo DINARP"
            className="h-8 w-auto max-w-[150px] object-contain dark:brightness-0 dark:invert"
          />
          <div className="h-5 w-px bg-border" />
          <span className="text-xs font-medium text-muted-foreground leading-tight">
            Portal Interoperabilidad
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
        </div>
      </div>

      {/* Título y subtítulo */}
      <div className="mb-7 text-left">
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
          Ingresa al portal
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">
          Accede con tu cuenta institucional.
        </p>
      </div>

      {/* Formulario de login */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Correo institucional */}
        <div className="flex flex-col gap-2 text-left">
          <Label
            htmlFor="institutional-email"
            className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer"
          >
            Correo institucional
          </Label>
          <InputGroup
            size="default"
            state={emailState}
            leftIcon={<Mail className="size-4 text-muted-foreground" />}
            rightIcon={
              emailState === "success" ? (
                <CheckCircle2 className="size-4 text-foreground animate-in fade-in" />
              ) : emailState === "error" ? (
                <AlertCircle className="size-4 text-foreground animate-in fade-in" />
              ) : undefined
            }
            className="bg-background"
          >
            <InputGroupInput
              id="institutional-email"
              type="email"
              placeholder="nombre@institucion.gob.ec"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              required
            />
          </InputGroup>

          {/* Mensajes de validación de correo */}
          {emailState === "error" && (
            <p className="text-xs text-muted-foreground font-medium mt-0.5 animate-in fade-in slide-in-from-top-1">
              Ingresa un correo institucional válido (ej. nombre@institucion.gob.ec).
            </p>
          )}
          {emailState === "success" && (
            <p className="text-xs text-muted-foreground font-medium mt-0.5 animate-in fade-in slide-in-from-top-1">
              Formato de correo válido.
            </p>
          )}
        </div>

        {/* Contraseña */}
        <div className="flex flex-col gap-2 text-left">
          <Label
            htmlFor="institutional-password"
            className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer"
          >
            Contraseña
          </Label>
          <InputGroup
            size="default"
            leftIcon={<Lock className="size-4 text-muted-foreground" />}
            className="bg-background"
          >
            <InputGroupInput
              id="institutional-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

          <div className="flex justify-end mt-1">
            <Link
              href="/wireframes/recuperar-acceso"
              className="text-xs sm:text-sm text-foreground underline-offset-4 hover:underline font-medium transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {/* Botón Iniciar sesión */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isFormValid}
          className="w-full mt-2 font-semibold justify-center gap-2 h-12 text-sm sm:text-base rounded-xl disabled:opacity-50"
        >
          <span>Iniciar sesión</span>
          <ArrowRight className="size-4 shrink-0" />
        </Button>

        {/* Botón Continuar con Google */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleGoogleLogin}
          className="w-full font-semibold justify-center gap-3 h-12 text-sm sm:text-base rounded-xl border-border text-foreground hover:bg-muted/30 transition-all"
        >
          <svg className="size-5 shrink-0" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>Continuar con Google</span>
        </Button>

        {/* Divisor institucional inferior */}
        <div className="flex items-center gap-3 w-full my-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-normal text-center">
            Acceso para instituciones autorizadas.
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
      </form>
    </WireframeAuthLayout>
  );
}
