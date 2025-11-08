import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ClientProviders from "../contexts/ClientProviders";
import Script from "next/script";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://koneti.com'),
  title: {
    default: "Koneti Café - Dobrodošli",
    template: "%s | Koneti Café",
  },
  description: "Uživajte u najboljoj kafi u prijatnom ambijentu. Rezervišite stolove, uživajte u specijalitetima i doživite nezaboravne trenutke u našem kafeu.",
  keywords: [
    "kafe", "kafa", "rezervacija", "Novi Sad", "specijaliteti", 
    "ambijent", "poslovni sastanci", "proslave", "kafić",
    "specialty coffee", "ketering", "torte", "poslastice"
  ],
  authors: [{ name: "Koneti Café", url: "https://koneti.com" }],
  category: "Restaurant",
  applicationName: "Koneti Café",
  other: {
    'google-site-verification': 'your-verification-code',
    'facebook-domain-verification': 'your-verification-code',
  },
  openGraph: {
    title: "Koneti Café - Dobrodošli",
    description: "Uživajte u najboljoj kafi u prijatnom ambijentu. Rezervišite stolove za poslovne sastanke ili proslave.",
    url: "https://koneti.com",
    siteName: "Koneti Café",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Koneti Café - Ambijent i specijaliteti",
      },
      {
        url: "/og-image-alt.jpg",
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
    description: "Uživajte u najboljoj kafi u prijatnom ambijentu.",
    images: ["/koneti-logo.png"],
    creator: "@koneticafe",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Koneti Café",
    "description": "Uživajte u najboljoj kafi u prijatnom ambijentu. Rezervišite stolove za poslovne sastanke ili proslave.",
    "url": "https://koneti.com",
    "telephone": "+381-XX-XXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Vaša ulica i broj",
      "addressLocality": "Beograd",
      "addressRegion": "Srbija",
      "postalCode": "11000",
      "addressCountry": "RS"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 44.7866,
      "longitude": 20.4489
    },
    "openingHours": [
      "Mo-Fr 07:00-22:00",
      "Sa 08:00-23:00",
      "Su 08:00-21:00"
    ],
    "servesCuisine": ["Coffee", "Desserts", "Mediterranean"],
    "priceRange": "$$",
    "image": "https://koneti.com/koneti-logo.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Kafe specijaliteti",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Poslovni sastanci",
            "description": "Rezervišite prostor za poslovne sastanke"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Proslave",
            "description": "Organizujte nezaboravne proslave"
          }
        }
      ]
    }
  };

  return (
    <html lang="sr" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#cfa68a" />
        <meta name="msapplication-TileColor" content="#cfa68a" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
