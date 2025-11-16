"use client";

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faSearch,
  faSort,
  faSpinner,
  faChevronLeft,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Spinner from "../ui/Spinner";
import Modal from "../ui/Modal";
import AddGalleryImage from "../forms/AddGalleryImage";
import { apiRequest, API_URL } from "@/utils/api";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "./GalleryManagement.scss";

interface GalleryImage {
  _id: string;
  title: {
    sr: string;
    en: string;
  };
  description: {
    sr: string;
    en: string;
  };
  image: string;
  cloudinary_id: string;
  order: number;
  createdAt: string;
}

const GalleryManagement: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<GalleryImage | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const itemsPerPage = 10;
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/gallery", { useToken: true });
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        console.error('Greška pri učitavanju galerije:', response.status);
      }
    } catch (error) {
      console.error("Greška pri učitavanju galerije:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (textObj: { sr: string; en: string }) => {
    return i18n.language === "en" && textObj.en ? textObj.en : textObj.sr;
  };

  // Filter and sort images
  const filteredImages = images
    .filter((image) =>
      getLocalizedText(image.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLocalizedText(image.description).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "title") {
        return getLocalizedText(a.title).localeCompare(getLocalizedText(b.title));
      }
      return 0;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = filteredImages.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top after state update
    setTimeout(() => {
      if (galleryRef.current) {
        galleryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Scroll to top after state update
      setTimeout(() => {
        if (galleryRef.current) {
          galleryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Scroll to top after state update
      setTimeout(() => {
        if (galleryRef.current) {
          galleryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    }
  };

  const deleteImage = async (id: string) => {
    setUpdatingStatus(id);
    try {
      const response = await apiRequest(`/gallery/${id}`, {
        method: "DELETE",
        useToken: true,
      });

      if (response.ok) {
        await fetchGalleryImages();
        toast.success(t("admin.galleryManagement.imageDeleted"));
        setSelectedImage(null);
        setShowDeleteConfirm(null);
      } else {
        toast.error(t("admin.galleryManagement.deleteError"));
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error(t("admin.galleryManagement.deleteError"));
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return <Spinner size="lg" text={t("admin.galleryManagement.loading")} />;
  }

  return (
    <motion.div
      className="gallery-management"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="gallery-header">
        <div className="header-actions">
          <button
            className="btn-add-image"
            onClick={() => setShowAddModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            {t("admin.galleryManagement.addButton")}
          </button>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">{images.length}</span>
              <span className="stat-label">{t("admin.galleryManagement.totalImages")}</span>
            </div>
            {totalPages > 1 && (
              <span className="stat">
                {t("admin.galleryManagement.page")}: <strong>{currentPage} {t("admin.galleryManagement.of")} {totalPages}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="main-content-container" ref={galleryRef}>
        <div className="gallery-controls">
          <div className="search-filter-row">
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder={t("admin.galleryManagement.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  ×
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
                <option value="newest">{t("admin.galleryManagement.sortOptions.newest")}</option>
                <option value="oldest">{t("admin.galleryManagement.sortOptions.oldest")}</option>
                <option value="title">{t("admin.galleryManagement.sortOptions.title")}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="gallery-grid-container">
          {currentImages.length === 0 ? (
            <div className="empty-gallery">
              <FontAwesomeIcon icon={faImage} size="3x" />
              <h3>{t("admin.galleryManagement.noImages")}</h3>
              <p>{t("admin.galleryManagement.noImagesDesc")}</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {currentImages.map((image, index) => (
                <motion.div
                  key={image._id}
                  className="gallery-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="gallery-image-wrapper">
                    <img
                      src={image.image}
                      alt={getLocalizedText(image.title)}
                      className="gallery-image"
                    />
                    <div className="gallery-overlay">
                      <button
                        className="btn-view"
                        onClick={() => setSelectedImage(image)}
                        title={t("admin.galleryManagement.viewTooltip")}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </div>
                  </div>
                  <div className="gallery-content">
                    <h4 className="gallery-title">{getLocalizedText(image.title)}</h4>
                    <div className="gallery-description-container">
                      <p className="gallery-description">
                        {getLocalizedText(image.description) || t("admin.galleryManagement.noDescription")}
                      </p>
                    </div>
                    <p className="gallery-date">
                      {new Date(image.createdAt).toLocaleDateString('sr-RS', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                    <div className="gallery-actions">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setSelectedImage(image);
                          setShowAddModal(true);
                        }}
                        title={t("admin.galleryManagement.editTooltip")}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => setShowDeleteConfirm(image)}
                        disabled={updatingStatus === image._id}
                        title={t("admin.galleryManagement.deleteTooltip")}
                      >
                        {updatingStatus === image._id ? (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                          <FontAwesomeIcon icon={faTrash} />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

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

      {/* Image Details Modal */}
      {selectedImage && !showAddModal && (
        <div className="gallery-modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gallery-modal-content">
              <button className="close-btn" onClick={() => setSelectedImage(null)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <img
                src={selectedImage.image}
                alt={getLocalizedText(selectedImage.title)}
                className="gallery-modal-image"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        show={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedImage(null);
        }}
        title={selectedImage ? t("admin.galleryManagement.editTitle") : t("admin.galleryManagement.addTitle")}
      >
        <AddGalleryImage
          onClose={() => {
            setShowAddModal(false);
            setSelectedImage(null);
          }}
          onSuccess={(image) => {
            fetchGalleryImages();
            setShowAddModal(false);
            setSelectedImage(null);
          }}
          editData={selectedImage}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="delete-confirm-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowDeleteConfirm(null)}>×</button>
            <h3>{t("admin.galleryManagement.deleteConfirm.title")}</h3>
            <p>{t("admin.galleryManagement.deleteConfirm.message")}</p>
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteConfirm(null)}
              >
                {t("admin.galleryManagement.deleteConfirm.cancel")}
              </button>
              <button
                className="btn-confirm"
                onClick={() => deleteImage(showDeleteConfirm._id)}
                disabled={updatingStatus === showDeleteConfirm._id}
              >
                {updatingStatus === showDeleteConfirm._id ? t("admin.galleryManagement.deleting") : t("admin.galleryManagement.deleteConfirm.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GalleryManagement;
