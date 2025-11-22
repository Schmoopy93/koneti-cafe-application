"use client"
import MenuManagementPage from "@/components/menu/MenuManagementPage"
import { ProtectedRoute } from "@/contexts/ProtectedRoute"
import type { Category } from "@/app/[lang]/types/category"
import type { Drink } from "@/app/[lang]/types/drink"

interface MenuManagementPageWrapperProps {
  drinks: Drink[]
  categories: Category[]
}

export default function MenuManagementPageWrapper({
  drinks,
  categories,
}: MenuManagementPageWrapperProps) {
  return (
    <main className="admin-menu-page">
      <ProtectedRoute>
        <MenuManagementPage drinks={drinks} categories={categories} />
      </ProtectedRoute>
    </main>
  )
}