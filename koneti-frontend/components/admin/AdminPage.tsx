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
  faEye,
  faSignOutAlt,
  faBriefcase,
  faTimes,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { motion, Variants } from "framer-motion";

import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { apiRequest } from "@/utils/api";
import { useScrollLock } from "@/hooks/useScrollLock";
import CareerManagement from "./CareerManagement";
import Spinner from "../ui/Spinner";

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
  rejected: number;
}

type ModalType = "career" | null;

const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout } = useAuth();

  // State declarations with proper types
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState<ModalType>(null);
  const [stats, setStats] = useState<Stats>({
    totalDrinks: 0,
    totalCategories: 0,
    totalReservations: 0,
  });
  const [statusCounters, setStatusCounters] = useState<StatusCounters>({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  useScrollLock(showModal !== null);
  
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

      const response = await apiRequest(`/admin/dashboard`);

      if (!response?.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      const drinksData = data.drinks as Drink[];
      const categoriesData = data.categories as Category[];
      const reservationsData = data.reservations || [];

      const pendingCount = reservationsData.filter((r: Reservation) => r.status === "pending").length;
      const approvedCount = reservationsData.filter((r: Reservation) => r.status === "approved").length;
      const rejectedCount = reservationsData.filter((r: Reservation) => r.status === "rejected").length;

      setStatusCounters({ pending: pendingCount, approved: approvedCount, rejected: rejectedCount });
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
      <main className="admin-dashboard__main">
        <motion.div
          className="admin-dashboard__content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Enhanced Stats grid */}
          <motion.div className="admin-dashboard__stats-grid" variants={containerVariants}>
            <motion.div
              className="admin-dashboard__stat-card admin-dashboard__stat-card--drinks"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="admin-dashboard__stat-icon admin-dashboard__stat-icon--drinks">
                <FontAwesomeIcon icon={faGlassMartiniAlt} />
              </div>
              <div className="admin-dashboard__stat-info">
                <h3>{stats.totalDrinks}</h3>
                <p>{t("adminPage.stats.totalDrinks")}</p>
              </div>
            </motion.div>

            <motion.div
              className="admin-dashboard__stat-card admin-dashboard__stat-card--categories"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="admin-dashboard__stat-icon admin-dashboard__stat-icon--categories">
                <FontAwesomeIcon icon={faList} />
              </div>
              <div className="admin-dashboard__stat-info">
                <h3>{stats.totalCategories}</h3>
                <p>{t("adminPage.stats.totalCategories")}</p>
              </div>
            </motion.div>

            <motion.div
              className="admin-dashboard__stat-card admin-dashboard__stat-card--reservations"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="admin-dashboard__stat-icon admin-dashboard__stat-icon--reservations">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div className="admin-dashboard__stat-info">
                <h3>{stats.totalReservations}</h3>
                <p>{t("adminPage.stats.totalReservations")}</p>
                <div className="admin-dashboard__stat-breakdown">
                  <span className="admin-dashboard__stat-count admin-dashboard__stat-count--approved">
                    <span className="admin-dashboard__count-number">{statusCounters.approved}</span>
                    <span className="admin-dashboard__count-label">{t("adminPage.stats.approved")}</span>
                  </span>
                  <span className="admin-dashboard__stat-count admin-dashboard__stat-count--pending">
                    <span className="admin-dashboard__count-number">{statusCounters.pending}</span>
                    <span className="admin-dashboard__count-label">{t("adminPage.stats.pending")}</span>
                  </span>
                  <span className="admin-dashboard__stat-count admin-dashboard__stat-count--rejected">
                    <span className="admin-dashboard__count-number">{statusCounters.rejected}</span>
                    <span className="admin-dashboard__count-label">{t("adminPage.stats.rejected")}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Action cards */}
          <motion.div className="admin-dashboard__action-cards" variants={containerVariants}>
            <motion.div
              className="admin-dashboard__action-card admin-dashboard__action-card--menu"
              onClick={() => {
                const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'sr';
                router.push(`/${currentLang}/menu-management`);
              }}
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="admin-dashboard__card-icon-wrapper">
                <FontAwesomeIcon icon={faGlassMartiniAlt} style={{ color: '#ffc107' }} />
                <div className="admin-dashboard__icon-glow"></div>
              </div>
              <h3>{t("adminPage.actions.manageMenu")}</h3>
              <p>{t("adminPage.actions.manageMenuDesc")}</p>
            </motion.div>

            <motion.div
              className="admin-dashboard__action-card admin-dashboard__action-card--calendar"
              onClick={() => {
                const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'sr';
                router.push(`/${currentLang}/calendar`);
              }}
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="admin-dashboard__card-icon-wrapper">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <div className="admin-dashboard__icon-glow"></div>
              </div>
              <h3>{t("adminPage.actions.calendar")}</h3>
              <p>{t("adminPage.actions.calendarDesc")}</p>
            </motion.div>

            <motion.div
              className="admin-dashboard__action-card admin-dashboard__action-card--logout"
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
            className="admin-dashboard__action-cards"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="admin-dashboard__action-card admin-dashboard__action-card--statistics"
              onClick={() => {
                const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'sr';
                router.push(`/${currentLang}/statistics`);
              }}
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="admin-dashboard__card-icon-wrapper">
                <FontAwesomeIcon icon={faChartLine} />
                <div className="admin-dashboard__icon-glow"></div>
              </div>
              <h3>{t("adminPage.actions.statistics")}</h3>
              <p>{t("adminPage.actions.statisticsDesc")}</p>
            </motion.div>

            <motion.div
              className="admin-dashboard__action-card admin-dashboard__action-card--career"
              onClick={() => {
                const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'sr';
                router.push(`/${currentLang}/admin/career`);
              }}
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="admin-dashboard__card-icon-wrapper">
                <FontAwesomeIcon icon={faBriefcase} />
                <div className="admin-dashboard__icon-glow"></div>
              </div>
              <h3>{t("adminPage.actions.jobApplications")}</h3>
              <p>{t("adminPage.actions.jobApplicationsDesc")}</p>
            </motion.div>

            <motion.div
              className="admin-dashboard__action-card admin-dashboard__action-card--gallery"
              onClick={() => {
                const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'sr';
                router.push(`/${currentLang}/admin/gallery`);
              }}
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="admin-dashboard__card-icon-wrapper">
                <FontAwesomeIcon icon={faImage} style={{ color: '#28a745' }} />
                <div className="admin-dashboard__icon-glow"></div>
              </div>
              <h3>{t("adminPage.actions.gallery")}</h3>
              <p>{t("adminPage.actions.galleryDesc")}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* Career Management Modal */}
      {showModal === "career" && (
        <div
          className="admin-dashboard__modal-overlay admin-dashboard__modal-overlay--fullscreen admin-dashboard__modal-overlay--blur"
          onClick={() => setShowModal(null)}
        >
          <div
            className="admin-dashboard__modal-content admin-dashboard__modal-content--fullscreen admin-dashboard__modal-content--career"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-dashboard__modal-header">
              <h3>💼 {t("adminPage.actions.jobApplications")}</h3>
              <button className="admin-dashboard__modal-close-btn" onClick={() => setShowModal(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="admin-dashboard__modal-body">
              <CareerManagement />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
