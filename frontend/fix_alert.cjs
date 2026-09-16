const fs = require('fs');

// 1. Update Alert Component
let alertContent = fs.readFileSync('src/components/ui/alert.tsx', 'utf8');

alertContent = alertContent.replace(
  /const alertVariants = cva\([\s\S]*?defaultVariants: \{\s*variant: "default",\s*\},\s*\}\s*\)/,
  `const alertVariants = cva(
  "relative w-full rounded-[2.5rem] border border-border/40 bg-card p-4 sm:p-5 flex items-center gap-4 shadow-sm transition-all overflow-hidden",
  {
    variants: {
      variant: {
        default: "[&_.alert-icon]:bg-primary/10 [&_.alert-icon]:text-primary [&_.alert-title]:text-foreground",
        info: "[&_.alert-icon]:bg-info/10 [&_.alert-icon]:text-info-700 dark:[&_.alert-icon]:text-info-400 [&_.alert-title]:text-info-700 dark:[&_.alert-title]:text-info-400",
        success: "[&_.alert-icon]:bg-success/10 [&_.alert-icon]:text-success-700 dark:[&_.alert-icon]:text-success-400 [&_.alert-title]:text-success-700 dark:[&_.alert-title]:text-success-400",
        warning: "[&_.alert-icon]:bg-warning/10 [&_.alert-icon]:text-warning-700 dark:[&_.alert-icon]:text-warning-400 [&_.alert-title]:text-warning-700 dark:[&_.alert-title]:text-warning-400",
        danger: "[&_.alert-icon]:bg-danger/10 [&_.alert-icon]:text-danger-700 dark:[&_.alert-icon]:text-danger-400 [&_.alert-title]:text-danger-700 dark:[&_.alert-title]:text-danger-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)`
);

alertContent = alertContent.replace(
  /export interface AlertProps[\s\S]*?onClose\?: \(\) => void\s*\}/,
  `export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
  VariantProps<typeof alertVariants> {
  icon?: React.ReactNode
  title?: React.ReactNode
}`
);

alertContent = alertContent.replace(
  /const Alert = React\.forwardRef<HTMLDivElement, AlertProps>\(\s*\(\{ className, variant, icon, title, children, action, onClose, \.\.\.props \}, ref\) => \{/,
  `const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, title, children, ...props }, ref) => {`
);

alertContent = alertContent.replace(
  /\{icon && \([\s\S]*?\{icon\}[\s\S]*?<\/div>[\s\S]*?\)\}/,
  `{icon && (
          <div className="alert-icon shrink-0 flex items-center justify-center size-12 rounded-full [&_svg]:size-6">
            {icon}
          </div>
        )}`
);

alertContent = alertContent.replace(/\{action && \([\s\S]*?\{action\}<\/div>\s*\)\}/, '');
alertContent = alertContent.replace(/\{onClose && \([\s\S]*?<\/button>\s*\)\}/, '');

fs.writeFileSync('src/components/ui/alert.tsx', alertContent, 'utf8');

// 2. Update Feedback Showcase (remove action and onClose from Alerts)
let showcaseContent = fs.readFileSync('src/modules/uikit/components/feedback-states-showcase.tsx', 'utf8');

showcaseContent = showcaseContent.replace(/ action="Cerrar"/g, '');
showcaseContent = showcaseContent.replace(/ action="Renovar ahora"/g, '');
showcaseContent = showcaseContent.replace(/ action="Reintentar"/g, '');
showcaseContent = showcaseContent.replace(/ action="Ignorar"/g, '');
showcaseContent = showcaseContent.replace(/ onClose=\{\(\) => \{\}\}/g, '');

fs.writeFileSync('src/modules/uikit/components/feedback-states-showcase.tsx', showcaseContent, 'utf8');

