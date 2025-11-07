import type { Metadata } from "next";
import ReservationForm from "../../components/forms/ReservationForm";

export const metadata: Metadata = {
  title: "Rezervacija Stolova | Koneti Café",
  description: "Rezervišite prostor za proslavu, poslovni sastanak ili poseban događaj u Koneti Café. Uživajte u prijatnom ambijentu sa najboljom kafom.",
  keywords: ["rezervacija", "stolovi", "proslava", "poslovni sastanak", "kafe", "Novi Sad"],
  openGraph: {
    title: "Rezervacija Stolova | Koneti Café",
    description: "Rezervišite prostor za proslavu ili poslovni sastanak u našem kafeu.",
    url: "https://koneti-cafe.rs/reservation",
    siteName: "Koneti Café",
    images: [
      {
        url: "/business-meeting.jpg",
        width: 1200,
        height: 630,
        alt: "Poslovni sastanak u Koneti Café",
      },
    ],
    locale: "sr_RS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rezervacija Stolova | Koneti Café",
    description: "Rezervišite prostor za proslavu ili poslovni sastanak.",
    images: ["/business-meeting.jpg"],
  },
  alternates: {
    canonical: '/reservation',
  },
};

export default function ReservationPage() {
  return <ReservationForm />;
}
