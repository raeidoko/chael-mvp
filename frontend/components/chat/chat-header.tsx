"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, SquarePen, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg/90 px-5 py-4 backdrop-blur-sm">
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-2 hover:text-text"
      >
        <Menu size={20} />
      </button>
      <h1 className="font-display text-2xl">chael</h1>
      <button
        aria-label="New conversation"
        className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-2 hover:text-text"
      >
        <SquarePen size={19} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-[#1a0f0d]/40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-surface p-6"
            >
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="mb-8 flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-surface-2"
              >
                <X size={20} />
              </button>
              <nav className="flex flex-col gap-1 text-sm">
                <Link href="/chat" onClick={() => setOpen(false)} className="rounded-btn px-3 py-2.5 hover:bg-surface-2">
                  current conversation
                </Link>
                <Link href="/you/timeline" onClick={() => setOpen(false)} className="rounded-btn px-3 py-2.5 hover:bg-surface-2">
                  past check-ins
                </Link>
                <Link href="/you/settings" onClick={() => setOpen(false)} className="rounded-btn px-3 py-2.5 hover:bg-surface-2">
                  settings
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
