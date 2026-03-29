"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { PortfolioCategoryChips } from "@/app/components/portfolio/PortfolioCategoryChips";
import {
  fetchPortfolioCategories,
  fetchPortfolioProjects,
  mediaUrl,
  type PortfolioCategory,
  type PortfolioProject,
} from "@/lib/api";

function isPlaceholderPortfolioList(list: PortfolioProject[]): boolean {
  return list.length > 0 && list[0].id < 0;
}

function PortfolioGridCard({
  p,
  staggerIndex,
}: {
  p: PortfolioProject;
  staggerIndex: number;
}) {
  const delayMs = Math.min(staggerIndex, 24) * 48;
  const cover = p.cover_image_url ? mediaUrl(p.cover_image_url) : null;

  return (
    <Link
      href={`/portfolio/${p.slug}`}
      className="card-fade-up group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/35 hover:border-white/20 hover:bg-zinc-900/55 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/35"
      style={
        {
          "--card-fade-delay": `${delayMs}ms`,
        } as CSSProperties
      }
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-800">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            className="object-cover transition duration-(--t-ui) group-hover:opacity-95"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800/90 text-xs text-zinc-500">
            No cover
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {p.meta || "Project"}
        </p>
        <h3 className="mt-2 text-lg font-semibold leading-snug text-white group-hover:text-white/95">
          {p.title}
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">
          {p.description}
        </p>
        <p className="mt-4 flex items-center gap-1 text-sm font-medium text-white/80">
          Open
          <span
            className="transition-transform duration-(--t-fast) ease-(--ease-smooth) group-hover:translate-x-0.5"
            aria-hidden
          >
            →
          </span>
        </p>
      </div>
    </Link>
  );
}

export function PortfolioIndexClient() {
  const searchParams = useSearchParams();
  const activeCategorySlug = searchParams.get("category")?.trim() || undefined;

  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [cats, projs] = await Promise.all([
        fetchPortfolioCategories(),
        fetchPortfolioProjects(),
      ]);
      if (!cancelled) {
        setCategories(cats);
        setProjects(projs);
        setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!activeCategorySlug) return projects;
    return projects.filter((p) =>
      p.categories.some((c) => c.slug === activeCategorySlug),
    );
  }, [projects, activeCategorySlug]);

  const staggerBySlug = useMemo(() => {
    let i = 0;
    const m = new Map<string, number>();
    for (const p of filtered) {
      m.set(p.slug, i++);
    }
    return m;
  }, [filtered]);

  const showSampleNote = isPlaceholderPortfolioList(projects);

  if (!loaded) {
    return (
      <p className="mt-6 text-zinc-500" aria-live="polite">
        Loading…
      </p>
    );
  }

  return (
    <>
      <PortfolioCategoryChips
        categories={categories}
        activeSlug={activeCategorySlug}
      />
      <p className="mt-4 max-w-2xl text-lg text-zinc-400">
        Use the chips to filter by category. Covers and case studies are edited
        in the dashboard (with the API running).
      </p>

      {filtered.length === 0 ? (
        <p className="mt-10 text-zinc-500">
          {activeCategorySlug
            ? "No projects in this category yet."
            : "No projects yet."}
        </p>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.slug}>
              <PortfolioGridCard
                p={p}
                staggerIndex={staggerBySlug.get(p.slug) ?? 0}
              />
            </li>
          ))}
        </ul>
      )}

      {showSampleNote ? (
        <p className="mt-10 max-w-2xl text-sm text-zinc-500">
          Sample projects only. Add real ones in the dashboard once the API is
          connected.
        </p>
      ) : null}
    </>
  );
}
