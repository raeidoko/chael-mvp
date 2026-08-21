"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface ProgressPhoto {
  id: string;
  date: string;
  imageUrl: string;
  note: string | null;
}

export default function PhotoProgressPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareIndex, setCompareIndex] = useState(0);

  useEffect(() => {
    async function loadPhotos() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("assessments")
        .select("id, photo_url, created_at, summary")
        .eq("user_id", authUser.id)
        .not("photo_url", "is", null)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Load photos error:", error);
      } else if (data) {
        const mapped = data.map((row) => ({
          id: row.id,
          date: row.created_at,
          imageUrl: row.photo_url as string,
          note: row.summary,
        }));
        setPhotos(mapped);
        setCompareIndex(mapped.length - 1);
      }

      setLoading(false);
    }

    loadPhotos();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-text-secondary">loading your photos…</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-text-secondary">
          no photos yet. upload one in chat to start tracking your progress.
        </p>
        <button
          onClick={() => router.push("/chat")}
          className="mt-4 rounded-btn bg-accent px-5 py-2.5 text-sm font-medium text-[#1a0f0d]"
        >
          go to chat
        </button>
      </div>
    );
  }

  const baseline = photos[0];
  const compare = photos[compareIndex];

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
          <div>
            <h1 className="font-display text-2xl">photo progress</h1>
            <p className="text-sm text-text-secondary">compare changes over time</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setCompareIndex(i)}
              className={cn(
                "shrink-0 rounded-pill px-4 py-2 text-sm transition-colors duration-250",
                i === compareIndex ? "bg-accent text-[#1a0f0d]" : "bg-surface-2 text-text-secondary"
              )}
            >
              {formatDate(p.date)}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="overflow-hidden rounded-photo">
            <img src={baseline.imageUrl} alt={`Skin photo from ${formatDate(baseline.date)}`} className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="overflow-hidden rounded-photo">
            <img src={compare.imageUrl} alt={`Skin photo from ${formatDate(compare.date)}`} className="aspect-[4/5] w-full object-cover" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-text-secondary">
          <button
            onClick={() => setCompareIndex((i) => Math.max(0, i - 1))}
            disabled={compareIndex === 0}
            className="flex items-center gap-1.5 disabled:opacity-30"
          >
            <ArrowLeft size={15} /> earlier
          </button>
          <span>swipe to compare</span>
          <button
            onClick={() => setCompareIndex((i) => Math.min(photos.length - 1, i + 1))}
            disabled={compareIndex === photos.length - 1}
            className="flex items-center gap-1.5 disabled:opacity-30"
          >
            later <ArrowRight size={15} />
          </button>
        </div>

        {compare.note && (
          <p className="mt-6 rounded-container bg-surface-2 px-5 py-4 text-[15px] text-text-secondary">
            {compare.note}
          </p>
        )}
      </div>
    </div>
  );
}