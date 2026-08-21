"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [phase, setPhase] = useState<"splash" | "hero">("splash");

  useEffect(() => {
    const t = setTimeout(() => setPhase("hero"), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg">
      <AnimatePresence mode="wait">
        {phase === "splash" ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-screen flex-col items-center justify-center gap-10 px-8 text-center"
          >
            <div>
              <h1 className="font-display text-6xl text-accent">chael</h1>
              <p className="mx-auto mt-5 max-w-xs font-display text-2xl leading-snug text-text">
                understand your skin, built for melanin-rich skin.
              </p>
            </div>
            <div className="absolute bottom-16 flex flex-col items-center gap-3">
              <div className="h-[2px] w-24 overflow-hidden rounded-pill bg-surface-2">
                <motion.div
                  className="h-full bg-accent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <p className="text-xs text-text-secondary">getting things ready&hellip;</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex min-h-screen flex-col justify-end"
          >
            <div className="absolute inset-0">
              <img
                src="https://picsum.photos/seed/chael-hero/1200/1600"
                alt="Portrait of a woman with radiant, healthy skin"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0d] via-[#1a0f0d]/40 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col gap-6 px-8 pb-14">
              <div>
                <h1 className="font-display text-5xl leading-tight text-[#fdf0f4]">
                  hi, I&apos;m Chael.
                </h1>
                <p className="mt-3 max-w-sm text-[15px] text-[#fdf0f4]/80">
                  your AI skin health companion. I&apos;m here to help you understand your skin
                  and support your journey.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/chat">
                  <Button variant="primary" size="lg" className="w-full bg-accent text-[#1a0f0d] hover:bg-accent-strong">
                    start chatting with chael
                  </Button>
                </Link>
                <Link href="/signin" className="text-center text-sm text-[#fdf0f4]/85 underline-offset-4 hover:underline">
                  already have an account? sign in
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}