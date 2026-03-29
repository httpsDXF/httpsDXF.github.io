import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { CaseStudyBlocks } from "@/app/components/portfolio/CaseStudyBlocks";
import { fetchPortfolioProject, fetchPortfolioProjectSlugs, mediaUrl } from "@/lib/api";
import { siteUrl } from "../../../config/site";

export async function generateStaticParams() {
  const slugs = await fetchPortfolioProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchPortfolioProject(slug);
  if (!data) {
    return { title: "Case study" };
  }
  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: `${siteUrl}/portfolio/${slug}` },
  };
}

export default async function PortfolioCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchPortfolioProject(slug);
  if (!data) notFound();

  const categoryLabel =
    data.categories.map((c) => c.name).join(" · ") || "Portfolio";
  const cover = data.cover_image_url ? mediaUrl(data.cover_image_url) : null;

  return (
    <article>
      <p className="text-sm text-zinc-500">
        <Link href="/portfolio" className="text-white/70 transition hover:text-white">
          ← Portfolio
        </Link>
        <span className="mx-2 text-zinc-700">·</span>
        <span className="text-zinc-500">{categoryLabel}</span>
      </p>
      <p className="mt-6 text-xs font-medium uppercase tracking-wider text-zinc-500">
        {data.meta}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
        {data.title}
      </h1>
      {data.id < 0 ? (
        <p className="mt-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Case study preview
        </p>
      ) : null}
      <p className="mt-4 max-w-2xl text-lg text-white/75">{data.description}</p>

      {cover ? (
        <div
          className="card-fade-up relative mt-8 aspect-[21/9] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"
          style={{ "--card-fade-delay": "0ms" } as CSSProperties}
        >
          <Image
            src={cover}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
            unoptimized
          />
        </div>
      ) : null}

      <div className="mt-12 space-y-12 border-t border-white/10 pt-12">
        {data.case_study.map((section, index) => (
          <section key={`${section.heading}-${index}`}>
            <h2 className="text-lg font-semibold tracking-tight text-white">
              {section.heading}
            </h2>
            <CaseStudyBlocks blocks={section.blocks} />
          </section>
        ))}
      </div>
    </article>
  );
}
