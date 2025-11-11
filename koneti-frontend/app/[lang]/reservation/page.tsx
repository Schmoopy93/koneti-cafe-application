import type { Metadata } from "next";
import ReservationForm from "../../components/forms/ReservationForm";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Rezervacije | Poslovni Sastanci, Proslave i Privatni Eventi | Koneti Café",
  description: "Rezervišite svoj prostor u Koneti Café-u za poslovne sastanke, proslave, rođendane, team building ili privatne događaje. Nudimo fleksibilne pakete, prijatnu atmosferu i sve što je potrebno za uspešan event u Novom Sadu.",
  keywords: [
    "rezervacije",
    "poslovni sastanci",
    "proslave",
    "rođendani",
    "eventi",
    "privatni događaji",
    "konferencije",
    "team building",
    "networking",
    "kafić Novi Sad",
    "prostor za proslave",
    "sala za sastanke",
    "privatna događanja",
    "korporativni eventi",
    "organizacija događaja",
    "mala sala za sastanke",
    "ketering za evente",
    "prostor za team building",
    "intimni događaji",
    "posebni paketi za proslave"
  ],
  authors: [{ name: "Koneti Café", url: "https://koneti.com" }],
  creator: "Koneti Café",
  openGraph: {
    title: "Rezervacije | Koneti Café",
    description: "Rezervišite savršen prostor za vašu priliku",
    url: "https://koneti.com/reservation",
    type: "website",
    locale: "sr_RS",
    siteName: "Koneti Café",
    images: [
      {
        url: "/reservation-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Koneti Café Rezervacije",
        type: "image/jpeg",
      },
      {
        url: "/reservation-interior.jpg",
        width: 1200,
        height: 630,
        alt: "Koneti Café Enterijer",
        type: "image/jpeg",
      },
    ],
  },
  alternates: {
    canonical: "https://koneti.com/reservation",
    languages: {
      "sr-RS": "https://koneti.com/reservation",
      "en-US": "https://koneti.com/en/reservation",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    other: {
      "facebook-domain-verification": "your-facebook-verification",
    },
  },
  category: "Reservation",
  applicationName: "Koneti Café Reservation System",
  twitter: {
    card: "summary_large_image",
    title: "Rezervacije | Koneti Café",
    description:
      "Rezervišite svoj idealan prostor za poslovne sastanke i proslave",
    site: "@KonetiCafe",
    creator: "@KonetiCafe",
    images: ["/reservation-twitter.jpg"],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Početna",
      item: "https://koneti.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Rezervacije",
      item: "https://koneti.com/reservation",
    },
  ],
};

const reservationJsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: "Koneti Café",
  image: "https://koneti.com/koneti-cafe.jpg",
  url: "https://koneti.com",
  "@id": "https://koneti.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Your Street Address",
    addressLocality: "Novi Sad",
    addressRegion: "Vojvodina",
    postalCode: "21000",
    addressCountry: "RS",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 45.2551338,
    longitude: 19.8451756,
  },
  telephone: "+381XXXXXXXXX",
  email: "info@koneti.com",
  areaServed: {
    "@type": "City",
    name: "Novi Sad",
  },
  hasMap: "https://www.google.com/maps?cid=your-google-business-id",
  paymentAccepted: ["Cash", "Credit Card"],
  currenciesAccepted: "RSD, EUR",
  acceptsReservations: "True",
  servesCuisine: ["Coffee", "Desserts", "Brunch"],
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "23:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "09:00",
      closes: "23:00",
    },
  ],
  amenityFeature: [
    {
      "@type": "LocationFeatureSpecification",
      name: "Business Meetings",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Private Events",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "WiFi",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Parking",
      value: true,
    },
  ],
  potentialAction: {
    "@type": "ReserveAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://koneti.com/reservation",
      inLanguage: "sr-RS",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "250",
    bestRating: "5",
    worstRating: "1",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "RSD",
    lowPrice: "4095",
    highPrice: "46800",
    offerCount: "5",
    offers: [
      {
        "@type": "Offer",
        name: "Business Basic",
        price: "23400",
        priceCurrency: "RSD",
        description: "Poslovni paket za sastanke do 2h",
        availability: "https://schema.org/InStock",
        url: "https://koneti.com/reservation?type=business",
      },
      {
        "@type": "Offer",
        name: "Business Premium",
        price: "46800",
        priceCurrency: "RSD",
        description: "Premium poslovni paket za sastanke do 2h",
        availability: "https://schema.org/InStock",
        url: "https://koneti.com/reservation?type=business",
      },
      {
        "@type": "Offer",
        name: "Experience Start",
        price: "4095",
        priceCurrency: "RSD",
        description: "Basic paket za proslave (po osobi)",
        availability: "https://schema.org/InStock",
        url: "https://koneti.com/reservation?type=experience",
      },
      {
        "@type": "Offer",
        name: "Experience Classic",
        price: "5850",
        priceCurrency: "RSD",
        description: "Classic paket za proslave (po osobi)",
        availability: "https://schema.org/InStock",
        url: "https://koneti.com/reservation?type=experience",
      },
      {
        "@type": "Offer",
        name: "Experience VIP",
        price: "8190",
        priceCurrency: "RSD",
        description: "VIP paket za proslave (po osobi)",
        availability: "https://schema.org/InStock",
        url: "https://koneti.com/reservation?type=experience",
      },
    ],
  },
};

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "BusinessEvent",
  name: "Poslovni događaji u Koneti Café",
  eventAttendanceMode: "OfflineEventAttendanceMode",
  eventStatus: "EventScheduled",
  location: {
    "@type": "FoodEstablishment",
    name: "Koneti Café",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Your Street Address",
      addressLocality: "Novi Sad",
      addressRegion: "Vojvodina",
      postalCode: "21000",
      addressCountry: "RS",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Koneti Café",
    url: "https://koneti.com",
    telephone: "+381XXXXXXXXX",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    lowPrice: "200",
    highPrice: "400",
    availability: "https://schema.org/InStock",
    url: "https://koneti.com/reservation",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Koji je minimalan broj osoba za rezervaciju?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Za poslovne sastanke minimum je 2 osobe, a za proslave minimum zavisi od izabranog paketa. Experience Start paket je dostupan za 1 osobu, dok ostali paketi zahtevaju najmanje 2 osobe.",
      },
    },
    {
      "@type": "Question",
      name: "Kako mogu izvršiti rezervaciju?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rezervaciju možete izvršiti putem našeg online sistema za rezervacije na ovoj stranici ili pozivom na naš kontakt telefon +381XXXXXXXXX. Online rezervacija je dostupna 24/7.",
      },
    },
    {
      "@type": "Question",
      name: "Koji su uslovi otkazivanja?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rezervaciju možete otkazati do 24h pre zakazanog termina bez dodatnih troškova. Otkazivanja sa manje od 24h napomene mogu biti naplaćena prema uslovima paketa.",
      },
    },
    {
      "@type": "Question",
      name: "Koliko unapred trebam da rezervišem?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Za Business Basic i Experience Classic pakete preporučujemo rezervaciju najmanje 2 dana unapred. Za Experience VIP paket preporučujemo rezervaciju najmanje 7 dana unapred.",
      },
    },
    {
      "@type": "Question",
      name: "Da li je moguće promeniti datum i vreme rezervacije?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Da, moguće je promeniti datum i vreme rezervacije do 48h pre zakazanog termina. Kontaktirajte nas na info@koneti.com ili pozovite +381XXXXXXXXX.",
      },
    },
    {
      "@type": "Question",
      name: "Šta je uključeno u paketima?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Svaki paket uključuje pristup prostoru, osnovno piće i poslastice. Premium paketi uključuju dodatne usluge kao što su specijalizovana hrana, dekoracija i dodatni napici. Detaljne informacije dostupne su u opisu svakog paketa.",
      },
    },
    {
      "@type": "Question",
      name: "Da li mogu da donesem svoju hranu i piće?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Spoljašnja hrana i piće nisu dozvoljeni. Svi napici i poslastice moraju biti naručeni kroz Koneti Café. Kontaktirajte nas ako imate posebne zahteve ili alergije.",
      },
    },
    {
      "@type": "Question",
      name: "Koliko osoba može da stane u prostor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Naš prostor može da primi do 50 osoba u zavisnosti od tipa događaja i konfiguracije. Za velike grupe preporučujemo da nas kontaktirate direktno za prilagođene rešenje.",
      },
    },
  ],
};
export default function ReservationPage() {
  return (
    <>
      <Script
        id="reservation-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reservationJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="event-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main>
        <ReservationForm />
      </main>
    </>
  );
}
