"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { supabase } from "@/lib/supabase";

export default function EditProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reminders, setReminders] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setLoading(false);
        return;
      }

      setUserId(authUser.id);
      setEmail(authUser.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", authUser.id)
        .single();

      if (profile?.full_name) {
        setName(profile.full_name);
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: name, email })
      .eq("id", userId);

    if (profileError) {
      console.error("Profile update error:", profileError);
      return;
    }

    await supabase.auth.updateUser({ email });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-text-secondary">loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 pb-10 pt-6 md:px-8">
      <div className="mx-auto max-w-md">
        <div className="flex items-center gap-4">
          <button
            aria-label="Back"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-2 hover:text-text"
          >
            <ArrowLeft size={19} />
          </button>
          <h1 className="font-display text-2xl">edit profile</h1>
        </div>

        <form onSubmit={handleSave} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm text-text-secondary">
            full name
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="flex flex-col gap-2 text-sm text-text-secondary">
            email address
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <div id="notifications" className="mt-4 scroll-mt-24 rounded-container border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[15px] text-text">routine reminders</p>
                <p className="mt-0.5 text-xs text-text-secondary">a gentle nudge to log in each evening</p>
              </div>
              <Toggle checked={reminders} onChange={setReminders} label="Routine reminders" />
            </div>
          </div>

          <div id="password" className="scroll-mt-24">
            <label className="flex flex-col gap-2 text-sm text-text-secondary">
              new password
              <Input type="password" placeholder="leave blank to keep current password" />
            </label>
          </div>

          <Button type="submit" size="lg" className="mt-4 w-full">
            {saved ? "saved" : "save changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}