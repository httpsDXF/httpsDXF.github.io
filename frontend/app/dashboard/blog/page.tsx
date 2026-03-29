"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BlogPostDraftForm } from "@/app/components/blog/BlogPostDraftForm";
import { getApiBase, mediaUrl, type BlogPost } from "@/lib/api";
import { authHeaders, clearTokens, getAccessToken } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export default function DashboardBlogPage() {
  const router = useRouter();
  const base = getApiBase();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const [published, setPublished] = useState(true);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!base) return;
    const r = await fetch(`${base}/api/blog/posts/`, { headers: authHeaders() });
    if (r.status === 401) {
      clearTokens();
      router.replace("/dashboard/login");
      return;
    }
    if (!r.ok) return;
    setPosts(await r.json());
  }, [base, router]);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/dashboard/login");
      return;
    }
    const id = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(id);
  }, [router, load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    if (!base) {
      setErr("Missing NEXT_PUBLIC_API_URL.");
      return;
    }
    const textLen = bodyHtml
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim().length;
    if (textLen < 12) {
      setErr("Add more to the story body — text, headings, or images.");
      return;
    }
    const fd = new FormData();
    fd.append("title", title);
    fd.append("slug", slug || slugify(title));
    fd.append("description", description);
    fd.append("body", bodyHtml);
    fd.append("body_format", "html");
    fd.append("published", published ? "true" : "false");
    if (coverFile) fd.append("cover_image", coverFile);
    for (const f of mediaFiles) {
      fd.append("media", f);
    }

    const r = await fetch(`${base}/api/blog/posts/`, {
      method: "POST",
      headers: authHeaders(),
      body: fd,
    });
    if (r.status === 401) {
      clearTokens();
      router.replace("/dashboard/login");
      return;
    }
    if (!r.ok) {
      const j = (await r.json().catch(() => ({}))) as Record<string, unknown>;
      setErr(JSON.stringify(j));
      return;
    }
    setMsg("Post created.");
    setTitle("");
    setSlug("");
    setDescription("");
    setBodyHtml("");
    setEditorKey((k) => k + 1);
    setPublished(true);
    setCoverFile(null);
    setMediaFiles([]);
    void load();
  }

  async function deletePost(slug: string, title: string) {
    if (!base) return;
    const ok = window.confirm(
      `Delete “${title}”? This cannot be undone.`,
    );
    if (!ok) return;
    setDeletingSlug(slug);
    setErr(null);
    try {
      const r = await fetch(`${base}/api/blog/posts/${slug}/`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (r.status === 401) {
        clearTokens();
        router.replace("/dashboard/login");
        return;
      }
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as Record<string, unknown>;
        setErr(typeof j.detail === "string" ? j.detail : "Could not delete post.");
        return;
      }
      setMsg("Post deleted.");
      void load();
    } finally {
      setDeletingSlug(null);
    }
  }

  if (!getAccessToken()) return null;

  return (
    <div className="pt-2">
      <p className="text-sm text-zinc-500">
        Open a post card to edit. Use the{" "}
        <span className="text-zinc-400">+</span> beside an empty line in the
        editor to add images, video, YouTube, code, or a divider.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-white">All posts</h2>
        {posts.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center text-sm text-zinc-500">
            No posts yet. Compose a new story below.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-sm shadow-black/20 transition hover:border-white/20 hover:bg-zinc-900/60">
                  <Link
                    href={`/dashboard/blog/edit?slug=${encodeURIComponent(p.slug)}`}
                    className="group flex min-h-0 flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                  >
                    <div className="relative aspect-[16/10] w-full bg-zinc-800">
                      {p.cover_image_url ? (
                        <Image
                          src={mediaUrl(p.cover_image_url)}
                          alt=""
                          fill
                          className="object-cover transition group-hover:opacity-95"
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-800/90 text-xs text-zinc-500">
                          No cover
                        </div>
                      )}
                      <div className="absolute left-3 top-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            p.published
                              ? "bg-emerald-950/80 text-emerald-200/90 ring-1 ring-emerald-500/30"
                              : "bg-zinc-950/80 text-zinc-400 ring-1 ring-white/10"
                          }`}
                        >
                          {p.published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="line-clamp-2 font-medium leading-snug text-white group-hover:text-emerald-50/95">
                        {p.title}
                      </h3>
                      {p.description ? (
                        <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                          {p.description}
                        </p>
                      ) : null}
                      <p className="mt-3 text-xs text-zinc-600">
                        Updated{" "}
                        {new Date(p.updated_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <span className="mt-3 text-sm font-medium text-emerald-400/90 group-hover:text-emerald-300">
                        Edit →
                      </span>
                    </div>
                  </Link>
                  <div className="flex items-center justify-end gap-2 border-t border-white/10 px-4 py-3">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      disabled={deletingSlug === p.slug}
                      onClick={() => void deletePost(p.slug, p.title)}
                      className="rounded-lg px-3 py-1.5 text-sm text-red-400/90 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                    >
                      {deletingSlug === p.slug ? "…" : "Delete"}
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16 border-t border-white/10 pt-12">
        <h2 className="text-lg font-semibold text-white">New story</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Start a draft; publish when you are ready.
        </p>
        <div className="mt-8">
          <BlogPostDraftForm
            stickyHeading="New story"
            stickyBadge="Draft"
            submitLabel="Publish"
            editorMountKey={editorKey}
            initialHtml=""
            title={title}
            setTitle={setTitle}
            slug={slug}
            setSlug={setSlug}
            description={description}
            setDescription={setDescription}
            setBodyHtml={setBodyHtml}
            published={published}
            setPublished={setPublished}
            coverFile={coverFile}
            setCoverFile={setCoverFile}
            mediaFiles={mediaFiles}
            setMediaFiles={setMediaFiles}
            onSubmit={create}
            err={err}
            msg={msg}
          />
        </div>
      </section>
    </div>
  );
}
