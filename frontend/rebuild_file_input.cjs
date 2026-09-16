const fs = require('fs');

const content = `"use client"

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
  return \`\${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} \${sizes[i]}\`
}

function FileItem({ item, disabled, onRemove, onRetry, onCancel }: { item: FileItemData; disabled?: boolean; onRemove: () => void; onRetry: () => void; onCancel: () => void }) {
  const { file, status, progress = 0 } = item
  const fileType = getFileType(file)
  
  const isUploading = status === "uploading"
  const isError = status === "error"
  const isSuccess = status === "success"

  return (
    <div
      className={cn(
        "relative flex items-center justify-between p-2.5 rounded-lg border bg-background transition-all group overflow-hidden",
        isError ? "border-danger/30" : "border-border/50",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      {/* Uploading Progress Background */}
      {isUploading && (
        <div 
          className="absolute inset-0 bg-primary/10 transition-all duration-300 ease-out z-0"
          style={{ width: \`\${progress}%\` }}
        />
      )}

      <div className="relative z-10 flex items-center gap-3 min-w-0 flex-1">
        {/* Extension Badge */}
        <Badge 
          tone={fileType.badgeTone} 
          appearance="soft" 
          className="px-2 py-0.5 text-[11px] font-bold uppercase rounded-md shrink-0 w-11 justify-center"
        >
          {fileType.label}
        </Badge>
        
        {/* File Name */}
        <span className="text-[13px] font-medium text-foreground truncate max-w-[200px] sm:max-w-[300px]">
          {file.name}
        </span>
      </div>

      <div className="relative z-10 flex items-center gap-3 shrink-0 ml-4">
        {/* File Size */}
        <span className="text-[11px] text-muted-foreground font-semibold tabular-nums uppercase">
          {formatBytes(file.size, 0)}
        </span>

        {/* Action Button */}
        {!disabled && (
          <button
            type="button"
            onClick={isUploading ? onCancel : onRemove}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="size-3.5" />
          </button>
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
        "relative w-full rounded-xl transition-all duration-500 outline-none overflow-hidden cursor-pointer",
        "flex flex-col items-center justify-center gap-4 text-center",
        "py-10 px-6 sm:py-14 sm:px-8",
        "bg-gradient-to-br from-background via-background to-muted/20 border border-border border-dashed",
        isDragging && "border-primary bg-primary/[0.02]",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      {/* Icon Graphic */}
      <div className="relative flex items-center justify-center size-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-info/20 blur-xl opacity-60" />
        <div className="relative flex items-center justify-center size-14 rounded-full bg-gradient-to-tr from-primary/10 to-info/10 shadow-sm border border-border/50 text-primary">
          <FileUp className="size-6" strokeWidth={2} />
        </div>
      </div>

      <div className="space-y-1 z-10">
        <h4 className="text-lg font-bold text-foreground">
          {isDragging ? "Suelta los archivos aquí" : "Arrastra y suelta archivos"}
        </h4>
        <p className="text-sm text-muted-foreground">
          Formatos soportados
        </p>
      </div>

      {/* Badges Ribbon */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-2 z-10">
        <Badge tone="info" appearance="soft" className="rounded-sm px-2 text-[11px] uppercase font-bold">.jpeg</Badge>
        <Badge tone="primary" appearance="soft" className="rounded-sm px-2 text-[11px] uppercase font-bold">.png</Badge>
        <Badge tone="success" appearance="soft" className="rounded-sm px-2 text-[11px] uppercase font-bold">.gif</Badge>
        <Badge tone="danger" appearance="soft" className="rounded-sm px-2 text-[11px] uppercase font-bold">.pdf</Badge>
        <Badge tone="secondary" appearance="soft" className="rounded-sm px-2 text-[11px] uppercase font-bold">.psd</Badge>
        <Badge tone="warning" appearance="soft" className="rounded-sm px-2 text-[11px] uppercase font-bold">.ai</Badge>
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
`;

fs.writeFileSync('src/components/ui/file-input.tsx', content, 'utf8');
