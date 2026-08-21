"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/primitives";
import { RadioOption } from "@/components/chat/radio-option";
import { assessmentQuestions } from "@/lib/mock-data";
import { useAssessmentStore } from "@/lib/store";

export default function AssessmentPage() {
  const router = useRouter();
  const recordAnswer = useAssessmentStore((s) => s.recordAnswer);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const question = assessmentQuestions[index];
  const total = assessmentQuestions.length;

  const goBack = () => {
    if (index === 0) {
      router.back();
      return;
    }
    setIndex((i) => i - 1);
    setSelected(null);
  };

  const goNext = () => {
    if (!selected) return;
    const option = question.options.find((o) => o.id === selected)!;
    recordAnswer({ questionId: question.id, optionId: option.id, optionLabel: option.label }, total);

    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      router.push("/chat/analyzing");
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-6 md:px-10">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
        <div className="flex items-center gap-4">
          <button
            aria-label="Back"
            onClick={goBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-2 hover:text-text"
          >
            <ArrowLeft size={19} />
          </button>
          <div className="flex-1">
            <p className="mb-2 text-xs text-text-secondary">
              skin assessment · step {index + 1} of {total}
            </p>
            <ProgressBar value={index + 1} max={total} />
          </div>
        </div>

        <h1 className="mt-10 font-display text-3xl leading-snug">{question.prompt}</h1>

        <div className="mt-8 flex flex-col gap-3" role="radiogroup" aria-label={question.prompt}>
          {question.options.map((opt) => (
            <RadioOption
              key={opt.id}
              label={opt.label}
              selected={selected === opt.id}
              onSelect={() => setSelected(opt.id)}
            />
          ))}
        </div>

        <div className="mt-auto flex gap-3 pt-14">
          <Button variant="outline" size="lg" onClick={goBack} className="flex-1">
            back
          </Button>
          <Button size="lg" onClick={goNext} disabled={!selected} className="flex-1">
            {index + 1 === total ? "finish" : "next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
