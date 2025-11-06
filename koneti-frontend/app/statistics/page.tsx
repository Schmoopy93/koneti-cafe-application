"use client";

import React, { useEffect, useState } from "react";
import EventStats from "@/components/statistics/EventStats";
import { ProtectedRoute } from "@/contexts/ProtectedRoute";
import { apiRequest } from "@/utils/api";
import Spinner from "@/components/ui/Spinner";
import { useTranslation } from "react-i18next";

export default function EventStatsPage() {
  const { t } = useTranslation();
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

  if (loading) return <Spinner size="lg" text={t("eventStats.loading")} />;

  if (!events || events.length === 0) {
    return (
      <ProtectedRoute>
        <div className="event-stats">
          <h2>{t("eventStats.title")}</h2>
          <div className="no-results">
            <div className="no-results-icon">📊</div>
            <h3>Nema podataka za prikaz</h3>
            <p>Trenutno nema rezervacija za analizu statistika.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <EventStats events={events} />
    </ProtectedRoute>
  );
}
