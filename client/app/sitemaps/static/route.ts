import { NextResponse } from "next/server";
import { getStaticRoutes } from "@/lib/sitemap-api";

export async function GET() {
  const urls = getStaticRoutes();
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((loc) => `<url><loc>${loc}</loc></url>`),
    "</urlset>",
  ].join("");
  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
