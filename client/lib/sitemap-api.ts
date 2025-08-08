import { config } from "@/common/env"

const BASE = config.API_URL
// ↑ поставь сюда свой API base (тот же, что юзают RTK endpoints, но тут — без хуков)

const PER_FILE = 45000; // запас < 50k на файл

export type PublicProfile = {
	slug?: string;
	shortId?: string; // фолбэк, если нет slug
	updatedAt?: string;
};

// ИДЕАЛ: если на бэке сделаешь отдельные эндпоинты для sitemap:
// GET /users/public/count -> { count: number }
// GET /users/public?sitemap=1&skip&limit -> [{slug, shortId, updatedAt}]
export async function getPublicProfilesCount(): Promise<number> {
	try {
		const res = await fetch(`${BASE}/users/public/count`, {
			cache: "no-store",
		});
		if (!res.ok) throw new Error("count not ok");
		const data = await res.json();
		return Number(data?.count || 0);
	} catch {
		// ФОЛБЭК (если нет отдельного count): забери хоть сколько-то с лимитом
		const list = await getPublicProfilesBatch(0, 1000);
		return list.length; // лучше сделать нормальный count на бэке
	}
}

export async function getPublicProfilesBatch(
	skip: number,
	limit: number
): Promise<PublicProfile[]> {
	// ИДЕАЛ:
	try {
		const res = await fetch(
			`${BASE}/users/public?sitemap=1&skip=${skip}&limit=${limit}`,
			{ cache: "no-store" }
		);
		if (!res.ok) throw new Error("list not ok");
		const arr = await res.json();
		return Array.isArray(arr) ? arr : [];
	} catch {
		// ФОЛБЭК к твоему текущему getUsers (у него нет skip/offset — возьмём просто limit)
		// Вынеси на бэке отдельный endpoint под sitemap, чтобы убрать этот костыль.
		const res = await fetch(`${BASE}/users?limit=${limit}&withPhoto=1`, {
			cache: "no-store",
		});
		if (!res.ok) return [];
		const data = await res.json();
		const items = Array.isArray(data?.items)
			? data.items
			: Array.isArray(data)
				? data
				: data?.data || [];
		return items.map((u: any) => ({
			slug: u.slug,
			shortId: u.shortId ?? u._id ?? u.id,
			updatedAt: u.updatedAt,
		}));
	}
}

export function profilesShardUrls(count: number): string[] {
	const files = Math.ceil(count / PER_FILE);
	return Array.from(
		{ length: files || 1 },
		(_, i) =>
			`https://blow.ru/sitemaps/profiles-${String(i + 1).padStart(4, "0")}.xml`
	);
}

export async function getProfilesForShard(name: string) {
	const m = name.match(/^profiles-(\d+)\.xml$/);
	if (!m) return [];
	const index = Number(m[1]) - 1;
	const skip = index * PER_FILE;
	const list = await getPublicProfilesBatch(skip, PER_FILE);
	return list.map((p) => ({
		loc: `https://blow.ru/u/${p.slug || p.shortId}`,
		lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
	}));
}

export function getStaticRoutes() {
	return [
		"https://blow.ru/",
		"https://blow.ru/rules",
		"https://blow.ru/privacy",
		"https://blow.ru/contacts",
		"https://blow.ru/offer",
		"https://blow.ru/flyer",
	];
}
