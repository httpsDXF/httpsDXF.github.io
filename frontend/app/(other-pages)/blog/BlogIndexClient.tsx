"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, type CSSProperties } from "react";
import { BlogCardPreview } from "@/app/components/blog/BlogCardPreview";
import { BlogCategoryChips } from "@/app/components/blog/BlogCategoryChips";
import type { BlogCategory, BlogPost } from "@/lib/api";

function filterPostsByCategory(
  posts: BlogPost[],
  categorySlug: string | undefined,
): BlogPost[] {
  if (!categorySlug) return posts;
  return posts.filter((p) =>
    (p.categories ?? []).some((c) => c.slug === categorySlug),
  );
}

type Props = {
  postsAll: BlogPost[];
  categories: BlogCategory[];
  showPreviewNote: boolean;
};

export function BlogIndexClient({
  postsAll,
  categories,
  showPreviewNote,
}: Props) {
  const searchParams = useSearchParams();
  const activeCategorySlug =
    searchParams.get("category")?.trim() || undefined;
  const posts = useMemo(
    () => filterPostsByCategory(postsAll, activeCategorySlug),
    [postsAll, activeCategorySlug],
  );

  return (
    <>
      <BlogCategoryChips
        categories={categories}
        activeSlug={activeCategorySlug}
      />
      <p className="mt-4 max-w-2xl text-lg text-white/70">
        Notes on engineering, robotics, and the work in between—build logs,
        sketches, and longer essays.
      </p>
      {showPreviewNote ? (
        <p className="mt-4 max-w-2xl text-sm text-zinc-500">
          Showing a curated preview—new work will appear here as it goes live.
        </p>
      ) : null}

      {posts.length === 0 ? (
        <p className="mt-10 text-zinc-500">
          {activeCategorySlug
            ? "No posts in this category."
            : "Nothing published here yet."}
        </p>
      ) : (
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="card-fade-up group block overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-sm hover:border-white/20 hover:bg-zinc-900/70"
                style={
                  {
                    "--card-fade-delay": `${Math.min(i, 24) * 48}ms`,
                  } as CSSProperties
                }
              >
                <BlogCardPreview coverUrl={p.cover_image_url} />
                <div className="p-5 md:p-6">
                  <h2 className="text-lg font-semibold leading-snug tracking-tight text-white">
                    {p.title}
                  </h2>
                  {p.description ? (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                      {p.description}
                    </p>
                  ) : null}
                  <p className="mt-4 text-xs text-zinc-500">
                    {new Date(p.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="mt-3 flex items-center gap-1 text-sm font-medium text-white/85">
                    Read
                    <span
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    >
                      →
                    </span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
