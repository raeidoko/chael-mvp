"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  "aria-label"?: string;
}

export function Toggle({ checked, onChange, label, ...rest }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label ?? rest["aria-label"]}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-pill transition-colors duration-250 ease-expensive",
        checked ? "bg-accent-strong" : "bg-surface-2"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-surface shadow-card transition-transform duration-250 ease-expensive",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}
