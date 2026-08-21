"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { realDoctors } from "@/lib/doctors";
import { formatDate } from "@/lib/utils";

const timeSlots = ["9:00 am", "10:00 am", "11:30 am", "1:00 pm", "2:30 pm", "4:30 pm"];

export default function BookAppointmentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const doctor = realDoctors.find((d) => d.id === params.id);

  const [date, setDate] = useState("");
  const [time, setTime] = useState(timeSlots[0]);
  const [type, setType] = useState<"in-person" | "video">("in-person");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (!doctor) return null;

  if (confirmed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-[#1a0f0d]"
        >
          <CalendarCheck size={26} />
        </motion.div>
        <div>
          <h1 className="font-display text-3xl">you&apos;re booked</h1>
          <p className="mt-3 max-w-xs text-[15px] text-text-secondary">
            {doctor.name} will see you {date ? formatDate(date, { month: "long", day: "numeric" }) : "soon"}{" "}
            at {time}. we&apos;ll send a reminder beforehand.
          </p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3 pt-4">
          <Button size="lg" onClick={() => router.push("/care#appointments")}>
            view appointments
          </Button>
          <Button variant="ghost" onClick={() => router.push("/chat")}>
            back to chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pb-10 pt-6 md:px-10">
      <div className="mx-auto max-w-md">
        <button
          aria-label="Back"
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-2 hover:text-text"
        >
          <ArrowLeft size={19} />
        </button>

        <h1 className="mt-6 font-display text-3xl">book appointment</h1>
        <p className="mt-2 text-[15px] text-text-secondary">with {doctor.name}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setConfirmed(true);
          }}
          className="mt-8 flex flex-col gap-5"
        >
          <label className="flex flex-col gap-2 text-sm text-text-secondary">
            date
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </label>

          <label className="flex flex-col gap-2 text-sm text-text-secondary">
            time
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-input border border-border bg-surface px-5 py-4 text-[15px] text-text focus:outline-none focus:border-accent-strong"
            >
              {timeSlots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-2 text-sm text-text-secondary">
            type
            <div className="flex gap-2">
              {(["in-person", "video"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 rounded-input border px-4 py-3 text-sm transition-colors duration-250 ${
                    type === t ? "border-accent-strong bg-surface-2 text-text" : "border-border text-text-secondary"
                  }`}
                >
                  {t === "in-person" ? "in-person" : "video call"}
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-2 text-sm text-text-secondary">
            reason (optional)
            <Input
              placeholder="e.g. acne consultation"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>

          <Button type="submit" size="lg" className="mt-3 w-full">
            confirm booking
          </Button>
        </form>
      </div>
    </div>
  );
}