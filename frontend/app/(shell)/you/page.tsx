"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings, Flame, ChevronRight } from "lucide-react";
import { Card, Avatar } from "@/components/ui/primitives";
import { ProgressChart } from "@/components/you/progress-chart";
import { user as mockUser, progressSeries } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { calculateStreak } from "@/lib/streak";

const tabs = [
  { href: "/you/timeline", label: "timeline" },
  { href: "/you/photos", label: "photos" },
  { href: "/you/settings", label: "settings" },
];

export default function YouPage() {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", authUser.id)
        .single();

      if (profile?.full_name) {
        setDisplayName(profile.full_name);
      }

      const streak = await calculateStreak(authUser.id);
      setStreakDays(streak);
    }

    loadProfile();
  }, []);

  const name = displayName ?? "there";

  return (
    <div className="min-h-screen px-5 pb-10 pt-6 md:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={mockUser.photoUrl} alt={name} size={44} />
            <h1 className="font-display text-3xl">me</h1>
          </div>
          <Link
            href="/you/settings"
            aria-label="Settings"
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-2 hover:text-text"
          >
            <Settings size={19} />
          </Link>
        </div>

        <Link
          href="/you/timeline"
          className="mt-6 flex items-center justify-between rounded-container border border-border bg-surface px-5 py-4"
        >
          <div>
            <p className="text-[15px] text-text">your progress</p>
            <p className="text-sm text-text-secondary">see how you&apos;ve been doing</p>
          </div>
          <ChevronRight size={18} className="text-text-secondary" />
        </Link>

        <div className="mt-6 flex gap-5 border-b border-border text-sm text-text-secondary">
          {tabs.map((t, i) => (
            <Link
              key={t.href}
              href={t.href}
              className={`pb-3 ${i === 0 ? "border-b-2 border-accent-strong text-text" : ""}`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <Card className="mt-6">
          <p className="text-[15px] text-text">skin progress</p>
          <p className="text-sm text-text-secondary">good progress. keep going, {name}.</p>
          <div className="mt-5">
            <ProgressChart data={progressSeries} />
          </div>
        </Card>

        <Card className="mt-4 flex items-center gap-4 bg-surface-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-[#1a0f0d]">
            <Flame size={19} />
          </span>
          <div>
            <p className="text-[15px] text-text">your streak</p>
            <p className="font-display text-2xl">{streakDays} days</p>
            <p className="text-xs text-text-secondary">of logging in</p>
          </div>
        </Card>

        <Card className="mt-4">
          <p className="text-[15px] text-text">goals</p>
          <ul className="mt-3 flex flex-col gap-2">
            {mockUser.goals.map((g) => (
              <li key={g} className="text-sm text-text-secondary">
                · {g}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}