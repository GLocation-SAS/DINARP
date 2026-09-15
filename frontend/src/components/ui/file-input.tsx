"use client"

import * as React from "react"
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileArchive,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  File as FileGeneric,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  XCircle,
  Map,
  Globe,
  Layers,
  Play,
  Trash2,
  ArrowUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// ─── Types ───────────────────────────────────────────────────────────────────

export type FileItemStatus =
  | "idle"
  | "queued"
  | "uploading"
  | "paused"
  | "success"
  | "error"
  | "cancelled"

export type FileErrorType =
  | "format"
  | "size"
  | "invalid"
  | "network"
  | "cancelled"
  | null

export interface FileItemData {
  id: string
  file: File
  status: FileItemStatus
  errorType: FileErrorType
  progress: number
  previewUrl?: string
}

export interface FileUploadProps {
  label?: string
  accept?: string
  maxSizeMB?: number
  maxFiles?: number
  multiple?: boolean
  disabled?: boolean
  required?: boolean
  className?: string
  allowedFormats?: string
  items?: FileItemData[]
  onFileSelect?: (files: File[]) => void
  onRemove?: (id: string) => void
  onRetry?: (id: string) => void
  onCancel?: (id: string) => void
}

// ─── File type registry ────────────────────────────────────────────────────

// Badge variant/appearance from Design System
// variant: "primary" | "secondary" | "error" | "success" | "warning" | "info" | "neutral"
// appearance: "default" | "outline" | "soft"
interface FileTypeDef {
  label: string
  iconColor: string                              // semantic token class for icon
  badgeVariant: "primary" | "secondary" | "error" | "success" | "warning" | "info" | "neutral"
  badgeAppearance: "solid" | "outline" | "soft" | "ghost"
  icon: React.ReactNode
}

// Mapping: file type → closest semantic token
// PDF  → error/danger (red)       Excel/CSV → success (green)
// Word → info (blue)              ZIP/Archive → warning (amber)
// PPT  → warning (orange)         Image → secondary (violet)
// Video → secondary               Audio → warning (soft)
// Geo formats → success (geo/earth)  JSON/Code → primary
// TXT  → neutral                  Unknown → neutral
const EXT_MAP: Record<string, FileTypeDef> = {
  pdf: { label: "PDF", iconColor: "text-danger", badgeVariant: "error", badgeAppearance: "solid", icon: <FileText className="size-8" /> },
  doc: { label: "Word", iconColor: "text-info", badgeVariant: "info", badgeAppearance: "solid", icon: <FileText className="size-8" /> },
  docx: { label: "Word", iconColor: "text-info", badgeVariant: "info", badgeAppearance: "solid", icon: <FileText className="size-8" /> },
  xls: { label: "Excel", iconColor: "text-success", badgeVariant: "success", badgeAppearance: "solid", icon: <FileSpreadsheet className="size-8" /> },
  xlsx: { label: "Excel", iconColor: "text-success", badgeVariant: "success", badgeAppearance: "solid", icon: <FileSpreadsheet className="size-8" /> },
  csv: { label: "CSV", iconColor: "text-success", badgeVariant: "success", badgeAppearance: "solid", icon: <FileSpreadsheet className="size-8" /> },
  ppt: { label: "PowerPoint", iconColor: "text-warning", badgeVariant: "warning", badgeAppearance: "solid", icon: <FileText className="size-8" /> },
  pptx: { label: "PowerPoint", iconColor: "text-warning", badgeVariant: "warning", badgeAppearance: "solid", icon: <FileText className="size-8" /> },
  jpg: { label: "Image", iconColor: "text-secondary", badgeVariant: "secondary", badgeAppearance: "solid", icon: <FileImage className="size-8" /> },
  jpeg: { label: "Image", iconColor: "text-secondary", badgeVariant: "secondary", badgeAppearance: "solid", icon: <FileImage className="size-8" /> },
  png: { label: "Image", iconColor: "text-secondary", badgeVariant: "secondary", badgeAppearance: "solid", icon: <FileImage className="size-8" /> },
  webp: { label: "Image", iconColor: "text-secondary", badgeVariant: "secondary", badgeAppearance: "solid", icon: <FileImage className="size-8" /> },
  mp4: { label: "Video", iconColor: "text-secondary", badgeVariant: "secondary", badgeAppearance: "solid", icon: <FileVideo className="size-8" /> },
  mov: { label: "Video", iconColor: "text-secondary", badgeVariant: "secondary", badgeAppearance: "solid", icon: <FileVideo className="size-8" /> },
  webm: { label: "Video", iconColor: "text-secondary", badgeVariant: "secondary", badgeAppearance: "solid", icon: <FileVideo className="size-8" /> },
  mp3: { label: "Audio", iconColor: "text-warning", badgeVariant: "warning", badgeAppearance: "solid", icon: <FileAudio className="size-8" /> },
  wav: { label: "Audio", iconColor: "text-warning", badgeVariant: "warning", badgeAppearance: "solid", icon: <FileAudio className="size-8" /> },
  zip: { label: "ZIP", iconColor: "text-warning", badgeVariant: "warning", badgeAppearance: "solid", icon: <FileArchive className="size-8" /> },
  rar: { label: "Archive", iconColor: "text-warning", badgeVariant: "warning", badgeAppearance: "solid", icon: <FileArchive className="size-8" /> },
  "7z": { label: "Archive", iconColor: "text-warning", badgeVariant: "warning", badgeAppearance: "solid", icon: <FileArchive className="size-8" /> },
  geojson: { label: "GeoJSON", iconColor: "text-success", badgeVariant: "success", badgeAppearance: "solid", icon: <Globe className="size-8" /> },
  shp: { label: "SHP", iconColor: "text-success", badgeVariant: "success", badgeAppearance: "solid", icon: <Layers className="size-8" /> },
  kml: { label: "KML", iconColor: "text-info", badgeVariant: "info", badgeAppearance: "solid", icon: <Map className="size-8" /> },
  kmz: { label: "KMZ", iconColor: "text-info", badgeVariant: "info", badgeAppearance: "solid", icon: <Map className="size-8" /> },
  txt: { label: "TXT", iconColor: "text-muted-foreground", badgeVariant: "neutral", badgeAppearance: "solid", icon: <FileText className="size-8" /> },
  json: { label: "JSON", iconColor: "text-primary", badgeVariant: "primary", badgeAppearance: "solid", icon: <FileCode className="size-8" /> },
}

