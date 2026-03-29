"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { BlogPostDraftForm } from "@/app/components/blog/BlogPostDraftForm";
import { getApiBase, type BlogCategory, type BlogPost } from "@/lib/api";
import { authHeaders, clearTokens, getAccessToken } from "@/lib/auth";

function EditBlogPostInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug")?.trim() ?? "";
  const base = getApiBase();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [published, setPublished] = useState(true);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [categoriesList, setCategoriesList] = useState<BlogCategory[]>([]);
  const [selectedCategorySlugs, setSelectedCategorySlugs] = useState<string[]>(
    [],
  );

  const loadCategories = useCallback(async () => {
    if (!base) return;
    const r = await fetch(`${base}/api/blog/categories/`, {
      headers: authHeaders(),
    });
    if (r.status === 401) {
      clearTokens();
      router.replace("/dashboard/login");
      return;
    }
    if (r.ok) setCategoriesList(await r.json());
  }, [base, router]);

  const load = useCallback(async () => {
    if (!base || !slugParam) return;
    setLoadErr(null);
    setPost(null);
    const r = await fetch(
      `${base}/api/blog/posts/${encodeURIComponent(slugParam)}/`,
      { headers: authHeaders() },
    );
    if (r.status === 401) {
      clearTokens();
      router.replace("/dashboard/login");
      return;
    }
    if (r.status === 404) {
      setLoadErr("Post not found.");
      return;
    }
    if (!r.ok) {
      setLoadErr("Could not load post.");
      return;
    }
    const data = (await r.json()) as BlogPost;
    setPost(data);
    setTitle(data.title);
    setSlug(data.slug);
    setDescription(data.description);
    setBodyHtml(data.body);
    setPublished(data.published);
    setCoverFile(null);
    setMediaFiles([]);
    setSelectedCategorySlugs(
      data.categories?.map((c) => c.slug) ?? [],
    );
  }, [base, router, slugParam]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/dashboard/login");
      return;
    }
    if (!slugParam) {
      setPost(null);
      setLoadErr(null);
      return;
    }
    void load();
  }, [router, slugParam, load]);

  function toggleCategorySlug(s: string) {
    setSelectedCategorySlugs((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    if (!base) {
      setErr("The API server URL isn’t configured.");
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
    fd.append("slug", slug);
    fd.append("description", description);
    fd.append("body", bodyHtml);
    fd.append("body_format", "html");
    fd.append("published", published ? "true" : "false");
    if (coverFile) fd.append("cover_image", coverFile);
    for (const f of mediaFiles) {
      fd.append("media", f);
    }
    fd.append("category_slugs", JSON.stringify(selectedCategorySlugs));

    const r = await fetch(
      `${base}/api/blog/posts/${encodeURIComponent(slugParam)}/`,
      {
        method: "PATCH",
        headers: authHeaders(),
        body: fd,
      },
    );
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
    const updated = (await r.json()) as BlogPost;
    setPost(updated);
    setTitle(updated.title);
    setSlug(updated.slug);
    setDescription(updated.description);
    setBodyHtml(updated.body);
    setPublished(updated.published);
    setCoverFile(null);
    setMediaFiles([]);
    setSelectedCategorySlugs(
      updated.categories?.map((c) => c.slug) ?? [],
    );
    setMsg("Saved.");
    if (updated.slug !== slugParam) {
      router.replace(
        `/dashboard/blog/edit?slug=${encodeURIComponent(updated.slug)}`,
      );
    }
  }

  if (!getAccessToken()) return null;

  if (!slugParam) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
        <p className="text-zinc-400">Choose a post from the list to edit.</p>
        <Link
          href="/dashboard/blog"
          className="mt-4 inline-block text-sm text-emerald-400/90 hover:text-emerald-300"
        >
          ← All posts
        </Link>
      </div>
    );
  }

  if (loadErr) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-zinc-400">{loadErr}</p>
        <Link
          href="/dashboard/blog"
          className="mt-4 inline-block text-sm text-emerald-400/90 hover:text-emerald-300"
        >
          ← Back to blog
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center text-sm text-zinc-500">
        Loading post…
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <Link
          href="/dashboard/blog"
          className="text-zinc-500 transition hover:text-white"
        >
          ← All posts
        </Link>
        <span className="text-zinc-700">·</span>
        <Link
          href={`/blog/${post.slug}`}
          className="text-zinc-500 transition hover:text-emerald-400/90"
        >
          View live
        </Link>
      </div>

      <BlogPostDraftForm
        stickyHeading="Edit story"
        stickyBadge={published ? "Published" : "Draft"}
        submitLabel="Save"
        editorMountKey={post.id}
        initialHtml={post.body}
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
        initialCoverUrl={post.cover_image_url}
        mediaFiles={mediaFiles}
        setMediaFiles={setMediaFiles}
        categoriesList={categoriesList}
        selectedCategorySlugs={selectedCategorySlugs}
        toggleCategorySlug={toggleCategorySlug}
        onSubmit={save}
        err={err}
        msg={msg}
      />
    </div>
  );
}

export default function EditBlogPostPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center text-sm text-zinc-500">
          Loading…
        </div>
      }
    >
      <EditBlogPostInner />
    </Suspense>
  );
}
