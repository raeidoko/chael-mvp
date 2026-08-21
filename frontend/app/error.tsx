"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#3e2723] px-8 text-center text-[#f6eee8]">
          <h1 className="font-display text-4xl">something didn&apos;t load right</h1>
          <p className="max-w-xs text-[15px] text-[#f6eee8]/75">
            this is on us, not your skin. try again in a moment.
          </p>
          <Button onClick={() => reset()} className="mt-2 bg-[#f4c9d6] text-[#3e2723]">
            try again
          </Button>
        </div>
      </body>
    </html>
  );
}
