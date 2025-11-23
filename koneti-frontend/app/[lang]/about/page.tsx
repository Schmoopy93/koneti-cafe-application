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
    sr: "Koneti Café je otvoren 2022. godine u srcu Novog Sada, na Bulevaru Oslobođenja 97. Naša misija je pružiti premium specialty kafu, brunch i prostor za nezaboravne događaje sa toplom atmosferom i pažnjom prema svakom detalju.",
    en: "Koneti Café opened in 2022 in the heart of Novi Sad at Bulevar Oslobođenja 97. Our mission is to provide premium specialty coffee, brunch and space for unforgettable events with warm atmosphere and attention to every detail."
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    keywords: lang === 'sr'
      ? ["o nama", "koneti café", "priča", "misija", "vrednosti", "kafić", "Novi Sad", "2022"]
      : ["about us", "koneti café", "story", "mission", "values", "cafe", "Novi Sad", "2022"],
    authors: [{ name: "Koneti Café", url: "https://koneticaffee.com" }],
    creator: "Koneti Café",
    alternates: {
      canonical: `https://koneticaffee.com/${lang}/about`,
      languages: {
        sr: "https://koneticaffee.com/sr/about",
        en: "https://koneticaffee.com/en/about",
      },
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: `https://koneticaffee.com/${lang}/about`,
      type: "website",
      locale: lang === 'sr' ? "sr_RS" : "en_US",
      siteName: "Koneti Café",
      images: [
        {
          url: "https://koneticaffee.com/og/about.jpg",
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
      images: ["https://koneticaffee.com/og/about.jpg"],
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
      "item": "https://koneticaffee.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": lang === 'sr' ? "O Nama" : "About",
      "item": `https://koneticaffee.com/${lang}/about`
    }
  ]
})

const getOrganizationJsonLd = (lang: string) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://koneticaffee.com",
  "name": "Koneti Café",
  "url": "https://koneticaffee.com",
  "logo": "https://koneticaffee.com/koneti-logo.png",
  "image": "https://koneticaffee.com/koneti-cafe.jpg",
  "description": lang === 'sr'
    ? "Koneti Café je moderan kafić u Novom Sadu specijalizovan za premium specialty kafu, brunch i organizaciju poslovnih događaja. Otvoren 2022. godine, brzo smo postali omiljeno mesto za ljubitelje kvalitetnog pića i prijatnog ambijenta."
    : "Koneti Café is a modern café in Novi Sad specialized in premium specialty coffee, brunch and business event organization. Opened in 2022, we quickly became the favorite spot for quality drink and pleasant atmosphere lovers.",
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
    "latitude": 45.25012974165488,
    "longitude": 19.838497955822376
  },
  "telephone": "+381-65-6337371",
  "email": "konetibulevar@gmail.com",
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
  },
  "knowsAbout": [
    "Specialty Coffee",
    "Premium Service",
    "Event Organization",
    "Brunch Cuisine",
    "Fresh Juices"
  ]
})

export default async function AboutPage({ params }: Props) {
  const { lang } = await params

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