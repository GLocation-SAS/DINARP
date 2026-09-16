const fs = require('fs');

// ---------------------------------------------------------
// 1. ALERT COMPONENT (Image 1: Left border, pale background, right action button)
// ---------------------------------------------------------
let alertContent = `"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-r-xl rounded-l-none border border-border/30 border-l-[4px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition-all",
  {
    variants: {
      variant: {
        default: "bg-surface border-l-border text-foreground [&_.alert-icon]:text-foreground [&_.alert-action]:text-foreground [&_.alert-action]:border-border",
        info: "bg-background border-l-info text-info-700 dark:text-info-300 [&_.alert-icon]:text-info [&_.alert-action]:text-info [&_.alert-action]:border-info/30 hover:[&_.alert-action]:bg-info/10",
        success: "bg-success/10 border-l-success text-success-700 dark:text-success-300 [&_.alert-icon]:text-success [&_.alert-action]:text-success [&_.alert-action]:border-success/30 hover:[&_.alert-action]:bg-success/10",
        warning: "bg-warning/10 border-l-warning text-warning-700 dark:text-warning-300 [&_.alert-icon]:text-warning-600 dark:[&_.alert-icon]:text-warning-400 [&_.alert-action]:text-warning-700 dark:[&_.alert-action]:text-warning-400 [&_.alert-action]:border-warning/30 hover:[&_.alert-action]:bg-warning/10",
        danger: "bg-danger/10 border-l-danger text-danger-700 dark:text-danger-300 [&_.alert-icon]:text-danger [&_.alert-action]:text-danger [&_.alert-action]:border-danger/30 hover:[&_.alert-action]:bg-danger/10",
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
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, title, children, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
          {icon && (
            <div className="alert-icon shrink-0 size-6 flex items-center justify-center [&_svg]:size-5">
              {icon}
            </div>
          )}
          <div className="flex-1 flex flex-col gap-0.5 text-left">
            {title && <h5 className="font-bold text-[15px] leading-tight tracking-tight">{title}</h5>}
            <div className="text-[14px] opacity-90 leading-snug">{children}</div>
          </div>
        </div>

        {action && (
          <div className="shrink-0 sm:ml-4 w-full sm:w-auto flex justify-end mt-2 sm:mt-0">
            <button className="alert-action px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors bg-transparent">
              {action}
            </button>
          </div>
        )}
      </div>
    )
  }
)
Alert.displayName = "Alert"

export { Alert, alertVariants }
`;
fs.writeFileSync('src/components/ui/alert.tsx', alertContent, 'utf8');

// ---------------------------------------------------------
// 2. TOAST COMPONENT (Image 2: Pill shape, circular icon bg, description only)
// ---------------------------------------------------------
let sonnerContent = fs.readFileSync('src/components/ui/sonner.tsx', 'utf8');

// Replace solid icons with circular background icons
sonnerContent = sonnerContent.replace(
  /<div className="flex items-center justify-center shrink-0"><CircleCheckIcon className="size-8 text-card fill-success" \/><\/div>/g,
  '<div className="flex items-center justify-center shrink-0 size-10 rounded-full bg-success/15 text-success"><CircleCheckIcon className="size-5 stroke-[2.5px]" /></div>'
);
sonnerContent = sonnerContent.replace(
  /<div className="flex items-center justify-center shrink-0"><InfoIcon className="size-8 text-card fill-info-600" \/><\/div>/g,
  '<div className="flex items-center justify-center shrink-0 size-10 rounded-full bg-info/15 text-info"><InfoIcon className="size-5 stroke-[2.5px]" /></div>'
);
sonnerContent = sonnerContent.replace(
  /<div className="flex items-center justify-center shrink-0"><TriangleAlertIcon className="size-8 text-card fill-warning-500" \/><\/div>/g,
  '<div className="flex items-center justify-center shrink-0 size-10 rounded-full bg-warning/15 text-warning"><TriangleAlertIcon className="size-5 stroke-[2.5px]" /></div>'
);
sonnerContent = sonnerContent.replace(
  /<div className="flex items-center justify-center shrink-0"><OctagonXIcon className="size-8 text-card fill-danger" \/><\/div>/g,
  '<div className="flex items-center justify-center shrink-0 size-10 rounded-full bg-danger/15 text-danger"><OctagonXIcon className="size-5 stroke-[2.5px]" /></div>'
);

