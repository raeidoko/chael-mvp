"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Camera, ListChecks } from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { TextBubble, ImageBubble } from "./bubbles";
import { ResultsInlineCard } from "./results-inline";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/lib/store";

function AnalyzingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-container bg-surface-2 px-4 py-3 w-fit">
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-strong [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-strong [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-strong" />
      </span>
      <span className="text-sm text-text-secondary">analyzing your photo…</span>
    </div>
  );
}

export function MessageList({
  messages,
  onUpload,
}: {
  messages: ChatMessage[];
  onUpload: (dataUrl: string) => void;
}) {
  const router = useRouter();
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const phase = useChatStore((s) => s.phase);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, phase]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6 md:px-6">
      {messages.map((m) => {
        switch (m.kind) {
          case "text":
            return <TextBubble key={m.id} role={m.role === "user" ? "user" : "assistant"} text={m.text ?? ""} />;

          case "image":
            return <ImageBubble key={m.id} role="user" src={m.imageUrl ?? ""} />;

          case "upload-prompt":
            return (
              <div key={m.id} className="flex flex-col gap-3">
                <TextBubble role="assistant" text={m.text ?? ""} />
                <div className="flex flex-col gap-2.5 pl-1 sm:flex-row">
                  <Button
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    className="justify-start gap-2.5"
                  >
                    <Camera size={17} /> upload today&apos;s photo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/chat/assessment")}
                    className="justify-start gap-2.5"
                  >
                    <ListChecks size={17} /> start skin assessment
                  </Button>
                </div>
              </div>
            );

          case "choice-summary": {
            const choices = (m.meta?.choices as { id: string; label: string; href?: string }[]) ?? [];
            return (
              <div key={m.id} className="flex flex-col gap-3">
                <TextBubble role="assistant" text={m.text ?? ""} />
                <div className="flex flex-col gap-2.5 pl-1 sm:flex-row">
                  {choices.map((c) => (
                    <Button
                      key={c.id}
                      variant={c.id === "continue" ? "primary" : "outline"}
                      onClick={() => c.href && router.push(c.href)}
                    >
                      {c.label}
                    </Button>
                  ))}
                </div>
              </div>
            );
          }

          case "results": {
            const result = m.meta?.result as import("@/lib/types").SkinResult;
            return <ResultsInlineCard key={m.id} result={result} />;
          }

          default:
            return null;
        }
      })}

      {phase === "photo-review" && <AnalyzingIndicator />}

      <div ref={endRef} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}