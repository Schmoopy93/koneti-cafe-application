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
    sr: "Rezervišite prostor za poslovne sastanke, proslave, team building ili privatne događaje. Fleksibilni paketi, prijatna atmosfera i profesionalna usluga.",
    en: "Book space for business meetings, celebrations, team building or private events. Flexible packages, pleasant atmosphere and professional service."
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    keywords: lang === 'sr'
      ? ["rezervacije", "proslave", "poslovni sastanci", "team building", "događaji", "ketering", "Novi Sad", "privatni događaji", "rođendani", "kumstva"]
      : ["reservations", "celebrations", "business meetings", "team building", "events", "catering", "Novi Sad", "private events", "birthdays", "weddings"],
    authors: [{ name: "Koneti Café", url: "https://koneti.com" }],
    creator: "Koneti Café",
    alternates: {
      canonical: `https://koneti.com/${lang}/reservation`,
      languages: {
        sr: "https://koneti.com/sr/reservation",
        en: "https://koneti.com/en/reservation",
      },
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: `https://koneti.com/${lang}/reservation`,
      type: "website",
      locale: lang === 'sr' ? "sr_RS" : "en_US",
      siteName: "Koneti Café",
      images: [
        {
          url: "https://koneti.com/reservation-og-image.jpg",
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
      images: ["https://koneti.com/reservation-og-image.jpg"],
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
      google: "your-google-verification-code",
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
      "item": "https://koneti.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": lang === 'sr' ? "Rezervacije" : "Reservations",
      "item": `https://koneti.com/${lang}/reservation`
    }
  ]
})

const getEventJsonLd = (lang: string) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://koneti.com",
  "name": "Koneti Café",
  "image": "https://koneti.com/koneti-cafe.jpg",
  "url": `https://koneti.com/${lang}`,
  "telephone": "+381-XX-XXX-XXXX",
  "email": "info@koneti.com",
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
      "closes": "24:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "08:00",
      "closes": "21:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "250",
    "bestRating": "5",
    "worstRating": "1"
  },
  "potentialAction": {
    "@type": "ReserveAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `https://koneti.com/${lang}/reservation`,
      "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"]
    }
  }
})

const getFAQJsonLd = (lang: string) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Kako mogu da napravim rezervaciju?" : "How can I make a reservation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Popunite online formu na ovoj stranici i izaberite vrstu događaja. Dobićete potvrdu u roku od 24h."
          : "Fill out the online form on this page and select your event type. You'll receive confirmation within 24 hours."
      }
    },
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Koliko osoba može da stane?" : "How many people can we accommodate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Prostor može da primi do 50 osoba zavisno od vrste događaja. Za veće grupe kontaktirajte nas direktno."
          : "Our space can accommodate up to 50 people depending on the event type. Contact us directly for larger groups."
      }
    },
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Koji su paketi dostupni?" : "What packages are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Nudimo Business Basic, Business Premium, Experience Start, Experience Classic i Experience VIP pakete sa različitim uslugama."
          : "We offer Business Basic, Business Premium, Experience Start, Experience Classic and Experience VIP packages with various services."
      }
    },
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Koje su mogućnosti otkazivanja?" : "What are the cancellation options?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Može se otkazati do 24h pre događaja bez naplate. Otkazivanja sa kraćim rokom mogu biti naplaćena."
          : "Cancellation is free up to 24 hours before the event. Earlier cancellations may be charged."
      }
    }
  ]
})

export default function ReservationPage({ params }: Props) {
  const lang = (params as any).lang || 'sr'

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
      <Script
        id="reservation-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFAQJsonLd(lang)) }}
        strategy="afterInteractive"
      />
      <main>
        <ReservationForm />
      </main>
    </>
  )
}