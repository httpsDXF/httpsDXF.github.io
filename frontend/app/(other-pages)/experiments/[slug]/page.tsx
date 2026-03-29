import type { Metadata } from "next";
import { fetchExperimentSlugs } from "@/lib/api";
import { siteUrl } from "../../../config/site";
import { ExperimentDetailClient } from "./ExperimentDetailClient";

export async function generateStaticParams() {
  try {
    const slugs = await fetchExperimentSlugs();
    if (slugs.length) {
      return slugs.map((slug) => ({ slug }));
    }
  } catch {
    /* ignore */
  }
  return [{ slug: "offline" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Experiment · ${slug}`,
    alternates: { canonical: `${siteUrl}/experiments/${slug}` },
  };
}

export default async function ExperimentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ExperimentDetailClient slug={slug} />;
}
