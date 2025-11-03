import Menu from "@/components/menu/Menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
};


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

