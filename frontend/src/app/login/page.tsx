"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAssetPath } from "@/lib/utils";
import {
  Building2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
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

export default function LoginPage() {
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid(email)) {
      setEmailState("error");
      setHasInteracted(true);
      return;
    }
    router.push("/uikit");
  };

  const handleGoogleLogin = () => {
    toast.info("Función en evaluación de diseño UX/UI", {
      className: "!w-auto !max-w-none whitespace-nowrap",
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground p-4 sm:p-6 lg:p-8 xl:p-12 relative">
      <div className="w-full max-w-[1600px] min-h-[720px] rounded-3xl border border-border bg-card overflow-hidden shadow-2xl flex flex-col lg:flex-row items-stretch">
        
        {/* ══════════════════════════════════════════════════
            COLUMNA IZQUIERDA: Panel Azul Institucional
           ══════════════════════════════════════════════════ */}
        <section className="w-full lg:w-[58%] xl:w-[60%] relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#061d4a] via-[#092a6b] to-[#041638] p-8 sm:p-12 lg:p-14 xl:p-16 text-white border-b lg:border-b-0 lg:border-r border-blue-900/40 shrink-0">
          {/* Fondo con resplandor ambiental */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Encabezado y Descripción */}
          <div className="relative z-10 flex flex-col items-start text-left max-w-2xl">
            <div className="w-12 h-1.5 bg-cyan-400 rounded-full mb-8" />

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-extrabold tracking-tight text-white leading-[1.15] mb-5">
              La información pública, <br className="hidden sm:inline" />
              conectada con propósito.
            </h1>

            <p className="text-base sm:text-lg text-blue-100/85 font-normal leading-relaxed max-w-xl">
              Solicita datos de otras instituciones, gestiona autorizaciones y sigue cada intercambio desde un solo lugar.
            </p>
          </div>

          {/* Secuencia de 4 Tarjetas Conectadas y Centradas */}
          <div className="relative z-10 my-8 sm:my-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 relative">
              
              {/* Conector horizontal centrado en la mitad de las tarjetas */}
              <div className="hidden xl:block absolute top-1/2 -translate-y-1/2 left-[10%] right-[10%] h-[2px] bg-blue-400/25 z-0" />

              {/* Tarjeta 1: Entidad solicitante */}
              <div className="relative z-10 rounded-2xl border border-blue-400/20 bg-blue-950/40 backdrop-blur-md p-5 flex flex-col items-center text-center gap-3 transition-transform hover:-translate-y-0.5">
                <div className="size-11 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                  <Building2 className="size-5" />
                </div>
                <div className="flex flex-col items-center w-full">
                  <p className="text-sm font-bold text-white text-center leading-snug">
                    Entidad <br /> solicitante
                  </p>
                  <div className="flex flex-col items-center gap-1.5 mt-3">
                    <div className="h-1.5 w-16 bg-blue-300/30 rounded-full" />
                    <div className="h-1.5 w-10 bg-blue-300/15 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Tarjeta 2: Datos requeridos */}
              <div className="relative z-10 rounded-2xl border border-blue-400/20 bg-blue-950/40 backdrop-blur-md p-5 flex flex-col items-center text-center gap-3 transition-transform hover:-translate-y-0.5">
                <div className="size-11 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                  <FileText className="size-5" />
                </div>
                <div className="flex flex-col items-center w-full">
                  <p className="text-sm font-bold text-white text-center leading-snug">
                    Datos <br /> requeridos
                  </p>
                  <div className="flex flex-col items-center gap-1.5 mt-3">
                    <div className="h-1.5 w-16 bg-blue-300/30 rounded-full" />
                    <div className="h-1.5 w-10 bg-blue-300/15 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Tarjeta 3: Revisión DINARP */}
              <div className="relative z-10 rounded-2xl border border-blue-400/20 bg-blue-950/40 backdrop-blur-md p-5 flex flex-col items-center text-center gap-3 transition-transform hover:-translate-y-0.5">
                <div className="size-11 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                  <ShieldCheck className="size-5" />
                </div>
                <div className="flex flex-col items-center w-full">
                  <p className="text-sm font-bold text-white text-center leading-snug">
                    Revisión <br /> DINARP
                  </p>
                  <div className="flex flex-col items-center gap-1.5 mt-3">
                    <div className="h-1.5 w-16 bg-blue-300/30 rounded-full" />
                    <div className="h-1.5 w-10 bg-blue-300/15 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Tarjeta 4: Intercambio autorizado */}
              <div className="relative z-10 rounded-2xl border border-blue-400/20 bg-blue-950/40 backdrop-blur-md p-5 flex flex-col items-center text-center gap-3 transition-transform hover:-translate-y-0.5">
                <div className="size-11 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                  <CheckCircle2 className="size-5" />
                </div>
                <div className="flex flex-col items-center w-full">
                  <p className="text-sm font-bold text-white text-center leading-snug">
                    Intercambio <br /> autorizado
                  </p>
                  <div className="flex flex-col items-center gap-1.5 mt-3">
                    <div className="h-1.5 w-16 bg-blue-300/30 rounded-full" />
                    <div className="h-1.5 w-10 bg-blue-300/15 rounded-full" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Mensaje institucional */}
          <div className="pt-6 flex items-center gap-2.5 border-t border-blue-400/20 relative z-10">
            <Building2 className="size-4 text-cyan-300 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-blue-200">
              Instituciones que trabajan por un Ecuador más conectado
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            COLUMNA DERECHA: Formulario Blanco de Acceso
           ══════════════════════════════════════════════════ */}
        <section className="w-full lg:w-[42%] xl:w-[40%] flex flex-col justify-center p-8 sm:p-12 lg:p-14 xl:p-16 bg-card">
          <div className="w-full max-w-[440px] mx-auto flex flex-col justify-center">
              
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
              <div className="mb-8 text-left">
                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
                  Ingresa al portal
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">
                  Accede con tu cuenta institucional.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                {/* Correo institucional */}
                <div className="flex flex-col gap-2 text-left">
                  <Label
                    htmlFor="institutional-email"
                    className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer"
                  >
                    Correo institucional
                  </Label>
                  <InputGroup
                    state={emailState}
                    leftIcon={<Mail className="size-4 text-muted-foreground" />}
                    rightIcon={
                      emailState === "success" ? (
                        <CheckCircle2 className="size-4 text-success animate-in fade-in" />
                      ) : emailState === "error" ? (
                        <AlertCircle className="size-4 text-danger animate-in fade-in" />
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
                  {emailState === "error" && (
                    <p className="text-xs text-danger font-medium mt-0.5 animate-in fade-in slide-in-from-top-1">
                      Ingresa un correo institucional válido (ej. nombre@institucion.gob.ec).
                    </p>
                  )}
                  {emailState === "success" && (
                    <p className="text-xs text-success font-medium mt-0.5 animate-in fade-in slide-in-from-top-1">
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
                      className="text-xs sm:text-sm text-[#0066FF] hover:text-[#0052CC] dark:text-cyan-400 dark:hover:text-cyan-300 underline-offset-4 hover:underline font-medium transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>

                {/* Botón Iniciar sesión */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={!isFormValid}
                  className="w-full mt-2 font-semibold justify-center gap-2 h-12 text-sm sm:text-base rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-neutral-950 disabled:opacity-50"
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
                  className="w-full font-semibold justify-center gap-3 h-12 text-sm sm:text-base rounded-xl border-border/80 text-foreground hover:bg-muted/40 transition-all"
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
                  <div className="flex-1 h-px bg-border/60" />
                  <span className="text-xs text-muted-foreground/80 font-normal text-center">
                    Acceso para instituciones autorizadas.
                  </span>
                  <div className="flex-1 h-px bg-border/60" />
                </div>
              </form>

            </div>
          </section>

        </div>
    </div>
  );
}
