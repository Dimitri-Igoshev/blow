// pages/api/sitemap.xml.ts
import { config } from "@/common/env"
import { NextApiRequest, NextApiResponse } from "next";

const staticRoutes = ["/", "/search", "/offer", "/contacts", "/privacy"]; // ✏️ добавь свои страницы

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const baseUrl = config.NEXT_PUBLIC_SITE_URL || "https://blow.ru";

	const pages = staticRoutes.map((route) => {
		return `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>monthly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.7"}</priority>
  </url>`;
	});

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.join("\n")}
</urlset>`;

	res.setHeader("Content-Type", "application/xml");
	res.status(200).send(xml);
}