const DEFAULT_TYPE: FileTypeDef = {
  label: "File",
  iconColor: "text-muted-foreground",
  badgeVariant: "neutral",
  badgeAppearance: "solid",
  icon: <FileGeneric className="size-8" />,
}

function getFileType(file: File): FileTypeDef {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
  return EXT_MAP[ext] ?? DEFAULT_TYPE
}

function isImage(file: File) {
  return file.type.startsWith("image/")
}

function isVideo(file: File) {
  return file.type.startsWith("video/")
}

// ─── formatBytes ───────────────────────�// ─── FileItem Component ────────────────────────────────────────────────────

interface FileItemProps {
  item: FileItemData
  disabled?: boolean
  onRemove: () => void
  onRetry: () => void
  onCancel: () => void
}

function FileItem({ item, disabled, onRemove, onRetry, onCancel }: FileItemProps) {
  const { file, status, progress = 0, errorType } = item
  const [showSuccess, setShowSuccess] = React.useState(false)

  React.useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => setShowSuccess(true), 150)
      return () => clearTimeout(t)
    } else {
      setShowSuccess(false)
    }
  }, [status])

  const isIdle = progress === 0 && status !== "success" && status !== "error"
  const isSuccess = status === "success" || showSuccess
  const isError = status === "error"

  const stateColorClass = isSuccess
    ? "bg-success"
    : isError
      ? "bg-danger"
      : isIdle
        ? "bg-muted-foreground"
        : "bg-primary"

  const glowColorClass = isSuccess
    ? "bg-success/15"
    : isError
      ? "bg-danger/15"
      : isIdle
        ? "bg-muted"
        : "bg-primary/20"

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-surface p-4 sm:p-5 shadow-sm transition-all duration-300",
        "animate-in fade-in slide-in-from-bottom-3",
        status === "cancelled" ? "border-dashed opacity-70" : "border-border",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      {/* Background Subtle Glow & Grid */}
      <div className={cn("absolute -top-10 -left-10 size-40 blur-3xl rounded-full opacity-60 pointer-events-none transition-colors duration-500", glowColorClass)} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.05]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "16px 16px" }} />

      <div className="relative flex items-start gap-4">
        {/* Left: Icon */}
        <div className={cn("size-10 sm:size-12 shrink-0 flex items-center justify-center rounded-full text-white shadow-sm transition-colors duration-500", stateColorClass)}>
          {isSuccess ? <CheckCircle2 className="size-5 sm:size-6" strokeWidth={2.5} /> : isError ? <AlertTriangle className="size-5 sm:size-6" strokeWidth={2} /> : <UploadCloud className="size-5 sm:size-6" strokeWidth={2.5} />}
        </div>

        {/* Right: Content */}
        <div className="flex-1 min-w-0 pt-0.5">

          {/* Header row: Title and Close */}
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13px] sm:text-sm font-semibold text-foreground truncate">
              {isSuccess ? "Subido" : isError ? "Error" : "Subiendo"}{" "}
              <span className="text-primary font-medium">"{file.name}"</span>
            </p>
            {!disabled && (
              <button
                type="button"
                onClick={status === "uploading" ? onCancel : onRemove}
                aria-label={status === "uploading" ? "Cancelar carga" : "Eliminar archivo"}
                className="shrink-0 p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors -mt-1.5 -mr-1.5"
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Message */}
          <p className="text-[13px] text-muted-foreground mt-0.5">
            {isSuccess
              ? "¡Subido con éxito!"
              : isError
                ? "Ha ocurrido un error al intentar subir."
                : isIdle
                  ? "Por favor, espera mientras nos preparamos."
                  : "Por favor, espera mientras subimos tu archivo."}
          </p>

          {/* Progress Bar */}
          {(status === "uploading" || isSuccess || status === "queued") && (
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mt-4">
              <div
                className={cn("h-full rounded-full transition-all duration-300 ease-out", isSuccess ? "bg-success" : "bg-primary")}
                style={{ width: `${isSuccess ? 100 : Math.min(Math.max(progress, 0), 100)}%` }}
              />
            </div>
          )}

          {/* Footer row: Percentage and Actions */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">
              {isSuccess ? "100%" : Math.round(progress)}% subido{isSuccess ? "!" : "..."}
            </span>

            {/* Actions */}
            {!disabled && status !== "success" && (
              <div className="flex items-center gap-3 sm:gap-4">
                {status === "uploading" && (
                  <button type="button" onClick={onCancel} className="text-[11px] sm:text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                    Cancelar
                  </button>
                )}
                {isError && (
                  <button type="button" onClick={onRetry} className="text-[11px] sm:text-xs font-semibold text-danger hover:text-danger-600 transition-colors">
                    Reintentar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
// ─── DropZone ──────────────────────────────────────────────────────────────

interface DropZoneProps {
  inputRef: React.RefObject<HTMLInputElement | null>
  disabled?: boolean
  multiple?: boolean
  accept?: string
  allowedFormats?: string
  maxSizeMB?: number
  maxFiles?: number
  isDragging: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onClick: () => void
}

function DropZone({
  inputRef,
  disabled,
  multiple,
  accept,
  allowedFormats = "PDF, Word, Excel, CSV, imágenes, videos y archivos geoespaciales",
  maxSizeMB = 20,
  maxFiles = 10,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: DropZoneProps) {
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Zona de carga de archivos. Arrastra un archivo o presiona Enter para seleccionar."
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          onClick()
        }
      }}
      className={cn(
        "relative w-full rounded-[2rem] border-2 transition-all duration-500 outline-none overflow-hidden",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "flex flex-col items-center justify-center gap-6 text-center",
        "py-16 px-6",
        isDragging
          ? "border-primary bg-primary/[0.08] shadow-[0_0_40px_-10px_var(--color-primary)] scale-[1.02]"
          : "border-border/60 border-dashed bg-gradient-to-b from-primary/5 to-surface hover:border-primary/60 hover:border-solid hover:shadow-[0_0_40px_-15px_var(--color-primary)] hover:bg-primary/[0.02] shadow-sm",
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer group"
      )}
    >
      {/* Structured Dot Pattern Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.08] transition-opacity duration-500"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1.5px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Dynamic Background Glow */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-72 rounded-full blur-[80px] pointer-events-none transition-all duration-700 ease-out",
        isDragging ? "bg-primary/40 scale-150" : "bg-primary/10 group-hover:bg-primary/30 group-hover:scale-125"
      )} />

      {/* Central Icon */}
      <div className="relative z-10 flex items-center justify-center mt-2">
        {/* Pulsing ring on hover/drag */}
        <div className={cn(
          "absolute inset-0 rounded-full border border-primary transition-all duration-700",
          isDragging ? "animate-ping opacity-60 scale-150" : "opacity-0 group-hover:animate-ping group-hover:opacity-30 group-hover:scale-150"
        )} />

        <div
          className={cn(
            "relative flex items-center justify-center rounded-full transition-all duration-500",
            "size-20 border-2",
            isDragging
              ? "bg-primary text-primary-foreground border-primary scale-110 shadow-primary/30 shadow-lg"
              : "bg-background text-primary border-primary/20 shadow-sm group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/25"
          )}
        >
          <ArrowUp
            className={cn(
              "size-8 transition-all duration-300",
              isDragging ? "animate-bounce" : "group-hover:-translate-y-1"
            )}
            strokeWidth={2.5}
          />
        </div>
      </div>

      {/* Hero Text */}
      <div className="space-y-1 z-10 max-w-md mt-2">
        <p className={cn(
          "text-sm font-medium tracking-tight transition-colors",
          isDragging ? "text-primary" : "text-foreground/80"
        )}>
          {isDragging ? "¡Suéltalos aquí mismo!" : "Arrastra y suelta tus archivos aquí, o"}
        </p>
      </div>

      {/* Button */}
      {!isDragging && (
        <div className="z-10 flex flex-col items-center gap-3">
          <Button
            type="button"
            variant="primary"
            className="rounded-full px-8 py-5 text-base font-semibold shadow-md"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation()
              if (!disabled) onClick()
            }}
            tabIndex={-1}
          >
            {multiple ? "Seleccionar Archivos" : "Seleccionar Archivo"}
          </Button>

          <p className="text-[11px] text-muted-foreground font-medium mt-1">
            Soporta imágenes, documentos y más • Máx. {maxSizeMB} MB
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Main FileUpload ───────────────────────────────────────────────────────

export function FileUpload({
  label,
  accept,
  maxSizeMB = 20,
  maxFiles = 10,
  multiple = false,
  disabled = false,
  required = false,
  className,
  allowedFormats = "PDF, Word, Excel, CSV, imágenes, videos y archivos geoespaciales",
  items = [],
  onFileSelect,
  onRemove,
  onRetry,
  onCancel,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const handleFiles = (files: FileList | null) => {
    if (!files || !onFileSelect) return
    onFileSelect(Array.from(files).slice(0, maxFiles))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    handleFiles(e.dataTransfer.files)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    if (e.target) e.target.value = ""
  }

  return (
    <div className={cn("flex flex-col gap-3 w-full text-left", className)}>
      {label && (
        <label className={cn("text-sm font-semibold text-foreground", disabled && "opacity-50")}>
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
        aria-hidden="true"
      />

      <DropZone
        inputRef={inputRef}
        disabled={disabled}
        multiple={multiple}
        accept={accept}
        allowedFormats={allowedFormats}
        maxSizeMB={maxSizeMB}
        maxFiles={maxFiles}
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      />

      {items.length > 0 && (
        <div className="space-y-3 mt-2">
          {/* Resumen superior estilo gestor documental */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pb-1 border-b border-border/40">
            <span className="font-semibold text-foreground">
              Archivos seleccionados ({items.length}/{maxFiles})
            </span>
            <div className="flex items-center gap-3">
              <span>
                {(items.reduce((acc, i) => acc + i.file.size, 0) / (1024 * 1024)).toFixed(1)} MB en total
              </span>
              <span>•</span>
              <span>
                {items.filter(i => i.status === "success").length} completados
              </span>
              {items.some(i => i.status === "uploading") && (
                <>
                  <span>•</span>
                  <span className="text-primary font-medium">
                    {items.filter(i => i.status === "uploading").length} cargando
                  </span>
                </>
              )}
            </div>
          </div>

          <div
            role="list"
            aria-label="Archivos cargados"
            className="space-y-2"
          >
            {items.map((item) => (
              <FileItem
                key={item.id}
                item={item}
                disabled={disabled}
                onRemove={() => onRemove?.(item.id)}
                onRetry={() => onRetry?.(item.id)}
                onCancel={() => onCancel?.(item.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const FileUploadAdvanced = FileUpload
