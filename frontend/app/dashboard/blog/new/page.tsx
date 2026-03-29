"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BlogPostDraftForm } from "@/app/components/blog/BlogPostDraftForm";
import { getApiBase } from "@/lib/api";
import { authHeaders, clearTokens, getAccessToken } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export default function DashboardNewBlogPostPage() {
  const router = useRouter();
  const base = getApiBase();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [published, setPublished] = useState(true);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

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
    router.push("/dashboard/blog");
  }

  if (!getAccessToken()) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <Link
          href="/dashboard/blog"
          className="text-zinc-500 transition hover:text-white"
        >
          ← All posts
        </Link>
      </div>

      <BlogPostDraftForm
        stickyHeading="New story"
        stickyBadge="Draft"
        submitLabel="Publish"
        editorMountKey="new"
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
  );
}
