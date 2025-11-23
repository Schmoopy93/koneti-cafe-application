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
          url: "https://koneticaffee.com/reservation-og-image.jpg",
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
      images: ["https://koneticaffee.com/reservation-og-image.jpg"],
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
  "telephone": "+381-65-6337371",
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
      "closes": "24:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "08:00",
      "closes": "23:00"
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

const getFAQJsonLd = (lang: string) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Koji je minimalan broj osoba za rezervaciju?" : "What is the minimum number of people for a reservation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Za poslovne sastanke nema minimalnog broja, maksimum je 10 osoba. Za proslave maksimalan broj je 35 osoba. Ukoliko želite da gosti samo stoje sa cateringom, tada može do 50 osoba."
          : "For business meetings there is no minimum number, maximum is 10 people. For celebrations the maximum is 35 people. If you want guests to only stand with catering, up to 50 people is possible."
      }
    },
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Kako mogu da izvršim rezervaciju?" : "How can I make a reservation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Rezervaciju možete izvršiti putem našeg online sistema za rezervacije na ovoj stranici ili pozivom na naš kontakt telefon +381 65 6337 371. Online rezervacija je dostupna 24/7."
          : "You can make a reservation through our online reservation system on this page or by calling our contact number +381 65 6337 371. Online reservation is available 24/7."
      }
    },
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Koji su uslovi otkazivanja?" : "What are the cancellation conditions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Rezervaciju možete otkazati do 24h pre zakazanog termina bez dodatnih troškova. Otkazivanja sa manje od 24h napomene mogu biti naplaćena prema uslovima paketa."
          : "You can cancel your reservation up to 24 hours before the scheduled time without additional charges. Cancellations with less than 24 hours notice may be charged according to package terms."
      }
    },
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Koliko unapred trebam da rezervišem?" : "How far in advance should I book?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Za Business Basic i Experience Classic pakete preporučujemo rezervaciju najmanje 2 dana unapred. Za Experience VIP paket preporučujemo rezervaciju najmanje 7 dana unapred."
          : "For Business Basic and Experience Classic packages we recommend booking at least 2 days in advance. For the Experience VIP package we recommend booking at least 7 days in advance."
      }
    },
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Da li je moguće promeniti datum i vreme rezervacije?" : "Is it possible to change the date and time of the reservation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Da, moguće je promeniti datum i vreme rezervacije do 48h pre zakazanog termina. Kontaktirajte nas na konetibulevar@gmail.com ili pozovite +381 65 6337 371"
          : "Yes, it is possible to change the date and time of the reservation up to 48 hours before the scheduled time. Contact us at konetibulevar@gmail.com or call +381 65 6337 371"
      }
    },
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Da li mogu da donesem svoju hranu i piće?" : "Can I bring my own food and drinks?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Spoljašnja hrana i piće nisu dozvoljeni. Svi napici i poslastice moraju biti naručeni kroz Koneti Café. Kontaktirajte nas ako imate posebne zahteve ili alergije."
          : "Outside food and beverages are not allowed. All drinks and pastries must be ordered through Koneti Café. Contact us if you have special requests or allergies."
      }
    },
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Koliko osoba može da stane u prostor?" : "How many people can fit in the space?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Naš prostor može da primi do 50 osoba u zavisnosti od tipa događaja i konfiguracije. Za velike grupe preporučujemo da nas kontaktirate direktno za prilagođena rešenja."
          : "Our space can accommodate up to 50 people depending on the event type and configuration. For larger groups we recommend contacting us directly for customized solutions."
      }
    },
    {
      "@type": "Question",
      "name": lang === 'sr' ? "Koji su paketi dostupni?" : "What packages are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'sr'
          ? "Nudimo Business Basic (11.900 RSD/h), Business High (23.800 RSD/h), Business Corporate Day (95.200 RSD), KONETI START (4.165 RSD/osoba), KONETI CLASSIC (5.355 RSD/osoba) i KONETI CELEBRATION EXPERIENCE (8.330 RSD/osoba)."
          : "We offer Business Basic (11,900 RSD/h), Business High (23,800 RSD/h), Business Corporate Day (95,200 RSD), KONETI START (4,165 RSD/person), KONETI CLASSIC (5,355 RSD/person) and KONETI CELEBRATION EXPERIENCE (8,330 RSD/person)."
      }
    }
  ]
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