import Home from "../components/home/Home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koneti Café – Savršeno mesto za kafu, proslave i poslovne sastanke u Novom Sadu",
  description:
    "Uživajte u specialty kafi, poslasticama i prijatnom ambijentu. Rezervišite prostor za poslovne sastanke ili proslave u Koneti Café-u u Novom Sadu.",
  alternates: {
    canonical: "https://koneti.com",
  },
  openGraph: {
    title: "Koneti Café - Dobrodošli",
    description:
      "Specialty coffee, poslastice i rezervacije prostora za događaje i sastanke.",
    url: "https://koneti.com",
    type: "website",
    images: [
      {
        url: "/og/cover.jpg",
        width: 1200,
        height: 630,
        alt: "Koneti Café - Hero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Koneti Café - Dobrodošli",
    description:
      "Specialty coffee, poslastice i rezervacije prostora za događaje i sastanke.",
    images: ["/og/cover.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return <Home />;
}