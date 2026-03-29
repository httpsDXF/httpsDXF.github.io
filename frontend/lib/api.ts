import {
  PLACEHOLDER_BLOG_CATEGORIES,
  PLACEHOLDER_BLOG_POSTS,
  PLACEHOLDER_BLOG_SLUGS,
  PLACEHOLDER_EXPERIMENT_SLUGS,
  PLACEHOLDER_EXPERIMENTS,
  PLACEHOLDER_PORTFOLIO_CATEGORIES,
  getPlaceholderExperimentBySlug,
  getPlaceholderPostBySlug,
} from "@/lib/placeholderContent";
import {
  getPortfolioCaseStudy,
  normalizeCaseStudyFromApi,
  type CaseStudyBlock,
} from "@/lib/portfolioCaseStudies";
import { getAllPortfolioSlugs } from "@/lib/portfolioUtils";

/** Base URL for Django API (no trailing slash). */
export function getApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

function cacheInit(): RequestInit {
  if (typeof window !== "undefined") return {};
  return { next: { revalidate: 60 } };
}

export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = getApiBase();
  if (!base) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export type BlogPostMediaItem = {
  id: number;
  url: string;
  kind: "image" | "video";
  caption: string;
  order: number;
};

export type BlogCategory = {
  id: number;
  name: string;
  slug: string;
  order: number;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  description: string;
  body: string;
  body_format: "markdown" | "html";
  published: boolean;
  cover_image_url: string | null;
  media: BlogPostMediaItem[];
  categories?: { slug: string; name: string }[];
  created_at: string;
  updated_at: string;
};

export type Experiment = {
  id: number;
  title: string;
  slug: string;
  description: string;
  preview_image_url: string | null;
  model_url: string;
  source_format: string;
  created_at: string;
  updated_at: string;
};

export type PortfolioCategory = {
  id: number;
  name: string;
  slug: string;
  order: number;
};

export type PortfolioProject = {
  id: number;
  title: string;
  slug: string;
  description: string;
  meta: string;
  cover_image_url: string | null;
  categories: { slug: string; name: string }[];
  case_study: { heading: string; blocks: CaseStudyBlock[] }[];
  published: boolean;
  order: number;
  created_at: string;
  updated_at: string;
};

const CATEGORY_NAME_TO_SLUG: Record<string, string> = {
  Mechatronics: "mechatronics",
  Brand: "brand",
  Photography: "photography",
};

const PLACEHOLDER_PORTFOLIO_ID: Record<string, number> = {
  "desktop-test-rig": -1,
  "ros-bring-up-notes": -2,
  "sensor-fusion-sketch": -3,
  "studio-wordmark": -4,
  "site-grid-system": -5,
  "motion-principles": -6,
  "low-light-street-set": -7,
  "studio-still-life": -8,
  "travel-log-selects": -9,
};

const PLACEHOLDER_ISO = "2026-01-15T12:00:00.000Z";

function getPlaceholderPortfolioProject(slug: string): PortfolioProject | null {
  const data = getPortfolioCaseStudy(slug);
  if (!data) return null;
  const catSlug = CATEGORY_NAME_TO_SLUG[data.category] ?? "general";
  return {
    id: PLACEHOLDER_PORTFOLIO_ID[slug] ?? -99,
    title: data.card.title,
    slug: data.card.slug,
    description: data.card.description,
    meta: data.card.meta,
    cover_image_url: data.card.cover_image_url ?? null,
    categories: [{ slug: catSlug, name: data.category }],
    case_study: data.sections.map((s) => ({
      heading: s.heading,
      blocks: s.blocks,
    })),
    published: true,
    order: 0,
    created_at: PLACEHOLDER_ISO,
    updated_at: PLACEHOLDER_ISO,
  };
}

function allPlaceholderPortfolioProjects(): PortfolioProject[] {
  return getAllPortfolioSlugs()
    .map((s) => getPlaceholderPortfolioProject(s))
    .filter((p): p is PortfolioProject => p != null);
}

export async function fetchPortfolioCategories(): Promise<PortfolioCategory[]> {
  const base = getApiBase();
  if (!base) {
    return [...PLACEHOLDER_PORTFOLIO_CATEGORIES] as unknown as PortfolioCategory[];
  }
  const r = await fetch(`${base}/api/portfolio/categories/`, cacheInit());
  if (!r.ok) {
    return [...PLACEHOLDER_PORTFOLIO_CATEGORIES] as unknown as PortfolioCategory[];
  }
  const rows: PortfolioCategory[] = await r.json();
  if (!rows.length) {
    return [...PLACEHOLDER_PORTFOLIO_CATEGORIES] as unknown as PortfolioCategory[];
  }
  return rows;
}

export async function fetchPortfolioProjects(): Promise<PortfolioProject[]> {
  const base = getApiBase();
  if (!base) return allPlaceholderPortfolioProjects();
  const r = await fetch(`${base}/api/portfolio/projects/`, cacheInit());
  if (!r.ok) return allPlaceholderPortfolioProjects();
  const list: PortfolioProject[] = await r.json();
  if (!list.length) return allPlaceholderPortfolioProjects();
  return list.map((p) => ({
    ...p,
    case_study: normalizeCaseStudyFromApi(p.case_study),
  }));
}

export async function fetchPortfolioProject(
  slug: string,
): Promise<PortfolioProject | null> {
  const base = getApiBase();
  if (base) {
    const r = await fetch(
      `${base}/api/portfolio/projects/${encodeURIComponent(slug)}/`,
      cacheInit(),
    );
    if (r.ok) {
      const row = (await r.json()) as PortfolioProject;
      return {
        ...row,
        case_study: normalizeCaseStudyFromApi(row.case_study),
      };
    }
  }
  return getPlaceholderPortfolioProject(slug);
}