fs.writeFileSync('src/components/ui/sonner.tsx', sonnerContent, 'utf8');

// ---------------------------------------------------------
// 3. SHOWCASES UPDATE
// ---------------------------------------------------------

// Fix Toast explicit icons to use circular background
let toastShowcase = fs.readFileSync('src/modules/uikit/components/toast-showcase.tsx', 'utf8');
toastShowcase = toastShowcase.replace(
  /<div className="flex items-center justify-center shrink-0"><BellIcon className="size-8 text-card fill-primary" \/><\/div>/g,
  '<div className="flex items-center justify-center shrink-0 size-10 rounded-full bg-primary/15 text-primary"><BellIcon className="size-5 stroke-[2.5px]" /></div>'
);
toastShowcase = toastShowcase.replace(
  /<div className="flex items-center justify-center shrink-0"><TimerIcon className="size-8 text-card fill-primary" \/><\/div>/g,
  '<div className="flex items-center justify-center shrink-0 size-10 rounded-full bg-primary/15 text-primary"><TimerIcon className="size-5 stroke-[2.5px]" /></div>'
);
fs.writeFileSync('src/modules/uikit/components/toast-showcase.tsx', toastShowcase, 'utf8');

// Add actions back to Alert showcase to match Image 1
let alertShowcase = fs.readFileSync('src/modules/uikit/components/feedback-states-showcase.tsx', 'utf8');

alertShowcase = alertShowcase.replace(
  /<Alert variant="info" icon=\{<Info className="h-6 w-6" \/>\} title="37 Nuevas Reseñas">\s*Se han encontrado nuevas reseñas en su feed\.\s*<\/Alert>/g,
  '<Alert variant="info" icon={<Info className="h-5 w-5" />} title="Heads up!" action="Dismiss">\n              Everything seems to be in order.\n            </Alert>'
);

alertShowcase = alertShowcase.replace(
  /<Alert variant="success" icon=\{<CheckCircle2 className="h-6 w-6" \/>\} title="¡Éxito!">\s*Sus cambios han sido guardados exitosamente\.\s*<\/Alert>/g,
  '<Alert variant="success" icon={<CheckCircle2 className="h-5 w-5" />} title="Success!" action="Close">\n              Your changes have been saved successfully!\n            </Alert>'
);

alertShowcase = alertShowcase.replace(
  /<Alert variant="danger" icon=\{<XCircle className="h-6 w-6" \/>\} title="¡Error!">\s*Hubo un problema procesando su solicitud\.\s*<\/Alert>/g,
  '<Alert variant="danger" icon={<XCircle className="h-5 w-5" />} title="Error!" action="Retry">\n              There was a problem processing your request!\n            </Alert>'
);

alertShowcase = alertShowcase.replace(
  /<Alert variant="warning" icon=\{<AlertTriangle className="h-6 w-6" \/>\} title="¡Advertencia!">\s*Su cuenta está a punto de expirar\. Por favor renueve su suscripción\.\s*<\/Alert>/g,
  '<Alert variant="warning" icon={<AlertTriangle className="h-5 w-5" />} title="Warning!" action="Renew Now">\n              Your account is about to expire. Please renew your subscription.\n            </Alert>'
);

// Remove the default one since image 1 only has 4
alertShowcase = alertShowcase.replace(
  /<Alert icon=\{<Info className="h-6 w-6" \/>\} title="¡Atención!">\s*Todo parece estar en orden con sus configuraciones\.\s*<\/Alert>/g,
  ''
);

fs.writeFileSync('src/modules/uikit/components/feedback-states-showcase.tsx', alertShowcase, 'utf8');

