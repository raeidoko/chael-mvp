"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/primitives";
import { RadioOption } from "@/components/chat/radio-option";
import { assessmentQuestions } from "@/lib/mock-data";
import { useAssessmentStore, useChatStore } from "@/lib/store";
import { logEvent } from "@/lib/analytics";
import { supabase } from "@/lib/supabase";

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

  const goNext = async () => {
    if (!selected) return;
    const option = question.options.find((o) => o.id === selected)!;
    recordAnswer({ questionId: question.id, optionId: option.id, optionLabel: option.label }, total);

    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setSelected(null);
      return;
    }

    router.push("/chat/analyzing");

    const { answers, visibleFindings } = useAssessmentStore.getState();
    const allAnswers = [
      ...answers,
      { questionId: question.id, optionId: option.id, optionLabel: option.label },
    ];

    try {
      const response = await fetch("/api/analyze-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visibleFindings,
          questionnaire: allAnswers.map((a) => ({
            question: a.questionId,
            answer: a.optionLabel,
          })),
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      const raw = data.raw;

      const likelihoodMap: Record<string, "low" | "medium" | "high"> = {
        low: "low",
        medium: "medium",
        high: "high",
      };

      const result = {
        id: `result-${Date.now()}`,
        date: new Date().toISOString(),
        condition: visibleFindings.lesion_type ?? "unclear",
        location: visibleFindings.location_notes ?? "",
        severity: visibleFindings.severity ?? "mild",
        contributors: (raw.contributor_likelihood ?? []).map((c: any) => ({
          label: c.factor,
          level: likelihoodMap[c.likelihood] ?? "low",
        })),
        summary: raw.chael_message ?? "",
        explanation: [raw.chael_message, ...(raw.guidance ?? [])].filter(Boolean).join(" "),
        chael_message: raw.chael_message,
        see_derm: raw.see_derm ?? false,
        derm_reason: raw.derm_reason ?? null,
      };

      useChatStore.setState({ currentResult: result });
      useChatStore.getState().push({ role: "assistant", kind: "results", meta: { result } });
      useChatStore.getState().push({
        role: "assistant",
        kind: "save-prompt",
        text: "Want to save this and get your personalized plan?",
      });

      logEvent("assessment_completed", { severity: result.severity, see_derm: result.see_derm });

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { error: saveError } = await supabase.from("assessments").insert({
          user_id: authUser.id,
          photo_url: visibleFindings.photo_url ?? null,
          photo_path: `${authUser.id}/${Date.now()}`,
          questionnaire: allAnswers.map((a) => ({ question: a.questionId, answer: a.optionLabel })),
          result: result,
          lesion_type: result.condition,
          location: result.location,
          severity: result.severity,
          contributors: result.contributors,
          summary: result.summary,
          explanation: result.explanation,
          see_derm: result.see_derm,
          derm_reason: result.derm_reason,
          pih_present: visibleFindings.pih_present ?? false,
        });

        if (saveError) {
          console.error("Save assessment error:", saveError);
        }
      }

      useAssessmentStore.getState().resetAssessment();
      router.push("/chat");
    } catch (error) {
      console.error("Full analysis error:", error);
      router.push("/chat");
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