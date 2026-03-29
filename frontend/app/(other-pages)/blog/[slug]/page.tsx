import type { Metadata } from "next";
import { PLACEHOLDER_BLOG_SLUGS } from "@/lib/placeholderContent";
import { fetchBlogSlugs } from "@/lib/api";
import { siteUrl } from "../../../config/site";
import { BlogPostClient } from "./BlogPostClient";

export async function generateStaticParams() {
  try {
    const slugs = await fetchBlogSlugs();
    if (slugs.length) {
      return slugs.map((slug) => ({ slug }));
    }
  } catch {
    /* ignore */
  }
  return PLACEHOLDER_BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Blog · ${slug}`,
    alternates: { canonical: `${siteUrl}/blog/${slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
