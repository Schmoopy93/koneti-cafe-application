/**
 * CareerManagement - Upravljanje prijavama za posao
 * CareerManagement - Job applications management
 */
"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faBriefcase,
  faFileAlt,
  faDownload,
  faEye,
  faCheck,
  faTimes,
  faSpinner,
  faChevronLeft,
  faChevronRight,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "../ui/Spinner";
import { apiRequest } from "@/utils/api";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "./CareerManagement.scss";

interface CareerApplication {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  coverLetter: string;
  cvUrl?: string;
  status: "pending" | "reviewed" | "contacted" | "rejected";
  createdAt: string;
}

interface Position {
  _id: string;
  title: {
    sr: string;
    en?: string;
  };
}

const CareerManagement: React.FC = () => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<CareerApplication | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<CareerApplication | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddPosition, setShowAddPosition] = useState(false);
  const [newPosition, setNewPosition] = useState({ title: '' });
  const [positions, setPositions] = useState<Position[]>([]);
  const [positionError, setPositionError] = useState('');
  const itemsPerPage = 4;

  useEffect(() => {
    fetchApplications();
    fetchPositions();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/career", { useToken: true });
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error('Greška pri učitavanju prijava:', response.status);
      }
    } catch (error) {
      console.error("Greška pri učitavanju prijava:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await apiRequest("/positions");
      if (response.ok) {
        const data = await response.json();
        setPositions(data);
      }
    } catch (error) {
      console.error("Greška pri učitavanju pozicija:", error);
    }
  };

  const handleAddPosition = async () => {
    if (!newPosition.title.trim()) {
      setPositionError(t("adminPage.career.enterPositionName"));
      return;
    }

    try {
      const response = await apiRequest("/positions", {
        method: "POST",
        body: JSON.stringify({ title: newPosition.title }),
        useToken: true,
      });

      if (response.ok) {
        toast.success(t("adminPage.career.positionAdded"));
        setNewPosition({ title: '' });
        setPositionError('');
        setShowAddPosition(false);
        fetchPositions();
      } else {
        const error = await response.json();
        toast.error(error.message || t("adminPage.career.addPositionError"));
      }
    } catch (error) {
      console.error("Error adding position:", error);
      toast.error(t("adminPage.career.addPositionError"));
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    setUpdatingStatus(id);
    try {
      const response = await apiRequest(`/career/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        useToken: true,
      });

      if (response.ok) {
        await fetchApplications();
        toast.success(t("adminPage.career.statusUpdated"));
        if (selectedApplication && selectedApplication._id === id) {
          setSelectedApplication({ ...selectedApplication, status: status as any });
        }
      } else {
        toast.error(t("adminPage.career.statusUpdateError"));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(t("adminPage.career.statusUpdateError"));
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deleteApplication = async (id: string) => {
    setUpdatingStatus(id);
    try {
      const response = await apiRequest(`/career/${id}`, {
        method: "DELETE",
        useToken: true,
      });

      if (response.ok) {
        await fetchApplications();
        toast.success(t("adminPage.career.applicationDeleted"));
        setSelectedApplication(null);
        setShowDeleteConfirm(null);
      } else {
        toast.error(t("adminPage.career.deleteError"));
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error(t("adminPage.career.deleteError"));
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "#f39c12";
      case "reviewed": return "#3498db";
      case "contacted": return "#27ae60";
      case "rejected": return "#e74c3c";
      default: return "#95a5a6";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return t("adminPage.career.status.pending");
      case "reviewed": return t("adminPage.career.status.reviewed");
      case "contacted": return t("adminPage.career.status.contacted");
      case "rejected": return t("adminPage.career.status.rejected");
      default: return status;
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = applications.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return <Spinner size="lg" text={t("adminPage.career.loading")} />;
  }

  return (
    <div className="career-management">
      <div className="career-header">

        <div className="header-actions">
          <button 
            className="btn-add-position"
            onClick={() => setShowAddPosition(!showAddPosition)}
          >
            <FontAwesomeIcon icon={faPlus} />
            {t("adminPage.career.addPosition")}
          </button>
          <div className="stats">
            <span className="stat">
              {t("adminPage.career.total")}: <strong>{applications.length}</strong>
            </span>
            <span className="stat">
              {t("adminPage.career.pending")}: <strong>{applications.filter(a => a.status === "pending").length}</strong>
            </span>
            {totalPages > 1 && (
              <span className="stat">
                {t("adminPage.career.page")}: <strong>{currentPage} {t("adminPage.career.of")} {totalPages}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add Position Form */}
      {showAddPosition && (
        <div className="add-position-form">
          <div className="form-row">
            <input
              type="text"
              placeholder={t("adminPage.career.positionPlaceholder")}
              value={newPosition.title}
              onChange={(e) => {
                setNewPosition({title: e.target.value});
                if (positionError) setPositionError('');
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPosition()}
              className={positionError ? 'error' : ''}
            />
            <button className="btn-submit-position" onClick={handleAddPosition}>
              ✓
            </button>
            <button className="btn-cancel" onClick={() => {
              setShowAddPosition(false);
              setPositionError('');
              setNewPosition({ title: '' });
            }}>
              ×
            </button>
          </div>
          {positionError && <span className="error-text">{positionError}</span>}
        </div>
      )}

      <div className="main-content-container">
        <div className="applications-grid">
          {currentApplications.map((app) => (
            <div key={app._id} className="application-card">
              <div className="card-header">
                <div className="applicant-info">
                  <h3>{app.firstName} {app.lastName}</h3>
                  <span className="position">{app.position}</span>
                </div>
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(app.status) }}
                >
                  {getStatusText(app.status)}
                </span>
              </div>

              <div className="card-body">
                <div className="contact-info">
                  <div className="info-item">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span>{app.email}</span>
                  </div>
                  <div className="info-item">
                    <FontAwesomeIcon icon={faPhone} />
                    <span>{app.phone}</span>
                  </div>
                </div>

                <div className="application-date">
                  {t("adminPage.career.submitted")}: {new Date(app.createdAt).toLocaleDateString("sr-RS")}
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn-view"
                  onClick={() => setSelectedApplication(app)}
                >
                  <FontAwesomeIcon icon={faEye} />
                  {t("adminPage.career.view")}
                </button>

                {app.cvUrl && (
                  <a
                    href={app.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-download"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    CV
                  </a>
                )}

                {app.status === "pending" && (
                  <div className="status-actions">
                    <button
                      className="btn-approve"
                      onClick={() => updateApplicationStatus(app._id, "reviewed")}
                      disabled={updatingStatus === app._id}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => updateApplicationStatus(app._id, "rejected")}
                      disabled={updatingStatus === app._id}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                )}

                <button
                  className="btn-delete"
                  onClick={() => setShowDeleteConfirm(app)}
                  disabled={updatingStatus === app._id}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {applications.length === 0 && (
          <div className="empty-state">
            <FontAwesomeIcon icon={faBriefcase} size="3x" />
            <h3>{t("adminPage.career.noApplications")}</h3>
            <p>{t("adminPage.career.noApplicationsDesc")}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn" 
              onClick={goToPrevious} 
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              className="pagination-btn" 
              onClick={goToNext} 
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
          <div className="application-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedApplication.firstName} {selectedApplication.lastName}</h3>
              <button onClick={() => setSelectedApplication(null)}>×</button>
            </div>

            <div className="modal-body">
              <div className="applicant-details">
                <div className="detail-row">
                  <FontAwesomeIcon icon={faBriefcase} />
                  <span><strong>{t("adminPage.career.position")}:</strong> {selectedApplication.position}</span>
                </div>
                <div className="detail-row">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span><strong>{t("adminPage.career.email")}:</strong> {selectedApplication.email}</span>
                </div>
                <div className="detail-row">
                  <FontAwesomeIcon icon={faPhone} />
                  <span><strong>{t("adminPage.career.phone")}:</strong> {selectedApplication.phone}</span>
                </div>
              </div>

              <div className="cover-letter">
                <h4><FontAwesomeIcon icon={faFileAlt} /> {t("adminPage.career.coverLetter")}</h4>
                <div className="letter-content">
                  {selectedApplication.coverLetter}
                </div>
              </div>

              <div className="status-section">
                <h4>{t("adminPage.career.updateStatus")}</h4>
                <div className="status-buttons">
                  {["reviewed", "contacted", "rejected"].map((status) => (
                    <button
                      key={status}
                      className={`status-btn ${selectedApplication.status === status ? "active" : ""}`}
                      onClick={() => updateApplicationStatus(selectedApplication._id, status)}
                      disabled={updatingStatus === selectedApplication._id}
                    >
                      {updatingStatus === selectedApplication._id ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : (
                        getStatusText(status)
                      )}
                    </button>
                  ))}
                </div>
                <button
                  className="btn-delete-modal"
                  onClick={() => setShowDeleteConfirm(selectedApplication)}
                  disabled={updatingStatus === selectedApplication._id}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  {t("adminPage.career.deleteApplication")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="delete-confirm-popup" onClick={(e) => e.stopPropagation()}>
            <h3>{t("adminPage.career.deleteConfirm.title")}</h3>
            <p>{t("adminPage.career.deleteConfirm.message")}</p>
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteConfirm(null)}
              >
                {t("adminPage.career.deleteConfirm.cancel")}
              </button>
              <button
                className="btn-confirm"
                onClick={() => deleteApplication(showDeleteConfirm._id)}
                disabled={updatingStatus === showDeleteConfirm._id}
              >
                {updatingStatus === showDeleteConfirm._id ? t("adminPage.actions.updating") : t("adminPage.career.deleteConfirm.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerManagement;