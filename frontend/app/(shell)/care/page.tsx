"use client";

import { Bell, LifeBuoy } from "lucide-react";
import { DoctorCard } from "@/components/care/doctor-card";
import { ArticleCard } from "@/components/care/article-card";
import { Button } from "@/components/ui/button";
import { realDoctors } from "@/lib/doctors";
import { articles, appointments } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function CarePage() {
  const doctors = realDoctors;
  const saved = doctors.filter((d) => d.saved);

  return (
    <div className="min-h-screen px-5 pb-10 pt-6 md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl">care</h1>
          <button
            aria-label="Notifications"
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-2 hover:text-text"
          >
            <Bell size={19} />
          </button>
        </div>

        <section className="mt-8">
          <h2 className="mb-4 text-sm text-text-secondary">our dermatologists</h2>
          {doctors.length === 0 ? (
            <div className="rounded-container border border-border bg-surface px-5 py-8 text-center">
              <p className="text-[15px] text-text">
                we&apos;re building our network of dermatologists who understand melanin-rich skin.
              </p>
              <p className="mt-1.5 text-sm text-text-secondary">check back soon.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {doctors.map((d) => (
                <DoctorCard key={d.id} doctor={d} />
              ))}
            </div>
          )}
        </section>

        {saved.length > 0 && (
          <section id="saved" className="mt-10 scroll-mt-24">
            <h2 className="mb-4 text-sm text-text-secondary">bookmarked derms &amp; clinics</h2>
            <div className="flex flex-col gap-3">
              {saved.map((d) => (
                <DoctorCard key={d.id} doctor={d} />
              ))}
            </div>
          </section>
        )}

        <section id="appointments" className="mt-10 scroll-mt-24">
          <h2 className="mb-4 text-sm text-text-secondary">appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-[15px] text-text-secondary">
              you don&apos;t have any appointments yet. booking one is quick.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {appointments.map((a) => {
                const doctor = doctors.find((d) => d.id === a.doctorId);
                if (!doctor) return null;
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-container border border-border bg-surface p-4"
                  >
                    <div>
                      <p className="text-[15px] text-text">{doctor.name}</p>
                      <p className="mt-0.5 text-sm text-text-secondary">
                        {formatDate(a.date, { month: "long", day: "numeric" })} · {a.time} ·{" "}
                        {a.type === "in-person" ? "in-person" : "video"}
                      </p>
                    </div>
                    <span className="text-xs capitalize text-text-secondary">{a.status}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section id="resources" className="mt-10 scroll-mt-24">
          <h2 className="mb-4 text-sm text-text-secondary">resources</h2>
          <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 md:mx-0 md:px-0">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>

        <section id="emergency" className="mt-10 scroll-mt-24">
          <div className="flex items-center gap-4 rounded-container bg-surface-2 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-[#1a0f0d]">
              <LifeBuoy size={19} />
            </span>
            <div className="flex-1">
              <p className="text-[15px] text-text">need help now?</p>
              <p className="text-sm text-text-secondary">chat with a medical professional</p>
            </div>
            <Button size="sm">start</Button>
          </div>
        </section>
      </div>
    </div>
  );
}