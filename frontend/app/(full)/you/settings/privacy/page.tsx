"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

export default function PrivacyPage() {
  const router = useRouter();
  const { consentAnalyze, consentImprove, setConsent } = useAppStore();

  return (
    <div className="min-h-screen px-5 pb-10 pt-6 md:px-8">
      <div className="mx-auto max-w-md">
        <div className="flex items-center gap-4">
          <button
            aria-label="Back"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-2 hover:text-text"
          >
            <ArrowLeft size={19} />
          </button>
          <h1 className="font-display text-2xl">privacy</h1>
        </div>

        <p className="mt-6 text-[15px] leading-relaxed text-text-secondary">
          your photos are yours. we only use them to provide you with insights.
        </p>

        <div id="consent" className="mt-8 scroll-mt-24 flex flex-col gap-3">
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

        <div id="data" className="mt-8 scroll-mt-24 flex flex-col gap-3">
          <p className="px-1 text-xs text-text-secondary">your data</p>
          <Button variant="outline" size="lg" className="w-full justify-start gap-3">
            <Download size={17} /> export my data
          </Button>
          <Button variant="outline" size="lg" className="w-full justify-start gap-3 text-red-500 hover:bg-red-50">
            <Trash2 size={17} /> delete my account
          </Button>
        </div>
      </div>
    </div>
  );
}
