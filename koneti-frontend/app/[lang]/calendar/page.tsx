"use client";

import Calendar from "../../components/calendar/Calendar";
import { ProtectedRoute } from "@/contexts/ProtectedRoute";

const CalendarPage = () => {
  return (
    <ProtectedRoute>
      <Calendar />
    </ProtectedRoute>
  );
};

export default CalendarPage;