// компактный нормализатор и "умный" description для профиля
export function cut(s: string, n = 180) {
  if (!s) return "";
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
}

type P = {
  firstName?: string;
  name?: string;
  sex?: "male" | "female";
  age?: number;
  city?: string;
  about?: string;
  sponsor?: boolean;
  relationships?: boolean;
  evening?: boolean;
  traveling?: boolean;
  photos?: Array<{ url?: string } | string>;
};

export function makeProfileTitle(p: P) {
  const nm = p.firstName || p.name || "Профиль";
  const age = p.age ? `, ${p.age}` : "";
  const city = p.city ? ` — ${p.city}` : "";
  return `${nm}${age}${city}`;
}

export function makeProfileDescription(p: P) {
  // 1) приоритет — "about"
  if (p.about && p.about.trim()) {
    return cut(p.about.trim(), 180);
  }

  // 2) сборка из фактов анкеты
  const who =
    p?.firstName ? p.firstName : p.sex === "male" ? "мужчина" : p.sex === "female" ? "девушка" : "пользователь";
  const age = p?.age ? `${p.age} лет` : "";
  const city = p?.city ? `, ${p.city}` : "";
  const withPhoto = Array.isArray(p?.photos) && p?.photos.length ? " С фотографиями." : "";

  const goals: string[] = [];
  if (p?.sponsor) goals.push(p.sex === "male" ? "стану спонсором" : "ищу спонсора");
  if (p?.relationships) goals.push("серьёзные отношения");
  if (p?.evening) goals.push("провести вечер");
  if (p?.traveling) goals.push("совместные путешествия");

  const goalsPart = goals?.length ? ` Цели: ${goals.join(", ")}.` : "";

  // базовое, но уникальное за счёт пола/возраста/города/целей
  const base = `${who}${age ? `, ${age}` : ""}${city}. Анкета на BLOW.${withPhoto}${goalsPart}`;

  // гарантия, что не вернём общий дефолт
  return cut(base, 180);
}

/** Решаем, индексировать ли профиль.
 * Если вообще нет возраста, города и целей, и нет about — лучше noindex, чтобы не плодить дублей.
 */
export function shouldIndexProfile(p: P) {
  const hasAbout = Boolean(p.about && p.about.trim());
  const hasAny =
    hasAbout ||
    Boolean(p.age) ||
    Boolean(p.city) ||
    Boolean(p.sponsor || p.relationships || p.evening || p.traveling);
  return hasAny;
}
