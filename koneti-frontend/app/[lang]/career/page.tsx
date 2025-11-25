import type { Metadata } from "next"
import CareerApplication from "@/components/career/CareerApplication"
import Script from 'next/script'

type Props = { params: Promise<{ lang: 'sr' | 'en' }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params

  const titles = {
    sr: "Karijera | Pridruži se Koneti Café Timu - Poslovi u Novom Sadu",
    en: "Careers | Join the Koneti Café Team - Jobs in Novi Sad"
  }

  const descriptions = {
    sr: "Tražimo konobara sa iskustvom. Dnevnica 2200 RSD. Dinamičan tim, fleksibilan raspored, mogućnost napredovanja. Podnesi prijavu sada!",
    en: "Hiring experienced servers. Daily rate 2200 RSD. Dynamic team, flexible schedule, career growth. Apply now!"
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    keywords: lang === 'sr'
      ? ["poslovi", "karijera", "konobar", "zaposlenje", "Novi Sad", "kafić", "rad", "tim", "fleksibilan raspored", "dnevnica"]
      : ["jobs", "careers", "server", "employment", "Novi Sad", "cafe", "work", "team", "flexible schedule"],
    authors: [{ name: "Koneti Café", url: "https://koneticaffee.com" }],
    creator: "Koneti Café",
    alternates: {
      canonical: `https://koneticaffee.com/${lang}/career`,
      languages: {
        sr: "https://koneticaffee.com/sr/career",
        en: "https://koneticaffee.com/en/career",
      },
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: `https://koneticaffee.com/${lang}/career`,
      type: "website",
      locale: lang === 'sr' ? "sr_RS" : "en_US",
      siteName: "Koneti Café",
      images: [
        {
          url: "https://koneticaffee.com/koneti-karijera.jpg",
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
      images: ["https://koneticaffee.com/koneti-karijera.jpg"],
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
    category: "Employment",
    applicationName: "Koneti Café Careers Portal",
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
      "name": lang === 'sr' ? "Karijera" : "Careers",
      "item": `https://koneticaffee.com/${lang}/career`
    }
  ]
})

const getJobPostingJsonLd = (lang: string) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "@id": `https://koneticaffee.com/${lang}/career`,
  "title": lang === 'sr' ? "Konobar/Konobarica - Koneti Café" : "Server - Koneti Café",
  "description": lang === 'sr'
    ? "Koneti Café traži iskusnog konobare/konobaricu. Dinamičan tim, fleksibilan raspored, mogućnost napredovanja. Dnevnica 2200 RSD."
    : "Koneti Café is seeking an experienced server. Dynamic team, flexible schedule, advancement opportunities. Daily rate 2200 RSD.",
  "datePosted": new Date().toISOString(),
  "validThrough": new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
  "employmentType": ["FULL_TIME", "PART_TIME", "TEMPORARY"],
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Koneti Café",
    "@id": "https://koneticaffee.com",
    "sameAs": [
      "https://www.facebook.com/KonetiCafe",
      "https://www.instagram.com/KonetiCafe"
    ],
    "logo": "https://koneticaffee.com/koneti-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Human Resources",
      "telephone": "+381-69-2565563",
      "email": "konetibulevar@gmail.com",
      "url": `https://koneticaffee.com/${lang}/career`
    }
  },
  "jobLocation": [
    {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bulevar Oslobođenja 97",
        "addressLocality": "Novi Sad",
        "addressRegion": "Vojvodina",
        "postalCode": "21000",
        "addressCountry": "RS"
      }
    }
  ],
  "baseSalary": {
    "@type": "PriceSpecification",
    "priceCurrency": "RSD",
    "price": "2200"
  },
  "applicantLocationRequirements": {
    "@type": "Country",
    "name": "RS"
  }
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
    ? "Moderan kafić u Novom Sadu sa bogatom ponudom kafe, brunch i usluga za događaje"
    : "Modern café in Novi Sad with diverse coffee, brunch and event service offerings",
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
  "telephone": "+381-69-2565563",
  "email": "konetibulevar@gmail.com",
  "sameAs": [
    "https://www.facebook.com/KonetiCafe",
    "https://www.instagram.com/KonetiCafe"
  ],
  "areaServed": {
    "@type": "City",
    "name": "Novi Sad"
  },
  "foundingDate": "2022",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Human Resources",
    "telephone": "+381-69-2565563",
    "email": "konetibulevar@gmail.com",
    "url": `https://koneticaffee.com/${lang}/career`
  }
})

const getFAQJsonLd = (lang: string) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Koja je pozicija dostupna?" : "What position is available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Tražimo iskusnog konobare/konobaricu za rad u našem kafību. Redovno se pojavljuju nove pozicije."
          : "We're hiring an experienced server for our café. New positions open regularly."
      }
    },
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Kako mogu da se prijavim?" : "How can I apply?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Popunite online obrazac na ovoj stranici i pošaljite CV. Biće vam javljena povratna informacija u roku od 5 radnih dana."
          : "Fill out the online form on this page and submit your CV. You'll receive feedback within 5 business days."
      }
    },
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Koja je dnevnica?" : "What is the daily rate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Dnevnica je 2200 RSD sa mogućnošću bonusa prema performansama."
          : "Daily rate is 2200 RSD with possibility of performance bonuses."
      }
    },
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Da li je iskustvo obavezno?" : "Is experience required?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Iskustvo je obavezno za ovu poziciju. Trebate da imate iskustvo u radu sa gostima i osnovne veštine servisa."
          : "Experience is required for this position. You need experience working with guests and basic service skills."
      }
    },
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Koji su benefiti rada?" : "What are the work benefits?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Fleksibilan raspored, besplatni napici tokom smene, mogućnost napredovanja, dobra atmosfera i profesionalni razvoj."
          : "Flexible schedule, free beverages during shift, advancement opportunities, great atmosphere and professional development."
      }
    }
  ]
})

export default async function CareerPage({ params }: Props) {
  const { lang } = await params

  return (
    <>
      <Script
        id="career-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumb(lang)) }}
        strategy="afterInteractive"
      />
      <Script
        id="career-job-posting-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getJobPostingJsonLd(lang)) }}
        strategy="afterInteractive"
      />
      <Script
        id="career-organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationJsonLd(lang)) }}
        strategy="afterInteractive"
      />
      <Script
        id="career-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFAQJsonLd(lang)) }}
        strategy="afterInteractive"
      />
      <main>
        <CareerApplication />
      </main>
    </>
  )
}