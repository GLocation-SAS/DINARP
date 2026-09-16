const fs = require('fs');
let content = fs.readFileSync('src/components/ui/file-input.tsx', 'utf8');

const oldDropZoneRegex = /function DropZone\(\{[^]*?return \([\s\S]*?className=\{cn\([\s\S]*?isDragging &&[^]*?<div className="flex flex-wrap items-center justify-center gap-2 mt-4 z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300">[\s\S]*?<\/div>\s*<\/div>\n  \)\n}/m;

const newDropZone = `function DropZone({
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
        <Badge tone="info" appearance="soft" className="rounded-md px-2 text-[10px] uppercase font-bold tracking-wider">.jpeg</Badge>
        <Badge tone="primary" appearance="soft" className="rounded-md px-2 text-[10px] uppercase font-bold tracking-wider">.png</Badge>
        <Badge tone="success" appearance="soft" className="rounded-md px-2 text-[10px] uppercase font-bold tracking-wider">.csv</Badge>
        <Badge tone="danger" appearance="soft" className="rounded-md px-2 text-[10px] uppercase font-bold tracking-wider">.pdf</Badge>
        <Badge tone="secondary" appearance="soft" className="rounded-md px-2 text-[10px] uppercase font-bold tracking-wider">.mp4</Badge>
      </div>
    </div>
  )
}`;

content = content.replace(oldDropZoneRegex, newDropZone);
fs.writeFileSync('src/components/ui/file-input.tsx', content, 'utf8');
