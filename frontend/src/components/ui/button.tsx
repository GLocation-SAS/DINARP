"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    // Base
    "group",
    "relative",
    "inline-flex",
    "items-center",
    "justify-center",

    "overflow-hidden",
    "!rounded-full",
    "border-2",

    "font-semibold",
    "outline-none",
    "select-none",
    "isolate",

    // Motion
    "transition-[border-color,color,transform,box-shadow]",
    "duration-500",

    // States
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "active:scale-[0.96]",

    // Icons
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "border-primary",
          "text-white",
          "bg-primary",
          "[--radial-bg:var(--primary)] dark:[--radial-bg:var(--primary)]",
          "[--glow:var(--primary)]",
          "hover:opacity-90",
        ].join(" "),

        secondary: [
          "border-secondary",
          "text-secondary",
          "bg-transparent",
          "[--radial-bg:var(--secondary)] dark:[--radial-bg:var(--secondary)]",
          "[--glow:var(--secondary)]",
          "hover:border-secondary",
          "hover:text-white",
          "active:text-white",
          "data-[state=active]:border-secondary",
          "data-[state=active]:bg-secondary",
          "data-[state=active]:text-white",
        ].join(" "),

        success: [
          "border-success",
          "text-white",
          "bg-success",
          "[--radial-bg:var(--success)] dark:[--radial-bg:var(--success)]",
          "[--glow:var(--success)]",
          "hover:opacity-90",
        ].join(" "),

        warning: [
          "border-warning",
          "text-white",
          "bg-warning",
          "[--radial-bg:var(--warning)] dark:[--radial-bg:var(--warning)]",
          "[--glow:var(--warning)]",
          "hover:opacity-90",
        ].join(" "),

        danger: [
          "border-danger",
          "text-white",
          "bg-danger",
          "[--radial-bg:var(--danger)] dark:[--radial-bg:var(--danger)]",
          "[--glow:var(--danger)]",
          "hover:opacity-90",
        ].join(" "),

        info: [
          "border-info",
          "text-white",
          "bg-info",
          "[--radial-bg:var(--info)] dark:[--radial-bg:var(--info)]",
          "[--glow:var(--info)]",
          "hover:opacity-90",
        ].join(" "),

        ghost: [
          "border-transparent",
          "text-foreground",
          "bg-transparent",
          "hover:text-foreground",
          "hover:border-border/40",
          "hover:bg-muted/30",
        ].join(" "),

        neutral: [
          "border-border",
          "bg-muted",
          "text-foreground",
          "hover:bg-muted-foreground/20",
          "dark:hover:bg-muted-foreground/20",
          "hover:text-foreground",
          "dark:hover:text-foreground",
          "hover:border-border",
          "dark:hover:border-border",
        ].join(" "),

        outline: [
          "border-border",
          "bg-muted/40",
          "text-foreground",
          "hover:border-foreground/20",
          "hover:bg-muted/60",
          "hover:text-foreground",
          "hover:shadow-[0_0_20px_-10px_hsl(var(--foreground)/0.25)]",
        ].join(" "),
      },

      size: {
        default: "h-11 px-8 text-base",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-10 text-lg",
        icon: "w-11 h-11 shrink-0",
        "icon-sm": "w-10 h-10 shrink-0",
        "icon-xs": "w-10 h-10 shrink-0 [&_svg]:scale-75",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = React.useState(false)

    const handleMouseMove = (
      e: React.MouseEvent<HTMLButtonElement>
    ) => {
      const rect = e.currentTarget.getBoundingClientRect()

      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const innerContent = (
      <>
        {/* RADIAL FILL */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none",
            "absolute",
            "z-[1]",
            "h-64",
            "w-64",
            "!rounded-full",
            "bg-[var(--radial-bg)]",
            "transform-gpu",
            "will-change-transform"
          )}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: `translate(-50%, -50%) scale(${isHovered ? 1.5 : 0})`,
            opacity: isHovered ? 0.8 : 0,
            transition: "transform 1200ms cubic-bezier(0.22, 1, 0.36, 1), opacity 1000ms ease-in-out",
          }}
        />

        {/* LIQUID GLOW */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none",
            "absolute",
            "z-[2]",
            "h-40",
            "w-40",
            "-translate-x-1/2",
            "-translate-y-1/2",
            "!rounded-full",
            "bg-[var(--glow)]",
            "blur-[40px]"
          )}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            opacity: isHovered ? 0.4 : 0,
            transition: "opacity 1200ms ease-in-out",
          }}
        />

        {/* SOFT LIGHT */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none",
            "absolute",
            "inset-0",
            "z-[3]",
            "bg-gradient-to-br",
            "from-white/5",
            "to-transparent",
            "transition-opacity",
            "duration-700",
            "ease-in-out",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />
      </>
    )

    const childNode = asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
      ? children.props.children
      : children

    const content = (
      <>
        {innerContent}
        {/* CONTENT */}
        <span
          className={cn(
            "pointer-events-none relative z-[4] flex w-full items-center gap-2",
            className?.includes("justify-between")
              ? "justify-between"
              : className?.includes("justify-start")
                ? "justify-start"
                : className?.includes("justify-end")
                  ? "justify-end"
                  : "justify-center"
          )}
        >
          {leftIcon}
          {childNode}
          {rightIcon}
        </span>
      </>
    )

    return (
      <Comp
        ref={ref}
        {...props}
        className={cn(
          buttonVariants({ variant, size }),
          className
        )}
        onMouseEnter={(e) => {
          setIsHovered(true)
          props.onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          setIsHovered(false)
          props.onMouseLeave?.(e)
        }}
        onMouseMove={(e) => {
          handleMouseMove(e)
          props.onMouseMove?.(e)
        }}
      >
        {asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
          ? React.cloneElement(children, {
            children: content,
          })
          : content}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
