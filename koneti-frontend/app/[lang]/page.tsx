import Home from "../../components/home/Home";
import type { Metadata } from "next";
import Script from "next/script";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  
  const metadata: Record<string, Metadata> = {
    sr: {
      title: "Koneti – Najbolji kafić u Novom Sadu | Specialty Coffee & Proslave",
      description:
        "Koneti - premijum kafić u Novom Sadu sa specialty kafi, brunchom i prostorima za poslovne sastanke i proslave. Bulevar Oslobođenja 97. Brze rezervacije online.",
      keywords: [
        "Koneti", "Koneti Novi Sad", "najbolji kafić Novi Sad", "kafe Novi Sad", "specialty coffee", "brunch Novi Sad", "proslave Novi Sad", "poslovni sastanci", "ketering", "events", "caffe bar", "reservation", "Bulevar Oslobođenja 97", "Koneti Experience", "privatni događaji"
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
        title: "Koneti – Najbolji kafić u Novom Sadu",
        description: "Premium specialty coffee, brunch, proslave i poslovni prostori. Rezervacije na Bulevaru Oslobođenja 97.",
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
            alt: "Koneti Café - Ambijent u Novom Sadu",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Koneti - Najbolji kafić u Novom Sadu",
        description: "Specialty coffee, brunch, proslave i poslovni prostori.",
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
      verification: {
        google: '1vHXZcaq_PxJ4JsGFbrV5PCygadNzzjPeUi',
      },
    },
    en: {
      title: "Koneti – Best Café in Novi Sad | Specialty Coffee & Events",
      description:
        "Koneti - premium café in Novi Sad with specialty coffee, brunch and spaces for business meetings and celebrations. Bulevar Oslobođenja 97. Quick online reservations.",
      keywords: [
        "Koneti", "Koneti Novi Sad", "best café Novi Sad", "cafe Novi Sad", "coffee shop", "specialty coffee", "brunch", "celebrations", "business meetings", "catering", "events", "reservation", "Bulevar Oslobođenja 97", "Koneti Experience", "private events"
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
        title: "Koneti – Best Café in Novi Sad",
        description: "Premium specialty coffee, brunch, celebrations and business spaces. Reservations at Bulevar Oslobođenja 97.",
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
            alt: "Koneti Café - Atmosphere in Novi Sad",
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
      verification: {
        google: '1vHXZcaq_PxJ4JsGFbrV5PCygadNzzjPeUi',
      },
    },
  };

  return metadata[lang] || metadata.sr;
}

export default function HomePage() {
  return (
    <>
      <Script
        id="breadcrumb-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Početna",
                "item": "https://koneticaffee.com/sr"
              }
            ]
          })
        }}
      />
      <Script
        id="website-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Koneti Café",
            "url": "https://koneticaffee.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://koneticaffee.com/sr/menu?search={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <Home />
    </>
  );
}