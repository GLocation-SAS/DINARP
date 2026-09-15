"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface Step {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface StepperProps {
  steps: Step[];
  activeStep: number;
  completedSteps?: number[];
  onStepClick?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
}

export function Stepper({ 
  steps, 
  activeStep, 
  completedSteps = [], 
  onStepClick,
  orientation = "horizontal"
}: StepperProps) {
  const isVertical = orientation === "vertical";

  return (
    <div className="w-full">
      <ol className={cn(
        "flex w-full relative",
        isVertical ? "flex-col items-start gap-8" : "flex-row items-start justify-between"
      )}>
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index) || index < activeStep;
          const isActive = index === activeStep;
          const isPending = index > activeStep && !isCompleted;
          
          // Determine Icon to show
          const Icon = isCompleted ? Check : step.icon;

          return (
            <li
              key={step.id}
              className={cn(
                "relative group flex",
                isVertical ? "flex-row items-start w-full" : "flex-col items-center flex-1"
              )}
              aria-current={isActive ? "step" : undefined}
            >
              {/* Conector Line */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "absolute bg-border z-0",
                  isVertical 
                    ? "left-[19px] top-[40px] bottom-[-32px] w-[2px]" // Vertical line
                    : "top-[19px] left-[50%] right-[-50%] h-[2px]" // Horizontal line
                )}>
                  <motion.div
                    className={cn(
                      "bg-success origin-top-left",
                      isVertical ? "w-full h-full" : "h-full w-full"
                    )}
                    initial={isVertical ? { scaleY: 0 } : { scaleX: 0 }}
                    animate={
                      isVertical 
                        ? { scaleY: completedSteps.includes(index) || activeStep > index ? 1 : 0 }
                        : { scaleX: completedSteps.includes(index) || activeStep > index ? 1 : 0 }
                    }
                    transition={{ ease: "easeInOut", duration: 0.35 }}
                  />
                </div>
              )}

              {/* Icon Node */}
              <div className={cn("relative z-10", isVertical ? "mr-4" : "mb-3")}>
                <motion.button
                  type="button"
                  onClick={() => onStepClick?.(index)}
                  disabled={isPending || !onStepClick}
                  aria-disabled={isPending || !onStepClick}
                  animate={
                    isCompleted && !isActive ? { scale: [1, 0.95, 1] } : { scale: 1 }
                  }
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className={cn(
                    "size-10 rounded-full flex items-center justify-center transition-all duration-300 outline-none",
                    isActive ? "ring-4 ring-primary/20 dark:ring-primary/40 ring-offset-0" : "focus-visible:ring-2 focus-visible:ring-ring",
                    isCompleted 
                      ? "bg-success text-success-foreground border-2 border-success shadow-md shadow-success/20"
                      : isActive 
                        ? "bg-primary text-primary-foreground border-2 border-primary shadow-md shadow-primary/20"
                        : "bg-background border-2 border-dashed border-border text-muted-foreground",
                    isPending || !onStepClick ? (isPending ? "cursor-not-allowed" : "cursor-default") : "cursor-pointer hover:opacity-80"
                  )}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isCompleted ? "completed" : isActive ? "active" : "pending"}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center"
                    >
                      <Icon className={cn("size-4", isCompleted ? "stroke-[3px]" : "stroke-[2px]")} />
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Textos */}
              <div className={cn(
                "flex flex-col z-10",
                isVertical ? "items-start text-left mt-[-2px]" : "items-center text-center w-full"
              )}>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
                  Step {index + 1}
                </span>
                <span className={cn(
                  "text-sm font-semibold mb-1.5 transition-colors duration-300 whitespace-nowrap",
                  isActive ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
                
                {/* Status Badge */}
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-colors",
                  isCompleted 
                    ? "bg-success/10 text-success" 
                    : isActive 
                      ? "bg-primary/10 text-primary" 
                      : "bg-surface-subtle text-muted-foreground border border-border"
                )}>
                  {isCompleted ? "Completed" : isActive ? "In Progress" : "Pending"}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
