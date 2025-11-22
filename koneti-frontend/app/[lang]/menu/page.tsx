import Menu from "@/components/menu/Menu"
import type { Metadata } from 'next'
import Script from 'next/script'

type Props = { params: Promise<{ lang: 'sr' | 'en' }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  
  const titles = {
    sr: "Meni | Koneti Café - Kafa, Piće, Brunch i Ketering u Novom Sadu",
    en: "Menu | Koneti Café - Coffee, Drinks, Brunch & Catering in Novi Sad"
  }
  
  const descriptions = {
    sr: "Otkrijte naš bogat meni sa premium specialty kafom, osvežavajućim pićima, brunch ponudom i mogućnošću keteringa. Espresso, cappuccino, filter kafa, cedjeni sokovi i poslastice.",
    en: "Explore our diverse menu featuring specialty coffee, refreshing drinks, brunch options and catering. Espresso, cappuccino, filter coffee, freshly pressed juices and pastries."
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    keywords: lang === 'sr'
      ? ["meni", "kafa", "espresso", "cappuccino", "filter kafa", "piće", "brunch", "ketering", "kafić Novi Sad", "doručak", "cedjeni sokovi", "poslastice", "specialty coffee"]
      : ["menu", "coffee", "espresso", "cappuccino", "filter coffee", "drinks", "brunch", "catering", "Novi Sad", "breakfast", "fresh juices", "pastries", "specialty coffee"],
    alternates: {
      canonical: `https://koneti.com/${lang}/menu`,
      languages: {
        sr: "https://koneti.com/sr/menu",
        en: "https://koneti.com/en/menu",
      },
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: `https://koneti.com/${lang}/menu`,
      type: "website",
      locale: lang === 'sr' ? "sr_RS" : "en_US",
      siteName: "Koneti Café",
      images: [
        {
          url: "https://koneti.com/menu-og-image.jpg",
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
      images: ["https://koneti.com/menu-og-image.jpg"],
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
    category: "Restaurant",
    applicationName: "Koneti Café Menu",
  }
}

export const dynamic = "force-dynamic"
const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

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
      "name": lang === 'sr' ? "Meni" : "Menu",
      "item": `https://koneti.com/${lang}/menu`
    }
  ]
})

const getMenuStructuredData = (lang: string) => ({
  "@context": "https://schema.org",
  "@type": "Restaurant",
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
  "servesCuisine": ["Coffee", "Desserts", "Brunch", "Beverages"],
  "priceRange": "$$",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "250",
    "bestRating": "5",
    "worstRating": "1"
  },
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
  "hasMenu": {
    "@type": "Menu",
    "name": lang === 'sr' ? "Koneti Café Meni" : "Koneti Café Menu",
    "description": lang === 'sr'
      ? "Kompletan meni sa specijalitetima, napicima i brunch ponudom"
      : "Complete menu with specialties, drinks and brunch options",
    "url": `https://koneti.com/${lang}/menu`,
    "hasMenuSection": [
      {
        "@type": "MenuSection",
        "name": lang === 'sr' ? "Specialty Kafa" : "Specialty Coffee",
        "description": lang === 'sr'
          ? "Premium kafe od najboljih proizvoditelja"
          : "Premium coffee from the best producers",
      },
      {
        "@type": "MenuSection",
        "name": lang === 'sr' ? "Napici" : "Beverages",
        "description": lang === 'sr'
          ? "Svežo cednjeni sokovi i smoothie-ji"
          : "Freshly pressed juices and smoothies",
      },
      {
        "@type": "MenuSection",
        "name": lang === 'sr' ? "Brunch" : "Brunch",
        "description": lang === 'sr'
          ? "Doručak i brunch ponuda tokom dana"
          : "Breakfast and brunch offerings throughout the day",
      },
      {
        "@type": "MenuSection",
        "name": lang === 'sr' ? "Poslastice" : "Pastries",
        "description": lang === 'sr'
          ? "Svežo pripremljene poslastice i kolači"
          : "Fresh pastries and cakes",
      }
    ]
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "RSD",
    "lowPrice": "150",
    "highPrice": "1500",
    "availability": "https://schema.org/InStock"
  }
})

export default async function MenuPage({ params }: Props) {
  const { lang } = await params
  
  try {
    const [catRes, drinkRes] = await Promise.all([
      fetch(`${API_URL}/categories`, { cache: "no-store" }),
      fetch(`${API_URL}/drinks`, { cache: "no-store" }),
    ])

    const [categories, drinks] = await Promise.all([
      catRes.json(),
      drinkRes.json(),
    ])

    return (
      <>
        <Script
          id="menu-breadcrumb-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumb(lang)) }}
          strategy="afterInteractive"
        />
        <Script
          id="menu-structured-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getMenuStructuredData(lang)) }}
          strategy="afterInteractive"
        />
        <main>
          <Menu initialCategories={categories} initialDrinks={drinks} />
        </main>
      </>
    )
  } catch (error) {
    console.error("Error fetching menu data:", error)
    return (
      <main>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#e74c3c', marginBottom: '1rem' }}>
            {lang === 'sr' ? 'Greška pri učitavanju menija' : 'Error loading menu'}
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            {lang === 'sr'
              ? 'Došlo je do greške prilikom učitavanja podataka. Molimo pokušajte ponovo kasnije.'
              : 'An error occurred while loading data. Please try again later.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            {lang === 'sr' ? 'Pokušaj ponovo' : 'Try again'}
          </button>
        </div>
      </main>
    )
  }
}