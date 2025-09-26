// import type { MetadataRoute } from "next";

// export default function robots(): MetadataRoute.Robots {
//   return {
//     rules: [
//       { userAgent: "*", allow: "/" },
//       // Закрываем приватные разделы, поиск, личный кабинет
//       { userAgent: "*", disallow: ["/account/", "/admin", "/auth/", "/search", "/inbox", "/matches", "/settings"] },
//       // Старые пути с профилями (если ещё живы)
//       { userAgent: "*", disallow: ["/account/search/"] },
//     ],
//     sitemap: "https://blow.ru/sitemap.xml",
//     host: "https://blow.ru",
//   };
// }

// app/robots.txt/route.ts
export const dynamic = 'force-static'; // чтоб кэшировался как статик

export async function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',

    // закрываем приватные разделы
    'Disallow: /account/',
    'Disallow: /admin',
    'Disallow: /auth/',
    'Disallow: /search',
    'Disallow: /inbox',
    'Disallow: /matches',
    'Disallow: /settings',
    // старые пути с профилями
    'Disallow: /account/search/',

    // --- Яндекс: игнорируем НЕзначащие GET-параметры, чтобы убрать дубли ---
    // аналитические метки
    'Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content /',
    // рекламные клики/идентификаторы
    'Clean-param: gclid&fbclid&yclid /',
    // источники/рефералы
    'Clean-param: from&ref /',

    // Канонические вещи
    'Host: blow.ru',
    'Sitemap: https://blow.ru/sitemaps',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
