import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ClientProviders from "../../contexts/ClientProviders";
import Script from "next/script";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

type Props = {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 5,
};

export async function generateStaticParams() {
  return [
    { lang: 'sr' },
    { lang: 'en' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  
  const metadata: Record<string, Metadata> = {
    sr: {
      metadataBase: new URL('https://koneticaffee.com'),
      title: {
        default: "Koneti Café - Dobrodošli",
        template: "%s | Koneti Café",
      },
      description: "Koneti - najbolji kafić u Novom Sadu na Bulevaru Oslobođenja 97. Premium specialty coffee, brunch, ketering i poslovni prostori. Rezervacije za proslave, sastanke i privatne događaje.",
      keywords: [
        "Koneti", "Koneti café", "Koneti kafić", "Koneti Novi Sad", "kafe Novi Sad", "kafić Novi Sad", "best kafić", "najbolji kafić", "specialty coffee Novi Sad", "brunch Novi Sad", "ketering Novi Sad", "poslovni sastanci", "proslave Novi Sad", "privatni događaji", "caffe bar", "coffee shop", "Bulevar Oslobođenja 97", "Koneti Experience", "Koneti Café Bulevar"
      ],
      authors: [{ name: "Koneti Café", url: "https://koneticaffee.com" }],
      creator: "Koneti Café",
      publisher: "Koneti Café",
      category: "Café",
      applicationName: "Koneti Café",
      other: {
        'google-site-verification': '1vHXZcaq_PxJ4JsGFbrV5PCygadNzzjPeUi',
        'facebook-domain-verification': 'your-verification-code',
      },
      openGraph: {
        title: "Koneti Café - Dobrodošli",
        description: "Premium specialty kafa, brunch i prostora za poslovne sastanke i proslave u Novom Sadu",
        url: "https://koneticaffee.com/sr",
        siteName: "Koneti Café",
        images: [
          {
            url: "https://koneticaffee.com/koneti-kafe.jpg",
            width: 1200,
            height: 630,
            alt: "Koneti Café - Ambijent i specijaliteti",
          }
        ],
        locale: "sr_RS",
        alternateLocale: ["en_US"],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Koneti Café - Dobrodošli",
        description: "Premium specialty kafa i brunch u Novom Sadu",
        images: ["https://koneticaffee.com/koneti-kafe.jpg"],
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
        google: '1vHXZcaq_PxJ4JsGFbrV5PCygadNzzjPeUi',
      },
      alternates: {
        canonical: 'https://koneticaffee.com/sr',
        languages: {
          'sr': 'https://koneticaffee.com/sr',
          'en': 'https://koneticaffee.com/en',
        },
      },
    },
    en: {
      metadataBase: new URL('https://koneticaffee.com'),
      title: {
        default: "Koneti Café - Welcome",
        template: "%s | Koneti Café",
      },
      description: "Koneti Café - Premium specialty coffee, brunch and catering in Novi Sad. Reserve for business meetings, celebrations and private events at Bulevar Oslobođenja 97.",
      keywords: [
        "Koneti", "Koneti café", "Koneti Novi Sad", "cafe Novi Sad", "coffee shop Novi Sad", "specialty coffee", "brunch", "catering", "celebrations", "business meetings", "reservation", "Bulevar Oslobođenja 97", "Koneti Experience", "best café", "coffee Serbia", "premium coffee Novi Sad", "event space Novi Sad"
      ],
      authors: [{ name: "Koneti Café", url: "https://koneticaffee.com" }],
      creator: "Koneti Café",
      publisher: "Koneti Café",
      category: "Café",
      applicationName: "Koneti Café",
      other: {
        'google-site-verification': '1vHXZcaq_PxJ4JsGFbrV5PCygadNzzjPeUi',
        'facebook-domain-verification': 'your-verification-code',
      },
      openGraph: {
        title: "Koneti Café - Welcome",
        description: "Premium specialty coffee, brunch and space for business meetings and celebrations in Novi Sad",
        url: "https://koneticaffee.com/en",
        siteName: "Koneti Café",
        images: [
          {
            url: "https://koneticaffee.com/koneti-kafe.jpg",
            width: 1200,
            height: 630,
            alt: "Koneti Café - Atmosphere and specialties",
          }
        ],
        locale: "en_US",
        alternateLocale: ["sr_RS"],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Koneti Café - Welcome",
        description: "Premium specialty coffee and brunch in Novi Sad",
        images: ["/koneti-logo.png"],
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
        google: '1vHXZcaq_PxJ4JsGFbrV5PCygadNzzjPeUi',
      },
      alternates: {
        canonical: 'https://koneticaffee.com/en',
        languages: {
          'sr': 'https://koneticaffee.com/sr',
          'en': 'https://koneticaffee.com/en',
        },
      },
    },
  };

  return metadata[lang] || metadata.sr;
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  
  const cafeJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://koneticaffee.com",
    "additionalType": "CafeOrCoffeeShop",
    "name": "Koneti Café",
    "description": lang === 'en' 
      ? "Premium specialty coffee, brunch and event space in Novi Sad. Perfect for business meetings, celebrations and private gatherings."
      : "Premium specialty kafa, brunch i prostor za događaje u Novom Sadu. Idealno za poslovne sastanke, proslave i privatna okupljanja.",
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
    "servesCuisine": ["Coffee", "Brunch", "Desserts", "Beverages"],
    "priceRange": "$$",
    "image": "https://koneticaffee.com/koneti-kafe.jpg",
    "logo": {
      "@type": "ImageObject",
      "url": "https://koneticaffee.com/koneti-logo.png",
      "width": 250,
      "height": 60
    },
    "sameAs": [
      "https://www.facebook.com/KonetiCafe",
      "https://www.instagram.com/KonetiCafe"
    ],
    "foundingDate": "2022",
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "92",
      "bestRating": "5",
      "worstRating": "1"
    },
    "acceptsReservations": true,
    "availableLanguage": ["sr-RS", "en-US"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": lang === 'en' ? "Koneti Café Services" : "Koneti Café Usluge",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": lang === 'en' ? "Business Meetings" : "Poslovni Sastanci",
          "description": lang === 'en'
            ? "Professional workspace for meetings and presentations with premium catering"
            : "Profesionalan prostor za sastanke i prezentacije sa premium cateringom",
          "priceCurrency": "RSD",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": lang === 'en' ? "Celebrations & Events" : "Proslave i Događaji",
          "description": lang === 'en'
            ? "Exclusive venue for celebrations, birthdays, and private gatherings"
            : "Ekskluzivan prostor za proslave, rođendane i privatna okupljanja",
          "priceCurrency": "RSD",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": lang === 'en' ? "Specialty Coffee & Brunch" : "Specialty Kafa i Brunch",
          "description": lang === 'en'
            ? "Premium specialty coffee, fresh juices and brunch offerings"
            : "Premium specialty kafa, cedjeni sokovi i brunch ponuda",
          "priceCurrency": "RSD",
          "availability": "https://schema.org/InStock"
        }
      ]
    }
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://koneticaffee.com",
    "name": "Koneti Café",
    "inLanguage": lang === 'sr' ? 'sr-RS' : 'en-US',
    "potentialAction": {
      "@type": "SearchAction",
      "target": `https://koneticaffee.com/${lang}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang={lang} className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#cfa68a" />
        <meta name="msapplication-TileColor" content="#cfa68a" />
        <meta name="google-site-verification" content="your-verification-code" />
        {/* Preload critical images and fonts */}
        <link
          rel="preload"
          as="image"
          href="https://koneticaffee.com/koneti-kafe.jpg"
          type="image/jpeg"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="https://koneticaffee.com/koneti-logo.png"
          type="image/png"
          fetchPriority="high"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Script
          id="cafe-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(cafeJsonLd),
          }}
          strategy="beforeInteractive"
        />
        <Script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteJsonLd),
          }}
          strategy="beforeInteractive"
        />
        <ClientProviders lang={lang}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}