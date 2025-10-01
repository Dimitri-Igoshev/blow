import type { Metadata } from "next";
import ArticlesClient from "./ArticlesClient"

export const metadata: Metadata = {
  title: "Статьи",
  description: "Полезные статьи для пользователей BLOW",
  alternates: {
    canonical: "https://blow.ru/articles",
  },
  openGraph: {
    type: "article",
    title: "Статьи",
    description: "Полезные статьи для пользователей BLOW",
    url: "https://blow.ru/articles",
  },
  twitter: {
    card: "summary",
    title: "Статьи",
    description: "Полезные статьи для пользователей BLOW",
  },
};

export default function Page() {
  return <ArticlesClient />;
}
