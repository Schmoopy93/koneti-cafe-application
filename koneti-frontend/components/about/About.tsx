"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faChevronLeft, faChevronRight, faCoffee, faHeart, faUsers } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { apiRequest } from "@/utils/api";
import Spinner from "../ui/Spinner";
import "./About.scss";

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
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/gallery/about");
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        console.error("Error loading gallery:", response.status);
      }
    } catch (error) {
      console.error("Error loading gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const goToPrevious = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % images.length);

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
      {/* <div className="gallery-header">
        <h1 className="gallery-title">
          <FontAwesomeIcon icon={faCoffee} />
          {t("gallery.about.title")}
        </h1>
        <p className="gallery-subtitle">{t("gallery.about.subtitle")}</p>
      </div> */}

      <section className="about-welcome-section">
        <div className="welcome-content">
          <p className="welcome-intro">{t("gallery.about.aboutPage.welcome")}</p>
          <div className="welcome-offers">
            <div className="offer-card">
              <div className="offer-icon">
                <FontAwesomeIcon icon={faCoffee} />
              </div>
              <h4 className="offer-text">{t("gallery.about.aboutPage.offer.business")}</h4>
            </div>
            <div className="offer-card">
              <div className="offer-icon">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <h4 className="offer-text">{t("gallery.about.aboutPage.offer.koneti")}</h4>
            </div>
          </div>
          <p className="welcome-cta">{t("gallery.about.aboutPage.cta")}</p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2>{t("gallery.about.sectionTitle")}</h2>
            <p>
              {t("gallery.about.intro1")}
              <strong>{t("gallery.about.intro1_highlight")}</strong>
              {t("gallery.about.intro2")}
            </p>
            <p>
              {t("gallery.about.intro3")}
              <strong>{t("gallery.about.intro3_highlight")}</strong>
              {t("gallery.about.intro3_rest")}
            </p>
            <p>{t("gallery.about.mission")}</p>
            <div className="about-features">
              <div className="feature-item">
                <FontAwesomeIcon icon={faCoffee} />
                <div className="feature-text">
                  <h4>{t("gallery.about.features.quality.title")}</h4>
                  <p>{t("gallery.about.features.quality.description")}</p>
                </div>
              </div>
              <div className="feature-item">
                <FontAwesomeIcon icon={faHeart} />
                <div className="feature-text">
                  <h4>{t("gallery.about.features.passion.title")}</h4>
                  <p>{t("gallery.about.features.passion.description")}</p>
                </div>
              </div>
              <div className="feature-item">
                <FontAwesomeIcon icon={faUsers} />
                <div className="feature-text">
                  <h4>{t("gallery.about.features.community.title")}</h4>
                  <p>{t("gallery.about.features.community.description")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-image">
            {images.length === 0 ? (
              <div className="empty-slider">
                <FontAwesomeIcon icon={faImage} size="3x" />
                <p>{t("gallery.noImages")}</p>
              </div>
            ) : (
              <div className="image-slider">
                <div
                  className="slider-wrapper"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {images.map((image) => (
                    <div key={image._id} className="slider-slide">
                      <img
                        src={image.image}
                        alt={
                          i18n.language === "en" && image.title.en
                            ? image.title.en
                            : image.title.sr
                        }
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                <div className="slider-indicators">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`slider-indicator ${currentSlide === index ? "active" : ""}`}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  className="slider-nav prev"
                  onClick={goToPrevious}
                  aria-label="Previous slide"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  className="slider-nav next"
                  onClick={goToNext}
                  aria-label="Next slide"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Gallery;
