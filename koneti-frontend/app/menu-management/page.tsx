import MenuManagementPage from "@/components/menu/MenuManagementPage";
import { Metadata } from "next";
import { ProtectedRoute } from "@/contexts/ProtectedRoute";
import { Category } from "@/app/types/category";
import { Drink } from "@/app/types/drink";

export const metadata: Metadata = {
  title: "Menu Management | Admin",
};

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Page() {
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

  return (
    <main className="admin-menu-page">
      <ProtectedRoute>
        <MenuManagementPage drinks={drinks} categories={categories} />
      </ProtectedRoute>

      {(!drinks.length || !categories.length) && (
        <div className="data-fallback">
          ⚠️{" "}
          {drinks.length === 0 && categories.length === 0
            ? "Nema dostupnih podataka. API možda nije aktivan."
            : "Neki podaci nisu mogli da se učitaju."}
        </div>
      )}
    </main>
  );
}
