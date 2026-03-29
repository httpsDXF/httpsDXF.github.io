import type { MetadataRoute } from "next";
import { mainNavItems } from "./config/navigation";
import { siteUrl } from "./config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes = mainNavItems.map(({ href }) => ({
    url: href === "/" ? siteUrl : `${siteUrl}${href}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: href === "/" ? 1 : 0.8,
  }));

  return routes;
}
