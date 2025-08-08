// app/sitemaps/[name]/route.ts
import { NextResponse } from "next/server";
import { getProfilesForShard } from "@/lib/sitemap-api";

export async function GET(req: Request) {
  // никакого { params }; достаём имя напрямую из URL
  const { pathname } = new URL(req.url);
  const raw = pathname.split("/").pop() || ""; // например: "profiles-0001.xml"

  if (!raw) {
    return NextResponse.json({ error: "Missing shard name" }, { status: 400 });
  }

  let urls: Array<{ loc: string; lastmod?: string | Date }> = [];
  try {
    // ВАЖНО: передаём ровно raw, со строкой "profiles-0001.xml"
    urls = (await getProfilesForShard(raw)) || [];
    console.log("[sitemap shard]", { raw, count: urls.length });
  } catch (e) {
    console.error("[sitemap shard]", raw, e);
    return NextResponse.json({ error: "Sitemap shard error" }, { status: 500 });
  }

  const escapeXml = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const normalizeLastmod = (v?: string | Date) => {
    if (!v) return "";
    try {
      const iso = typeof v === "string" ? new Date(v).toISOString() : v.toISOString();
      return `<lastmod>${iso}</lastmod>`;
    } catch {
      return "";
    }
  };

  const items = urls
    .map((u) => `<url><loc>${escapeXml(String(u.loc))}</loc>${normalizeLastmod(u.lastmod)}</url>`)
    .join("");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    items +
    `</urlset>\n`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=600",
    },
  });
}
