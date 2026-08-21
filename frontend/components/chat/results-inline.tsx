"use client";

import { motion } from "framer-motion";
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
        <Badge tone="neutral">{result.confidence}% confidence</Badge>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">{result.summary}</p>
    </motion.div>
  );
}
