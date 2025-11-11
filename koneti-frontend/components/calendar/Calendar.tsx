"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faArrowLeft,
  faCheck,
  faTimes,
  faTrash,
  faBriefcase,
  faGlassCheers,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { apiRequest } from "@/utils/api";
import FullCalendarComponent from "./FullCalendarComponent";
import Spinner from "../ui/Spinner";
import Modal from "../ui/Modal";
import "./Calendar.scss";

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

const Calendar: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingReservation, setUpdatingReservation] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Reservation | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchReservations();
  }, []);

  const fetchReservations = async (): Promise<void> => {
    try {
      if (reservations.length === 0) setLoading(true);
      const response = await apiRequest(`/admin/dashboard`);

      if (!response?.ok) {
        throw new Error("Failed to fetch reservations");
      }

      const data = await response.json();
      const reservationsData = data.reservations as Reservation[];
      setReservations(reservationsData);
    } catch (error) {
      console.error("Greška pri učitavanju rezervacija:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReservationAction = async (
    reservationId: string,
    action: string
  ): Promise<void> => {
    setUpdatingReservation(reservationId);

    // Optimistic update
    const updatedReservations = reservations.map(reservation =>
      reservation._id === reservationId
        ? { ...reservation, status: action }
        : reservation
    );
    setReservations(updatedReservations);

    if (selectedEvent && selectedEvent._id === reservationId) {
      setSelectedEvent({ ...selectedEvent, status: action });
    }

    try {
      const response = await apiRequest(`/reservations/${reservationId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: action }),
        useToken: true
      });

      if (response.ok) {
        await fetchReservations();
      } else {
        await fetchReservations();
      }
    } catch (error) {
      await fetchReservations();
    } finally {
      setUpdatingReservation(null);
    }
  };

  const handleDeleteReservation = async (reservationId: string): Promise<void> => {
    setUpdatingReservation(reservationId);
    try {
      const response = await apiRequest(`/reservations/${reservationId}`, {
        method: "DELETE",
        useToken: true
      });

      if (response.ok) {
        await fetchReservations();
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

  const handleBackToAdmin = () => {
    // Get current language from pathname or default to 'sr'
    const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'sr';
    router.push(`/${currentLang}/admin`);
  };

  if (loading) {
    return <Spinner size="lg" text={t("adminPage.loading")} />;
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <motion.button
          className="back-button"
          onClick={handleBackToAdmin}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          {t("calendarPage.backToAdmin")}
        </motion.button>

        <motion.div
          className="calendar-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <FontAwesomeIcon icon={faCalendarAlt} />
          <h1>{t("calendarPage.title")}</h1>
        </motion.div>

        <motion.div
          className="calendar-stats"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="stat-item">
            <span className="stat-number">{reservations.length}</span>
            <span className="stat-label">{t("calendarPage.totalEvents")}</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="calendar-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="calendar-wrapper">
          <FullCalendarComponent
            reservations={reservations}
            onEventClick={(reservation) => setSelectedEvent(reservation)}
            onStatusUpdate={handleReservationAction}
          />
        </div>
      </motion.div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal
          show={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          className={`event-details-modal ${
            selectedEvent.type === "koneti"
              ? `${selectedEvent.subType || "basic"}-package`
              : ""
          }`}
        >
          <div className="event-header">
            <FontAwesomeIcon
              icon={
                selectedEvent.type === "business" ? faBriefcase : faGlassCheers
              }
              className="event-icon"
            />
            <h4>{selectedEvent.name}</h4>
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
        </Modal>
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

export default Calendar;