import { NextResponse } from "next/server";
import { getProfilesForShard } from "@/lib/sitemap-api";

// ВАЖНО: без строгого типа для context, иначе next type validator ноет
export async function GET(_req: Request, context: any) {
	const raw = context?.params?.name as string | undefined;
	if (!raw) {
		return NextResponse.json({ error: "Missing shard name" }, { status: 400 });
	}

	// Если в URL есть .xml — отрезаем, чтобы getProfilesForShard получил чистое имя шарда
	const name = raw.replace(/\.xml$/i, "");

	let urls: Array<{ loc: string; lastmod?: string | Date }> = [];
	try {
		urls = (await getProfilesForShard(name)) || [];
	} catch (e) {
		console.error("[sitemap shard]", name, e);
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
			const iso =
				typeof v === "string" ? new Date(v).toISOString() : v.toISOString();
			return `<lastmod>${iso}</lastmod>`;
		} catch {
			return "";
		}
	};

	const items = urls
		.map(
			(u) =>
				`<url><loc>${escapeXml(String(u.loc))}</loc>${normalizeLastmod(u.lastmod)}</url>`
		)
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
