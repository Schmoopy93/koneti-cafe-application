import type { Metadata } from "next";
import MenuManagementPageWrapper from "@/components/menu/MenuManagementPageWrapper";
import type { Category } from "@/app/[lang]/types/category";
import type { Drink } from "@/app/[lang]/types/drink";

type Props = { params: Promise<{ lang: "sr" | "en" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "sr"
        ? "Upravljanje Menijem | Admin"
        : "Menu Management | Admin",
    robots: { index: false, follow: false },
    alternates: {
      canonical: `https://koneticaffee.com/${lang}/menu-management`,
    },
  };
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function MenuManagementPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  let drinks: Drink[] = [];
  let categories: Category[] = [];

  try {
    const [drinksRes, categoriesRes] = await Promise.all([
      fetch(`${API_URL}/drinks`, { cache: "no-store" }),
      fetch(`${API_URL}/categories`, { cache: "no-store" }),
    ]);

    if (drinksRes.ok) drinks = await drinksRes.json();
    if (categoriesRes.ok) categories = await categoriesRes.json();
  } catch (err) {
    console.error("⚠️ SSR Fetch failed:", err);
  }

  return <MenuManagementPageWrapper drinks={drinks} categories={categories} />;
}
