import * as React from "react"
import { cn } from "@/lib/utils"

export interface DetailItem {
  label: string
  value: React.ReactNode
  colSpan?: 1 | 2
}

export interface DetailListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: DetailItem[]
  layout?: "vertical" | "horizontal" | "grid"
  columns?: 1 | 2 | 3 | 4
}

export function DetailList({
  items,
  layout = "grid",
  columns = 2,
  className,
  ...props
}: DetailListProps) {

  if (layout === "vertical") {
    return (
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.label}</span>
            <div className="text-sm font-medium text-foreground">{item.value || "-"}</div>
          </div>
        ))}
      </div>
    )
  }

  if (layout === "horizontal") {
    return (
      <div className={cn("flex flex-col gap-3", className)} {...props}>
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
            <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
            <div className="text-sm font-semibold text-foreground text-right">{item.value || "-"}</div>
          </div>
        ))}
      </div>
    )
  }

  // Grid layout
  return (
    <div
      className={cn(
        "grid gap-x-6 gap-y-4",
        columns === 1 ? "grid-cols-1" :
          columns === 2 ? "grid-cols-1 sm:grid-cols-2" :
            columns === 3 ? "grid-cols-1 sm:grid-cols-3" :
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
      {...props}
    >
      {items.map((item, i) => (
        <div key={i} className={cn("flex flex-col gap-1", item.colSpan === 2 && "sm:col-span-2")}>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.label}</span>
          <div className="text-sm font-medium text-foreground">{item.value || "-"}</div>
        </div>
      ))}
    </div>
  )
}

