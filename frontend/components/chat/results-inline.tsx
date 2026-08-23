"use client";

import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { SkinResult } from "@/lib/types";

const severityTone = { mild: "low", moderate: "medium", severe: "high" } as const;

export function ResultsInlineCard({ result }: { result: SkinResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full rounded-container border border-border bg-surface p-6"
    >
      <p className="font-display text-2xl capitalize">{result.condition}</p>
      <div className="mt-3 flex gap-2">
        <Badge tone={severityTone[result.severity]}>{result.severity}</Badge>
      </div>

      {result.see_derm && (
        <div className="mt-4 flex items-start gap-3 rounded-container bg-surface-2 p-4">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-[#1a0f0d]">
            <Stethoscope size={15} />
          </span>
          <div>
            <p className="text-sm font-medium text-text">worth seeing a dermatologist</p>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              {result.derm_reason ?? "Based on what we're seeing, a dermatologist could give you more personalized guidance."}
            </p>
          </div>
        </div>
      )}

      <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">{result.summary}</p>
    </motion.div>
  );
}