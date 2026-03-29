"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BlogBody } from "@/app/components/blog/BlogBody";
import type { BlogPost } from "@/lib/api";
import { fetchBlogPost, mediaUrl } from "@/lib/api";

export function BlogPostClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await fetchBlogPost(slug);
      if (!cancelled) setPost(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (post === undefined) {
    return (
      <p className="text-zinc-300" aria-live="polite">
        Loading…
      </p>
    );
  }

  if (!post) {
    return (
      <div>
        <p className="text-sm text-zinc-500">
          <Link href="/blog" className="text-white/70 hover:text-white">
            ← Blog
          </Link>
        </p>
        <h1 className="mt-4 text-2xl font-semibold">Post not found</h1>
        <p className="mt-2 text-zinc-400">
          This post may not exist or the API is offline.
        </p>
      </div>
    );
  }

  const gallery = post.media ?? [];
  const format = post.body_format === "html" ? "html" : "markdown";

  return (
    <article>
      <p className="text-sm text-zinc-500">
        <Link href="/blog" className="text-white/70 hover:text-white">
          ← Blog
        </Link>
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
        {post.title}
      </h1>
      {(post.categories?.length ?? 0) > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {(post.categories ?? []).map((c) => (
            <Link
              key={c.slug}
              href={`/blog?category=${encodeURIComponent(c.slug)}`}
              className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
            >
              {c.name}
            </Link>
          ))}
        </div>
      ) : null}
      <p className="mt-2 text-sm text-zinc-500">
        {new Date(post.created_at).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      {post.description ? (
        <p className="mt-6 text-lg text-white/75">{post.description}</p>
      ) : null}

      {post.cover_image_url ? (
        <div className="relative mt-8 aspect-[21/9] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
          <Image
            src={mediaUrl(post.cover_image_url)}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
            unoptimized
          />
        </div>
      ) : null}

      <BlogBody body={post.body} bodyFormat={format} />

      {gallery.length > 0 ? (
        <div className="mt-12 space-y-6 border-t border-white/10 pt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Gallery
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {gallery.map((item) => (
              <li
                key={item.id}
                className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/80"
              >
                {item.kind === "video" ? (
                  <video
                    src={mediaUrl(item.url)}
                    controls
                    playsInline
                    className="aspect-video w-full object-contain"
                    preload="metadata"
                  />
                ) : (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={mediaUrl(item.url)}
                      alt={item.caption || ""}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                    />
                  </div>
                )}
                {item.caption ? (
                  <p className="px-3 py-2 text-xs text-zinc-400">{item.caption}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
