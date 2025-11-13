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
  faSearch,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "../ui/Spinner";
import Modal from "../ui/Modal";
import { apiRequest, API_URL } from "@/utils/api";
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
  const { t, i18n } = useTranslation();
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<CareerApplication | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<CareerApplication | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddPosition, setShowAddPosition] = useState(false);
  const [showAddPositionPopup, setShowAddPositionPopup] = useState(false);
  const [newPosition, setNewPosition] = useState({ title: '' });
  const [positions, setPositions] = useState<Position[]>([]);
  const [positionError, setPositionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, reviewed: 0, contacted: 0, rejected: 0 });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date-desc");
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
        setShowAddPositionPopup(false);
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

  const getPositionDisplayName = (positionSr: string) => {
    const position = positions.find(pos => pos.title.sr === positionSr);
    if (position) {
      return i18n.language === "en" && position.title.en ? position.title.en : position.title.sr;
    }
    return positionSr;
  };

  // Filter and sort applications
  const filteredApplications = applications
    .filter((app) =>
      `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPositionDisplayName(app.position).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date-asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "date-desc") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = filteredApplications.slice(startIndex, endIndex);

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
            onClick={() => setShowAddPositionPopup(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            {t("adminPage.career.addPosition")}
          </button>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">{applications.length}</span>
              <span className="stat-label">{t("adminPage.career.total")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{applications.filter(a => a.status === "pending").length}</span>
              <span className="stat-label">{t("adminPage.career.pending")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{applications.filter(a => a.status === "reviewed").length}</span>
              <span className="stat-label">{t("adminPage.career.status.reviewed")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{applications.filter(a => a.status === "contacted").length}</span>
              <span className="stat-label">{t("adminPage.career.status.contacted")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{applications.filter(a => a.status === "rejected").length}</span>
              <span className="stat-label">{t("adminPage.career.status.rejected")}</span>
            </div>
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
        <div className="menu-controls">
          <div className="search-filter-row">
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder={t("adminPage.career.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>

            <div className="filter-container">
              <FontAwesomeIcon icon={faSort} className="filter-icon" />
              <select
                className="filter-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-desc">{t("adminPage.career.sortOptions.dateDesc")}</option>
                <option value="date-asc">{t("adminPage.career.sortOptions.dateAsc")}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="applications-table-container">
          <table className="applications-table">
            <thead>
              <tr>
                <th>{t("adminPage.career.name")}</th>
                <th>{t("adminPage.career.position")}</th>
                <th>{t("adminPage.career.email")}</th>
                <th>{t("adminPage.career.phone")}</th>
                <th>{t("adminPage.career.statusHeader")}</th>
                <th>{t("adminPage.career.date")}</th>
                <th>{t("adminPage.career.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {currentApplications.map((app) => (
                <tr key={app._id}>
                  <td className="applicant-name">
                    {app.firstName} {app.lastName}
                  </td>
                  <td className="position">{getPositionDisplayName(app.position)}</td>
                  <td className="email">{app.email}</td>
                  <td className="phone">{app.phone}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(app.status) }}
                    >
                      {getStatusText(app.status)}
                    </span>
                  </td>
                  <td className="date">
                    {new Date(app.createdAt).toLocaleDateString("sr-RS")}
                  </td>
                  <td className="actions">
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => setSelectedApplication(app)}
                        title={t("adminPage.career.viewTooltip")}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>

                      {app.cvUrl && (
                        <a
                          href={`${API_URL}/career/${app._id}/download-cv`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-download"
                          title={t("adminPage.career.downloadTooltip")}
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </a>
                      )}

                      {app.status === "pending" && (
                        <>
                          <button
                            className="btn-approve"
                            onClick={() => updateApplicationStatus(app._id, "reviewed")}
                            disabled={updatingStatus === app._id}
                            title={t("adminPage.career.approveTooltip")}
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => updateApplicationStatus(app._id, "rejected")}
                            disabled={updatingStatus === app._id}
                            title={t("adminPage.career.rejectTooltip")}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </>
                      )}

                      <button
                        className="btn-delete"
                        onClick={() => setShowDeleteConfirm(app)}
                        disabled={updatingStatus === app._id}
                        title={t("adminPage.career.deleteTooltip")}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && applications.length > 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>{t("menu.noResults")}</h3>
            <p>{t("menu.tryDifferent")}</p>
          </div>
        )}

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
      <Modal
        show={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        title={t("adminPage.career.applicationDetails")}
      >
        {selectedApplication && (
          <>
            <div className="applicant-details">
              <div className="detail-row">
                <FontAwesomeIcon icon={faUser} />
                <span><strong>{t("adminPage.career.name")}:</strong> {selectedApplication.firstName} {selectedApplication.lastName}</span>
              </div>
              <div className="detail-row">
                <FontAwesomeIcon icon={faBriefcase} />
                <span><strong>{t("adminPage.career.position")}:</strong> {getPositionDisplayName(selectedApplication.position)}</span>
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

            {selectedApplication.coverLetter && (
              <div className="cover-letter">
                <h4><FontAwesomeIcon icon={faFileAlt} /> {t("adminPage.career.coverLetter")}</h4>
                <div className="letter-content">
                  {selectedApplication.coverLetter}
                </div>
              </div>
            )}

            <div className="status-section">
              <h4>{t("adminPage.career.updateStatus")}</h4>
              <div className="status-buttons">
                <button
                  className={`status-btn ${selectedApplication.status === "reviewed" ? "active" : ""}`}
                  onClick={() => updateApplicationStatus(selectedApplication._id, "reviewed")}
                  disabled={updatingStatus === selectedApplication._id}
                  title={t("adminPage.career.status.reviewed")}
                >
                  {updatingStatus === selectedApplication._id ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </button>
                <button
                  className={`status-btn ${selectedApplication.status === "contacted" ? "active" : ""}`}
                  onClick={() => updateApplicationStatus(selectedApplication._id, "contacted")}
                  disabled={updatingStatus === selectedApplication._id}
                  title={t("adminPage.career.status.contacted")}
                >
                  {updatingStatus === selectedApplication._id ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faCheck} />
                  )}
                </button>
                <button
                  className={`status-btn ${selectedApplication.status === "rejected" ? "active" : ""}`}
                  onClick={() => updateApplicationStatus(selectedApplication._id, "rejected")}
                  disabled={updatingStatus === selectedApplication._id}
                  title={t("adminPage.career.status.rejected")}
                >
                  {updatingStatus === selectedApplication._id ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} />
                  )}
                </button>
                <button
                  className="btn-delete-modal"
                  onClick={() => setShowDeleteConfirm(selectedApplication)}
                  disabled={updatingStatus === selectedApplication._id}
                  title={t("adminPage.career.deleteApplication")}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="delete-confirm-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowDeleteConfirm(null)}>×</button>
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

      {/* Add Position Modal */}
      <Modal
        show={showAddPositionPopup}
        onClose={() => setShowAddPositionPopup(false)}
        title={t("adminPage.career.addPosition")}
      >
        <div className="add-position-form">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleAddPosition();
          }}>
            <div className="form-group">
              <label>{t("adminPage.career.positionPlaceholder")}:</label>
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
              {positionError && <span className="error">{positionError}</span>}
            </div>

            <button type="submit" className="gradient-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <Spinner size="sm" text={t("adminPage.career.savePosition")} />
              ) : (
                t("adminPage.career.savePosition")
              )}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CareerManagement;
