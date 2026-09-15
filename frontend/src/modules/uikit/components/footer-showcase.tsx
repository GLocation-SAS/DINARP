"use client";

import React from "react";
import { SubSection } from './sub-section';
import { cn } from "@/lib/utils";
import { Monitor, Tablet, Smartphone, Settings2, User, Share2, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { defaultFooterConfig } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Slider } from "@/components/ui/slider";

const PRESETS = [
  { label: "Desktop", icon: Monitor, width: 1280 },
  { label: "Tablet", icon: Tablet, width: 768 },
  { label: "Móvil", icon: Smartphone, width: 375 },
] as const;

export function FooterShowcase() {
  const [theme, setTheme] = React.useState("light");
  const [config, setConfig] = React.useState(defaultFooterConfig);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [draftConfig, setDraftConfig] = React.useState(defaultFooterConfig);
  const [activeStep, setActiveStep] = React.useState(0);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const handleSave = () => {
    setConfig(draftConfig);
    setIsModalOpen(false);
    toast.success("Configuración del footer guardada correctamente");
  };

  const handleOpen = () => {
    setDraftConfig(config);
    setActiveStep(0);
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_FOOTER', payload: config }, '*');
    }
  }, [config]);

  React.useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "light");
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-theme") {
          setTheme(document.documentElement.getAttribute("data-theme") || "light");
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = React.useState(1280);
  const [maxWidth, setMaxWidth] = React.useState(1280);
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    const updateMax = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setMaxWidth(w);
        setViewportWidth((prev) => Math.min(prev, w));
      }
    };
    updateMax();
    window.addEventListener("resize", updateMax);
    return () => window.removeEventListener("resize", updateMax);
  }, []);

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const startX = e.clientX;
      const startWidth = viewportWidth;

      const handleMouseMove = (ev: MouseEvent) => {
        const delta = ev.clientX - startX;
        const newWidth = Math.min(maxWidth, Math.max(320, startWidth + delta * 2));
        setViewportWidth(newWidth);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [viewportWidth, maxWidth]
  );

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="pt-2"></div>

      {/* ── Toolbar: presets + slider ── */}
      <div className="flex flex-wrap items-center justify-between gap-6 p-4 rounded-2xl border border-border bg-surface/50">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground">Vista Dispositivo</span>
            <Tabs
              value={
                Math.abs(viewportWidth - 1280) < 20 || (1280 > maxWidth && viewportWidth === maxWidth)
                  ? "Desktop"
                  : Math.abs(viewportWidth - 768) < 20 || (768 > maxWidth && viewportWidth === maxWidth)
                    ? "Tablet"
                    : "Móvil"
              }
              onValueChange={(val) => {
                const preset = PRESETS.find((p) => p.label === val);
                if (preset) {
                  setViewportWidth(Math.min(preset.width, maxWidth));
                }
              }}
              className="w-auto"
            >
              <TabsList className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border h-auto">
                {PRESETS.map((preset) => (
                  <TabsTrigger
                    key={preset.label}
                    value={preset.label}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-caption font-semibold transition-all duration-200 border-0 shadow-none cursor-pointer text-muted-foreground hover:text-foreground hover:bg-transparent bg-transparent",
                      "after:hidden data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-0 data-[state=active]:hover:bg-surface"
                    )}
                  >
                    <preset.icon className="size-3.5 text-secondary shrink-0" />
                    <span>{preset.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[200px] text-left">
          <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground">Ancho Viewport</span>
          <div className="flex items-center gap-3">
            <Slider
              min={320}
              max={maxWidth}
              value={[viewportWidth]}
              onValueChange={(vals) => setViewportWidth(vals[0])}
              className="flex-1 w-[150px]"
            />
            <span className="text-caption font-mono font-bold text-muted-foreground tabular-nums min-w-[52px] text-right">
              {Math.round(viewportWidth)}px
            </span>
          </div>
        </div>
      </div>

      {/* ── Preview container con resize ── */}
      <div className="flex justify-center">
        <div
          className={cn(
            "relative border border-border rounded-xl overflow-hidden shadow-sm bg-background",
            "transition-[width] duration-150",
            isDragging && "transition-none"
          )}
          style={{ width: `${viewportWidth}px`, maxWidth: "100%" }}
        >
          <iframe
            ref={iframeRef}
            key={theme}
            src={`/footer-preview?theme=${theme}`}
            className="w-full h-[800px] border-none bg-background pointer-events-auto"
            title="Footer Preview"
            onLoad={() => {
              if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_FOOTER', payload: config }, '*');
              }
            }}
          />

          <div
            onMouseDown={handleMouseDown}
            className={cn(
              "absolute right-0 top-0 bottom-0 w-3 cursor-col-resize z-10",
              "flex items-center justify-center",
              "bg-transparent hover:bg-primary/5",
              "transition-colors duration-150",
              "group"
            )}
            aria-label="Arrastrar para cambiar ancho"
          >
            <div
              className={cn(
                "w-1 h-10 rounded-full",
                "bg-border group-hover:bg-primary/40",
                "transition-colors duration-150",
                isDragging && "bg-primary/60"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
