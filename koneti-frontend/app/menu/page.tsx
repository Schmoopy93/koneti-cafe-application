import Menu from "@/components/menu/Menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Meni | Koneti Cafe Novi Sad',
  description: 'Pogledajte našu ponudu kafa, pica i napitaka. U Koneti Cafe-u vas očekuje kvalitetna italijanska pica i bogat izbor toplih i hladnih napitaka.',
  keywords: 'meni Koneti Cafe, kafa Novi Sad, pica Novi Sad, napici',
  openGraph: {
    title: 'Meni | Koneti Cafe Novi Sad',
    description: 'Otkrijte našu ponudu kafa, pica i napitaka u Koneti Cafe-u',
    type: 'website',
    locale: 'sr_RS',
  }
}

export const dynamic = "force-dynamic";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

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

    return <Menu initialCategories={categories} initialDrinks={drinks} />;
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return <div>Failed to load menu data.</div>;
  }
}

