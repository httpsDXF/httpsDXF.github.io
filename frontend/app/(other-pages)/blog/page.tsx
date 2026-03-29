import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogIndexClient } from "./BlogIndexClient";
import { fetchBlogCategories, fetchBlogPosts } from "@/lib/api";
import { siteUrl } from "../../config/site";

function isPreviewContent(posts: { id: number }[]): boolean {
  return posts.length > 0 && posts[0].id < 0;
}

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Posts by Yaw Appiah (httpsDXF) on engineering, robotics, and related work.",
  alternates: { canonical: `${siteUrl}/blog` },
};

export default async function BlogPage() {
  const [postsAll, categories] = await Promise.all([
    fetchBlogPosts(),
    fetchBlogCategories(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Blog</h1>
      <Suspense
        fallback={
          <p className="mt-4 text-zinc-500" aria-live="polite">
            Loading…
          </p>
        }
      >
        <BlogIndexClient
          postsAll={postsAll}
          categories={categories}
          showPreviewNote={isPreviewContent(postsAll)}
        />
      </Suspense>
    </div>
  );
}
