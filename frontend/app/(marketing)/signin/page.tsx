"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // If email not confirmed, still let them in for alpha
      if (signInError.message.includes('Email not confirmed')) {
        router.push('/chat');
        return;
      }
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      router.push("/chat");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-text mb-2">
          welcome back
        </h1>
        <p className="text-sm text-text-secondary mb-8">
          sign in to continue with Chael.
        </p>

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
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
            {loading ? "signing in..." : "sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          do not have an account?{" "}
          <Link href="/signup" className="text-accent underline-offset-4 hover:underline">
            create one
          </Link>
        </p>
      </div>
    </div>
  );
}