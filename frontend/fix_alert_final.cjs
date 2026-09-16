const fs = require('fs');

let alertContent = `"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-xl border border-border/60 bg-card p-4 sm:p-5 flex items-start gap-4 shadow-sm transition-all overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-l-border/80 [&_.alert-icon]:bg-primary [&_.alert-icon]:text-primary-foreground [&_.alert-title]:text-foreground",
        info: "border-l-info [&_.alert-icon]:bg-info [&_.alert-icon]:text-white [&_.alert-title]:text-info-700 dark:[&_.alert-title]:text-info-400",
        success: "border-l-success [&_.alert-icon]:bg-success [&_.alert-icon]:text-white [&_.alert-title]:text-success-700 dark:[&_.alert-title]:text-success-400",
        warning: "border-l-warning [&_.alert-icon]:bg-warning [&_.alert-icon]:text-white [&_.alert-title]:text-warning-700 dark:[&_.alert-title]:text-warning-400",
        danger: "border-l-danger [&_.alert-icon]:bg-danger [&_.alert-icon]:text-white [&_.alert-title]:text-danger-700 dark:[&_.alert-title]:text-danger-400",
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
  onClose?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, title, children, onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({ variant }), 
          onClose ? "pr-10" : "",
          "border-l-[4px]",
          className
        )}
        {...props}
      >
        {icon && (
          <div className="alert-icon shrink-0 flex items-center justify-center size-7 rounded-full [&_svg]:size-4 mt-0.5 shadow-sm">
            {icon}
          </div>
        )}
        <div className="flex-1 flex flex-col gap-1 text-left justify-center">
          {title && <h5 className="alert-title font-bold text-[15px] leading-none tracking-tight">{title}</h5>}
          <div className="text-[13.5px] text-muted-foreground leading-snug">{children}</div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-4" />
            <span className="sr-only">Cerrar</span>
          </button>
        )}
      </div>
    )
  }
)
Alert.displayName = "Alert"

export { Alert, alertVariants }
`;

fs.writeFileSync('src/components/ui/alert.tsx', alertContent, 'utf8');

let showcaseContent = fs.readFileSync('src/modules/uikit/components/feedback-states-showcase.tsx', 'utf8');

// The showcase might need onClose handlers if we want the X to show up to match the image exactly
showcaseContent = showcaseContent.replace(
  /<Alert variant="info" icon=\{<Info className="h-5 w-5" \/>\} title="Heads up!" action="Dismiss">/g,
  '<Alert variant="info" icon={<Info className="h-5 w-5" />} title="Did you know?" onClose={() => {}}>'
);

showcaseContent = showcaseContent.replace(
  /<Alert variant="warning" icon=\{<AlertTriangle className="h-5 w-5" \/>\} title="Warning!" action="Renew Now">/g,
  '<Alert variant="warning" icon={<AlertTriangle className="h-5 w-5" />} title="Uh oh, something went wrong" onClose={() => {}}>'
);

showcaseContent = showcaseContent.replace(
  /<Alert variant="success" icon=\{<CheckCircle2 className="h-5 w-5" \/>\} title="Success!" action="Close">/g,
  '<Alert variant="success" icon={<CheckCircle2 className="h-5 w-5" />} title="Yay! Everything worked!" onClose={() => {}}>'
);

showcaseContent = showcaseContent.replace(
  /<Alert variant="danger" icon=\{<XCircle className="h-5 w-5" \/>\} title="Error!" action="Retry">/g,
  '<Alert variant="danger" icon={<XCircle className="h-5 w-5" />} title="Error!" onClose={() => {}}>'
);

fs.writeFileSync('src/modules/uikit/components/feedback-states-showcase.tsx', showcaseContent, 'utf8');
