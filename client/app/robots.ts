import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Закрываем приватные разделы, поиск, личный кабинет
      { userAgent: "*", disallow: ["/account/", "/admin", "/auth/", "/search", "/inbox", "/matches", "/settings"] },
      // Старые пути с профилями (если ещё живы)
      { userAgent: "*", disallow: ["/account/search/"] },
    ],
    sitemap: "https://blow.ru/sitemap.xml",
    host: "https://blow.ru",
  };
}
