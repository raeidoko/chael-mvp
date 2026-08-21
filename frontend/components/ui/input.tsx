"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full rounded-input border bg-surface px-5 py-4 text-[15px] text-text placeholder:text-text-secondary/70",
            "border-border transition-colors duration-250 ease-expensive",
            "focus:outline-none focus:border-accent-strong",
            error && "border-red-400",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 pl-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
