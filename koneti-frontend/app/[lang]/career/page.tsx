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
    sr: "Otvoren za baristase, konobara, kuvarsku ekipu i menadžere. Dinamičan tim, fleksibilan raspored, profesionalni razvoj. Podnesi prijavu sada!",
    en: "Hiring baristas, servers, kitchen staff and managers. Dynamic team, flexible schedule, professional growth. Apply now!"
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    keywords: lang === 'sr'
      ? ["poslovi", "karijera", "barista", "konobar", "zaposlenje", "Novi Sad", "kafić", "rad", "tim", "fleksibilan raspored"]
      : ["jobs", "careers", "barista", "server", "employment", "Novi Sad", "cafe", "work", "team", "flexible schedule"],
    authors: [{ name: "Koneti Café", url: "https://koneti.com" }],
    creator: "Koneti Café",
    alternates: {
      canonical: `https://koneti.com/${lang}/career`,
      languages: {
        sr: "https://koneti.com/sr/career",
        en: "https://koneti.com/en/career",
      },
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: `https://koneti.com/${lang}/career`,
      type: "website",
      locale: lang === 'sr' ? "sr_RS" : "en_US",
      siteName: "Koneti Café",
      images: [
        {
          url: "https://koneti.com/career-og-image.jpg",
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
      images: ["https://koneti.com/career-og-image.jpg"],
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
    category: "Careers",
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
      "item": "https://koneti.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": lang === 'sr' ? "Karijera" : "Careers",
      "item": `https://koneti.com/${lang}/career`
    }
  ]
})

const getJobPostingJsonLd = (lang: string) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "@id": `https://koneti.com/${lang}/career`,
  "title": lang === 'sr' ? "Različite pozicije - Koneti Café" : "Various Positions - Koneti Café",
  "description": lang === 'sr'
    ? "Koneti Café traži motivirane kandidate za različite pozicije. Dinamičan tim, fleksibilan raspored, mogućnost napredovanja."
    : "Koneti Café is seeking motivated candidates for various positions. Dynamic team, flexible schedule, advancement opportunities.",
  "datePosted": new Date().toISOString(),
  "validThrough": new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
  "employmentType": ["FULL_TIME", "PART_TIME", "TEMPORARY"],
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Koneti Café",
    "@id": "https://koneti.com",
    "sameAs": [
      "https://www.facebook.com/KonetiCafe",
      "https://www.instagram.com/KonetiCafe"
    ],
    "logo": "https://koneti.com/koneti-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Human Resources",
      "telephone": "+381-XX-XXX-XXXX",
      "email": "careers@koneti.com",
      "url": `https://koneti.com/${lang}/career`
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
    "price": lang === 'sr' ? "Prema dogovoru" : "Negotiable"
  },
  "applicantLocationRequirements": {
    "@type": "Country",
    "name": "RS"
  }
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
    ? "Moderan kafić u Novom Sadu sa bogatom ponudom kafe, poslastica i usluga"
    : "Modern café in Novi Sad with diverse coffee, pastry and service offerings",
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
    "https://www.instagram.com/KonetiCafe",
    "https://www.linkedin.com/company/koneti-cafe"
  ],
  "areaServed": {
    "@type": "City",
    "name": "Novi Sad"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Human Resources",
    "telephone": "+381-XX-XXX-XXXX",
    "email": "careers@koneti.com",
    "url": `https://koneti.com/${lang}/career`
  }
})

const getFAQJsonLd = (lang: string) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Koje pozicije su dostupne?" : "What positions are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Tražimo baristase, konobara, kuvarsku ekipu i menadžere. Redovno se pojavljuju nove pozicije."
          : "We're hiring baristas, servers, kitchen staff and managers. New positions open regularly."
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
      "name": lang === 'sr' ? "Da li je iskustvo obavezno?" : "Is experience required?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Iskustvo je poželjno ali ne obavezno. Tražimo motivirane kandidate koje će obučiti naš tim."
          : "Experience is preferred but not required. We train motivated candidates on our team."
      }
    },
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Koji su benefiti rada?" : "What are the work benefits?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Fleksibilan raspored, besplatni napici, mogućnost napredovanja, dobra atmosfera i profesionalni razvoj."
          : "Flexible schedule, free beverages, advancement opportunities, great atmosphere and professional development."
      }
    }
  ]
})

export default function CareerPage({ params }: Props) {
  const lang = (params as any).lang || 'sr'

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