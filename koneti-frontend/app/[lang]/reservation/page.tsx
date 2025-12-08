import type { Metadata } from "next"
import ReservationForm from "../../../components/forms/ReservationForm"
import Script from "next/script"

type Props = { params: Promise<{ lang: 'sr' | 'en' }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params

  const titles = {
    sr: "Rezervacije | Poslovni Sastanci, Proslave i Događaji | Koneti Café",
    en: "Reservations | Business Meetings, Celebrations & Events | Koneti Café"
  }

  const descriptions = {
    sr: "Rezervišite prostor za poslovne sastanke, proslave, team building ili privatne događaje. Fleksibilni paketi od 4.165 RSD po osobi. Premium usluga i prijatna atmosfera.",
    en: "Book space for business meetings, celebrations, team building or private events. Flexible packages from 4.165 RSD per person. Premium service and pleasant atmosphere."
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    keywords: lang === 'sr'
      ? ["rezervacije", "proslave", "poslovni sastanci", "team building", "događaji", "ketering", "Novi Sad", "privatni događaji", "rodzendani", "kumstva"]
      : ["reservations", "celebrations", "business meetings", "team building", "events", "catering", "Novi Sad", "private events", "birthdays", "weddings"],
    authors: [{ name: "Koneti Café", url: "https://koneticaffee.com" }],
    creator: "Koneti Café",
    alternates: {
      canonical: `https://koneticaffee.com/${lang}/reservation`,
      languages: {
        sr: "https://koneticaffee.com/sr/reservation",
        en: "https://koneticaffee.com/en/reservation",
        'x-default': "https://koneticaffee.com/sr/reservation",
      },
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: `https://koneticaffee.com/${lang}/reservation`,
      type: "website",
      locale: lang === 'sr' ? "sr_RS" : "en_US",
      siteName: "Koneti Café",
      images: [
        {
          url: "https://koneticaffee.com/koneti-rezervacije.jpg",
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
      images: ["https://koneticaffee.com/koneti-rezervacije.jpg"],
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
      google: "1vHXZcaq_PxJ4JsGFbrV5PCygadNzzjPeUi",
    },
    category: "Reservations",
    applicationName: "Koneti Café Reservations",
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
      "name": lang === 'sr' ? "Rezervacije" : "Reservations",
      "item": `https://koneticaffee.com/${lang}/reservation`
    }
  ]
})

const getEventJsonLd = (lang: string) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://koneticaffee.com",
  "name": "Koneti Café",
  "image": "https://koneticaffee.com/koneti-cafe.jpg",
  "url": "https://koneticaffee.com",
  "telephone": "+381-69-2565563",
  "email": "konetibulevar@gmail.com",
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
  "acceptsReservations": true,
  "areaServed": {
    "@type": "City",
    "name": "Novi Sad"
  },
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": lang === 'sr' ? "Poslovni sastanci" : "Business Meetings",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": lang === 'sr' ? "Privatni događaji" : "Private Events",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "WiFi",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": lang === 'sr' ? "Parking" : "Parking",
      "value": true
    }
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "07:30",
      "closes": "23:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "07:30",
      "closes": "23:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "09:00",
      "closes": "23:00"
    }
  ],
  "potentialAction": {
    "@type": "ReserveAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `https://koneticaffee.com/${lang}/reservation`,
      "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"]
    }
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "RSD",
    "lowPrice": "4165",
    "highPrice": "95200",
    "offerCount": "6",
    "offers": [
      {
        "@type": "Offer",
        "name": "KONETI BUSINESS BASIC",
        "description": lang === 'sr' ? "Osnovno poslovno okupljanje sa kafom i osveženjima" : "Basic business gathering with coffee and refreshments",
        "price": "11900",
        "priceCurrency": "RSD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "priceCurrency": "RSD",
          "price": "11900",
          "unitCode": "HUR"
        },
        "availability": "https://schema.org/InStock",
        "url": `https://koneticaffee.com/${lang}/reservation?type=business&package=basic`
      },
      {
        "@type": "Offer",
        "name": "KONETI BUSINESS HIGH",
        "description": lang === 'sr' ? "Premium poslovno okupljanje sa plate i opcionalnim pićima" : "Premium business gathering with platters and optional drinks",
        "price": "23800",
        "priceCurrency": "RSD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "priceCurrency": "RSD",
          "price": "23800",
          "unitCode": "HUR"
        },
        "availability": "https://schema.org/InStock",
        "url": `https://koneticaffee.com/${lang}/reservation?type=business&package=premium`
      },
      {
        "@type": "Offer",
        "name": "KONETI BUSINESS CORPORATE DAY",
        "description": lang === 'sr' ? "Celodan poslovni događaj sa svim potrebnim uslugama" : "Full-day business event with all necessary services",
        "price": "95200",
        "priceCurrency": "RSD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "priceCurrency": "RSD",
          "price": "95200",
          "unitCode": "DAY"
        },
        "availability": "https://schema.org/InStock",
        "url": `https://koneticaffee.com/${lang}/reservation?type=business&package=corporate`
      },
      {
        "@type": "Offer",
        "name": "KONETI START",
        "description": lang === 'sr' ? "Prijatna atmosfera za intimne proslave sa prijateljima i porodicom" : "Cozy atmosphere for intimate celebrations with friends and family",
        "price": "4165",
        "priceCurrency": "RSD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "priceCurrency": "RSD",
          "price": "4165",
          "unitCode": "PER"
        },
        "availability": "https://schema.org/InStock",
        "url": `https://koneticaffee.com/${lang}/reservation?type=experience&package=basic`
      },
      {
        "@type": "Offer",
        "name": "KONETI CLASSIC",
        "description": lang === 'sr' ? "Sofisticirana elegancija sa poboljšanom uslugom i premium sadržajima" : "Sophisticated elegance with enhanced service and premium amenities",
        "price": "5355",
        "priceCurrency": "RSD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "priceCurrency": "RSD",
          "price": "5355",
          "unitCode": "PER"
        },
        "availability": "https://schema.org/InStock",
        "url": `https://koneticaffee.com/${lang}/reservation?type=experience&package=premium`
      },
      {
        "@type": "Offer",
        "name": "KONETI CELEBRATION EXPERIENCE",
        "description": lang === 'sr' ? "Vrhunsko luksuzno iskustvo sa ekskluzivnim pogodnostima i personalizovanom uslugom" : "The ultimate luxury experience with exclusive perks and personalized service",
        "price": "8330",
        "priceCurrency": "RSD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "priceCurrency": "RSD",
          "price": "8330",
          "unitCode": "PER"
        },
        "availability": "https://schema.org/InStock",
        "url": `https://koneticaffee.com/${lang}/reservation?type=experience&package=vip`
      }
    ]
  }
})

export default async function ReservationPage({ params }: Props) {
  const { lang } = await params

  return (
    <>
      <Script
        id="reservation-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumb(lang)) }}
        strategy="afterInteractive"
      />
      <Script
        id="reservation-event-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getEventJsonLd(lang)) }}
        strategy="afterInteractive"
      />
      <main>
        <ReservationForm />
      </main>
    </>
  )
}