"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { PortfolioProjectForm } from "@/app/components/portfolio/PortfolioProjectForm";
import {
  getApiBase,
  type PortfolioCategory,
  type PortfolioProject,
} from "@/lib/api";
import { authHeaders, clearTokens, getAccessToken } from "@/lib/auth";

function parseCaseStudyPayload(
  raw: string,
): { ok: true; value: unknown } | { ok: false; message: string } {
  const t = raw.trim();
  if (!t) {
    return { ok: true, value: [] };
  }
  try {
    const v = JSON.parse(t) as unknown;
    if (!Array.isArray(v)) {
      return { ok: false, message: "Case study must be a JSON array." };
    }
    return { ok: true, value: v };
  } catch {
    return { ok: false, message: "Case study must be valid JSON." };
  }
}

function EditPortfolioProjectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug")?.trim() ?? "";
  const base = getApiBase();

  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [meta, setMeta] = useState("");
  const [order, setOrder] = useState("0");
  const [published, setPublished] = useState(true);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [caseStudyJson, setCaseStudyJson] = useState("[]");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [categoriesList, setCategoriesList] = useState<PortfolioCategory[]>(
    [],
  );
  const [selectedCategorySlugs, setSelectedCategorySlugs] = useState<string[]>(
    [],
  );

  const loadCategories = useCallback(async () => {
    if (!base) return;
    const r = await fetch(`${base}/api/portfolio/categories/`, {
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
    setProject(null);
    const r = await fetch(
      `${base}/api/portfolio/projects/${encodeURIComponent(slugParam)}/`,
      { headers: authHeaders() },
    );
    if (r.status === 401) {
      clearTokens();
      router.replace("/dashboard/login");
      return;
    }
    if (r.status === 404) {
      setLoadErr("Project not found.");
      return;
    }
    if (!r.ok) {
      setLoadErr("Could not load project.");
      return;
    }
    const data = (await r.json()) as PortfolioProject;
    setProject(data);
    setTitle(data.title);
    setSlug(data.slug);
    setDescription(data.description);
    setMeta(data.meta);
    setOrder(String(data.order));
    setPublished(data.published);
    setCoverFile(null);
    setCaseStudyJson(JSON.stringify(data.case_study ?? [], null, 2));
    setSelectedCategorySlugs(data.categories?.map((c) => c.slug) ?? []);
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
      setProject(null);
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
    const parsed = parseCaseStudyPayload(caseStudyJson);
    if (!parsed.ok) {
      setErr(parsed.message);
      return;
    }
    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("slug", slug.trim());
    fd.append("description", description);
    fd.append("meta", meta);
    const n = Number.parseInt(order, 10);
    fd.append("order", String(Number.isFinite(n) ? n : 0));
    fd.append("published", published ? "true" : "false");
    if (coverFile) fd.append("cover_image", coverFile);
    fd.append("category_slugs", JSON.stringify(selectedCategorySlugs));
    fd.append("case_study", JSON.stringify(parsed.value));

    const r = await fetch(
      `${base}/api/portfolio/projects/${encodeURIComponent(slugParam)}/`,
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
    const updated = (await r.json()) as PortfolioProject;
    setProject(updated);
    setTitle(updated.title);
    setSlug(updated.slug);
    setDescription(updated.description);
    setMeta(updated.meta);
    setOrder(String(updated.order));
    setPublished(updated.published);
    setCoverFile(null);
    setCaseStudyJson(JSON.stringify(updated.case_study ?? [], null, 2));
    setSelectedCategorySlugs(updated.categories?.map((c) => c.slug) ?? []);
    setMsg("Saved.");
    if (updated.slug !== slugParam) {
      router.replace(
        `/dashboard/portfolio/edit?slug=${encodeURIComponent(updated.slug)}`,
      );
    }
  }

  if (!getAccessToken()) return null;

  if (!slugParam) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
        <p className="text-zinc-400">Choose a project from the list to edit.</p>
        <Link
          href="/dashboard/portfolio"
          className="mt-4 inline-block text-sm text-emerald-400/90 hover:text-emerald-300"
        >
          ← All projects
        </Link>
      </div>
    );
  }

  if (loadErr) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-zinc-400">{loadErr}</p>
        <Link
          href="/dashboard/portfolio"
          className="mt-4 inline-block text-sm text-emerald-400/90 hover:text-emerald-300"
        >
          ← Back to portfolio
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center text-sm text-zinc-500">
        Loading project…
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <Link
          href="/dashboard/portfolio"
          className="text-zinc-500 transition hover:text-white"
        >
          ← All projects
        </Link>
        <span className="text-zinc-700">·</span>
        <Link
          href={`/portfolio/${project.slug}`}
          className="text-zinc-500 transition hover:text-emerald-400/90"
        >
          View live
        </Link>
      </div>

      <PortfolioProjectForm
        stickyHeading="Edit project"
        stickyBadge={published ? "Published" : "Draft"}
        submitLabel="Save"
        title={title}
        setTitle={setTitle}
        slug={slug}
        setSlug={setSlug}
        description={description}
        setDescription={setDescription}
        meta={meta}
        setMeta={setMeta}
        order={order}
        setOrder={setOrder}
        published={published}
        setPublished={setPublished}
        coverFile={coverFile}
        setCoverFile={setCoverFile}
        initialCoverUrl={project.cover_image_url}
        caseStudyJson={caseStudyJson}
        setCaseStudyJson={setCaseStudyJson}
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

export default function EditPortfolioProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center text-sm text-zinc-500">
          Loading…
        </div>
      }
    >
      <EditPortfolioProjectInner />
    </Suspense>
  );
}