export async function fetchPortfolioProjectSlugs(): Promise<string[]> {
  const base = getApiBase();
  const local = [...getAllPortfolioSlugs()];
  if (!base) return local;
  const r = await fetch(`${base}/api/portfolio/projects/`, cacheInit());
  if (!r.ok) return local;
  const list: PortfolioProject[] = await r.json();
  const fromApi = list.map((p) => p.slug);
  if (!fromApi.length) return local;
  return Array.from(new Set([...fromApi, ...local]));
}

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const base = getApiBase();
  if (!base) return [...PLACEHOLDER_BLOG_CATEGORIES] as BlogCategory[];
  const r = await fetch(`${base}/api/blog/categories/`, cacheInit());
  if (!r.ok) return [...PLACEHOLDER_BLOG_CATEGORIES] as BlogCategory[];
  const rows: BlogCategory[] = await r.json();
  if (!rows.length) return [...PLACEHOLDER_BLOG_CATEGORIES] as BlogCategory[];
  return rows;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const base = getApiBase();
  if (!base) return [...PLACEHOLDER_BLOG_POSTS] as unknown as BlogPost[];
  const r = await fetch(`${base}/api/blog/posts/`, cacheInit());
  if (!r.ok) return [...PLACEHOLDER_BLOG_POSTS] as unknown as BlogPost[];
  const posts: BlogPost[] = await r.json();
  if (!posts.length) return [...PLACEHOLDER_BLOG_POSTS] as unknown as BlogPost[];
  return posts;
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  const base = getApiBase();
  if (base) {
    const r = await fetch(`${base}/api/blog/posts/${slug}/`, cacheInit());
    if (r.ok) return (await r.json()) as BlogPost;
  }
  const fallback = getPlaceholderPostBySlug(slug);
  return fallback ? ({ ...fallback } as unknown as BlogPost) : null;
}

export async function fetchExperiments(): Promise<Experiment[]> {
  const base = getApiBase();
  if (!base) return [...PLACEHOLDER_EXPERIMENTS] as unknown as Experiment[];
  const r = await fetch(`${base}/api/experiments/`, cacheInit());
  if (!r.ok) return [...PLACEHOLDER_EXPERIMENTS] as unknown as Experiment[];
  const list: Experiment[] = await r.json();
  if (!list.length) return [...PLACEHOLDER_EXPERIMENTS] as unknown as Experiment[];
  return list;
}

export async function fetchExperiment(slug: string): Promise<Experiment | null> {
  const base = getApiBase();
  if (base) {
    const r = await fetch(`${base}/api/experiments/${slug}/`, cacheInit());
    if (r.ok) return (await r.json()) as Experiment;
  }
  const fallback = getPlaceholderExperimentBySlug(slug);
  return fallback ? ({ ...fallback } as unknown as Experiment) : null;
}

export async function fetchExperimentSlugs(): Promise<string[]> {
  const base = getApiBase();
  if (!base) return [...PLACEHOLDER_EXPERIMENT_SLUGS];
  const r = await fetch(`${base}/api/experiments/`, cacheInit());
  if (!r.ok) return [...PLACEHOLDER_EXPERIMENT_SLUGS];
  const list: Experiment[] = await r.json();
  const fromApi = list.map((e) => e.slug);
  if (!fromApi.length) return [...PLACEHOLDER_EXPERIMENT_SLUGS];
  return Array.from(new Set([...fromApi, ...PLACEHOLDER_EXPERIMENT_SLUGS]));
}

export type HireInquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project_description: string;
  /** Anti-spam honeypot — must stay empty */
  website?: string;
};

export async function submitHireInquiry(
  payload: HireInquiryPayload,
): Promise<{ ok: true } | { ok: false; error: string; code?: "missing_api" }> {
  const base = getApiBase();
  if (!base) {
    return { ok: false, error: "API URL is not configured.", code: "missing_api" };
  }
  const r = await fetch(`${base}/api/contact/hire/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone?.trim() ?? "",
      company: payload.company?.trim() ?? "",
      project_description: payload.project_description.trim(),
      website: payload.website?.trim() ?? "",
    }),
  });
  if (r.status === 201) {
    return { ok: true };
  }
  let detail = `Request failed (${r.status}).`;
  try {
    const j = (await r.json()) as Record<string, unknown>;
    if (typeof j.detail === "string") detail = j.detail;
    else if (j.detail != null) detail = JSON.stringify(j.detail);
    else if (j.non_field_errors != null)
      detail = JSON.stringify(j.non_field_errors);
    else detail = JSON.stringify(j);
  } catch {
    /* ignore */
  }
  return { ok: false, error: detail };
}

export async function fetchBlogSlugs(): Promise<string[]> {
  const base = getApiBase();
  if (!base) return [...PLACEHOLDER_BLOG_SLUGS];
  const r = await fetch(`${base}/api/blog/posts/`, cacheInit());
  if (!r.ok) return [...PLACEHOLDER_BLOG_SLUGS];
  const list: BlogPost[] = await r.json();
  const fromApi = list.map((p) => p.slug);
  if (!fromApi.length) return [...PLACEHOLDER_BLOG_SLUGS];
  return Array.from(new Set([...fromApi, ...PLACEHOLDER_BLOG_SLUGS]));
}
