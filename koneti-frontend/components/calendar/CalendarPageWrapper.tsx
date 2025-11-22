"use client"
import Calendar from "@/components/calendar/Calendar"
import { ProtectedRoute } from "@/contexts/ProtectedRoute"

export default function CalendarPageWrapper() {
  return (
    <ProtectedRoute>
      <Calendar />
    </ProtectedRoute>
  )
}