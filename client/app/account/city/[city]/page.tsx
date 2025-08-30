// app/account/city/[city]/page.tsx
import type { Metadata, ResolvingMetadata } from "next";
import AccountSearch from "../../search/page";
import { config } from "@/common/env";

// ---- helpers ----
async function getCities() {
  const res = await fetch(`${config.API_URL}/city?limit=1000`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Не удалось загрузить список городов");
  return res.json();
}

const capitalize = (s: string) =>
  s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase();

type SearchQ = { sex?: "male" | "female"; withPhoto?: string };

function pickFirst(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0];
  return val;
}

// ---- metadata ----
export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: Promise<{ city: string }>;
    searchParams: Promise<Record<string, string | string[]>>;
  },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { city: rawCity } = await params;
  const sp = await searchParams;

  const cityValue = decodeURIComponent(rawCity || "").toLowerCase();
  const sexRaw = pickFirst(sp?.sex);
  const withPhotoRaw = pickFirst(sp?.withPhoto);

  // подтягиваем label города (если есть)
  let cityLabel = capitalize(cityValue);
  try {
    const cities = await getCities();
    const found = cities?.find((c: any) => c.value === cityValue);
    if (found?.label) cityLabel = found.label;
  } catch {
    // молча оставляем capitalized value
  }

  const sexTitle =
    sexRaw === "male"
      ? "Мужчины"
      : sexRaw === "female"
      ? "Содержанки"
      : "Содержанки и спонсоры";

  const title = `${sexTitle} | ${cityLabel}`;
  const description = `Знакомства (${sexTitle.toLowerCase()}) в городе ${cityLabel}. Мужчины и девушки для приятного вечера.`;

  // собираем канонический URL с фактическими query
  const q = new URLSearchParams();
  if (sexRaw) q.set("sex", sexRaw);
  if (withPhotoRaw) q.set("withPhoto", withPhotoRaw);

  const canonicalPath = `/account/city/${rawCity}${q.toString() ? `?${q.toString()}` : ""}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalPath,
      images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-default.jpg"],
    },
  };
}

// ---- page ----
export default async function CityPage({
  params,
  searchParams,
}: {
  params: Promise<{ city: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { city } = await params;
  const sp = await searchParams;

  const sex = pickFirst(sp?.sex) as SearchQ["sex"];
  const withPhoto = pickFirst(sp?.withPhoto);

  return <AccountSearch city={city} sex={sex} withPhoto={withPhoto} />;
}
