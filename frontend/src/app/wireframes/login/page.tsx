"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { WireframeAuthLayout } from "../components/wireframe-auth-layout";

export default function WireframeLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/wireframes/dashboard");
  };

  return (
    <WireframeAuthLayout>
      {/* Título y subtítulo */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
          Acceso al sistema
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">
          Ingresa con tu cuenta institucional
        </p>
      </div>

      {/* Formulario de login */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Correo institucional */}
        <div className="flex flex-col gap-2 text-left">
          <label
            htmlFor="institutional-email"
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
              id="institutional-email"
              type="email"
              placeholder="tu.correo@institucion.gob.ec"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
        </div>

        {/* Contraseña */}
        <div className="flex flex-col gap-2 text-left">
          <label
            htmlFor="institutional-password"
            className="text-xs sm:text-sm font-semibold text-foreground"
          >
            Contraseña
          </label>
          <InputGroup
            size="default"
            leftIcon={<Lock className="size-4 text-muted-foreground" />}
            className="bg-background"
          >
            <InputGroupInput
              id="institutional-password"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
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
        </div>

        {/* Recordarme & Olvidaste tu contraseña */}
        <div className="flex items-center justify-between mt-1 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
            />
            <label
              htmlFor="remember-me"
              className="font-medium text-foreground cursor-pointer select-none"
            >
              Recordarme
            </label>
          </div>

          <Link
            href="/wireframes/recuperar-acceso"
            className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors font-medium"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Botón Ingresar */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-3 font-semibold justify-center gap-2 h-12 text-sm sm:text-base rounded-full"
        >
          <span>Ingresar</span>
          <ArrowRight className="size-4 shrink-0" />
        </Button>

        {/* Botón Recuperar acceso */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/wireframes/recuperar-acceso")}
          className="w-full font-semibold justify-center h-12 text-sm sm:text-base rounded-full border-border/80 text-foreground hover:bg-muted/30"
        >
          Recuperar acceso
        </Button>
      </form>
    </WireframeAuthLayout>
  );
}
