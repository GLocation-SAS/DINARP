import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  status?: "neutral" | "success" | "warning" | "danger" | "info" | "primary";
  icon?: React.ReactNode;
  user?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("flex flex-col w-full", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const statusColor = getStatusColor(item.status);

        return (
          <div key={item.id} className={cn("relative flex gap-5 md:gap-6", !isLast && "pb-8")}>
            {/* Left column: Icon & Connecting Line */}
            <div className="relative flex flex-col items-center">
              <div className={cn(
                "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-border/80 bg-surface text-muted-foreground transition-colors",
                item.status && item.status !== "neutral" ? cn("border-solid", statusColor.border, statusColor.bg, statusColor.text) : ""
              )}>
                {item.icon ? (
                  <div className="flex items-center justify-center [&>svg]:size-5">{item.icon}</div>
                ) : (
                  <div className={cn("size-2.5 rounded-full", item.status ? "bg-current" : "bg-muted-foreground")} />
                )}
              </div>

              {!isLast && (
                <div className="absolute top-11 bottom-[-8px] left-1/2 w-px -translate-x-1/2 bg-border/80" />
              )}
            </div>

            {/* Right column: Content */}
            <div className="flex flex-col gap-1 flex-1 pt-1.5">
              <div className="flex flex-row justify-between items-start gap-4">
                <div className="flex flex-col gap-1">
                  <h4 className="font-semibold text-base text-foreground leading-none">{item.title}</h4>
                  {item.description && (
                    <p className="text-[15px] text-muted-foreground leading-snug">{item.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {item.status && (
                    <Badge tone={item.status} size="sm" appearance="soft" className="h-5 px-1.5 text-[10px]">
                      {item.status.toUpperCase()}
                    </Badge>
                  )}
                  <span className="text-[14px] text-muted-foreground whitespace-nowrap">{item.date}</span>
                </div>
              </div>

              {item.user && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="size-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase">
                    {item.user.substring(0, 2)}
                  </div>
                  <span className="text-sm font-medium text-foreground/80">{item.user}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getStatusColor(status?: TimelineItem["status"]) {
  switch (status) {
    case "success": return { bg: "bg-success/10", text: "text-success-700 dark:text-success-400", border: "border-success/30" };
    case "warning": return { bg: "bg-warning/10", text: "text-warning-700 dark:text-warning-400", border: "border-warning/30" };
    case "danger": return { bg: "bg-danger/10", text: "text-danger-700 dark:text-danger-400", border: "border-danger/30" };
    case "info": return { bg: "bg-info/10", text: "text-info-700 dark:text-info-400", border: "border-info/30" };
    case "primary": return { bg: "bg-primary/10", text: "text-primary-700 dark:text-primary-400", border: "border-primary/30" };
    default: return { bg: "bg-muted/50", text: "text-muted-foreground", border: "border-border" };
  }
}

