"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bookmark, Calendar, BookOpen, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";
import { realDoctors } from "@/lib/doctors";

const links = [
  { href: "/care", label: "find a dermatologist", icon: Search },
  { href: "/care#saved", label: "saved dermatologists", icon: Bookmark },
  { href: "/care#appointments", label: "appointments", icon: Calendar },
  { href: "/care#resources", label: "resources", icon: BookOpen },
];

export function CareRail() {
  const pathname = usePathname();
  const active = pathname?.startsWith("/care");
  const saved = realDoctors.filter((d) => d.saved);

  return (
    <aside className="flex h-full flex-col gap-6 overflow-y-auto px-6 py-8">
      <div>
        <h2
          className={cn(
            "font-display text-2xl transition-opacity",
            active ? "opacity-100" : "opacity-70"
          )}
        >
          care
        </h2>
        <p className="mt-1 text-sm text-text-secondary">Real support, close by.</p>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm text-text-secondary transition-colors duration-250 hover:bg-surface-2 hover:text-text"
          >
            <Icon size={17} strokeWidth={1.75} />
            {label}
          </Link>
        ))}
      </nav>

      {saved.length > 0 && (
        <div>
          <p className="mb-2 px-3 text-xs text-text-secondary">saved</p>
          <div className="flex flex-col gap-1">
            {saved.map((d) => (
              <Link
                key={d.id}
                href={`/care/${d.id}`}
                className="rounded-btn px-3 py-2 text-sm text-text transition-colors duration-250 hover:bg-surface-2"
              >
                {d.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link
        href="/care#emergency"
        className="mt-auto flex items-center gap-2 rounded-container bg-surface-2 px-4 py-3 text-sm text-text"
      >
        <LifeBuoy size={17} strokeWidth={1.75} />
        need help now?
      </Link>
    </aside>
  );
}