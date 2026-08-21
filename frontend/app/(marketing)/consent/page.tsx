"use client";

import { useRouter } from "next/navigation";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { useAppStore } from "@/lib/store";

export default function ConsentPage() {
  const router = useRouter();
  const { consentAnalyze, consentImprove, setConsent, completeOnboarding } = useAppStore();

  const onContinue = () => {
    completeOnboarding();
    router.push("/chat");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-8 py-14">
      <div>
        <h1 className="font-display text-4xl leading-tight">your privacy matters</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
          your photos are yours. we only use them to provide you with insights. you can choose to
          help improve Chael&apos;s AI.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <Card className="flex items-center justify-between gap-4 bg-surface-2">
          <div>
            <p className="text-[15px] text-text">analyze my photos</p>
            <p className="mt-0.5 text-xs text-text-secondary">required</p>
          </div>
          <Toggle checked={consentAnalyze} onChange={(v) => setConsent(v, consentImprove)} label="Analyze my photos" />
        </Card>

        <Card className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[15px] text-text">help improve Chael&apos;s AI</p>
            <p className="mt-0.5 text-xs text-text-secondary">optional</p>
          </div>
          <Toggle checked={consentImprove} onChange={(v) => setConsent(consentAnalyze, v)} label="Help improve Chael's AI" />
        </Card>
      </div>

      <Button size="lg" className="mt-auto w-full" onClick={onContinue}>
        continue
      </Button>
    </div>
  );
}
