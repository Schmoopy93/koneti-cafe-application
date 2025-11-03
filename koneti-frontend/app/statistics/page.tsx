"use client";

import React, { useEffect, useState } from "react";
import EventStats from "@/components/statistics/EventStats";
import { ProtectedRoute } from "@/contexts/ProtectedRoute";
import { apiRequest } from "@/utils/api";

export default function EventStatsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await apiRequest('/reservations');
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        } else {
          console.error('Failed to fetch reservations');
          setEvents([]);
        }
      } catch (err) {
        console.error("Error loading events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <ProtectedRoute>
      <EventStats events={events} />
    </ProtectedRoute>
  );
}
