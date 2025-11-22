"use client"
import AdminPage from "@/components/admin/AdminPage"
import { ProtectedRoute } from "@/contexts/ProtectedRoute"

export default function AdminPageWrapper() {
  return (
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  )
}