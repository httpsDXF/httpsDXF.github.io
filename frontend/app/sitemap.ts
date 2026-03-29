import type { MetadataRoute } from "next";
import { fetchExperimentSlugs, fetchPortfolioProjectSlugs } from "@/lib/api";
import { mainNavItems } from "./config/navigation";
import { siteUrl } from "./config/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const experimentSlugs = await fetchExperimentSlugs();
  const portfolioSlugs = await fetchPortfolioProjectSlugs();

  const routes = mainNavItems.map(({ href }) => ({
    url: href === "/" ? siteUrl : `${siteUrl}${href}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: href === "/" ? 1 : 0.8,
  }));

  const portfolioStudies = portfolioSlugs.map((slug) => ({
    url: `${siteUrl}/portfolio/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));

  const experimentPages = experimentSlugs.map((slug) => ({
    url: `${siteUrl}/experiments/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...routes,
    {
      url: `${siteUrl}/hire`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      url: `${siteUrl}/experiments/view`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    },
    ...portfolioStudies,
    ...experimentPages,
  ];
}
