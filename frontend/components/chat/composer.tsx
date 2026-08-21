"use client";

import { useRef, useState } from "react";
import { ArrowUp, Camera, Image as ImageIcon, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Composer({
  onSend,
  onUpload,
}: {
  onSend: (text: string) => void;
  onUpload: (dataUrl: string) => void;
}) {
  const [value, setValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result as string);
    reader.readAsDataURL(file);
    setMenuOpen(false);
  };

  return (
    <div className="sticky bottom-0 z-20 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur-sm md:px-6">
      <div className="relative mx-auto flex max-w-2xl items-center gap-2">
        <div className="relative">
          <button
            aria-label="Add photo"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2 text-text transition-colors duration-250 hover:bg-accent"
          >
            {menuOpen ? <X size={18} /> : <Plus size={18} />}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-14 left-0 flex w-48 flex-col gap-1 rounded-container border border-border bg-surface p-2 shadow-soft"
              >
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2.5 rounded-btn px-3 py-2.5 text-left text-sm hover:bg-surface-2"
                >
                  <ImageIcon size={16} /> upload from gallery
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2.5 rounded-btn px-3 py-2.5 text-left text-sm hover:bg-surface-2"
                >
                  <Camera size={16} /> take a photo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        <div className="flex flex-1 items-center rounded-pill border border-border bg-surface pl-5 pr-1.5">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="message chael…"
            aria-label="Message Chael"
            className="min-h-[48px] flex-1 bg-transparent text-[15px] text-text placeholder:text-text-secondary focus:outline-none"
          />
          <button
            aria-label="Send message"
            onClick={submit}
            disabled={!value.trim()}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-250",
              value.trim() ? "bg-accent text-[#1a0f0d]" : "bg-surface-2 text-text-secondary"
            )}
          >
            <ArrowUp size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
