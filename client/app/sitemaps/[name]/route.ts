import { NextResponse } from "next/server";
import { getProfilesForShard } from "@/lib/sitemap-api";

export async function GET(_: Request, { params }: { params: { name: string } }) {
  const urls = await getProfilesForShard(params.name); // [{loc,lastmod}]
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => `<url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`),
    "</urlset>",
  ].join("");
  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
