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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  
  const metadata: Record<string, Metadata> = {
    sr: {
      metadataBase: new URL('https://koneti.com'),
      title: {
        default: "Koneti Café - Dobrodošli",
        template: "%s | Koneti Café",
      },
      description: "Uživajte u najboljoj kafi u prijatnom ambijentu na Bulevaru Oslobođenja 97, Novi Sad. Rezervišite stolove za poslovne sastanke, proslave ili privatne događaje. Premium specialty coffee, brunch i ketering.",
      keywords: [
        "kafe Novi Sad", "kafić Novi Sad", "kafa", "specialty coffee", "brunch", "ketering", "proslave", "poslovni sastanci", "rezervacija", "Bulevar Oslobođenja", "Koneti Café"
      ],
      authors: [{ name: "Koneti Café", url: "https://koneti.com" }],
      creator: "Koneti Café",
      publisher: "Koneti Café",
      category: "Restaurant",
      applicationName: "Koneti Café",
      other: {
        'google-site-verification': 'your-verification-code',
        'facebook-domain-verification': 'your-verification-code',
      },
      openGraph: {
        title: "Koneti Café - Dobrodošli",
        description: "Premium specialty kafa, brunch i prostora za poslovne sastanke i proslave u Novom Sadu",
        url: "https://koneti.com/sr",
        siteName: "Koneti Café",
        images: [
          {
            url: "https://koneti.com/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "Koneti Café - Ambijent i specijaliteti",
          },
          {
            url: "https://koneti.com/og-image-alt.jpg",
            width: 1200,
            height: 630,
            alt: "Koneti Café - Enterijer",
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
        google: 'your-google-site-verification-code',
      },
      alternates: {
        canonical: 'https://koneti.com/sr',
        languages: {
          'sr': 'https://koneti.com/sr',
          'en': 'https://koneti.com/en',
        },
      },
    },
    en: {
      metadataBase: new URL('https://koneti.com'),
      title: {
        default: "Koneti Café - Welcome",
        template: "%s | Koneti Café",
      },
      description: "Enjoy the best specialty coffee in a pleasant atmosphere on Bulevar Oslobođenja 97, Novi Sad. Reserve tables for business meetings, celebrations or private events. Premium coffee, brunch and catering.",
      keywords: [
        "cafe Novi Sad", "coffee shop Novi Sad", "coffee", "specialty coffee", "brunch", "catering", "celebrations", "business meetings", "reservation", "Bulevar Oslobođenja", "Koneti Café"
      ],
      authors: [{ name: "Koneti Café", url: "https://koneti.com" }],
      creator: "Koneti Café",
      publisher: "Koneti Café",
      category: "Restaurant",
      applicationName: "Koneti Café",
      other: {
        'google-site-verification': 'your-verification-code',
        'facebook-domain-verification': 'your-verification-code',
      },
      openGraph: {
        title: "Koneti Café - Welcome",
        description: "Premium specialty coffee, brunch and space for business meetings and celebrations in Novi Sad",
        url: "https://koneti.com/en",
        siteName: "Koneti Café",
        images: [
          {
            url: "https://koneti.com/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "Koneti Café - Atmosphere and specialties",
          },
          {
            url: "https://koneti.com/og-image-alt.jpg",
            width: 1200,
            height: 630,
            alt: "Koneti Café - Interior",
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
        google: 'your-google-site-verification-code',
      },
      alternates: {
        canonical: 'https://koneti.com/en',
        languages: {
          'sr': 'https://koneti.com/sr',
          'en': 'https://koneti.com/en',
        },
      },
    },
  };

  return metadata[lang] || metadata.sr;
}

export async function generateStaticParams() {
  return [{ lang: 'sr' }, { lang: 'en' }];
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  
  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": "https://koneti.com",
    "name": "Koneti Café",
    "description": lang === 'en' 
      ? "Premium specialty coffee, brunch and event space in Novi Sad. Perfect for business meetings, celebrations and private gatherings."
      : "Premium specialty kafa, brunch i prostor za događaje u Novom Sadu. Idealno za poslovne sastanke, proslave i privatna okupljanja.",
    "url": "https://koneti.com",
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
    "servesCuisine": ["Coffee", "Juice", "Brunch", "Desserts"],
    "priceRange": "$$",
    "image": "https://koneti.com/koneti-logo.png",
    "logo": {
      "@type": "ImageObject",
      "url": "https://koneti.com/koneti-logo.png",
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "250",
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
    "url": "https://koneti.com",
    "name": "Koneti Café",
    "inLanguage": lang === 'sr' ? 'sr-RS' : 'en-US',
    "potentialAction": {
      "@type": "SearchAction",
      "target": `https://koneti.com/${lang}/search?q={search_term_string}`,
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
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Script
          id="restaurant-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(restaurantJsonLd),
          }}
          strategy="afterInteractive"
        />
        <Script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteJsonLd),
          }}
          strategy="afterInteractive"
        />
        <ClientProviders lang={lang}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}