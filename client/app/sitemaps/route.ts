import { NextResponse } from "next/server";
import { profilesShardUrls, getPublicProfilesCount } from "@/lib/sitemap-api";

const SITE = "https://blow.ru";
export const dynamic = "force-static";

export async function GET() {
  const count = await getPublicProfilesCount();
  const shards = profilesShardUrls(count); // https://blow.ru/sitemaps/profiles-0001.xml …

  const items = [
    `${SITE}/sitemaps/static.xml`,
    `${SITE}/sitemaps/cities.xml`,
    ...shards,
  ];

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...items.map(loc => `<sitemap><loc>${loc}</loc></sitemap>`),
    `</sitemapindex>`,
  ].join("");

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
