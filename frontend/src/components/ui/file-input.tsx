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
  FileUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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

interface FileTypeDef {
  label: string
  badgeTone: "primary" | "secondary" | "danger" | "success" | "warning" | "info" | "neutral"
}

const EXT_MAP: Record<string, FileTypeDef> = {
  pdf: { label: ".pdf", badgeTone: "danger" },
  doc: { label: ".doc", badgeTone: "info" },
  docx: { label: ".docx", badgeTone: "info" },
  xls: { label: ".xls", badgeTone: "success" },
  xlsx: { label: ".xlsx", badgeTone: "success" },
  csv: { label: ".csv", badgeTone: "success" },
  ppt: { label: ".ppt", badgeTone: "warning" },
  pptx: { label: ".pptx", badgeTone: "warning" },
  jpg: { label: ".jpg", badgeTone: "secondary" },
  jpeg: { label: ".jpeg", badgeTone: "secondary" },
  png: { label: ".png", badgeTone: "secondary" },
  gif: { label: ".gif", badgeTone: "success" },
  webp: { label: ".webp", badgeTone: "secondary" },
  mp4: { label: ".mp4", badgeTone: "secondary" },
  mp3: { label: ".mp3", badgeTone: "warning" },
  zip: { label: ".zip", badgeTone: "warning" },
  rar: { label: ".rar", badgeTone: "warning" },
  geojson: { label: ".json", badgeTone: "success" },
  txt: { label: ".txt", badgeTone: "neutral" },
  json: { label: ".json", badgeTone: "primary" },
  ai: { label: ".ai", badgeTone: "warning" },
  psd: { label: ".psd", badgeTone: "secondary" },
}

const DEFAULT_TYPE: FileTypeDef = {
  label: ".file",
  badgeTone: "neutral",
}

function getFileType(file: File): FileTypeDef {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
  return EXT_MAP[ext] ?? { label: "." + ext, badgeTone: "neutral" }
}

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

