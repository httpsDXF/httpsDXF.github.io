import type { Metadata } from "next";
import { fetchExperiment, fetchExperimentSlugs } from "@/lib/api";
import { siteUrl } from "../../../config/site";
import { ExperimentDetailClient } from "./ExperimentDetailClient";

export async function generateStaticParams() {
  const slugs = await fetchExperimentSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exp = await fetchExperiment(slug);
  return {
    title: exp?.title ?? `Experiment · ${slug}`,
    description: exp?.description,
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
