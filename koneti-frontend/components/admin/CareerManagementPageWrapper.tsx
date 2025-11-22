"use client"
import CareerManagement from "@/components/admin/CareerManagement"
import { ProtectedRoute } from "@/contexts/ProtectedRoute"

export default function CareerManagementPageWrapper() {
  return (
    <ProtectedRoute>
      <CareerManagement />
    </ProtectedRoute>
  )
}