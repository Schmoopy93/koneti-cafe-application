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
import { motion, Variants } from "framer-motion";

import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { apiRequest } from "@/utils/api";
import CareerManagement from "./CareerManagement";
import Spinner from "../ui/Spinner";
import FullCalendarComponent from "../calendar/FullCalendarComponent";

import "./AdminPage.scss";

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
  type: string;
  subType?: string;
  status: string;
  message?: string;
  selectedMenu?: string;
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

type ModalType = "calendar" | "career" | null;

const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout } = useAuth();

  // State declarations with proper types
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showModal, setShowModal] = useState<ModalType>(null);
  const [selectedEvent, setSelectedEvent] = useState<Reservation | null>(
    null
  );
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
  const [updatingReservation, setUpdatingReservation] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Reservation | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);
  
  // Prevent scroll restoration on back button
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    return () => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      
      const [reservationsRes, drinksRes, categoriesRes] = await Promise.all([
        apiRequest(`/reservations`),
        apiRequest(`/drinks`),
        apiRequest(`/categories`),
      ]);

      if (!reservationsRes?.ok || !drinksRes?.ok || !categoriesRes?.ok) {
        throw new Error("Failed to fetch data");
      }

      const reservationsData: Reservation[] = await reservationsRes.json();
      const drinksData: Drink[] = await drinksRes.json();
      const categoriesData: Category[] = await categoriesRes.json();

      const pendingCount = reservationsData.filter(r => r.status === "pending").length;
      const approvedCount = reservationsData.filter(r => r.status === "approved").length;

      setStatusCounters({ pending: pendingCount, approved: approvedCount });
      setReservations(reservationsData);
      setDrinks(drinksData);
      setCategories(categoriesData);
      setStats({
        totalDrinks: drinksData.length,
        totalCategories: categoriesData.length,
        totalReservations: reservationsData.length,
      });
    } catch (error) {
      console.error("Greška pri učitavanju podataka:", error);
    } finally {
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

  const handleDeleteReservation = async (reservationId: string): Promise<void> => {
    setUpdatingReservation(reservationId);
    try {
      const response = await apiRequest(`/reservations/${reservationId}`, {
        method: "DELETE",
        useToken: true
      });

      if (response.ok) {
        await fetchData();
        setSelectedEvent(null);
        setShowDeleteConfirm(null);
      } else {
        console.error('Failed to delete reservation');
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
    } finally {
      setUpdatingReservation(null);
    }
  };

  const handleReservationAction = async (
    reservationId: string,
    action: string
  ): Promise<void> => {
    console.log(`[DEBUG] Starting reservation action: ${action} for ID: ${reservationId}`);
    setUpdatingReservation(reservationId);
    
    // Optimistic update - ažuriraj UI odmah
    const updatedReservations = reservations.map(reservation => 
      reservation._id === reservationId 
        ? { ...reservation, status: action }
        : reservation
    );
    setReservations(updatedReservations);
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
        const actionText = action === "approved" ? t("adminPage.status.approved") : t("adminPage.status.rejected");
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

  const getStatusBadgeColor = (
    status: string
  ): { bg: string; text: string } => {
    if (status === "approved") return { bg: "#c3f7c7", text: "#155724" };
    if (status === "rejected") return { bg: "#f8d7da", text: "#721c24" };
    return { bg: "#f3e5ab", text: "#5a3e36" };
  };

  if (loading) {
    return <Spinner size="lg" text={t("adminPage.loading")} />;
  }

  return (
    <div className="admin-dashboard">
      <main className="admin-main">
        <motion.div
          className="dashboard-content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Enhanced Stats grid */}
          <motion.div className="stats-grid" variants={containerVariants}>
            <motion.div
              className="stat-card drinks-card"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="stat-icon drinks-icon">
                <FontAwesomeIcon icon={faGlassMartiniAlt} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalDrinks}</h3>
                <p>{t("adminPage.stats.totalDrinks")}</p>
                {/* <div className="stat-trend">
                  <span className="trend-number">📈</span>
                  <span className="trend-label">{t("adminPage.stats.trend.up")}</span>
                </div> */}
              </div>
            </motion.div>

            <motion.div
              className="stat-card categories-card"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="stat-icon categories-icon">
                <FontAwesomeIcon icon={faList} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalCategories}</h3>
                <p>{t("adminPage.stats.totalCategories")}</p>
                {/* <div className="stat-trend">
                  <span className="trend-number">📊</span>
                  <span className="trend-label">{t("adminPage.stats.trend.stable")}</span>
                </div> */}
              </div>
            </motion.div>

            <motion.div
              className="stat-card reservations-card"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="stat-icon reservations-icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div className="stat-info">
                <h3>{stats.totalReservations}</h3>
                <p>{t("adminPage.stats.totalReservations")}</p>
                <div className="stat-breakdown">
                  <span className="approved-count">
                    <span className="count-number">{statusCounters.approved}</span>
                    <span className="count-label">{t("adminPage.stats.approved")}</span>
                  </span>
                  <span className="pending-count">
                    <span className="count-number">{statusCounters.pending}</span>
                    <span className="count-label">{t("adminPage.stats.pending")}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Action cards */}
          {/* Action cards (prvi red) */}
          <motion.div className="action-cards" variants={containerVariants}>
            <motion.div
              className="action-card menu-card"
              onClick={() => router.push("/menu-management")}
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="card-icon-wrapper">
                <FontAwesomeIcon icon={faGlassMartiniAlt} />
                <div className="icon-glow"></div>
              </div>
              <h3>{t("adminPage.actions.manageMenu")}</h3>
              <p>{t("adminPage.actions.manageMenuDesc")}</p>
            </motion.div>

            <motion.div
              className="action-card calendar-card"
              onClick={() => setShowModal("calendar")}
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="card-icon-wrapper">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <div className="icon-glow"></div>
              </div>
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

          {/* Drugi red — Statistics i Career */}
          <motion.div
            className="action-cards"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="action-card statistics-card"
              onClick={() => router.push("/statistics")}
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="card-icon-wrapper">
                <FontAwesomeIcon icon={faChartLine} />
                <div className="icon-glow"></div>
              </div>
              <h3>{t("adminPage.actions.statistics")}</h3>
              <p>{t("adminPage.actions.statisticsDesc")}</p>
              {/* <div className="card-stats-preview">
                <span>📊 {t("adminPage.stats.detailedReports")}</span>
                <span>📈 {t("adminPage.stats.analytics")}</span>
              </div> */}
            </motion.div>

            <motion.div
              className="action-card career-card"
              onClick={() => setShowModal("career")}
              variants={cardVariants}
              whileHover="hover"
            >
              <FontAwesomeIcon icon={faBriefcase} />
              <h3>{t("adminPage.actions.jobApplications")}</h3>
              <p>{t("adminPage.actions.jobApplicationsDesc")}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* Career Management Modal */}
      {showModal === "career" && (
        <div
          className="modal-overlay fullscreen blur-backdrop"
          onClick={() => setShowModal(null)}
        >
          <div
            className="modal-content fullscreen-modal career-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>💼 {t("adminPage.actions.jobApplications")}</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <CareerManagement />
            </div>
          </div>
        </div>
      )}

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
              <button className="modal-close-btn" onClick={() => setShowModal(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="calendar-wrapper">
                <div style={{ marginBottom: "1rem", color: "#666" }}>
                  {t("adminPage.calendar.totalEvents")} {reservations.length}
                </div>
                <FullCalendarComponent
                  reservations={reservations}
                  onEventClick={(reservation) => setSelectedEvent(reservation)}
                  onStatusUpdate={handleReservationAction}
                />
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
                  selectedEvent.type === "business" ? faBriefcase : faGlassCheers
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
                  {selectedEvent.type === "business"
                    ? `${t("adminPage.event.businessMeeting")}${selectedEvent.subType ? ` - ${t(`adminPage.packages.${selectedEvent.subType}`)}` : ""}`
                    : selectedEvent.type === "experience"
                    ? `${t("adminPage.event.konetiExperience")}${selectedEvent.subType ? ` - ${t(`adminPage.packages.${selectedEvent.subType}`)}` : ""}`
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
                      {updatingReservation === selectedEvent._id ? t("adminPage.actions.updating") : t("adminPage.event.confirm")}
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() =>
                        handleReservationAction(selectedEvent._id, "rejected")
                      }
                      disabled={updatingReservation === selectedEvent._id}
                    >
                      <FontAwesomeIcon icon={faTimes} />{" "}
                      {updatingReservation === selectedEvent._id ? t("adminPage.actions.updating") : t("adminPage.event.reject")}
                    </button>
                  </>
                )}
                <button
                  className="btn-delete"
                  onClick={() => setShowDeleteConfirm(selectedEvent)}
                  disabled={updatingReservation === selectedEvent._id}
                >
                  <FontAwesomeIcon icon={faTrash} />{" "}
                  {t("adminPage.event.delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="modal-overlay blur-backdrop"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div
            className="delete-confirm-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{t("adminPage.event.deleteConfirm.title")}</h3>
            <p>{t("adminPage.event.deleteConfirm.message")}</p>
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteConfirm(null)}
              >
                {t("adminPage.event.deleteConfirm.cancel")}
              </button>
              <button
                className="btn-confirm"
                onClick={() => handleDeleteReservation(showDeleteConfirm._id)}
                disabled={updatingReservation === showDeleteConfirm._id}
              >
                {updatingReservation === showDeleteConfirm._id ? t("adminPage.actions.updating") : t("adminPage.event.deleteConfirm.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
