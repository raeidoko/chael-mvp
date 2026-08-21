"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "md" | "lg" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidthOnMobile?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-button text-button-text hover:opacity-90 disabled:opacity-40",
  secondary:
    "bg-surface-2 text-text hover:bg-accent hover:text-text disabled:opacity-40",
  outline:
    "bg-transparent text-text border border-border hover:bg-surface-2 disabled:opacity-40",
  ghost:
    "bg-transparent text-text-secondary hover:text-text disabled:opacity-40",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidthOnMobile, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-btn font-medium transition-all duration-250 ease-expensive",
          "min-h-[44px] active:scale-[0.98]",
          variantClasses[variant],
          sizeClasses[size],
          fullWidthOnMobile && "w-full sm:w-auto",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
