import type { Metadata } from "next";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  
  const metadata: Record<string, Metadata> = {
    sr: {
      metadataBase: new URL('https://koneti.com'),
      title: {
        default: "Koneti Café - Dobrodošli",
        template: "%s ",
      },
      description: "Uživajte u najboljoj kafi u prijatnom ambijentu. Rezervišite stolove, uživajte u specijalitetima i doživite nezaboravne trenutke u našem kafeu.",
      keywords: [
        "kafe", "kafa", "rezervacija", "Novi Sad", "specijaliteti", 
        "ambijent", "poslovni sastanci", "proslave", "kafić",
        "specialty coffee", "brunch", "ketering"
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
        template: "%s ",
      },
      description: "Enjoy the best coffee in a pleasant atmosphere. Reserve tables, enjoy specialties and experience unforgettable moments in our cafe.",
      keywords: [
        "cafe", "coffee", "reservation", "Novi Sad", "specialties", 
        "atmosphere", "business meetings", "celebrations", "coffee shop",
        "specialty coffee", "brunch", "catering"
      ],
      authors: [{ name: "Koneti Café", url: "https://koneti.com" }],
      category: "Restaurant",
      applicationName: "Koneti Café",
      other: {
        'google-site-verification': 'your-verification-code',
        'facebook-domain-verification': 'your-verification-code',
      },
      openGraph: {
        title: "Koneti Café - Welcome",
        description: "Enjoy the best coffee in a pleasant atmosphere. Reserve tables for business meetings or celebrations.",
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
        description: "Enjoy the best coffee in a pleasant atmosphere.",
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
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Koneti Café",
    "description": lang === 'en' 
      ? "Enjoy the best coffee in a pleasant atmosphere. Reserve tables for business meetings or celebrations."
      : "Uživajte u najboljoj kafi u prijatnom ambijentu. Rezervišite stolove za poslovne sastanke ili proslave.",
    "url": `https://koneti.com/${lang}`,
    "telephone": "+381-XX-XXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bulevar Oslobođenja 97",
      "addressLocality": "Novi Sad",
      "addressRegion": "Srbija",
      "postalCode": "21000",
      "addressCountry": "RS"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 44.7866,
      "longitude": 20.4489
    },
    "openingHours": [
      "Mo-Fr 07:30-23:00",
      "Sa 07:30-24:00",
      "Su 08:00-21:00"
    ],
    "servesCuisine": ["Coffee", "Juice", "Business Meetings", "Celebrations"],
    "priceRange": "$",
    "image": "https://koneti.com/koneti-logo.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": lang === 'en' ? "Cafe specialties" : "Kafe specijaliteti",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": lang === 'en' ? "Business meetings" : "Poslovni sastanci",
            "description": lang === 'en' 
              ? "Reserve space for business meetings"
              : "Rezervišite prostor za poslovne sastanke"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": lang === 'en' ? "Celebrations" : "Proslave",
            "description": lang === 'en'
              ? "Organize unforgettable celebrations"
              : "Organizujte nezaboravne proslave"
          }
        }
      ]
    }
  };

  return (
    <html lang={lang} className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
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