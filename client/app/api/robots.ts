import { config } from "@/common/env"
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res.setHeader("Content-Type", "text/plain");

	const baseUrl = config.NEXT_PUBLIC_SITE_URL || "https://blow.ru";

	const content = `
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
  `.trim();

	res.status(200).send(content);
}
