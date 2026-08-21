"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const accountLinks = [
  { href: "/you/settings/edit-profile", label: "edit profile" },
  { href: "/you/settings/edit-profile#password", label: "change password" },
  { href: "/you/settings/edit-profile#notifications", label: "notification preferences" },
];

const privacyLinks = [
  { href: "/you/settings/privacy", label: "privacy" },
  { href: "/you/settings/privacy#data", label: "data and privacy" },
  { href: "/you/settings/privacy#consent", label: "manage consent" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
          <h1 className="font-display text-2xl">settings</h1>
        </div>

        <section className="mt-8">
          <p className="mb-2 px-1 text-xs text-text-secondary">appearance</p>
          <div className="flex items-center justify-between rounded-container border border-border bg-surface px-5 py-4">
            <p className="text-[15px] text-text">dark theme</p>
            {mounted && (
              <Toggle checked={theme === "dark"} onChange={(v) => setTheme(v ? "dark" : "light")} label="Dark theme" />
            )}
          </div>
        </section>

        <section className="mt-8">
          <p className="mb-2 px-1 text-xs text-text-secondary">account</p>
          <div className="flex flex-col overflow-hidden rounded-container border border-border bg-surface">
            {accountLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="flex items-center justify-between border-b border-border px-5 py-4 text-[15px] text-text last:border-b-0 hover:bg-surface-2"
              >
                {l.label}
                <ChevronRight size={16} className="text-text-secondary" />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <p className="mb-2 px-1 text-xs text-text-secondary">privacy</p>
          <div className="flex flex-col overflow-hidden rounded-container border border-border bg-surface">
            {privacyLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="flex items-center justify-between border-b border-border px-5 py-4 text-[15px] text-text last:border-b-0 hover:bg-surface-2"
              >
                {l.label}
                <ChevronRight size={16} className="text-text-secondary" />
              </Link>
            ))}
          </div>
        </section>

        <button
          onClick={() => router.push("/")}
          className="mt-8 w-full rounded-container border border-border bg-surface px-5 py-4 text-left text-[15px] text-text hover:bg-surface-2"
        >
          log out
        </button>
      </div>
    </div>
  );
}
