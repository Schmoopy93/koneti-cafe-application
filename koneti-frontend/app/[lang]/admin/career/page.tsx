"use client";

import CareerManagement from "../../../../components/admin/CareerManagement";
import { ProtectedRoute } from "../../../../contexts/ProtectedRoute";

export default function CareerManagementPage() {
  return (
    <ProtectedRoute>
      <CareerManagement />
    </ProtectedRoute>
  );
}
