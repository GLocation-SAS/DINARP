"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Edit2, Check, Sun, Moon, ImageOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUpload, type FileUploadItem } from "@/components/ui/file-upload";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/data-display";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface LogoManagerCardProps {
  /** Identificador del recurso en dinarp-kit-assets (bucket de borrador, NUNCA dinarp-design-tokens). */
  slot: "horizontal" | "vertical" | "escudo" | "favicon" | "sin-lema";
  title: string;
  description: string;
  badge1: string;
  badge2: string;
  defaultLightImg?: string;
  defaultDarkImg?: string;
  monoLightImg?: string;
  monoDarkImg?: string;
  editLabel?: string;
  maxHeightClass?: string;
  allowedFormats?: string;
  isMissing?: boolean;
}

export function LogoManagerCard({
  slot,
  title,
  description,
  badge1,
  badge2,
  defaultLightImg = "",
  defaultDarkImg = "",
  monoLightImg,
  monoDarkImg,
  editLabel = "Editar recurso",
  maxHeightClass = "max-h-16",
  allowedFormats = "SVG o PNG",
  isMissing = false,
}: LogoManagerCardProps) {
  // Arranca optimistamente pidiendo lo que haya en el bucket de borrador
  // (extensión adivinada, el proxy resuelve la real si es otra — ver
  // api/kit-assets/[file]/route.ts) — así un logo ya editado sobrevive un
  // refresh de página en vez de volver siempre al estático de public/.
  // Si nunca se ha editado este slot, el proxy 404ea y onError cae al
  // estático original (ver <img> más abajo).
  const [lightImg, setLightImg] = React.useState(defaultLightImg);
  const [darkImg, setDarkImg] = React.useState(defaultDarkImg);

  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState<1 | 2>(1);
  const [deletePending, setDeletePending] = React.useState<{ id: string, type: 'light' | 'dark' } | null>(null);

  const [lightFiles, setLightFiles] = React.useState<FileUploadItem[]>([]);
  const [darkFiles, setDarkFiles] = React.useState<FileUploadItem[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [variant, setVariant] = React.useState<"color" | "mono">("color");

  const hasMono = Boolean(monoLightImg && monoDarkImg);
  const activeLightImg = variant === "mono" && hasMono ? (monoLightImg || lightImg) : lightImg;
  const activeDarkImg = variant === "mono" && hasMono ? (monoDarkImg || darkImg) : darkImg;

  // When opening the upload modal, clear previous files
  const handleOpenUpload = () => {
    setLightFiles([]);
    setDarkFiles([]);
    setCurrentStep(1);
    setIsUploadOpen(true);
  };

  const handleFileSelect = (newFiles: File[], type: 'light' | 'dark') => {
    if (newFiles.length === 0) return;

    const file = newFiles[0];
    const isSvgOrPng = file.type === "image/svg+xml" || file.type === "image/png";
    const setter = type === 'light' ? setLightFiles : setDarkFiles;

    if (!isSvgOrPng) {
      setter([
        {
          id: Math.random().toString(36).substring(7),
          file,
          status: "error",
          errorType: "format",
          progress: 0,
        },
      ]);
      return;
    }

    setter([
      {
        id: Math.random().toString(36).substring(7),
        file,
        status: "success",
        errorType: null,
        progress: 100,
      },
    ]);
  };

  const handleRemoveFile = (id: string, type: 'light' | 'dark') => {
    // Instead of removing immediately, ask for confirmation
    setDeletePending({ id, type });
  };

  const confirmDeleteFile = () => {
    if (!deletePending) return;
    const { id, type } = deletePending;
    if (type === 'light') {
      setLightFiles((prev) => prev.filter((f) => f.id !== id));
    } else {
      setDarkFiles((prev) => prev.filter((f) => f.id !== id));
    }
    setDeletePending(null);
  };

  const handleOpenConfirm = () => {
    const hasLight = lightFiles.length > 0 && lightFiles[0].status === "success";
    const hasDark = darkFiles.length > 0 && darkFiles[0].status === "success";

    if (!hasLight && !hasDark) return;
    setIsUploadOpen(false);
    setIsConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
    setIsUploadOpen(true);
  };

  const handleConfirmUpload = async () => {
    const hasLight = lightFiles.length > 0 && lightFiles[0].status === "success";
    const hasDark = darkFiles.length > 0 && darkFiles[0].status === "success";
    if (!hasLight && !hasDark) return;

    setIsProcessing(true);

    try {
      const uploadPromises = [];

      if (hasLight) {
        const bodyLight = new FormData();
        bodyLight.append("file", lightFiles[0].file);
        // Compatibilidad: el light principal lo subimos como slot (p/ej 'horizontal')
        bodyLight.append("slot", slot);
        uploadPromises.push(
          fetch("/api/kit-assets", { method: "POST", body: bodyLight })
            .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
            .then((data) => {
              setLightImg(data.url);
              // Tambien seteamos la variable en version "-light" por si acaso
              const bodyLight2 = new FormData();
              bodyLight2.append("file", lightFiles[0].file);
              bodyLight2.append("slot", `${slot}-light`);
              return fetch("/api/kit-assets", { method: "POST", body: bodyLight2 });
            })
        );
      }

      if (hasDark) {
        const bodyDark = new FormData();
        bodyDark.append("file", darkFiles[0].file);
        bodyDark.append("slot", `${slot}-dark`);
        uploadPromises.push(
          fetch("/api/kit-assets", { method: "POST", body: bodyDark })
            .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
            .then((data) => setDarkImg(data.url))
        );
      }

      await Promise.all(uploadPromises);

      toast.success(`${title} actualizado`, {
        description: "Los recursos se guardaron en el bucket de borrador del kit.",
      });
    } catch (err) {
      toast.error(`No se pudo actualizar ${title.toLowerCase()}`, {
        description: err instanceof Error ? err.message : "Error desconocido.",
      });
    } finally {
      setIsProcessing(false);
      setIsConfirmOpen(false);
    }
  };

  const currentLightFile = lightFiles[0];
  const isValidLight = currentLightFile?.status === "success";
  const previewLightUrl = isValidLight ? URL.createObjectURL(currentLightFile.file) : null;

  const currentDarkFile = darkFiles[0];
  const isValidDark = currentDarkFile?.status === "success";
  const previewDarkUrl = isValidDark ? URL.createObjectURL(currentDarkFile.file) : null;

  const hasAnyValid = isValidLight || isValidDark;

  return (
    <>
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
                  onClick={() => setVariant("color")}
                  className={cn("px-3 py-1 text-[10px] font-bold rounded-full transition-colors uppercase tracking-wider", variant === "color" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/20")}
                >
                  Color
                </button>
                <button
                  onClick={() => setVariant("mono")}
                  className={cn("px-3 py-1 text-[10px] font-bold rounded-full transition-colors uppercase tracking-wider", variant === "mono" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/20")}
                >
                  Mono
                </button>
              </div>
            )}
            <img
              src={activeLightImg}
              alt={`${title} Light`}
              className={`dark:hidden ${maxHeightClass} w-auto object-contain transition-transform group-hover:scale-105`}
              onError={() => setLightImg(defaultLightImg)}
            />
            <img
              src={activeDarkImg}
              alt={`${title} Dark`}
              className={`hidden dark:block ${maxHeightClass} w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-md`}
              onError={() => setDarkImg(defaultDarkImg)}
            />
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
              <a href={lightImg} download className="w-full dark:hidden">
                <Button variant="primary" className="w-full rounded-full" leftIcon={<Download className="size-4" />}>
                  Descargar SVG
                </Button>
              </a>
              <a href={darkImg} download className="w-full hidden dark:block">
                <Button variant="primary" className="w-full rounded-full" leftIcon={<Download className="size-4" />}>
                  Descargar SVG
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>

    </>
  );
}
