"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const bubbleMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
};

export function TextBubble({ role, text }: { role: "user" | "assistant"; text: string }) {
  const isUser = role === "user";
  return (
    <motion.div {...bubbleMotion} className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-container px-4 py-3 text-[15px] leading-relaxed",
          isUser
            ? "rounded-br-md bg-accent text-[#1a0f0d]"
            : "rounded-bl-md bg-surface-2 text-text"
        )}
      >
        {text}
      </div>
    </motion.div>
  );
}

export function ImageBubble({ role, src }: { role: "user" | "assistant"; src: string }) {
  const isUser = role === "user";
  return (
    <motion.div {...bubbleMotion} className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className="max-w-[65%] overflow-hidden rounded-photo">
        <img src={src} alt="Uploaded skin photo" className="aspect-[4/5] w-full object-cover" />
      </div>
    </motion.div>
  );
}

export function TypingBubble() {
  return (
    <motion.div {...bubbleMotion} className="flex w-full justify-start">
      <div className="flex items-center gap-1.5 rounded-container rounded-bl-md bg-surface-2 px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-text-secondary"
            style={{ animationDelay: `${i * 180}ms` }}
          />
        ))}
      </div>
    </motion.div>
  );
}
