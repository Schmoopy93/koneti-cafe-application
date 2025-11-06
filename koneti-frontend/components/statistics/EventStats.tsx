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

  const typeData = useMemo(() => {
    const stats = { business: 0, experience: 0 };
    events.forEach((ev) => {
      if (ev?.type) {
        const key = ev.type === 'biznis' ? 'business' : ev.type;
        if (key in stats) {
          stats[key as keyof typeof stats] += 1;
        }
      }
    });
    return Object.keys(stats).map((key) => ({
      key,
      name: t(`eventStats.types.${key}`),
      value: stats[key as keyof typeof stats],
    }));
  }, [events, t]);

  const weekdayData = useMemo(() => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const stats = days.reduce((acc, day) => ({ ...acc, [day]: 0 }), {} as Record<string, number>);
    
    events.forEach((ev) => {
      if (ev?.date) {
        const date = new Date(ev.date);
        if (!isNaN(date.getTime())) {
          const dayIndex = date.getDay();
          const dayKey = days[dayIndex === 0 ? 6 : dayIndex - 1]; // Convert Sunday=0 to Sunday=6
          stats[dayKey] += 1;
        }
      }
    });
    
    return days.map(day => ({
      name: t(`eventStats.weekdays.${day}`),
      value: stats[day]
    }));
  }, [events, t]);

  const totalEvents = events?.length || 0;
  const hasStatusData = statusData.some((d) => d.value > 0);
  const hasTypeData = typeData.some((d) => d.value > 0);

  return (
    <div className="event-stats">
      <h2>{t("eventStats.title")}</h2>

      <div className="charts-container">
        <div className="chart-wrapper status-chart">
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
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="75%"
                    innerRadius="45%"
                    paddingAngle={5}
                    label={({ value, percent }) => 
                      value > 0 ? `${value} (${(percent * 100).toFixed(0)}%)` : ''
                    }
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
                      fontSize: "0.9rem",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "600",
                      marginTop: "15px",
                      paddingTop: "10px",
                    }}
                    iconType="circle"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "15px",
                      border: "2px solid #cfa68a",
                      backgroundColor: "rgba(255,255,255,0.98)",
                      boxShadow: "0 8px 25px rgba(207, 166, 138, 0.3)",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "600",
                    }}
                    labelStyle={{ color: "#3d2f28", fontWeight: "700" }}
                    itemStyle={{ color: "#5a3e36" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="chart-wrapper monthly-chart">
          <h3>{t("eventStats.monthlyTitle")}</h3>
          <div style={{ width: "100%", height: "350px" }}>
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

        <div className="chart-wrapper type-chart">
          <h3>{t("eventStats.typeTitle")}</h3>
          {!hasTypeData ? (
            <p style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
              Nema podataka o tipovima
            </p>
          ) : (
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={typeData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="70%"
                    innerRadius="35%"
                    paddingAngle={5}
                    label={({ value, percent }) => 
                      value > 0 ? `${value} (${(percent * 100).toFixed(0)}%)` : ''
                    }
                    labelLine={false}
                  >
                    {typeData.map((entry, index) => (
                      <Cell
                        key={entry.key}
                        fill={index === 0 ? "#3498db" : "#e67e22"}
                      />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      fontSize: "0.9rem",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "600",
                      marginTop: "15px",
                      paddingTop: "10px",
                    }}
                    iconType="circle"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "15px",
                      border: "2px solid #cfa68a",
                      backgroundColor: "rgba(255,255,255,0.98)",
                      boxShadow: "0 8px 25px rgba(207, 166, 138, 0.3)",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "600",
                    }}
                    labelStyle={{ color: "#3d2f28", fontWeight: "700" }}
                    itemStyle={{ color: "#5a3e36" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="chart-wrapper weekday-chart">
          <h3>{t("eventStats.weekdayTitle")}</h3>
          <div style={{ width: "100%", height: "350px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weekdayData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#666", fontSize: 11 }}
                  axisLine={{ stroke: "#cfa68a" }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                  dataKey="value"
                  fill="#27ae60"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={50}
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
