import {
  PLACEHOLDER_BLOG_POSTS,
  PLACEHOLDER_BLOG_SLUGS,
  getPlaceholderPostBySlug,
} from "@/lib/placeholderContent";

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
  if (!base) return [];
  const r = await fetch(`${base}/api/experiments/`, cacheInit());
  if (!r.ok) return [];
  return r.json();
}

export async function fetchExperiment(slug: string): Promise<Experiment | null> {
  const base = getApiBase();
  if (!base) return null;
  const r = await fetch(`${base}/api/experiments/${slug}/`, cacheInit());
  if (!r.ok) return null;
  return r.json();
}

export async function fetchExperimentSlugs(): Promise<string[]> {
  const list = await fetchExperiments();
  return list.map((e) => e.slug);
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
