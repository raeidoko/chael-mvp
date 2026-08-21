"use client";

import { BottomNav } from "./bottom-nav";
import { CareRail } from "./care-rail";
import { YouRail } from "./you-rail";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto flex min-h-screen max-w-[1400px] md:grid md:grid-cols-[260px_minmax(0,1fr)_260px]">
        <div className="hidden border-r border-border md:block">
          <CareRail />
        </div>

        <main className="min-h-screen w-full pb-24 md:pb-0">{children}</main>

        <div className="hidden border-l border-border md:block">
          <YouRail />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
