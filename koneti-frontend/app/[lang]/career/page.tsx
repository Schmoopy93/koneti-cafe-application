import type { Metadata } from "next";
import CareerApplication from "@/components/career/CareerApplication";
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Karijera | Pridruži se Koneti Café Timu | Poslovi u Novom Sadu",
  description: "Traži se timski igrač! Otkri mogućnosti za rad u Koneti Café-u. Podnesi prijavu i postani deo našeg dinamičnog tima.",
  keywords: [
    "poslovi",
    "karijera",
    "zaposlenje",
    "koneti café",
    "kafić Novi Sad",
    "barista",
    "konobar",
    "kuhinja",
    "menadžer",
    "rad u kaficu",
    "sezonski poslovi",
    "stalni poslovi",
    "timski rad",
    "mogućnosti zaposlenja",
    "prijava za posao",
    "razvoj karijere",
    "dinamično radno okruženje"
  ],
  authors: [{ name: "Koneti Café", url: "https://koneti.com" }],
  creator: "Koneti Café",
  openGraph: {
    title: "Karijera | Koneti Café",
    description: "Pridruži se našem timu i budi deo Koneti Café porodice",
    url: "https://koneti.com/career",
    type: "website",
    locale: "sr_RS",
    siteName: "Koneti Café",
    images: [
      {
        url: "/career-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Koneti Café Karijera",
        type: "image/jpeg",
      },
      {
        url: "/team-koneti.jpg",
        width: 1200,
        height: 630,
        alt: "Koneti Café Tim",
        type: "image/jpeg",
      }
    ],
  },
  alternates: {
    canonical: 'https://koneti.com/career',
    languages: {
      'sr-RS': 'https://koneti.com/career',
      'en-US': 'https://koneti.com/en/career',
    }
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
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
    yandex: "your-yandex-verification-code",
    other: {
      "facebook-domain-verification": "your-facebook-verification"
    }
  },
  category: "Career",
  applicationName: "Koneti Café Career Portal",
  twitter: {
    card: 'summary_large_image',
    title: 'Karijera | Koneti Café',
    description: 'Pronađi svoj idealan posao u Koneti Café-u',
    site: '@KonetiCafe',
    creator: '@KonetiCafe',
    images: ['/career-twitter.jpg'],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Početna",
      "item": "https://koneti.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Karijera",
      "item": "https://koneti.com/career"
    }
  ]
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Koneti Café",
  "url": "https://koneti.com",
  "@id": "https://koneti.com",
  "logo": "https://koneti.com/logo.png",
  "image": "https://koneti.com/koneti-cafe.jpg",
  "description": "Moderan kafić u Novom Sadu sa bogatom ponudom kafe, poslastica i prostora za poslovne sastanke",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Your Street Address",
    "addressLocality": "Novi Sad",
    "addressRegion": "Vojvodina",
    "postalCode": "21000",
    "addressCountry": "RS"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 45.2551338,
    "longitude": 19.8451756
  },
  "telephone": "+381XXXXXXXXX",
  "email": "info@koneti.com",
  "sameAs": [
    "https://www.facebook.com/KonetiCafe",
    "https://www.instagram.com/KonetiCafe",
    "https://www.linkedin.com/company/koneti-cafe"
  ],
  "foundingDate": "2020",
  "areaServed": {
    "@type": "City",
    "name": "Novi Sad"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Human Resources",
    "telephone": "+381XXXXXXXXX",
    "email": "careers@koneti.com",
    "url": "https://koneti.com/career"
  }
};

const jobPostingJsonLd = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Različite pozicije - Koneti Café",
  "description": "Koneti Café traži motivirane kandidate za različite pozicije. Podnesi prijavu i postani deo našeg tima!",
  "datePosted": new Date().toISOString().split('T')[0],
  "validThrough": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  "employmentType": [
    "FULL_TIME",
    "PART_TIME",
    "TEMPORARY"
  ],
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Koneti Café",
    "sameAs": "https://koneti.com",
    "logo": "https://koneti.com/logo.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Street Address",
      "addressLocality": "Novi Sad",
      "addressRegion": "Vojvodina",
      "postalCode": "21000",
      "addressCountry": "RS"
    }
  },
  "baseSalary": {
    "@type": "PriceSpecification",
    "priceCurrency": "RSD",
    "price": "Prema dogovoru"
  },
  "applicantLocationRequirements": {
    "@type": "Country",
    "name": "RS"
  }
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Koje pozicije su dostupne u Koneti Café-u?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Koneti Café redovno traži kandidate za različite pozicije uključujući baristase, konobara, kuvarsku ekipu i menadžere. Sve dostupne pozicije možete videti na našoj stranici za karijeru."
      }
    },
    {
      "@type": "Question",
      "name": "Kako mogu da pošaljem svoju prijavu?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Prijavu možete poslati kroz naš online obrazac na ovoj stranici. Trebate da unesete svoje osnovne podatke, odaberete poziciju, napišete motivaciono pismo i priložite CV. Proces je jednostavan i traje samo nekoliko minuta."
      }
    },
    {
      "@type": "Question",
      "name": "Koji su zahtevi za poziciju baristase?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Za poziciju baristase tražimo kandidate sa iskustvom u pripremi kafe, znanjem o različitim vrstama kafe, odličnim komunikacijskim veštinama i sposobnošću da rade u brzom okruženju. Certifikati za bariste su prednost."
      }
    },
    {
      "@type": "Question",
      "name": "Da li je iskustvo obavezno?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Iskustvo je poželjno, ali nismo strogo. Tražimo motivirane kandidate sa željom da se razvijaju. Pružamo obuku za sve nove zaposlene kako bi se brzo uključili u tim."
      }
    },
    {
      "@type": "Question",
      "name": "Koliko dugo traje proces selekcije?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Obično proces selekcije traje 1-2 nedelje. Nakon što pošaljete prijavu, naš tim će je pregledati i kontaktirati vas ako ste prošli na sledeću fazu. Razgovor se obično održava u našem kaficu."
      }
    },
    {
      "@type": "Question",
      "name": "Koje su prednosti rada u Koneti Café-u?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Prednosti rada kod nas uključuju fleksibilan raspored, mogućnost profesionalnog razvoja, odličan timski ambijent, besplatne napitke tokom smene, mogućnost napredovanja i rad u modernom okruženju."
      }
    },
    {
      "@type": "Question",
      "name": "Da li nudi Koneti Café sezonske poslove?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Da, Koneti Café nudi sezonske poslove tokom letnjeg perioda i praznika. Ako ste zainteresovani za sezonski posao, slobodno nam pošaljite prijavu sa napomenom da tražite sezonsku poziciju."
      }
    },
    {
      "@type": "Question",
      "name": "Kako mogu da saznjem više o kulturi kompanije?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Više o kulturi Koneti Café-a možete saznati na našim društvenim mrežama (Facebook, Instagram), kroz razgovore sa našim timom ili posećivanjem kafića. Naš tim je uvek spreman da odgovori na vaša pitanja."
      }
    }
  ]
};


export default function CareerPage() {
  return (
    <>
      <Script
        id="career-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="breadcrumb-career-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="job-posting-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />
      <Script
        id="faq-career-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main>
        <CareerApplication />
      </main>
    </>
  );
}

