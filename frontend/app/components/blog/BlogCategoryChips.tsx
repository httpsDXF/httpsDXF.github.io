import Link from "next/link";

import type { BlogCategory } from "@/lib/api";

type Props = {
  categories: BlogCategory[];
  activeSlug?: string | null;
};

export function BlogCategoryChips({ categories, activeSlug }: Props) {
  const sorted = [...categories].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={`rounded-full border px-3 py-1 text-sm transition-colors ${
          !activeSlug
            ? "border-white/30 bg-white text-zinc-950"
            : "border-white/15 text-zinc-400 hover:border-white/25 hover:text-white"
        }`}
      >
        All
      </Link>
      {sorted.map((c) => {
        const isActive = activeSlug === c.slug;
        return (
          <Link
            key={c.id}
            href={`/blog?category=${encodeURIComponent(c.slug)}`}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              isActive
                ? "border-white/30 bg-white text-zinc-950"
                : "border-white/15 text-zinc-400 hover:border-white/25 hover:text-white"
            }`}
          >
            {c.name}
          </Link>
        );
      })}
    </div>
  );
}
