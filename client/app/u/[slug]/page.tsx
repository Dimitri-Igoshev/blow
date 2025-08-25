// app/u/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";// см. ниже
import { config } from "@/common/env";
import ProfileClient from "./ProfileClient"

const API_BASE = config.API_URL
const MEDIA_BASE = config.MEDIA_URL

// ---------- helpers ----------
function isObjectId(v: string) {
  return /^[a-f0-9]{24}$/i.test(v);
}

async function safeJson(res: Response) {
  if (!res?.ok) return null;
  const ct = res.headers.get("content-type") || "";
  if (res.status === 204) return null;
  if (!ct.includes("application/json")) {
    await res.text().catch(() => "");
    return null;
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function getBySlug(slug: string) {
  try {
    const r = await fetch(`${API_BASE}/user/by-slug/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    return await safeJson(r);
  } catch {
    return null;
  }
}

async function getById(id: string) {
  try {
    const r = await fetch(`${API_BASE}/user/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    return await safeJson(r);
  } catch {
    return null;
  }
}

function photoUrl(src?: string) {
  if (!src) return "";
  return MEDIA_BASE ? `${MEDIA_BASE}/${src}` : src;
}

function titleFromProfile(p: any) {
  const name = p?.firstName ?? p?.name ?? "Профиль";
  const age = p?.age ? `, ${p.age}` : "";
  const city = p?.city ? ` — ${p.city}` : "";
  return `${name}${age}${city}`;
}

function descriptionFromProfile(p: any) {
  if (typeof p?.about === "string" && p.about.trim()) {
    return p.about.trim().slice(0, 160);
  }
  return "Анкета пользователя на BLOW.";
}

// ---------- metadata ----------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: param } = await params;

  let profile = await getBySlug(param);
  if (!profile && isObjectId(param)) profile = await getById(param);

  if (!profile || profile?.status !== "active") {
    return { robots: { index: false, follow: false }, title: "Профиль не найден" };
  }

  const url = `https://blow.ru/u/${profile.slug ?? param}`;
  const title = titleFromProfile(profile);
  const description = descriptionFromProfile(profile);
  const firstPhoto = photoUrl(profile?.photos?.[0]?.url ?? profile?.photos?.[0]);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      url,
      title,
      description,
      images: firstPhoto ? [{ url: firstPhoto }] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

// ---------- page ----------
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: param } = await params;

  // 1) пытаемся как slug
  let profile = await getBySlug(param);

  // 2) фолбэк по ObjectId
  if (!profile && isObjectId(param)) {
    const byId = await getById(param);
    if (!byId) notFound();

    // если у юзера уже есть slug — редиректим на ЧПУ
    if (byId.slug && byId.slug !== param) {
      redirect(`/u/${byId.slug}`);
    }

    profile = byId;
  }

  // if (!profile || profile?.status !== "active") {
  //   notFound();
  // }

  // Профиль готов — отдаём клиентский компонент с твоей версткой и логикой
  return <ProfileClient profile={profile} mediaBase={MEDIA_BASE} />;
}
