"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoManagerCardProps {
  slot?: "horizontal" | "vertical" | "escudo" | "favicon" | "sin-lema";
  title: string;
  description: string;
  badge1: string;
  badge2?: string;
  defaultLightImg?: string;
  defaultDarkImg?: string;
  monoLightImg?: string;
  monoDarkImg?: string;
  maxHeightClass?: string;
  allowedFormats?: string;
  isMissing?: boolean;
}

export function LogoManagerCard({
  title,
  description,
  badge1,
  badge2,
  defaultLightImg = "",
  defaultDarkImg = "",
  monoLightImg,
  monoDarkImg,
  maxHeightClass = "max-h-16",
  isMissing = false,
}: LogoManagerCardProps) {
  const [variant, setVariant] = React.useState<"color" | "mono">("color");

  const hasMono = Boolean(monoLightImg && monoDarkImg);
  const activeLightImg = variant === "mono" && hasMono ? (monoLightImg || defaultLightImg) : defaultLightImg;
  const activeDarkImg = variant === "mono" && hasMono ? (monoDarkImg || defaultDarkImg) : defaultDarkImg;

  return (
    <div className={cn("flex flex-col rounded-2xl overflow-hidden group bg-surface", isMissing ? "border border-dashed border-border/60" : "border border-border/60 shadow-xs")}>
      {/* Image Box */}
      {isMissing ? (
        <div className="h-48 w-full bg-muted/20 flex flex-col items-center justify-center p-6 text-center border-b border-dashed border-border/60">
          <div className="size-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
            <ImageOff className="size-5 text-muted-foreground/50" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">Recurso faltante</span>
          <span className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">
            falta el recurso oficial del manual de marca
          </span>
        </div>
      ) : (
        <div className="relative h-48 p-6 flex flex-col items-center justify-center border-b border-border/40 bg-surface/50">
          {hasMono && (
            <div className="absolute top-3 right-3 flex bg-surface border border-border rounded-full p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setVariant("color")}
                className={cn("px-3 py-1 text-[10px] font-bold rounded-full transition-colors uppercase tracking-wider cursor-pointer", variant === "color" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/20")}
              >
                Color
              </button>
              <button
                type="button"
                onClick={() => setVariant("mono")}
                className={cn("px-3 py-1 text-[10px] font-bold rounded-full transition-colors uppercase tracking-wider cursor-pointer", variant === "mono" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/20")}
              >
                Mono
              </button>
            </div>
          )}
          {activeLightImg && (
            <img
              src={activeLightImg}
              alt={`${title} Light`}
              className={`dark:hidden ${maxHeightClass} w-auto object-contain transition-transform group-hover:scale-105`}
            />
          )}
          {activeDarkImg && (
            <img
              src={activeDarkImg}
              alt={`${title} Dark`}
              className={`hidden dark:block ${maxHeightClass} w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-md`}
            />
          )}
        </div>
      )}

      {/* Info Area */}
      <div className="p-6 flex flex-col flex-1 bg-surface">
        <div className="flex gap-2 mb-4">
          <Badge tone={isMissing ? "neutral" : "info"} appearance="soft" size="sm" className="font-bold uppercase tracking-wider text-[10px] px-2.5 py-1">
            {badge1}
          </Badge>
          {badge2 && (
            <Badge tone={isMissing ? "neutral" : "warning"} appearance="soft" size="sm" className="font-bold uppercase tracking-wider text-[10px] px-2.5 py-1">
              {badge2}
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <h3 className="text-foreground font-bold text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4 min-h-[3rem]">
            {description}
          </p>
        </div>

        {!isMissing && (
          <div className="mt-auto flex flex-col gap-2">
            <a href={activeLightImg} download className="w-full dark:hidden">
              <Button variant="primary" className="w-full rounded-full" leftIcon={<Download className="size-4" />}>
                Descargar SVG
              </Button>
            </a>
            <a href={activeDarkImg} download className="w-full hidden dark:block">
              <Button variant="primary" className="w-full rounded-full" leftIcon={<Download className="size-4" />}>
                Descargar SVG
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
