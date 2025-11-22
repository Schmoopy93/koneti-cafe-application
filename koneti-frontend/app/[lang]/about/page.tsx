import About from "../../../components/about/About"
import type { Metadata } from "next"
import Script from 'next/script'

type Props = { params: Promise<{ lang: 'sr' | 'en' }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params

  const titles = {
    sr: "O Nama | Koneti Café - Priča, Misija i Vrednosti",
    en: "About Us | Koneti Café - Our Story, Mission & Values"
  }

  const descriptions = {
    sr: "Saznajte priču iza Koneti Café-a – našu misiju, vrednosti i posvećenost kvaliteti u svakoj šolji kafe.",
    en: "Learn the story behind Koneti Café – our mission, values and commitment to quality in every cup of coffee."
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    keywords: lang === 'sr'
      ? ["o nama", "koneti café", "priča", "misija", "vrednosti", "kafić", "Novi Sad"]
      : ["about us", "koneti café", "story", "mission", "values", "cafe", "Novi Sad"],
    authors: [{ name: "Koneti Café", url: "https://koneti.com" }],
    creator: "Koneti Café",
    alternates: {
      canonical: `https://koneti.com/${lang}/about`,
      languages: {
        sr: "https://koneti.com/sr/about",
        en: "https://koneti.com/en/about",
      },
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: `https://koneti.com/${lang}/about`,
      type: "website",
      locale: lang === 'sr' ? "sr_RS" : "en_US",
      siteName: "Koneti Café",
      images: [
        {
          url: "https://koneti.com/og/about.jpg",
          width: 1200,
          height: 630,
          alt: titles[lang],
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[lang],
      description: descriptions[lang],
      images: ["https://koneti.com/og/about.jpg"],
      creator: "@KonetiCafe",
      site: "@KonetiCafe",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    category: "Restaurant",
    applicationName: "Koneti Café",
  }
}

const getBreadcrumb = (lang: string) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": lang === 'sr' ? "Početna" : "Home",
      "item": "https://koneti.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": lang === 'sr' ? "O Nama" : "About",
      "item": `https://koneti.com/${lang}/about`
    }
  ]
})

const getOrganizationJsonLd = (lang: string) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://koneti.com",
  "name": "Koneti Café",
  "url": "https://koneti.com",
  "logo": "https://koneti.com/koneti-logo.png",
  "image": "https://koneti.com/koneti-cafe.jpg",
  "description": lang === 'sr'
    ? "Moderan kafić u Novom Sadu specijalizovan za premium specialty kafu, brunch i organizaciju događaja"
    : "Modern café in Novi Sad specialized in premium specialty coffee, brunch and event organization",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Bulevar Oslobođenja 97",
    "addressLocality": "Novi Sad",
    "addressRegion": "Vojvodina",
    "postalCode": "21000",
    "addressCountry": "RS"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 44.7866,
    "longitude": 20.4489
  },
  "telephone": "+381-XX-XXX-XXXX",
  "email": "info@koneti.com",
  "sameAs": [
    "https://www.facebook.com/KonetiCafe",
    "https://www.instagram.com/KonetiCafe"
  ],
  "foundingDate": "2022",
  "areaServed": {
    "@type": "City",
    "name": "Novi Sad"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "250",
    "bestRating": "5",
    "worstRating": "1"
  }
})

export default function AboutPage({ params }: Props) {
  const lang = (params as any).lang || 'sr'

  return (
    <>
      <Script
        id="about-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumb(lang)) }}
        strategy="afterInteractive"
      />
      <Script
        id="about-organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationJsonLd(lang)) }}
        strategy="afterInteractive"
      />
      <main>
        <About />
      </main>
    </>
  )
}