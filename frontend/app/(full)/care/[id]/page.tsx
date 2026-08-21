"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { realDoctors } from "@/lib/doctors";
import { cn } from "@/lib/utils";

export default function DoctorProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const doctor = realDoctors.find((d) => d.id === params.id);

  if (!doctor) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="font-display text-2xl">we couldn&apos;t find that profile</p>
        <Button variant="outline" onClick={() => router.push("/care")}>
          back to care
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="relative">
        <img
          src={doctor.photoUrl}
          alt={doctor.name}
          className="h-80 w-full object-cover md:h-96"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
          <button
            aria-label="Back"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a0f0d]/35 text-[#fdf0f4] backdrop-blur-sm"
          >
            <ArrowLeft size={19} />
          </button>
          <button
            aria-label={doctor.saved ? "Remove from saved" : "Save doctor"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a0f0d]/35 text-[#fdf0f4] backdrop-blur-sm"
          >
            <Heart size={18} className={cn(doctor.saved && "fill-accent text-accent")} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-6 pt-6">
        <h1 className="font-display text-3xl">{doctor.name}</h1>
        <p className="mt-1 text-[15px] text-text-secondary">{doctor.title}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Star size={14} className="fill-accent-strong text-accent-strong" />
            {doctor.rating} ({doctor.reviewCount} reviews)
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} /> {doctor.location}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {doctor.specialties.map((s) => (
            <Badge key={s} tone="neutral">
              {s}
            </Badge>
          ))}
        </div>

        <p className="mt-6 text-[15px] leading-relaxed text-text-secondary">{doctor.bio}</p>

        <div className="mt-8">
          <p className="mb-3 text-xs text-text-secondary">next availability</p>
          <div className="flex flex-wrap gap-2">
            {doctor.availability.map((slot) => (
              <span
                key={slot}
                className="rounded-pill border border-border bg-surface px-4 py-2 text-sm text-text"
              >
                {slot}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-bg/95 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto max-w-lg">
          <Button size="lg" className="w-full" onClick={() => router.push(`/care/${doctor.id}/book`)}>
            book appointment
          </Button>
        </div>
      </div>
    </div>
  );
}