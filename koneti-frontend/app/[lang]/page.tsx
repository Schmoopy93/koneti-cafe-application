import Home from "../../components/home/Home";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  
  const metadata: Record<string, Metadata> = {
    sr: {
      title: "Koneti Café – Savršeno mesto za kafu, proslave i poslovne sastanke u Novom Sadu",
      description:
        "Uživajte u specialty kafi, poslasticama i prijatnom ambijentu. Rezervišite prostor za poslovne sastanke ili proslave u Koneti Café-u u Novom Sadu.",
      alternates: {
        canonical: "https://koneticaffee.com/sr",
      },
      openGraph: {
        title: "Koneti Café - Dobrodošli",
        description:
          "Specialty coffee, poslastice i rezervacije prostora za događaje i sastanke.",
        url: "https://koneticaffee.com/sr",
        type: "website",
        images: [
          {
            url: "/og/cover.jpg",
            width: 1200,
            height: 630,
            alt: "Koneti Café - Hero",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Koneti Café - Dobrodošli",
        description:
          "Specialty coffee, poslastice i rezervacije prostora za događaje i sastanke.",
        images: ["/og/cover.jpg"],
      },
      robots: {
        index: true,
        follow: true,
      },
    },
    en: {
      title: "Koneti Café – Perfect place for coffee, celebrations and business meetings in Novi Sad",
      description:
        "Enjoy specialty coffee, desserts and pleasant atmosphere. Reserve space for business meetings or celebrations at Koneti Café in Novi Sad.",
      alternates: {
        canonical: "https://koneticaffee.com/en",
      },
      openGraph: {
        title: "Koneti Café - Welcome",
        description:
          "Specialty coffee, desserts and space reservations for events and meetings.",
        url: "https://koneticaffee.com/en",
        type: "website",
        images: [
          {
            url: "/og/cover.jpg",
            width: 1200,
            height: 630,
            alt: "Koneti Café - Hero",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Koneti Café - Welcome",
        description:
          "Specialty coffee, desserts and space reservations for events and meetings.",
        images: ["/og/cover.jpg"],
      },
      robots: {
        index: true,
        follow: true,
      },
    },
  };

  return metadata[lang] || metadata.sr;
}

export default function HomePage() {
  return <Home />;
}