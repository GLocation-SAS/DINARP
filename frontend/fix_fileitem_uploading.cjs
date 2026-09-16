const fs = require('fs');
let content = fs.readFileSync('src/components/ui/file-input.tsx', 'utf8');

const oldFileItem = `function FileItem({ item, disabled, onRemove, onRetry, onCancel }: { item: FileItemData; disabled?: boolean; onRemove: () => void; onRetry: () => void; onCancel: () => void }) {
  const { file, status, progress = 0 } = item
  const fileType = getFileType(file)
  
  const isUploading = status === "uploading"
  const isError = status === "error"
  const isSuccess = status === "success"

  return (
    <div
      className={cn(
        "relative flex items-center justify-between p-2.5 rounded-lg border transition-all group overflow-hidden",
        isError ? "border-danger/30 bg-background" : 
        isSuccess ? "border-transparent bg-gradient-to-r from-success/90 to-primary/90 shadow-sm" : "border-border/50 bg-background",
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
          className={cn("px-2 py-0.5 text-[11px] font-bold uppercase rounded-md shrink-0 w-11 justify-center", isSuccess && "!bg-white/25 !text-white")}
        >
          {fileType.label}
        </Badge>
        
        {/* File Name */}
        <span className={cn("text-[13px] font-medium truncate max-w-[200px] sm:max-w-[300px]", isSuccess ? "text-white" : "text-foreground")}>
          {file.name}
        </span>
      </div>

      <div className="relative z-10 flex items-center gap-3 shrink-0 ml-4">
        {/* File Size */}
        <span className={cn("text-[11px] font-semibold tabular-nums uppercase", isSuccess ? "text-white/90" : "text-muted-foreground")}>
          {formatBytes(file.size, 0)}
        </span>

        {/* Action Button */}
        {!disabled && (
          <button
            type="button"
            onClick={isUploading ? onCancel : onRemove}
            className={cn("transition-colors p-1 rounded-md", isSuccess ? "text-white/80 hover:text-white hover:bg-white/20" : "text-muted-foreground hover:text-foreground hover:bg-muted")}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}`;

const newFileItem = `function FileItem({ item, disabled, onRemove, onRetry, onCancel }: { item: FileItemData; disabled?: boolean; onRemove: () => void; onRetry: () => void; onCancel: () => void }) {
  const { file, status, progress = 0 } = item
  const fileType = getFileType(file)
  
  const isUploading = status === "uploading"
  const isError = status === "error"
  const isSuccess = status === "success"

  return (
    <div
      className={cn(
        "relative flex items-center justify-between p-2.5 rounded-lg border transition-all group overflow-hidden",
        isError ? "border-danger/30 bg-background" : "border-border/50 bg-background",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      {/* Uploading Progress Background */}
      {isUploading && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-success/90 to-primary/90 transition-all duration-300 ease-out z-0"
          style={{ width: \`\${progress}%\` }}
        />
      )}

      <div className="relative z-10 flex items-center gap-3 min-w-0 flex-1">
        {/* Extension Badge */}
        <Badge 
          tone={fileType.badgeTone} 
          appearance="soft" 
          className={cn("px-2 py-0.5 text-[11px] font-bold uppercase rounded-md shrink-0 w-11 justify-center", isUploading && progress > 10 && "!bg-white/25 !text-white")}
        >
          {fileType.label}
        </Badge>
        
        {/* File Name */}
        <span className={cn("text-[13px] font-medium truncate max-w-[200px] sm:max-w-[300px]", isUploading && progress > 30 ? "text-white mix-blend-difference" : "text-foreground")}>
          {file.name}
        </span>
      </div>

      <div className="relative z-10 flex items-center gap-3 shrink-0 ml-4">
        {/* File Size */}
        <span className={cn("text-[11px] font-semibold tabular-nums uppercase", isUploading && progress > 80 ? "text-white/90" : "text-muted-foreground")}>
          {formatBytes(file.size, 0)}
        </span>

        {/* Action Button */}
        {!disabled && (
          <button
            type="button"
            onClick={isUploading ? onCancel : onRemove}
            className={cn("transition-colors p-1 rounded-md", isUploading && progress > 90 ? "text-white/80 hover:text-white hover:bg-white/20" : "text-muted-foreground hover:text-foreground hover:bg-muted")}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}`;

content = content.replace(oldFileItem, newFileItem);

fs.writeFileSync('src/components/ui/file-input.tsx', content, 'utf8');
