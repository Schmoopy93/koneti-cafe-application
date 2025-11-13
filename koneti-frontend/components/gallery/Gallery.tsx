"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faEye, faTimes, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { apiRequest } from "@/utils/api";
import Spinner from "../ui/Spinner";
import "./Gallery.scss";

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
  order: number;
  createdAt: string;
}

const Gallery: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/gallery");
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

  // Pagination logic
  const totalPages = Math.ceil(images.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = images.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top after state update
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Scroll to top after state update
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Scroll to top after state update
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    }
  };

  if (loading) {
    return (
      <div className="gallery-container">
        <Spinner size="lg" text={t("gallery.loading")} />
      </div>
    );
  }

  return (
    <motion.div
      className="gallery-management"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="gallery-header">
        <h1 className="gallery-title">
          <FontAwesomeIcon icon={faImage} />
          {t("header.gallery")}
        </h1>
        <p className="gallery-subtitle">
          {t("gallery.subtitle")}
        </p>
      </div>

      <div className="main-content-container">
        {images.length === 0 ? (
          <div className="empty-gallery">
            <FontAwesomeIcon icon={faImage} size="3x" />
            <h3>{t("gallery.noImages")}</h3>
            <p>{t("gallery.noImagesDesc")}</p>
          </div>
        ) : (
          <>
            <div className="gallery-grid">
              {currentImages.map((image, index) => (
                <motion.div
                  key={image._id}
                  className="gallery-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="gallery-image-wrapper">
                    <img
                      src={image.image}
                      alt={getLocalizedText(image.title)}
                      className="gallery-image"
                      loading="lazy"
                    />
                    <div className="gallery-overlay">
                      <FontAwesomeIcon icon={faEye} />
                      <span>{t("gallery.view")}</span>
                    </div>
                  </div>
                  <div className="gallery-content">
                    <h3 className="gallery-item-title">
                      {getLocalizedText(image.title)}
                    </h3>
                    <div className="gallery-description-container">
                      <p className="gallery-item-description">
                        {getLocalizedText(image.description) || "No description"}
                      </p>
                    </div>
                    <p className="gallery-date">
                      {new Date(image.createdAt).toLocaleDateString('sr-RS', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
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
          </>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
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
    </motion.div>
  );
};

export default Gallery;
