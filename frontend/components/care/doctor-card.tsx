"use client";

import Link from "next/link";
import { Bookmark, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Doctor } from "@/lib/types";
import { useAppStore } from "@/lib/store";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const toggleSaveDoctor = useAppStore((s) => s.toggleSaveDoctor);

  return (
    <div className="flex gap-4 rounded-container border border-border bg-surface p-4">
      <Link href={`/care/${doctor.id}`} className="shrink-0 overflow-hidden rounded-photo">
        <img
          src={doctor.photoUrl}
          alt={doctor.name}
          className="h-24 w-20 object-cover sm:h-28 sm:w-24"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/care/${doctor.id}`} className="min-w-0">
            <p className="truncate text-[15px] font-medium text-text">{doctor.name}</p>
            <p className="text-sm text-text-secondary">{doctor.title}</p>
          </Link>
          <button
            aria-label={doctor.saved ? "Remove from saved" : "Save doctor"}
            onClick={() => toggleSaveDoctor(doctor.id)}
            className="shrink-0 text-text-secondary transition-colors hover:text-text"
          >
            <Bookmark size={18} className={cn(doctor.saved && "fill-accent-strong text-accent-strong")} />
          </button>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-text-secondary">
          <Star size={13} className="fill-accent-strong text-accent-strong" />
          {doctor.rating} ({doctor.reviewCount} reviews)
          <span className="text-border">·</span>
          {doctor.distanceMiles} mi
        </div>

        <p className="mt-auto pt-3 text-xs text-text-secondary">
          next available: {doctor.availability[0]}
        </p>
      </div>
    </div>
  );
}
