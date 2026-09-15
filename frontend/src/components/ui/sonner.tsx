"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"
import { badgeVariants } from "@/components/ui/badge"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      offset={80}
      icons={{
        success: (
          <div className="flex items-center justify-center shrink-0 size-10 rounded-lg bg-success text-white shadow-sm">
            <CircleCheckIcon className="size-5 stroke-[2px]" />
          </div>
        ),
        info: (
          <div className="flex items-center justify-center shrink-0 size-10 rounded-lg bg-info text-white shadow-sm">
            <InfoIcon className="size-5 stroke-[2px]" />
          </div>
        ),
        warning: (
          <div className="flex items-center justify-center shrink-0 size-10 rounded-lg bg-warning text-white shadow-sm">
            <TriangleAlertIcon className="size-5 stroke-[2px]" />
          </div>
        ),
        error: (
          <div className="flex items-center justify-center shrink-0 size-10 rounded-lg bg-danger text-white shadow-sm">
            <OctagonXIcon className="size-5 stroke-[2px]" />
          </div>
        ),
        loading: (
          <div className="flex items-center justify-center shrink-0 size-10 rounded-lg bg-primary text-white shadow-sm">
            <Loader2Icon className="size-5 animate-spin stroke-[2px]" />
          </div>
        ),
      }}
      style={{} as React.CSSProperties}
      toastOptions={{
        classNames: {
          toast: `
            group toast
            !flex
            !rounded-xl
            !border
            !shadow-xl
            backdrop-blur-2xl
            transition-all duration-300
            !gap-4
            !py-4
            !px-6
            !flex-row
            !items-center
            !justify-start
            !min-w-[340px]
            font-sans
            /* Default styles (Base) */
            !bg-surface
            !border-border
            !text-foreground

            /* Default Type Styles (When no severity is provided) */
            group-[[data-type=default]]:!bg-primary/5
            group-[[data-type=default]]:!border-primary/20
            
            
            /* Success styles */
            group-[[data-type=success]]:!bg-success/10 
            group-[[data-type=success]]:!border-success/20
            
            /* Info styles */
            group-[[data-type=info]]:!bg-info/10 
            group-[[data-type=info]]:!border-info/20
            
            /* Warning styles */
            group-[[data-type=warning]]:!bg-warning/10 
            group-[[data-type=warning]]:!border-warning/20
            
            /* Error styles */
            group-[[data-type=error]]:!bg-danger/10 
            group-[[data-type=error]]:!border-danger/20
          `,

          title: `
            text-[14px]
            font-bold
            tracking-tight
            leading-tight
            text-left
            w-full
            text-foreground
            
            /* Colores de título dinámicos */
            group-[[data-type=success]]:!text-success-700 dark:group-[[data-type=success]]:!text-success-400
            group-[[data-type=info]]:!text-info-700 dark:group-[[data-type=info]]:!text-info-400
            group-[[data-type=warning]]:!text-warning-700 dark:group-[[data-type=warning]]:!text-warning-400
            group-[[data-type=error]]:!text-danger-700 dark:group-[[data-type=error]]:!text-danger-400
          `,

          description: `
            text-xs
            !text-foreground/80
            font-medium
            leading-snug
            text-left
            w-full
            !mt-0.5
          `,

          icon: `
            !static
            !shrink-0
            !flex
            !items-center
            !justify-center
            !m-0
            !mr-2
          `,

          loader: `
            !static
            !shrink-0
            !flex
            !m-0
          `,

          content: `
            !flex
            !flex-col
            !flex-1
            !justify-center
            overflow-hidden
          `,

          actionButton: badgeVariants({ tone: "primary", appearance: "soft", className: "hover:opacity-80 cursor-pointer px-4 py-2" }),

          cancelButton: `
            rounded-xl
            bg-muted
            text-muted-foreground
            hover:bg-muted-foreground/10
            transition-all
          `,

          closeButton: `
            hover:bg-muted
            text-muted-foreground
            hover:text-foreground
            transition-all
          `,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }