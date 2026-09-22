"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAssetPath } from "@/lib/utils";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { ThemeToggle } from "@/components/theme-toggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { WireframeAuthLayout } from "../components/wireframe-auth-layout";

export default function WireframeLogin2Page() {
  const router = useRouter();
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"login" | "otp">("login");
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // Validation states
  const [hasInteractedCedula, setHasInteractedCedula] = useState(false);
  const [hasInteractedPassword, setHasInteractedPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  // OTP state
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Simulation: Allow 10 digits for cédula
  const isCedulaValid = (val: string) => /^\d{10}$/.test(val);
  const isPasswordValid = (val: string) => val.length > 0;

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setCedula(val);
    setLoginError("");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasInteractedCedula(true);
    setHasInteractedPassword(true);

    if (!isCedulaValid(cedula)) return;
    if (!isPasswordValid(password)) return;

    // Simulate validation
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Simulate error scenario if cedula is 0000000000
      if (cedula === "0000000000") {
        setLoginError("No pudimos validar tus credenciales. Verifica la información e inténtalo nuevamente.");
        return;
      }
      setStep("otp");
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Simulate error scenarios
      if (otpValue === "000000") {
        setOtpError("El código ingresado no es válido.");
        return;
      }
      if (otpValue === "111111") {
        setOtpError("El código ha expirado. Solicita uno nuevo.");
        return;
      }
      router.push("/wireframes2/dashboard");
    }, 1000);
  };

  return (
    <WireframeAuthLayout>
      <div className="flex items-center justify-between pb-6 mb-10 border-b border-border/60">
        <div className="flex items-center gap-3">
          <img
            src={getAssetPath("/logotipo.png")}
            alt="Logo DINARP"
            className="h-9 w-auto max-w-[160px] object-contain dark:brightness-0 dark:invert opacity-90"
          />
          <div className="h-5 w-px bg-border" />
          <span className="text-xs font-semibold text-muted-foreground/80 leading-tight">
            Portal de Interoperabilidad
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
        </div>
      </div>

      {step === "login" ? (
        <>
          <div className="mb-8 text-left">
            <h2 className="font-heading font-extrabold text-3xl sm:text-[32px] tracking-tight text-foreground">
              Bienvenido
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">
              Ingresa con tu identidad registrada para acceder al Portal de Interoperabilidad.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
            {loginError && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm animate-in fade-in">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="flex flex-col gap-2 text-left">
              <Label htmlFor="cedula" className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer">
                Número de cédula
              </Label>
              <InputGroup
                size="default"
                state={hasInteractedCedula && !isCedulaValid(cedula) ? "error" : "default"}
                leftIcon={<User className="size-4 text-muted-foreground" />}
                className="bg-background"
              >
                <InputGroupInput
                  id="cedula"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ingresa tu número de cédula"
                  value={cedula}
                  onChange={handleCedulaChange}
                  onBlur={() => { if (cedula) setHasInteractedCedula(true); }}
                  required
                />
              </InputGroup>
              {hasInteractedCedula && cedula && !isCedulaValid(cedula) && (
                <p className="text-xs text-destructive font-medium mt-0.5 animate-in fade-in">
                  Ingresa un número de cédula válido.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 text-left">
              <Label htmlFor="password" className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer">
                Contraseña
              </Label>
              <InputGroup
                size="default"
                state={hasInteractedPassword && !isPasswordValid(password) && password.length > 0 ? "error" : "default"}
                leftIcon={<Lock className="size-4 text-muted-foreground" />}
                className="bg-background"
              >
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError("");
                  }}
                  onBlur={() => { if (password) setHasInteractedPassword(true); }}
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
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </InputGroupButton>
              </InputGroup>
              
              <div className="flex justify-end mt-2.5">
                <Link
                  href="/wireframes2/recuperar-acceso"
                  className="text-xs sm:text-sm text-foreground underline-offset-4 hover:underline font-medium transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full mt-4 font-semibold justify-center gap-2 h-12 text-sm sm:text-base rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin shrink-0" />
                  <span>Validando...</span>
                </>
              ) : (
                <>
                  <span>Iniciar sesión</span>
                  <ArrowRight className="size-4 shrink-0" />
                </>
              )}
            </Button>

            <div className="mt-4 flex flex-col items-center gap-6">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <ShieldCheck className="size-4 shrink-0" />
                <p className="text-xs font-medium">
                  Acceso protegido mediante autenticación institucional.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="text-xs font-medium text-muted-foreground underline-offset-4 hover:underline hover:text-foreground inline-flex transition-colors"
              >
                ¿Necesitas ayuda para ingresar?
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className="mb-7 text-left animate-in fade-in slide-in-from-right-4">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
              Verifica tu identidad
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">
              Ingresa el código de verificación enviado al medio registrado en tu cuenta.
            </p>
          </div>

          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4">
            {otpError && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{otpError}</span>
              </div>
            )}

            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    otpRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-lg sm:text-2xl font-bold bg-background shadow-none border-2 focus-visible:ring-0 focus-visible:border-primary px-0 rounded-xl"
                  required
                />
              ))}
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-muted-foreground">
                ¿No recibiste el código?
              </span>
              <button
                type="button"
                className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                onClick={() => setOtpError("")}
              >
                Reenviar código
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting || otp.join("").length < 6}
                className="w-full font-semibold justify-center gap-2 h-12 text-sm sm:text-base rounded-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin shrink-0" />
                    <span>Validando...</span>
                  </>
                ) : (
                  <>
                    <span>Verificar y continuar</span>
                    <ArrowRight className="size-4 shrink-0" />
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => {
                  setStep("login");
                  setOtp(Array(6).fill(""));
                  setOtpError("");
                }}
                className="w-full font-semibold h-12 text-sm sm:text-base rounded-xl"
              >
                Volver
              </Button>
            </div>
          </form>
        </>
      )}

      {/* Modal de ayuda */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground font-heading">Portal de Interoperabilidad</DialogTitle>
            <DialogDescription className="text-muted-foreground pt-3">
              Permite a las instituciones gestionar solicitudes de información, autorizaciones y servicios de interoperabilidad con DINARP.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="primary" className="w-full sm:w-auto">
                Entendido
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WireframeAuthLayout>
  );
}
