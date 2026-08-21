"use client";

import { Article } from "@/lib/types";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <button className="flex w-64 shrink-0 flex-col gap-3 text-left">
      <div className="overflow-hidden rounded-photo">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="aspect-[3/2] w-full object-cover"
        />
      </div>
      <div>
        <p className="text-xs text-text-secondary">
          {article.category} · {article.readTime}
        </p>
        <p className="mt-1 text-[15px] leading-snug text-text">{article.title}</p>
      </div>
    </button>
  );
}
