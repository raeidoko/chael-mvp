"use client";

import { cn } from "@/lib/utils";

export function RadioOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-container border px-5 py-4 text-left text-[15px] transition-colors duration-250 ease-expensive",
        selected ? "border-accent-strong bg-surface-2" : "border-border bg-surface"
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-250",
          selected ? "border-accent-strong" : "border-border"
        )}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-accent-strong" />}
      </span>
      <span className="text-text">{label}</span>
    </button>
  );
}
