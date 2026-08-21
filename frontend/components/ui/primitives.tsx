"use client";

import { HTMLAttributes } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-container bg-surface p-6 border border-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

const badgeTone = {
  neutral: "bg-surface-2 text-text",
  accent: "bg-accent text-[#3e2723]",
  low: "bg-surface-2 text-text-secondary",
  medium: "bg-accent/70 text-[#3e2723]",
  high: "bg-accent-strong text-[#3e2723]",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof badgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium capitalize",
        badgeTone[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-pill bg-surface-2" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div
        className="h-full rounded-pill bg-accent-strong transition-all duration-350 ease-expensive"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Avatar({ src, alt, size = 40 }: { src: string; alt: string; size?: number }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full bg-surface-2"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
    </div>
  );
}
