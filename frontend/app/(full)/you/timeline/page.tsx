"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const severityTone = { mild: "low", moderate: "medium", severe: "high" } as const;

interface TimelineEntry {
  date: string;
  title: string;
  severity: "mild" | "moderate" | "severe";
  note: string;
}

export default function TimelinePage() {
  const router = useRouter();
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("assessments")
        .select("lesion_type, severity, summary, created_at")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Load timeline error:", error);
      } else if (data) {
        setEntries(
          data.map((row) => ({
            date: row.created_at,
            title: row.lesion_type ?? "assessment",
            severity: (row.severity as "mild" | "moderate" | "severe") ?? "mild",
            note: row.summary ?? "",
          }))
        );
      }

      setLoading(false);
    }

    loadTimeline();
  }, []);

  return (
    <div className="min-h-screen px-5 pb-10 pt-6 md:px-8">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center gap-4">
          <button
            aria-label="Back"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-2 hover:text-text"
          >
            <ArrowLeft size={19} />
          </button>
          <h1 className="font-display text-2xl">your timeline</h1>
        </div>

        {loading && (
          <p className="mt-10 text-center text-sm text-text-secondary">loading your timeline…</p>
        )}

        {!loading && entries.length === 0 && (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-text-secondary">
              no entries yet. upload a photo in chat to start your timeline.
            </p>
            <button
              onClick={() => router.push("/chat")}
              className="mt-2 rounded-btn bg-accent px-5 py-2.5 text-sm font-medium text-[#1a0f0d]"
            >
              go to chat
            </button>
          </div>
        )}

        {entries.length > 0 && (
          <ol className="mt-8 flex flex-col gap-8 border-l border-border pl-6">
            {entries.map((entry, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent-strong" />
                <p className="text-xs text-text-secondary">
                  {formatDate(entry.date, { month: "long", day: "numeric", year: "numeric" })}
                </p>
                <p className="mt-1 text-[15px] text-text capitalize">{entry.title}</p>
                <Badge tone={severityTone[entry.severity]} className="mt-2">
                  {entry.severity}
                </Badge>
                {entry.note && (
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{entry.note}</p>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}