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
      keywords: [
        "kafe Novi Sad", "kafić Novi Sad", "specialty coffee", "brunch", "proslave", "poslovni sastanci", "rezervacije", "ketering", "events Novi Sad"
      ],
      category: "Café",
      alternates: {
        canonical: "https://koneticaffee.com/sr",
        languages: {
          sr: "https://koneticaffee.com/sr",
          en: "https://koneticaffee.com/en",
        },
      },
      openGraph: {
        title: "Koneti Café - Dobrodošli",
        description: "Specialty coffee, brunch i rezervacije prostora za poslovne sastanke, proslave i privatne događaje.",
        url: "https://koneticaffee.com/sr",
        type: "website",
        locale: "sr_RS",
        alternateLocale: ["en_US"],
        siteName: "Koneti Café",
        images: [
          {
            url: "https://koneticaffee.com/koneti-kafe.jpg",
            width: 1200,
            height: 630,
            alt: "Koneti Café - Premium Ambijent",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Koneti Café - Dobrodošli",
        description: "Specialty coffee, brunch i prostor za poslovne sastanke i proslave.",
        images: ["https://koneticaffee.com/koneti-kafe.jpg"],
        creator: "@KonetiCafe",
        site: "@KonetiCafe",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    },
    en: {
      title: "Koneti Café – Perfect place for coffee, celebrations and business meetings in Novi Sad",
      description:
        "Enjoy specialty coffee, desserts and pleasant atmosphere. Reserve space for business meetings or celebrations at Koneti Café in Novi Sad.",
      keywords: [
        "cafe Novi Sad", "coffee shop Novi Sad", "specialty coffee", "brunch", "celebrations", "business meetings", "reservations", "catering", "events Novi Sad"
      ],
      category: "Café",
      alternates: {
        canonical: "https://koneticaffee.com/en",
        languages: {
          sr: "https://koneticaffee.com/sr",
          en: "https://koneticaffee.com/en",
        },
      },
      openGraph: {
        title: "Koneti Café - Welcome",
        description: "Specialty coffee, brunch and space for business meetings, celebrations and private events.",
        url: "https://koneticaffee.com/en",
        type: "website",
        locale: "en_US",
        alternateLocale: ["sr_RS"],
        siteName: "Koneti Café",
        images: [
          {
            url: "https://koneticaffee.com/koneti-kafe.jpg",
            width: 1200,
            height: 630,
            alt: "Koneti Café - Premium Atmosphere",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Koneti Café - Welcome",
        description: "Specialty coffee, brunch and space for business meetings and celebrations.",
        images: ["https://koneticaffee.com/koneti-kafe.jpg"],
        creator: "@KonetiCafe",
        site: "@KonetiCafe",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    },
  };

  return metadata[lang] || metadata.sr;
}

export default function HomePage() {
  return <Home />;
}