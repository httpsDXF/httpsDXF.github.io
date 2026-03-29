"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_CASE_STUDY_JSON,
  PortfolioProjectForm,
} from "@/app/components/portfolio/PortfolioProjectForm";
import { getApiBase, type PortfolioCategory } from "@/lib/api";
import { authHeaders, clearTokens, getAccessToken } from "@/lib/auth";
import { slugify } from "@/lib/slug";

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

export default function DashboardNewPortfolioProjectPage() {
  const router = useRouter();
  const base = getApiBase();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [meta, setMeta] = useState("");
  const [order, setOrder] = useState("0");
  const [published, setPublished] = useState(true);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [caseStudyJson, setCaseStudyJson] = useState(DEFAULT_CASE_STUDY_JSON);
  const [categoriesList, setCategoriesList] = useState<PortfolioCategory[]>(
    [],
  );
  const [selectedCategorySlugs, setSelectedCategorySlugs] = useState<string[]>(
    [],
  );
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

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

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  function toggleCategorySlug(s: string) {
    setSelectedCategorySlugs((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  async function create(e: React.FormEvent) {
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
    fd.append("slug", (slug.trim() || slugify(title)).trim());
    fd.append("description", description);
    fd.append("meta", meta);
    const n = Number.parseInt(order, 10);
    fd.append("order", String(Number.isFinite(n) ? n : 0));
    fd.append("published", published ? "true" : "false");
    if (coverFile) fd.append("cover_image", coverFile);
    fd.append("category_slugs", JSON.stringify(selectedCategorySlugs));
    fd.append("case_study", JSON.stringify(parsed.value));

    const r = await fetch(`${base}/api/portfolio/projects/`, {
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
    setMsg("Project created.");
    router.push("/dashboard/portfolio");
  }

  if (!getAccessToken()) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <Link
          href="/dashboard/portfolio"
          className="text-zinc-500 transition hover:text-white"
        >
          ← All projects
        </Link>
      </div>

      <PortfolioProjectForm
        stickyHeading="New project"
        stickyBadge="Draft"
        submitLabel="Create"
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
        caseStudyJson={caseStudyJson}
        setCaseStudyJson={setCaseStudyJson}
        categoriesList={categoriesList}
        selectedCategorySlugs={selectedCategorySlugs}
        toggleCategorySlug={toggleCategorySlug}
        onSubmit={create}
        err={err}
        msg={msg}
      />
    </div>
  );
}
