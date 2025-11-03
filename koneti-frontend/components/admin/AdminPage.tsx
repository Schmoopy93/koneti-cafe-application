"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faGlassMartiniAlt,
  faCalendarAlt,
  faPlus,
  faList,
  faEdit,
  faTrash,
  faEye,
  faSignOutAlt,
  faCheck,
  faTimes,
  faBriefcase,
  faGlassCheers,
} from "@fortawesome/free-solid-svg-icons";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format } from "date-fns";
import { parse } from "date-fns";
import { startOfWeek } from "date-fns";
import { getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { motion, Variants } from "framer-motion";

import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { apiRequest } from "@/utils/api";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./AdminPage.scss";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// TypeScript Interfaces
interface Drink {
  _id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  description?: string;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface Reservation {
  _id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  type: "koneti" | "biznis";
  subType?: "basic" | "premium" | "vip";
  status: "pending" | "approved" | "rejected";
  message?: string;
  selectedMenu?: string;
}

interface CalendarEvent extends Reservation {
  title: string;
  start: Date;
  end: Date;
}

interface Stats {
  totalDrinks: number;
  totalCategories: number;
  totalReservations: number;
}

interface StatusCounters {
  pending: number;
  approved: number;
}

type ModalType = "calendar" | null;

const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout } = useAuth();

  // State declarations with proper types
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showModal, setShowModal] = useState<ModalType>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [calendarView, setCalendarView] = useState<View>("month");
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [stats, setStats] = useState<Stats>({
    totalDrinks: 0,
    totalCategories: 0,
    totalReservations: 0,
  });
  const [statusCounters, setStatusCounters] = useState<StatusCounters>({
    pending: 0,
    approved: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const [updatingReservation, setUpdatingReservation] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchData();
    }
  }, [mounted]);

  const fetchData = async (): Promise<void> => {
    try {
      // Cache-busting za production
      const timestamp = Date.now();
      const [reservationsRes, drinksRes, categoriesRes] = await Promise.all([
        apiRequest(`/reservations?_t=${timestamp}`),
        apiRequest(`/drinks?_t=${timestamp}`),
        apiRequest(`/categories?_t=${timestamp}`),
      ]);

      if (!reservationsRes.ok || !drinksRes.ok || !categoriesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const reservations: Reservation[] = await reservationsRes.json();
      const drinksData: Drink[] = await drinksRes.json();
      const categoriesData: Category[] = await categoriesRes.json();

      const formattedEvents: CalendarEvent[] = reservations.map((e) => {
        const datePart = new Date(e.date);
        const startDate = new Date(datePart);

        if (e.time) {
          const [hours, minutes] = e.time.split(":");
          startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        }

        return {
          ...e,
          title: `${e.name} (${
            e.type === "koneti"
              ? "Koneti Experience"
              : e.type === "biznis"
              ? "Biznis"
              : e.type
          })`,
          start: startDate,
          end: new Date(startDate.getTime() + 2 * 60 * 60 * 1000),
        };
      });

      // Status counters
      const pendingCount = reservations.filter(
        (r) => r.status === "pending"
      ).length;
      const approvedCount = reservations.filter(
        (r) => r.status === "approved"
      ).length;

      setStatusCounters({ pending: pendingCount, approved: approvedCount });
      setEvents(formattedEvents);
      setDrinks(drinksData);
      setCategories(categoriesData);
      setStats({
        totalDrinks: drinksData.length,
        totalCategories: categoriesData.length,
        totalReservations: reservations.length,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.push("/");
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: { scale: 1.05, boxShadow: "0 20px 40px rgba(61, 47, 40, 0.15)" },
  };

  const handleReservationAction = async (
    reservationId: string,
    action: "approved" | "rejected"
  ): Promise<void> => {
    console.log(`[DEBUG] Starting reservation action: ${action} for ID: ${reservationId}`);
    setUpdatingReservation(reservationId);
    
    // Optimistic update - ažuriraj UI odmah
    const updatedEvents = events.map(event => 
      event._id === reservationId 
        ? { ...event, status: action }
        : event
    );
    setEvents(updatedEvents);
    console.log(`[DEBUG] UI updated optimistically`);
    
    // Ažuriraj selectedEvent ako je otvoren
    if (selectedEvent && selectedEvent._id === reservationId) {
      setSelectedEvent({ ...selectedEvent, status: action });
      console.log(`[DEBUG] Selected event updated`);
    }
    
    try {
      console.log(`[DEBUG] Sending PATCH request to /reservations/${reservationId}`);
      console.log(`[DEBUG] Token available:`, localStorage.getItem('adminToken') ? 'Yes' : 'No');
      const response = await apiRequest(`/reservations/${reservationId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: action }),
        useToken: true
      });

      console.log(`[DEBUG] Response status: ${response.status}`);
      
      if (response.ok) {
        console.log(`[DEBUG] Request successful, refreshing data`);
        await fetchData();
        const actionText = action === "approved" ? "odobrena" : "odbijena";
        console.log(`[DEBUG] Rezervacija je uspešno ${actionText}!`);
      } else {
        console.log(`[DEBUG] Request failed, reverting state`);
        const errorData = await response.json();
        console.error('[DEBUG] Greška:', errorData.message);
        await fetchData();
      }
    } catch (error) {
      console.error("[DEBUG] Network error:", error);
      await fetchData();
    } finally {
      console.log(`[DEBUG] Clearing updating state`);
      setUpdatingReservation(null);
    }
  };

  const getEventBackgroundColor = (status: string): string => {
    if (status === "approved") return "#28a745";
    if (status === "rejected") return "#dc3545";
    return "#5a3e36"; // default pending
  };

  const getStatusBadgeColor = (
    status: string
  ): { bg: string; text: string } => {
    if (status === "approved") return { bg: "#c3f7c7", text: "#155724" };
    if (status === "rejected") return { bg: "#f8d7da", text: "#721c24" };
    return { bg: "#f3e5ab", text: "#5a3e36" };
  };

  const formatEventTitle = (event: CalendarEvent): string => {
    if (event.type === "koneti") {
      const subTypeFormatted = event.subType
        ? ` - ${event.subType.charAt(0).toUpperCase() + event.subType.slice(1)}`
        : "";
      return t("adminPage.event.konetiExperience") + subTypeFormatted;
    } else if (event.type === "biznis") {
      return t("adminPage.event.businessMeeting");
    }
    return event.title;
  };

  return (
    <div className="admin-dashboard">
      <main className="admin-main">
        <motion.div
          className="dashboard-content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Stats grid */}
          <motion.div className="stats-grid" variants={containerVariants}>
            <motion.div
              className="stat-card"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="stat-icon">
                <FontAwesomeIcon icon={faGlassMartiniAlt} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalDrinks}</h3>
                <p>{t("adminPage.stats.totalDrinks")}</p>
              </div>
            </motion.div>

            <motion.div
              className="stat-card"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="stat-icon">
                <FontAwesomeIcon icon={faList} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalCategories}</h3>
                <p>{t("adminPage.stats.totalCategories")}</p>
              </div>
            </motion.div>

            <motion.div
              className="stat-card"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="stat-icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalReservations}</h3>
                <p>{t("adminPage.stats.totalReservations")}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Action cards */}
          {/* Action cards (prvi red) */}
          <motion.div className="action-cards" variants={containerVariants}>
            <motion.div
              className="action-card"
              onClick={() => router.push("/menu-management")}
              variants={cardVariants}
              whileHover="hover"
            >
              <FontAwesomeIcon icon={faGlassMartiniAlt} />
              <h3>{t("adminPage.actions.manageMenu")}</h3>
              <p>{t("adminPage.actions.manageMenuDesc")}</p>
            </motion.div>

            <motion.div
              className="action-card"
              onClick={() => setShowModal("calendar")}
              variants={cardVariants}
              whileHover="hover"
            >
              <FontAwesomeIcon icon={faCalendarAlt} />
              <h3>{t("adminPage.actions.calendar")}</h3>
              <p>{t("adminPage.actions.calendarDesc")}</p>
            </motion.div>

            <motion.div
              className="action-card logout-card"
              onClick={handleLogout}
              variants={cardVariants}
              whileHover="hover"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <h3>{t("adminPage.actions.logout")}</h3>
              <p>{t("adminPage.actions.logoutDesc")}</p>
            </motion.div>
          </motion.div>

          {/* Novi red — Statistics kartica */}
          <motion.div
            className="action-cards stats-row"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="action-card stats-card"
              onClick={() => router.push("/statistics")}
              variants={cardVariants}
              whileHover="hover"
            >
              <FontAwesomeIcon icon={faChartLine} />
              <h3>{t("adminPage.actions.statistics")}</h3>
              <p>{t("adminPage.actions.statisticsDesc")}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* Calendar Modal */}
      {showModal === "calendar" && (
        <div
          className="modal-overlay fullscreen blur-backdrop"
          onClick={() => setShowModal(null)}
        >
          <div
            className="modal-content fullscreen-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{t("adminPage.calendar.title")}</h3>
              <button onClick={() => setShowModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="calendar-wrapper">
                <div style={{ marginBottom: "1rem", color: "#666" }}>
                  {t("adminPage.calendar.totalEvents")} {events.length}
                </div>
                <div style={{ height: "600px" }}>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={(event) => setSelectedEvent(event)}
                    views={["month", "week", "day", "agenda"]}
                    view={calendarView}
                    onView={(view) => setCalendarView(view)}
                    date={calendarDate}
                    onNavigate={(date) => setCalendarDate(date)}
                    eventPropGetter={(event) => {
                      const bgColor = getEventBackgroundColor(event.status);

                      return {
                        style: {
                          backgroundColor: bgColor,
                          color: "white",
                          borderRadius: "4px",
                          border: "none",
                          padding: "2px 5px",
                          fontSize: "0.85rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        },
                      };
                    }}
                    components={{
                      event: ({ event }: { event: CalendarEvent }) => {
                        const displayTitle = formatEventTitle(event);
                        const statusColors = getStatusBadgeColor(event.status);

                        return (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>{displayTitle}</span>
                            <span
                              style={{
                                marginLeft: "6px",
                                padding: "2px 6px",
                                borderRadius: "12px",
                                fontSize: "0.7rem",
                                backgroundColor: statusColors.bg,
                                color: statusColors.text,
                                fontWeight: "600",
                              }}
                            >
                              {event.status === "approved"
                                ? t("adminPage.status.approved")
                                : event.status === "rejected"
                                ? t("adminPage.status.rejected")
                                : t("adminPage.status.pending")}
                            </span>
                          </div>
                        );
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Panel */}
      {selectedEvent && (
        <div
          className="modal-overlay blur-backdrop"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className={`event-details-panel ${
              selectedEvent.type === "koneti"
                ? `${selectedEvent.subType || "basic"}-package`
                : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="event-header">
              <FontAwesomeIcon
                icon={
                  selectedEvent.type === "biznis" ? faBriefcase : faGlassCheers
                }
                className="event-icon"
              />
              <h4>{selectedEvent.name}</h4>
              <button
                className="close-event"
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>
            </div>
            <div className="event-body">
              <div className="event-info">
                <p className={`event-status ${selectedEvent.status}`}>
                  <strong>{t("adminPage.event.status")}</strong>{" "}
                  {selectedEvent.status === "pending"
                    ? t("adminPage.status.pending")
                    : selectedEvent.status === "approved"
                    ? t("adminPage.status.approved")
                    : selectedEvent.status === "rejected"
                    ? t("adminPage.status.rejected")
                    : selectedEvent.status}
                </p>
                <p>
                  <strong>{t("adminPage.event.type")}</strong>{" "}
                  {selectedEvent.type === "biznis"
                    ? t("adminPage.event.businessMeeting")
                    : selectedEvent.type === "koneti"
                    ? `${t("adminPage.event.konetiExperience")} - ${
                        selectedEvent.subType
                          ? selectedEvent.subType.charAt(0).toUpperCase() +
                            selectedEvent.subType.slice(1)
                          : "Basic"
                      }`
                    : selectedEvent.type}
                </p>
                <p>
                  <strong>{t("adminPage.event.email")}</strong>{" "}
                  {selectedEvent.email}
                </p>
                <p>
                  <strong>{t("adminPage.event.phone")}</strong>{" "}
                  {selectedEvent.phone}
                </p>
                <p>
                  <strong>{t("adminPage.event.date")}</strong>{" "}
                  {new Date(selectedEvent.date).toLocaleDateString("sr-RS")}
                </p>
                <p>
                  <strong>{t("adminPage.event.time")}</strong>{" "}
                  {selectedEvent.time}
                </p>
                <p>
                  <strong>{t("adminPage.event.guests")}</strong>{" "}
                  {selectedEvent.guests}
                </p>
                {selectedEvent.selectedMenu && (
                  <p>
                    <strong>{t("adminPage.event.menu")}:</strong>{" "}
                    {selectedEvent.selectedMenu}
                  </p>
                )}
                {selectedEvent.message && (
                  <p>
                    <strong>{t("adminPage.event.message")}</strong>{" "}
                    {selectedEvent.message}
                  </p>
                )}
              </div>
              <div className="event-actions">
                {selectedEvent.status === "pending" && (
                  <>
                    <button
                      className="btn-approve"
                      onClick={() =>
                        handleReservationAction(selectedEvent._id, "approved")
                      }
                      disabled={updatingReservation === selectedEvent._id}
                    >
                      <FontAwesomeIcon icon={faCheck} />{" "}
                      {updatingReservation === selectedEvent._id ? "Ažuriranje..." : t("adminPage.event.confirm")}
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() =>
                        handleReservationAction(selectedEvent._id, "rejected")
                      }
                      disabled={updatingReservation === selectedEvent._id}
                    >
                      <FontAwesomeIcon icon={faTimes} />{" "}
                      {updatingReservation === selectedEvent._id ? "Ažuriranje..." : t("adminPage.event.reject")}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
