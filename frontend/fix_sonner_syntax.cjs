const fs = require('fs');

const sonnerContent = `"use client"

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
          toast: \`
            group toast
            !flex
            !rounded-full
            !border
            !shadow-xl shadow-black/5
            backdrop-blur-2xl
            transition-all duration-300
            !gap-4
            !p-3.5
            !flex-row
            !items-center
            !justify-start
            !min-w-[340px]
            font-sans
            !bg-background
            !border-border/30
            !text-foreground
          \`,

          title: \`
            hidden
          \`,

          description: \`
            text-[14px]
            !text-foreground
            font-medium
            leading-snug
            text-left
            w-full
            !m-0
          \`,

          icon: \`
            !static
            !shrink-0
            !flex
            !items-center
            !justify-center
            !m-0
          \`,

          loader: \`
            !static
            !shrink-0
            !flex
            !m-0
          \`,

          content: \`
            !flex
            !flex-col
            !flex-1
            !justify-center
            overflow-hidden
          \`,

          actionButton: badgeVariants({ tone: "primary", appearance: "soft", className: "hover:opacity-80 cursor-pointer px-4 py-2" }),

          cancelButton: \`
            rounded-full
            bg-muted
            text-muted-foreground
            hover:bg-muted-foreground/10
            transition-all
          \`,

          closeButton: \`
            hover:bg-muted
            text-muted-foreground
            hover:text-foreground
            transition-all
          \`,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
`;

fs.writeFileSync('src/components/ui/sonner.tsx', sonnerContent, 'utf8');
