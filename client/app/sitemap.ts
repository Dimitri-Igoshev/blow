import type { MetadataRoute } from "next";
import { getPublicProfilesCount, profilesShardUrls, getStaticRoutes } from "@/lib/sitemap-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = getStaticRoutes().map((url) => ({
    url,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const count = await getPublicProfilesCount();
  const shardUrls = profilesShardUrls(count).map((url) => ({
    url,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  // Плюс отдельная карта только для статики
  const staticMapUrl = { url: "https://blow.ru/sitemaps/static.xml", changeFrequency: "weekly" as const, priority: 0.8 };

  return [staticMapUrl, ...staticRoutes, ...shardUrls];
}
