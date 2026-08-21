"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/primitives";
import { useChatStore } from "@/lib/store";
import { Contributor } from "@/lib/types";
import { formatTime } from "@/lib/utils";

const levelWidth = { low: "28%", medium: "58%", high: "88%" } as const;
const severityTone = { mild: "low", moderate: "medium", severe: "high" } as const;

export default function ResultsPage() {
  const router = useRouter();
  const pushResultsToChat = useChatStore((s) => s.pushResultsToChat);
  const currentResult = useChatStore((s) => s.currentResult);

  if (!currentResult) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-text-secondary">
          No results yet. Upload a photo in chat to get your first assessment.
        </p>
        <Button size="lg" className="mt-6" onClick={() => router.push("/chat")}>
          back to chat
        </Button>
      </div>
    );
  }

  const goChatMore = () => {
    pushResultsToChat();
    router.push("/chat");
  };

  return (
    <div className="min-h-screen px-6 pb-32 pt-6 md:px-10">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center gap-4">
          <button
            aria-label="Back"
            onClick={() => router.push("/chat")}
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-2 hover:text-text"
          >
            <ArrowLeft size={19} />
          </button>
        </div>

        <div className="mt-6">
          <h1 className="font-display text-4xl">your results</h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            today, {formatTime(currentResult.date)}
          </p>
        </div>

        <div className="mt-9">
          <p className="text-xs text-text-secondary">condition</p>
          <p className="mt-1.5 font-display text-2xl capitalize">{currentResult.condition}</p>
          <div className="mt-3 flex gap-2">
            <Badge tone={severityTone[currentResult.severity]}>{currentResult.severity}</Badge>
          </div>
        </div>

        {currentResult.see_derm && (
          <Card className="mt-6 flex items-start gap-3 bg-surface-2">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-[#1a0f0d]">
              <Stethoscope size={16} />
            </span>
            <div>
              <p className="text-[15px] font-medium text-text">worth seeing a dermatologist</p>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                {currentResult.derm_reason ?? "Based on what we're seeing, a dermatologist could give you more personalized guidance."}
              </p>
            </div>
          </Card>
        )}

        <div className="mt-10">
          <p className="mb-4 text-xs text-text-secondary">possible contributors</p>
          <div className="flex flex-col gap-5">
            {currentResult.contributors.map((c: Contributor) => (
              <div key={c.label}>
                <div className="mb-2 flex items-center justify-between text-[15px]">
                  <span className="text-text">{c.label}</span>
                  <span className="text-text-secondary">{c.level}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-pill bg-surface-2">
                  <div
                    className="h-full rounded-pill bg-accent-strong transition-all duration-500 ease-expensive"
                    style={{ width: levelWidth[c.level] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="mt-10 bg-surface-2">
          <p className="text-[15px] font-medium text-text">what does this mean?</p>
          <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
            {currentResult.explanation}
          </p>
        </Card>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg/95 px-6 py-4 backdrop-blur-sm md:px-10">
        <div className="mx-auto flex max-w-lg gap-3">
          <Button variant="outline" size="lg" onClick={goChatMore} className="flex-1">
            chat more
          </Button>
          <Button size="lg" onClick={() => router.push("/you")} className="flex-1">
            view plan
          </Button>
        </div>
      </div>
    </div>
  );
}