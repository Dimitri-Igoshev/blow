import type { Metadata, ResolvingMetadata } from "next";
import AccountSearch from "../../search/page"

type Props = { params: { city: string } };

const capitalize = (s: string) =>
  s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase();

export async function generateMetadata(
  { params }: any,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const city = capitalize(decodeURIComponent(params?.city));
  const title = `Содержанки и спонсоры — ${city}`;
  const description = `Знакомства для содержанок и спонсоров в городе ${city}. Мужчины и девушки для приятного вечера.`;

  return {
    title,
    description,
    alternates: { canonical: `/${params?.city || ''}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/${params.city}`,
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

function CityPage({ params }: { params: { city: string } }) {
  return <AccountSearch city={params.city} />
}

export default CityPage as any;