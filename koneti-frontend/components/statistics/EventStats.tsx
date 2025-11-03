"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useTranslation } from "react-i18next";
import "./EventStats.scss";

interface Event {
  _id: string;
  name: string;
  email: string;
  phone: string;
  date: string | Date;
  time: string;
  guests: number;
  status: "approved" | "pending" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

interface EventStatsProps {
  events: Event[];
}

const COLORS = {
  approved: "#4CAF50",
  pending: "#FFC107",
  rejected: "#F44336",
};

const EventStats: React.FC<EventStatsProps> = ({ events }) => {
  const { t, i18n } = useTranslation();

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString(i18n.language, { month: "short" }),
      count: 0,
    }));

    events.forEach((ev) => {
      if (!ev?.date) return;
      const date = new Date(ev.date);
      if (!isNaN(date.getTime())) {
        const m = date.getMonth();
        if (m >= 0 && m < 12) months[m].count += 1;
      }
    });

    return months;
  }, [events, i18n.language]);

  const statusData = useMemo(() => {
    const stats = { approved: 0, pending: 0, rejected: 0 };

    events.forEach((ev) => {
      if (ev?.status) {
        const key = ev.status as keyof typeof stats;
        if (key in stats) {
          stats[key] = (stats[key] || 0) + 1;
        }
      }
    });

    // Return all statuses, even if they have 0 values
    return Object.keys(stats).map((key) => ({
      key,
      name: t(`eventStats.statuses.${key}`),
      value: stats[key as keyof typeof stats],
    }));
  }, [events, t]);

  const totalEvents = events?.length || 0;
  const hasStatusData = statusData.some((d) => d.value > 0);

  return (
    <div className="event-stats">
      <h2>{t("eventStats.title")}</h2>

      <div className="stats-grid">
        <div className="stat-card status-chart">
          <h3>{t("eventStats.statusTitle")}</h3>
          {!events || events.length === 0 ? (
            <p style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
              Nema događaja za prikaz
            </p>
          ) : !hasStatusData ? (
            <p style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
              Nema podataka o statusima
            </p>
          ) : (
            <div
              className="status-chart"
              style={{
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
                height: "auto",
                minHeight: "360px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="70%"
                    innerRadius="40%"
                    paddingAngle={3}
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={entry.key}
                        fill={
                          COLORS[entry.key as keyof typeof COLORS] || "#999"
                        }
                      />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      fontSize: "0.85rem",
                      fontFamily: "Poppins, sans-serif",
                      marginTop: "10px",
                      flexWrap: "wrap",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #cfa68a",
                      backgroundColor: "rgba(255,255,255,0.95)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <hr></hr>
        <div className="stat-card wide">
          <h3>{t("eventStats.monthlyTitle")}</h3>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#666", fontSize: 12 }}
                  axisLine={{ stroke: "#cfa68a" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#666", fontSize: 12 }}
                  axisLine={{ stroke: "#cfa68a" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #cfa68a",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  }}
                  labelStyle={{ color: "#5a3e36", fontWeight: 600 }}
                  itemStyle={{ color: "#555" }}
                />
                <Bar
                  dataKey="count"
                  fill="#cfa68a"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventStats;
