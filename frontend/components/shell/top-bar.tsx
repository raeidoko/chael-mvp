"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export function TopBar() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsSignedIn(!!user);
      setCheckingAuth(false);
    }
    checkAuth();
  }, []);

  if (checkingAuth || isSignedIn) return null;

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg/95 px-4 py-2.5 backdrop-blur-sm md:px-6">
      <span className="font-display text-lg text-accent">chael</span>
      <Link
        href="/signup"
        className="rounded-btn bg-accent px-4 py-2 text-sm font-medium text-[#1a0f0d] transition-colors hover:bg-accent-strong"
      >
        create an account to save your results
      </Link>
    </div>
  );
}