"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-2xl border p-4 sm:p-5 flex items-start gap-4 transition-all shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-surface text-foreground border-border/80 [&_svg]:text-foreground",
        info: "border-info/30 text-info dark:border-info/50 bg-info/10 [&_svg]:text-info",
        success: "border-success/30 text-success dark:border-success/50 bg-success/10 [&_svg]:text-success",
        warning: "border-warning/30 text-warning dark:border-warning/50 bg-warning/10 [&_svg]:text-warning",
        danger: "border-danger/30 text-danger dark:border-danger/50 bg-danger/10 [&_svg]:text-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode
  title?: React.ReactNode
  action?: React.ReactNode
  onClose?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, title, children, action, onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon && (
          <div className="shrink-0 mt-0.5">
            {icon}
          </div>
        )}
        <div className="flex-1 flex flex-col gap-1.5">
          {title && <h5 className="font-bold leading-none tracking-tight">{title}</h5>}
          <div className="text-sm opacity-80 font-medium leading-relaxed">{children}</div>
          {action && <div className="mt-2">{action}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors text-inherit"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </button>
        )}
      </div>
    )
  }
)
Alert.displayName = "Alert"

export { Alert, alertVariants }
