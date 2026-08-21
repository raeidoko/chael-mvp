"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  "examining your photo",
  "reviewing your answers",
  "identifying patterns",
  "generating insights",
];

const STEP_DURATION = 1800;

export default function AnalyzingPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= steps.length) {
      const t = setTimeout(() => router.push("/chat/results"), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setActiveIndex((i) => i + 1), STEP_DURATION);
    return () => clearTimeout(t);
  }, [activeIndex, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <motion.div
        animate={{ rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-accent-strong"
      >
        <Sparkle size={26} />
      </motion.div>

      <h1 className="font-display text-3xl">analyzing your skin</h1>

      <ul className="mt-10 flex w-full max-w-xs flex-col gap-4 text-left">
        {steps.map((step, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <motion.li
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: done || active ? 1 : 0.35 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 text-[15px]"
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                  done ? "border-accent-strong bg-accent-strong text-[#1a0f0d]" : "border-border"
                )}
              >
                {done && <Check size={12} strokeWidth={3} />}
                {active && !done && (
                  <span className="h-2 w-2 animate-pulse-soft rounded-full bg-accent-strong" />
                )}
              </span>
              <span className={done ? "text-text" : "text-text-secondary"}>{step}</span>
            </motion.li>
          );
        })}
      </ul>

      <p className="mt-12 text-xs text-text-secondary">this usually takes less than a minute.</p>
    </div>
  );
}
