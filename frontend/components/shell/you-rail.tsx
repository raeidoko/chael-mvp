"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { calculateStreak } from "@/lib/streak";

const links = [
  { href: "/you", label: "your progress" },
  { href: "/you/timeline", label: "timeline" },
  { href: "/you/photos", label: "photos" },
  { href: "/you/settings", label: "settings" },
];

export function YouRail() {
  const pathname = usePathname();
  const active = pathname?.startsWith("/you");
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [streakDays, setStreakDays] = useState(0);
  const [latestPhotoUrl, setLatestPhotoUrl] = useState<string | null>(null);

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

      const { data: latestAssessment } = await supabase
        .from("assessments")
        .select("photo_url")
        .eq("user_id", authUser.id)
        .not("photo_url", "is", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (latestAssessment?.photo_url) {
        setLatestPhotoUrl(latestAssessment.photo_url);
      }
    }

    loadProfile();
  }, []);

  const name = displayName ?? "there";

  return (
    <aside className="flex h-full flex-col gap-6 overflow-y-auto px-6 py-8">
      <div>
        <h2
          className={cn(
            "font-display text-2xl leading-none transition-opacity",
            active ? "opacity-100" : "opacity-70"
          )}
        >
          {name}
        </h2>
        <p className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
          <Flame size={13} /> {streakDays} day streak
        </p>
      </div>

      {latestPhotoUrl && (
        <Link href="/you/photos" className="block overflow-hidden rounded-photo">
          <img
            src={latestPhotoUrl}
            alt="Latest progress photo"
            className="aspect-[4/5] w-full object-cover"
          />
        </Link>
      )}

      <nav className="flex flex-col gap-1">
        {links.map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className="rounded-btn px-3 py-2.5 text-sm text-text-secondary transition-colors duration-250 hover:bg-surface-2 hover:text-text"
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}