function FileItem({ item, disabled, onRemove, onRetry, onCancel }: { item: FileItemData; disabled?: boolean; onRemove: () => void; onRetry: () => void; onCancel: () => void }) {
  const { file, status, progress = 0, errorType } = item
  const fileType = getFileType(file)
  
  const isUploading = status === "uploading"
  const isError = status === "error"
  const isSuccess = status === "success"

  return (
    <div
      className={cn(
        "relative flex items-center justify-between p-2.5 rounded-lg border transition-all group overflow-hidden",
        isError ? "border-danger/40 bg-danger/5" : "border-border/50 bg-background",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      {/* Uploading Progress Background */}
      {isUploading && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-success/90 to-primary/90 transition-all duration-300 ease-out z-0"
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="relative z-10 flex items-center gap-3 min-w-0 flex-1">
        {/* Extension Badge */}
        {isError ? (
          <div className="size-6 shrink-0 rounded-full bg-danger/10 text-danger flex items-center justify-center">
            <AlertTriangle className="size-3.5" strokeWidth={2.5} />
          </div>
        ) : (
          <Badge 
            tone={fileType.badgeTone} 
            appearance="soft" 
            className={cn("px-2 py-0.5 text-[11px] font-bold uppercase rounded-md shrink-0 w-11 justify-center", isUploading && progress > 10 && "!bg-white/25 !text-white")}
          >
            {fileType.label}
          </Badge>
        )}
        
        {/* File Name & Error Message */}
        <div className="flex flex-col min-w-0">
          <span className={cn(
            "text-[13px] font-medium truncate max-w-[200px] sm:max-w-[300px]", 
            isUploading && progress > 30 ? "text-white mix-blend-difference" : isError ? "text-danger-700 dark:text-danger-400" : "text-foreground"
          )}>
            {file.name}
          </span>
          {isError && (
            <span className="text-[11px] font-medium text-danger-600 dark:text-danger-400 truncate">
              {errorType === "format" ? "Formato no permitido" : 
               errorType === "size" ? "Supera el límite de peso" : 
               "Error al cargar archivo"}
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-2 shrink-0 ml-4">
        {/* File Size (Hidden if error to make room for buttons) */}
        {!isError && (
          <span className={cn("text-[11px] font-semibold tabular-nums uppercase mr-1", isUploading && progress > 80 ? "text-white/90" : "text-muted-foreground")}>
            {formatBytes(file.size, 0)}
          </span>
        )}

        {/* Action Buttons */}
        {!disabled && (
          <div className="flex items-center gap-1">
            {isError && (
              <button
                type="button"
                onClick={onRetry}
                className="text-danger hover:text-white hover:bg-danger p-1.5 rounded-md transition-colors"
                title="Reintentar"
              >
                <RefreshCw className="size-3.5" strokeWidth={2.5} />
              </button>
            )}
            <button
              type="button"
              onClick={isUploading ? onCancel : onRemove}
              className={cn(
                "transition-colors p-1.5 rounded-md", 
                isUploading && progress > 90 ? "text-white/80 hover:text-white hover:bg-white/20" : 
                isError ? "text-danger-700/70 hover:text-danger hover:bg-danger/10" : 
                "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              title={isUploading ? "Cancelar" : "Eliminar"}
            >
              <X className="size-3.5" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function DropZone({
  inputRef,
  disabled,
  multiple,
  accept,
  allowedFormats,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: any) {
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
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
        "group relative w-full rounded-2xl transition-all duration-500 outline-none overflow-hidden cursor-pointer",
        "flex flex-col items-center justify-center gap-5 text-center",
        "py-12 px-6 sm:py-16 sm:px-8",
        "border-2 border-dashed",
        isDragging 
          ? "border-primary bg-primary/5 scale-[1.02] shadow-[0_0_30px_-5px_var(--color-primary)]" 
          : "border-border/60 bg-gradient-to-br from-background via-surface to-muted/20 hover:border-primary/40 hover:bg-primary/[0.03]",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      {/* 1. Pulsing inner border ring on hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/0 group-hover:ring-primary/60 group-hover:animate-pulse transition-all duration-700 pointer-events-none z-0" />

      {/* 2. Bottom glowing gradient on hover */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-primary/15 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

      {/* Dynamic Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.08] transition-opacity duration-500 z-0" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1.5px, transparent 0)', backgroundSize: '24px 24px' }} 
      />

      {/* Floating Icon Graphic */}
      <div className="relative flex items-center justify-center size-24 z-10">
        <div className={cn(
          "absolute inset-0 rounded-full blur-2xl transition-all duration-700 ease-out pointer-events-none",
          isDragging ? "bg-primary/40 scale-150" : "bg-primary/20 group-hover:bg-primary/30 group-hover:scale-125"
        )} />
        
        <div className={cn(
          "absolute inset-0 rounded-full border border-primary transition-all duration-700 pointer-events-none",
          isDragging ? "animate-ping opacity-60 scale-150" : "opacity-0"
        )} />

        <div className={cn(
          "relative flex items-center justify-center size-16 rounded-full transition-all duration-500 border-2",
          isDragging 
            ? "bg-primary border-primary text-primary-foreground scale-110 shadow-primary/30 shadow-lg" 
            : "bg-surface border-primary/20 text-primary shadow-sm group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground group-hover:-translate-y-2 group-hover:shadow-lg group-hover:shadow-primary/25"
        )}>
          <FileUp className={cn("size-7 transition-all duration-300", isDragging ? "animate-bounce" : "")} strokeWidth={2.5} />
        </div>
      </div>

      <div className="space-y-1.5 z-10 mt-2">
        <h4 className={cn("text-[17px] font-bold transition-colors duration-300", isDragging ? "text-primary" : "text-foreground")}>
          {isDragging ? "¡Suelta para cargar!" : "Arrastra y suelta aquí, o"}
        </h4>
        <p className="text-[13px] text-muted-foreground font-medium max-w-sm mx-auto">
          {allowedFormats || "Soporta imágenes, documentos y archivos comprimidos."}
        </p>
      </div>

      {/* Action Button (shown when not dragging) */}
      {!isDragging && (
        <div className="z-10 mt-3 transition-all duration-500 group-hover:scale-105">
          <Button 
            type="button" 
            variant="primary" 
            className="rounded-full px-8 font-semibold shadow-md pointer-events-none"
            tabIndex={-1}
          >
            Seleccionar archivo
          </Button>
        </div>
      )}

      {/* Badges Ribbon */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
        <Badge tone="secondary" appearance="outline" size="sm">.jpeg</Badge>
        <Badge tone="primary" appearance="outline" size="sm">.png</Badge>
        <Badge tone="success" appearance="outline" size="sm">.csv</Badge>
        <Badge tone="danger" appearance="outline" size="sm">.pdf</Badge>
        <Badge tone="info" appearance="outline" size="sm">.mp4</Badge>
      </div>
    </div>
  )
}

export function FileUpload({
  label,
  accept,
  maxSizeMB = 20,
  maxFiles = 10,
  multiple = false,
  disabled = false,
  required = false,
  className,
  allowedFormats,
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

  const uploadingItems = items.filter(i => i.status === "uploading")
  const uploadedItems = items.filter(i => i.status === "success" || i.status === "idle" || i.status === "error")

  return (
    <div className={cn("flex flex-col xl:flex-row gap-6 w-full items-start", className)}>
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

      {/* Left Side: Dropzone */}
      <div className="flex-1 w-full max-w-2xl shrink-0">
        {label && (
          <label className={cn("text-sm font-semibold text-foreground block mb-2", disabled && "opacity-50")}>
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <DropZone
          inputRef={inputRef}
          disabled={disabled}
          multiple={multiple}
          accept={accept}
          allowedFormats={allowedFormats}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        />
      </div>

      {/* Right Side: Files List */}
      {(uploadingItems.length > 0 || uploadedItems.length > 0) && (
        <div className="w-full xl:w-[350px] shrink-0 flex flex-col gap-6 bg-surface border border-border/40 p-4 sm:p-5 rounded-xl shadow-sm">
          <div>
            <h5 className="text-[15px] font-bold text-foreground mb-1">Archivos</h5>
          </div>

          {uploadingItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-[12px] font-medium text-muted-foreground mb-3">
                Subiendo - {uploadingItems.length} archivos
              </p>
              <div className="space-y-2">
                {uploadingItems.map(item => (
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

          {uploadedItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-[12px] font-medium text-muted-foreground mb-3">
                Completados - {uploadedItems.length} archivos
              </p>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {uploadedItems.map(item => (
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
      )}
    </div>
  )
}

export const FileUploadAdvanced = FileUpload
