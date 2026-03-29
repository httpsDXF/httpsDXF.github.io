"use client";

import { BlogEditor } from "@/app/components/blog/BlogEditor";

export function BlogPostDraftForm({
  stickyHeading,
  stickyBadge = "Draft",
  submitLabel,
  editorMountKey,
  initialHtml,
  title,
  setTitle,
  slug,
  setSlug,
  description,
  setDescription,
  setBodyHtml,
  published,
  setPublished,
  coverFile,
  setCoverFile,
  mediaFiles,
  setMediaFiles,
  onSubmit,
  err,
  msg,
}: {
  stickyHeading: string;
  stickyBadge?: string;
  submitLabel: string;
  editorMountKey: string | number;
  initialHtml: string;
  title: string;
  setTitle: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  setBodyHtml: (v: string) => void;
  published: boolean;
  setPublished: (v: boolean) => void;
  coverFile: File | null;
  setCoverFile: (f: File | null) => void;
  mediaFiles: File[];
  setMediaFiles: (f: File[]) => void;
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
        <label className="sr-only" htmlFor="post-title">
          Title
        </label>
        <input
          id="post-title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border-0 bg-transparent font-serif text-4xl font-normal tracking-tight text-white placeholder:text-zinc-600 focus:outline-none focus:ring-0 md:text-5xl"
        />

        <div className="mt-8 min-h-[420px] border-t border-white/5 pt-6">
          <BlogEditor
            key={String(editorMountKey)}
            initialHtml={initialHtml}
            onChange={setBodyHtml}
          />
        </div>

        <label className="mt-8 flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded border-white/30"
          />
          Visible on public blog
        </label>

        <details className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium text-zinc-300">
            Post settings
          </summary>
          <div className="mt-4 flex flex-col gap-4 pb-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-500">Slug</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto from title"
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-500">Description</span>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/35"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-500">Cover image (optional)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                className="text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-zinc-500">
                Gallery — images & videos (optional)
              </span>
              <input
                type="file"
                multiple
                accept="image/*,video/mp4,video/webm,video/quicktime"
                onChange={(e) =>
                  setMediaFiles(e.target.files ? Array.from(e.target.files) : [])
                }
                className="text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white"
              />
              <span className="text-xs text-zinc-500">
                {mediaFiles.length > 0
                  ? "New files replace the gallery when you save."
                  : "Leave empty to keep the current gallery."}
              </span>
            </label>
          </div>
        </details>

        {err ? (
          <p className="mt-4 text-sm text-red-400/90" role="alert">
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
