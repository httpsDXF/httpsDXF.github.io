"use client";

import { BlogCoverImageField } from "@/app/components/blog/BlogCoverImageField";
import type { PortfolioCategory } from "@/lib/api";

export const DEFAULT_CASE_STUDY_JSON = `[
  {
    "heading": "Overview",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Describe the project, constraints, and outcome."
      }
    ]
  }
]`;

export function PortfolioProjectForm({
  stickyHeading,
  stickyBadge = "Draft",
  submitLabel,
  title,
  setTitle,
  slug,
  setSlug,
  description,
  setDescription,
  meta,
  setMeta,
  order,
  setOrder,
  published,
  setPublished,
  coverFile,
  setCoverFile,
  initialCoverUrl,
  caseStudyJson,
  setCaseStudyJson,
  categoriesList,
  selectedCategorySlugs,
  toggleCategorySlug,
  onSubmit,
  err,
  msg,
}: {
  stickyHeading: string;
  stickyBadge?: string;
  submitLabel: string;
  title: string;
  setTitle: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  meta: string;
  setMeta: (v: string) => void;
  order: string;
  setOrder: (v: string) => void;
  published: boolean;
  setPublished: (v: boolean) => void;
  coverFile: File | null;
  setCoverFile: (f: File | null) => void;
  initialCoverUrl?: string | null;
  caseStudyJson: string;
  setCaseStudyJson: (v: string) => void;
  categoriesList: PortfolioCategory[];
  selectedCategorySlugs: string[];
  toggleCategorySlug: (s: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  err: string | null;
  msg: string | null;
}) {
  return (
    <form onSubmit={onSubmit} className="pt-2">
      <div className="sticky top-0 z-10 -mx-4 mb-8 flex items-center justify-between gap-4 border-b border-white/10 bg-zinc-950/90 px-4 py-3 backdrop-blur-md md:-mx-6 md:px-6">
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="font-serif text-lg font-semibold tracking-tight text-white">
            {stickyHeading}
          </span>
          <span className="text-sm text-zinc-500">{stickyBadge}</span>
        </div>
        <button
          type="submit"
          className="interaction-smooth shrink-0 rounded-full border border-emerald-600/50 bg-emerald-600/25 px-5 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-600/35"
        >
          {submitLabel}
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-1 pt-2">
        <label className="sr-only" htmlFor="portfolio-title">
          Title
        </label>
        <input
          id="portfolio-title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project title"
          className="w-full border-0 bg-transparent font-serif text-4xl font-normal tracking-tight text-white placeholder:text-zinc-600 focus:outline-none focus:ring-0 md:text-5xl"
        />

        <div className="mt-8 space-y-6 border-t border-white/5 pt-6">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-500">URL slug</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-project"
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-500">Short description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="One or two lines for the card and SEO."
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-500">Meta label (eyebrow)</span>
            <input
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              placeholder="e.g. Hardware · Prototype"
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
            />
          </label>
          <label className="flex w-full max-w-[120px] flex-col gap-1 text-sm">
            <span className="text-zinc-500">Sort order</span>
            <input
              type="number"
              min={0}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
            />
          </label>
        </div>

        <div className="mt-10">
          <BlogCoverImageField
            coverFile={coverFile}
            onCoverFileChange={setCoverFile}
            initialCoverUrl={initialCoverUrl}
          />
        </div>

        <label className="mt-10 flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded border-white/30"
          />
          Published on public portfolio
        </label>

        {categoriesList.length > 0 ? (
          <fieldset className="mt-6">
            <legend className="text-sm font-medium text-zinc-500">
              Categories (filter chips)
            </legend>
            <ul className="mt-2 flex flex-wrap gap-2">
              {[...categoriesList]
                .sort(
                  (a, b) =>
                    a.order - b.order || a.name.localeCompare(b.name),
                )
                .map((c) => {
                  const on = selectedCategorySlugs.includes(c.slug);
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => toggleCategorySlug(c.slug)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition ${
                          on
                            ? "border-emerald-500/50 bg-emerald-600/20 text-emerald-100"
                            : "border-white/15 bg-white/[0.03] text-zinc-400 hover:border-white/25 hover:text-zinc-200"
                        }`}
                      >
                        {c.name}
                      </button>
                    </li>
                  );
                })}
            </ul>
          </fieldset>
        ) : null}

        <div className="mt-10">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-zinc-500">Case study (JSON)</span>
            <p className="text-xs text-zinc-600">
              Array of sections with{" "}
              <code className="text-zinc-500">heading</code> and{" "}
              <code className="text-zinc-500">blocks</code>. Blocks:{" "}
              <code className="text-zinc-500">paragraph</code>,{" "}
              <code className="text-zinc-500">image</code> (src, alt, caption),{" "}
              <code className="text-zinc-500">video</code> (youtube, vimeo, or
              fileUrl).
            </p>
            <textarea
              value={caseStudyJson}
              onChange={(e) => setCaseStudyJson(e.target.value)}
              spellCheck={false}
              rows={18}
              className="font-mono text-xs leading-relaxed text-zinc-200 rounded-lg border border-white/15 bg-zinc-950/80 px-3 py-2 outline-none focus:border-white/35"
            />
          </label>
        </div>

        {err ? (
          <p className="mt-6 text-sm text-red-400/90" role="alert">
            {err}
          </p>
        ) : null}
        {msg ? (
          <p className="mt-4 text-sm text-emerald-400/90">{msg}</p>
        ) : null}
      </div>
    </form>
  );
}
