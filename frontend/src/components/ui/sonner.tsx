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
          <div className="flex items-center justify-center shrink-0 size-10 rounded-full bg-success/15 text-success"><CircleCheckIcon className="size-5 stroke-[2.5px]" /></div>
        ),
        info: (
          <div className="flex items-center justify-center shrink-0 size-10 rounded-full bg-info/15 text-info"><InfoIcon className="size-5 stroke-[2.5px]" /></div>
        ),
        warning: (
          <div className="flex items-center justify-center shrink-0 size-10 rounded-full bg-warning/15 text-warning"><TriangleAlertIcon className="size-5 stroke-[2.5px]" /></div>
        ),
        error: (
          <div className="flex items-center justify-center shrink-0 size-10 rounded-full bg-danger/15 text-danger"><OctagonXIcon className="size-5 stroke-[2.5px]" /></div>
        ),
        loading: (
          <div className="flex items-center justify-center shrink-0 size-10 rounded-full bg-primary/15 text-primary">
            <Loader2Icon className="size-5 animate-spin stroke-[2.5px]" />
          </div>
        ),
      }}
      style={{}}
      toastOptions={{
        classNames: {
          toast: `
            group toast
            !flex
            !rounded-full
            !border
            !shadow-xl shadow-black/5
            backdrop-blur-2xl
            transition-all duration-300
            !gap-5
            !py-3.5 !px-6
            !flex-row
            !items-center
            !justify-start
            !w-fit !min-w-fit
            font-sans
            !bg-background
            !border-border/30
            !text-foreground

            /* Dark mode semantic backgrounds */
            dark:group-[[data-type=success]]:!bg-success/15
            dark:group-[[data-type=success]]:!border-success/20
            dark:group-[[data-type=info]]:!bg-info/15
            dark:group-[[data-type=info]]:!border-info/20
            dark:group-[[data-type=warning]]:!bg-warning/15
            dark:group-[[data-type=warning]]:!border-warning/20
            dark:group-[[data-type=error]]:!bg-danger/15
            dark:group-[[data-type=error]]:!border-danger/20
            dark:group-[[data-type=default]]:!bg-primary/15
            dark:group-[[data-type=default]]:!border-primary/20
          `,

          title: `
              text-[14px]
              !text-foreground
              font-medium
              leading-snug
              text-left
              w-full
              !m-0
              line-clamp-2
            `,

          description: `
            hidden
          `,

          icon: `
            !static
            !shrink-0
            !flex
            !items-center
            !justify-center
            !m-0
            !self-center
          `,

          loader: `
            !static
            !shrink-0
            !flex
            !items-center
            !justify-center
            !m-0
            !self-center
          `,

          content: `
            !flex
            !flex-col
            !flex-1
            !justify-center
            overflow-hidden
          `,

          actionButton: badgeVariants({ tone: "neutral", appearance: "solid", className: "hover:opacity-80 cursor-pointer px-4 py-2" }),

          cancelButton: `
            rounded-full
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
