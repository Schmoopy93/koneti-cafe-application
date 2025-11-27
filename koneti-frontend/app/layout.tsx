import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL('https://koneticaffee.com'),
  title: "Koneti Café - Premium Specialty Kafa i Proslave u Novom Sadu",
  description: "Koneti Café je premium kafić na Bulevaru Oslobođenja 97 u Novom Sadu. Specialty coffee, brunch, poslovni sastanci, proslave i privatni događaji. Rezervacije dostupne 24/7.",
  keywords: [
    "koneti café", "kafić", "kafa", "specialty coffee", "brunch", "Novi Sad",
    "poslovni sastanci", "proslave", "privatni događaji", "ketering",
    "doručak", "piće", "Event space", "cafe Bulevar Oslobođenja"
  ],
  authors: [{ name: "Koneti Café", url: "https://koneticaffee.com" }],
  creator: "Koneti Café",
  publisher: "Koneti Café",
  applicationName: "Koneti Café",
  category: "Café",
  referrer: "strict-origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'noimageindex': false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '1vHXZcaq_PxJ4JsGFbrV5PCygadNzzjPeUi',
  },
  openGraph: {
    type: 'website',
    locale: 'sr_RS',
    url: 'https://koneticaffee.com',
    siteName: 'Koneti Café',
    title: 'Koneti Café - Premium Kafa i Proslave',
    description: 'Premijerski kafić sa specialty kafom, brunch i mogućnošću organizacije poslovnih sastanaka i proslava u Novom Sadu.',
    images: [
      {
        url: 'https://koneticaffee.com/koneti-kafe.jpg',
        width: 1200,
        height: 630,
        alt: 'Koneti Café - Premium Ambijent',
        type: 'image/jpeg',
      },
      {
        url: 'https://koneticaffee.com/koneti-logo.png',
        width: 400,
        height: 400,
        alt: 'Koneti Café Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Koneti Café',
    description: 'Premium specialty kafa, brunch i prostor za poslovne sastanke i proslave',
    creator: '@KonetiCafe',
    site: '@KonetiCafe',
    images: ['https://koneticaffee.com/koneti-kafe.jpg'],
  },
  alternates: {
    canonical: 'https://koneticaffee.com/',
    languages: {
      'sr': 'https://koneticaffee.com/sr',
      'en': 'https://koneticaffee.com/en',
      'x-default': 'https://koneticaffee.com/sr',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Script
        id="root-service-worker"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            }
          `,
        }}
      />
    </>
  );
}