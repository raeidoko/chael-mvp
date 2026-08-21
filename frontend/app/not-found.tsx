import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-8 text-center">
      <h1 className="font-display text-4xl">this page wandered off</h1>
      <p className="max-w-xs text-[15px] text-text-secondary">
        we couldn&apos;t find what you were looking for. let&apos;s get you back somewhere familiar.
      </p>
      <Link
        href="/chat"
        className="mt-2 rounded-btn bg-button px-6 py-3 text-[15px] font-medium text-button-text"
      >
        back to chael
      </Link>
    </div>
  );
}
