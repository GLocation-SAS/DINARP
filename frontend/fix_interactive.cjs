const fs = require('fs');

const content = fs.readFileSync('src/components/ui/data-display.tsx', 'utf8');

const replacement = `export interface InteractiveCardProps {
  title: string
  subtitle?: string
  description?: string
  icon?: React.ReactNode
  decorativeIcon?: React.ReactNode
  meta?: React.ReactNode
  color?: "default" | "primary" | "info" | "warning" | "success" | "danger" | "purple"
  href?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
  hideChevron?: boolean
}

const INTERACTIVE_COLORS: Record<string, string> = {
  default: "bg-surface border-border hover:bg-muted/50",
  primary: "bg-primary/10 border-primary/20 hover:bg-primary/15",
  secondary: "bg-secondary/10 border-secondary/20 hover:bg-secondary/15",
  info: "bg-info/10 border-info/20 hover:bg-info/15",
  warning: "bg-warning/10 border-warning/20 hover:bg-warning/15",
  success: "bg-success/10 border-success/20 hover:bg-success/15",
  danger: "bg-danger/10 border-danger/20 hover:bg-danger/15",
  purple: "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/15",
}

const INTERACTIVE_TITLE_COLORS: Record<string, string> = {
  default: "text-foreground",
  primary: "text-primary",
  secondary: "text-secondary",
  info: "text-info",
  warning: "text-warning",
  success: "text-success",
  danger: "text-danger",
  purple: "text-purple-600 dark:text-purple-400",
}

const INTERACTIVE_ICON_COLORS: Record<string, string> = {
  default: "text-foreground opacity-10 group-hover:opacity-20",
  primary: "text-primary opacity-20 group-hover:opacity-30",
  secondary: "text-secondary opacity-20 group-hover:opacity-30",
  info: "text-info opacity-20 group-hover:opacity-30",
  warning: "text-warning opacity-20 group-hover:opacity-30",
  success: "text-success opacity-20 group-hover:opacity-30",
  danger: "text-danger opacity-20 group-hover:opacity-30",
  purple: "text-purple-500 opacity-20 group-hover:opacity-30",
}

export function InteractiveCard({
  title, subtitle, description, icon, decorativeIcon, meta, color = "default", onClick, disabled, className, hideChevron
}: InteractiveCardProps) {
  const colorClass = INTERACTIVE_COLORS[color] || INTERACTIVE_COLORS.default;
  const titleColorClass = INTERACTIVE_TITLE_COLORS[color] || INTERACTIVE_TITLE_COLORS.default;
  const iconColorClass = INTERACTIVE_ICON_COLORS[color] || INTERACTIVE_ICON_COLORS.default;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group relative w-full text-left rounded-xl border shadow-sm transition-all duration-300 outline-none overflow-hidden min-h-[160px] p-5 flex flex-col items-start",
        "hover:shadow-md hover:-translate-y-0.5",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed hover:shadow-sm hover:translate-y-0",
        colorClass,
        className
      )}
    >
      {subtitle && (
        <Badge appearance="soft" tone={color === "default" || color === "purple" ? "neutral" : color} className="text-[10px] px-2 py-0.5 mb-2 shadow-none border-transparent font-semibold z-10">
          {subtitle}
        </Badge>
      )}

      {/* Decorative Icon */}
      {decorativeIcon && (
        <div className={cn("absolute -bottom-4 -right-4 size-32 pointer-events-none transition-all duration-500 z-0", iconColorClass)}>
          {decorativeIcon}
        </div>
      )}
      
      <div className="mt-auto relative z-10 w-full flex flex-col gap-1">
        <h3 className={cn("text-sm font-bold leading-tight transition-colors duration-300", titleColorClass)}>{title}</h3>
        {description && <p className="text-xs text-foreground/70">{description}</p>}
        {meta && <div className="mt-2">{meta}</div>}
      </div>
    </button>
  )
}`;

// We need to replace the old block from `export interface InteractiveCardProps {` up to `// 3. KPI CARD`
const regex = /export interface InteractiveCardProps \{[\s\S]*?\/\/ 3\. KPI CARD/;
const newContent = content.replace(regex, replacement + '\n\n  // 3. KPI CARD');

fs.writeFileSync('src/components/ui/data-display.tsx', newContent, 'utf8');
