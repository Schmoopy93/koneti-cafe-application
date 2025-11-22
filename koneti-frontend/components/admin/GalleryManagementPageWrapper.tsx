"use client"
import GalleryManagement from "@/components/admin/GalleryManagement"
import { ProtectedRoute } from "@/contexts/ProtectedRoute"

export default function GalleryManagementPageWrapper() {
  return (
    <ProtectedRoute>
      <GalleryManagement />
    </ProtectedRoute>
  )
}