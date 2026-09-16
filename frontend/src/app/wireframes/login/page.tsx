"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Cloud,
  Building2,
  Users,
  FileText,
  BarChart3,
} from "lucide-react";

import { cn, getAssetPath } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { GeoportalHeader } from "@/components/layout/geoportal-header";

export default function WireframeLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ── Header institucional existente ── */}
      <GeoportalHeader
        variant="user-actions"
        hideUserActions
        isStatic
        className="w-full max-w-none border-b border-border bg-surface/90"
      />

      {/* ── Contenido Principal (Dos Columnas) ── */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ══════════════════════════════════════════════════
              COLUMNA IZQUIERDA: Bienvenida & Gráfica Conceptual
             ══════════════════════════════════════════════════ */}
          <section className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-b from-muted/30 via-surface to-muted/20 p-8 sm:p-12 min-h-[520px] lg:min-h-[580px] shadow-xs">
            {/* Encabezado de Bienvenida */}
            <div className="relative z-10 flex flex-col items-start text-left max-w-lg">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={getAssetPath("/logotipo.png")}
                  alt="DINARP Logo"
                  className="h-9 w-auto object-contain opacity-90"
                />
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-none">
                Bienvenido a <br />
                <span className="text-foreground">DINARP</span>
              </h1>

              <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full my-4" />

              <p className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed">
                Portal de interoperabilidad y gestión de solicitudes.
              </p>
            </div>

            {/* Gráfica conceptual de interoperabilidad en escala de grises */}
            <div className="relative z-10 my-8 sm:my-10 flex items-center justify-center">
              {/* Mapa silueta de fondo SVG abstracto */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                {/* Silueta de Ecuador estilizada en grayscale */}
                <svg
                  className="absolute inset-0 w-full h-full text-muted/50 pointer-events-none -translate-x-3 -translate-y-2 opacity-60"
                  viewBox="0 0 400 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M 170,80 C 210,75 250,90 280,120 C 310,150 330,190 310,230 C 290,270 250,290 220,320 C 190,350 150,330 130,290 C 110,250 90,210 110,160 C 130,110 140,85 170,80 Z"
                    fill="currentColor"
                  />
                  <path
                    d="M 120,200 C 90,220 80,260 100,290 C 120,320 150,330 170,300 C 160,260 140,220 120,200 Z"
                    fill="currentColor"
                    fillOpacity="0.5"
                  />
                </svg>

                {/* Ondas concéntricas decorativas */}
                <div className="absolute inset-4 rounded-full border border-dashed border-border/60 pointer-events-none" />
                <div className="absolute inset-14 rounded-full border border-border/40 pointer-events-none" />

                {/* Líneas de conexión en cruz punteadas */}
                <svg
                  className="absolute inset-0 w-full h-full text-muted-foreground/40 pointer-events-none"
                  viewBox="0 0 320 320"
                >
                  {/* Línea Vertical */}
                  <line
                    x1="160"
                    y1="50"
                    x2="160"
                    y2="270"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* Línea Horizontal */}
                  <line
                    x1="50"
                    y1="160"
                    x2="270"
                    y2="160"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* Puntos de conexión en las líneas */}
                  <circle cx="160" cy="95" r="2.5" fill="currentColor" />
                  <circle cx="160" cy="225" r="2.5" fill="currentColor" />
                  <circle cx="95" cy="160" r="2.5" fill="currentColor" />
                  <circle cx="225" cy="160" r="2.5" fill="currentColor" />
                </svg>

                {/* Nodo Central: Nube institucional */}
                <div className="relative z-20 size-20 sm:size-24 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg border-4 border-surface">
                  <Cloud className="size-9 sm:size-10 stroke-[1.75]" />
                </div>

                {/* Nodo Superior: Institución / Gobierno */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 size-12 sm:size-14 rounded-full bg-surface border-2 border-border shadow-xs flex items-center justify-center text-foreground transition-transform hover:scale-105">
                  <Building2 className="size-5 sm:size-6 text-foreground/90 stroke-[1.75]" />
                </div>

                {/* Nodo Izquierdo: Ciudadanía / Usuarios */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 size-12 sm:size-14 rounded-full bg-surface border-2 border-border shadow-xs flex items-center justify-center text-foreground transition-transform hover:scale-105">
                  <Users className="size-5 sm:size-6 text-foreground/90 stroke-[1.75]" />
                </div>

                {/* Nodo Derecho: Trámites / Solicitudes */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 size-12 sm:size-14 rounded-full bg-surface border-2 border-border shadow-xs flex items-center justify-center text-foreground transition-transform hover:scale-105">
                  <FileText className="size-5 sm:size-6 text-foreground/90 stroke-[1.75]" />
                </div>

                {/* Nodo Inferior: Métricas / Indicadores */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 size-12 sm:size-14 rounded-full bg-surface border-2 border-border shadow-xs flex items-center justify-center text-foreground transition-transform hover:scale-105">
                  <BarChart3 className="size-5 sm:size-6 text-foreground/90 stroke-[1.75]" />
                </div>
              </div>
            </div>

            {/* Decoración de ondas inferiores sutiles */}
            <div className="absolute bottom-0 right-0 left-0 h-20 bg-gradient-to-t from-muted/40 to-transparent pointer-events-none rounded-b-3xl" />
          </section>

          {/* ══════════════════════════════════════════════════
              COLUMNA DERECHA: Formulario de Acceso al Sistema
             ══════════════════════════════════════════════════ */}
          <section className="w-full flex justify-center">
            <div className="w-full max-w-[460px] rounded-3xl border border-border bg-surface p-7 sm:p-10 md:p-12 shadow-sm flex flex-col">
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
                    href="/wireframes"
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
                  className="w-full font-semibold justify-center h-12 text-sm sm:text-base rounded-full border-border/80 text-foreground hover:bg-muted/30"
                >
                  Recuperar acceso
                </Button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
