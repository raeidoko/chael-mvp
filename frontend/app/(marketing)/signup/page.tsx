"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useChatStore } from "@/lib/store";
import { logEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          full_name: fullName,
          email: email,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }

      logEvent("signed_up");

      const localMessages = useChatStore.getState().messages;

      if (localMessages.length > 0) {
        const rows = localMessages.map((m) => ({
          user_id: data.user!.id,
          role: m.role,
          kind: m.kind,
          text: m.text ?? null,
          image_url: m.imageUrl ?? null,
          meta: m.meta ?? null,
          created_at: m.createdAt,
        }));

        const { error: messagesError } = await supabase
          .from("messages")
          .insert(rows);

        if (messagesError) {
          console.error("Message transfer error:", messagesError);
        }
      }

      router.push("/consent");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-text mb-2">
          create your account
        </h1>
        <p className="text-sm text-text-secondary mb-8">
          we will keep your data private and secure.
        </p>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="pr-11"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-accent text-[#1a0f0d]"
            disabled={loading}
          >
            {loading ? "creating account..." : "create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          already have an account?{" "}
          <Link href="/signin" className="text-accent underline-offset-4 hover:underline">
            sign in
          </Link>
        </p>

        <p className="mt-8 text-center text-xs text-text-secondary/60">
          by continuing, you agree to our{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            privacy policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="underline underline-offset-4">
            terms of service
          </Link>
          .
        </p>
      </div>
    </div>
  );
}