
import Menu from "@/components/menu/Menu";
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Meni | Koneti Café - Kafa, Piće i Proslave",
  description: "Otkrijte naš meni sa premium kafama, osvežavajućim pićima i mogućnošću keteringa za proslave i poslovne događaje u Novom Sadu.",
  keywords: [
    "meni", "kafa", "espresso", "cappuccino", "filter kafa",
    "piće", "osvežavajući napici", "brunch", "cedjeni sokovi",
    "ketering za proslave", "ketering za događaje", "kafić Novi Sad",
    "premium kafa", "specijalni napici", "doručak"
  ],
  openGraph: {
    title: "Meni | Koneti Café",
    description: "Premium kafa, pića i ketering za proslave i događaje",
    url: "https://koneti.com/menu",
    type: "website",
    locale: "sr_RS",
    siteName: "Koneti Café",
    images: [
      {
        url: "/menu-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Koneti Café Meni - Kafa, Piće i Proslave",
        type: "image/jpeg",
      }
    ],
  },
  alternates: {
    canonical: 'https://koneti.com/menu',
    languages: {
      'sr-RS': 'https://koneti.com/menu',
      'en-US': 'https://koneti.com/en/menu',
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
  },
  category: "Restaurant",
  applicationName: "Koneti Café Menu",
};

export const dynamic = "force-dynamic";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

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
      "name": "Meni",
      "item": "https://koneti.com/menu"
    }
  ]
};

const menuJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Koneti Café",
  "image": "https://koneti.com/koneti-cafe.jpg",
  "url": "https://koneti.com",
  "telephone": "+381XXXXXXXXX",
  "email": "info@koneti.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Bulevar oslobođenja 97",
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
  "servesCuisine": [
    "Coffee",
    "Desserts",
    "Brunch",
    "Beverages"
  ],
  "priceRange": "$$",
  "hasMenu": {
    "@type": "Menu",
    "name": "Koneti Café Meni",
    "hasMenuSection": [
      {
        "@type": "MenuSection",
        "name": "Specialty Coffee",
        "description": "Premium specialty kafe od najboljih proizvoditelja",
        "hasMenuItem": [
          {
            "@type": "MenuItem",
            "name": "Espresso",
            "description": "Single origin espresso",
            "offers": {
              "@type": "Offer",
              "priceCurrency": "RSD",
              "availability": "https://schema.org/InStock"
            }
          },
          {
            "@type": "MenuItem",
            "name": "Cappuccino",
            "description": "Espresso sa mlekom",
            "offers": {
              "@type": "Offer",
              "priceCurrency": "RSD",
              "availability": "https://schema.org/InStock"
            }
          }
        ]
      },
      {
        "@type": "MenuSection",
        "name": "Napici",
        "description": "Svežo cednjeni sokovi i smoothie-ji",
        "hasMenuItem": [
          {
            "@type": "MenuItem",
            "name": "Cedjena Malina",
            "description": "Svežo cednjeni sok od maline",
            "offers": {
              "@type": "Offer",
              "priceCurrency": "RSD",
              "availability": "https://schema.org/InStock"
            }
          },
          {
            "@type": "MenuItem",
            "name": "Smoothie",
            "description": "Voćni smoothie-ji",
            "offers": {
              "@type": "Offer",
              "priceCurrency": "RSD",
              "availability": "https://schema.org/InStock"
            }
          }
        ]
      },
      {
        "@type": "MenuSection",
        "name": "Poslastice",
        "description": "Svežo pripremljene poslastice",
        "hasMenuItem": [
          {
            "@type": "MenuItem",
            "name": "Razne Poslastice",
            "description": "Svežo pripremljene poslastice",
            "offers": {
              "@type": "Offer",
              "priceCurrency": "RSD",
              "availability": "https://schema.org/InStock"
            }
          }
        ]
      },
      {
        "@type": "MenuSection",
        "name": "Brunch",
        "description": "Doručak i brunch ponuda",
        "hasMenuItem": [
          {
            "@type": "MenuItem",
            "name": "Brunch Ponuda",
            "description": "Raznovrsna brunch jela",
            "offers": {
              "@type": "Offer",
              "priceCurrency": "RSD",
              "availability": "https://schema.org/InStock"
            }
          }
        ]
      }
    ]
  },
  "catering": {
    "@type": "Service",
    "name": "Ketering za Proslave i Događaje",
    "description": "Ketering usluge dostupne po narudžbini za proslave, poslovne događaje i privatne proslavljanja",
    "areaServed": {
      "@type": "City",
      "name": "Novi Sad"
    },
    "url": "https://koneti.com/reservation?type=experience"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "07:00",
      "closes": "23:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Saturday",
        "Sunday"
      ],
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
  }
};

export default async function MenuPage() {
  try {
    const [catRes, drinkRes] = await Promise.all([
      fetch(`${API_URL}/categories`, { cache: "no-store" }),
      fetch(`${API_URL}/drinks`, { cache: "no-store" }),
    ]);

    const [categories, drinks] = await Promise.all([
      catRes.json(),
      drinkRes.json(),
    ]);

    return (
      <>
        <Script
          id="menu-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
        />
        <Script
          id="breadcrumb-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <main>
          <Menu initialCategories={categories} initialDrinks={drinks} />
        </main>
      </>
    );
  } catch (error) {
    console.error("Error fetching menu data:", error);
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
          <h2 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Greška pri učitavanju menija</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Došlo je do greške prilikom učitavanja podataka. Molimo pokušajte ponovo kasnije.
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
            Pokušaj ponovo
          </button>
        </div>
      </main>
    );
  }
}