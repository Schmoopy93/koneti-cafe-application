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
      <div className="about__container">
        <Spinner size="lg" text={t("gallery.loading")} />
      </div>
    );
  }

  return (
    <motion.div
      className="about__management"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* <div className="about__header">
        <h1 className="about__title">
          <FontAwesomeIcon icon={faCoffee} />
          {t("gallery.about.title")}
        </h1>
        <p className="about__subtitle">{t("gallery.about.subtitle")}</p>
      </div> */}

      <section className="about__welcome-section">
        <div className="about__welcome-content">
          <p className="about__welcome-intro">{t("gallery.about.aboutPage.welcome")}</p>
          <div className="about__welcome-offers">
            <div className="about__offer-card">
              <div className="about__offer-icon">
                <FontAwesomeIcon icon={faCoffee} />
              </div>
              <h4 className="about__offer-text">{t("gallery.about.aboutPage.offer.business")}</h4>
            </div>
            <div className="about__offer-card">
              <div className="about__offer-icon">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <h4 className="about__offer-text">{t("gallery.about.aboutPage.offer.koneti")}</h4>
            </div>
          </div>
          <p className="about__welcome-cta">{t("gallery.about.aboutPage.cta")}</p>
        </div>
      </section>

      <section className="about__section">
        <div className="about__content">
          <div className="about__text">
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
            <div className="about__features">
              <div className="about__feature-item">
                <FontAwesomeIcon icon={faCoffee} />
                <div className="about__feature-text">
                  <h4>{t("gallery.about.features.quality.title")}</h4>
                  <p>{t("gallery.about.features.quality.description")}</p>
                </div>
              </div>
              <div className="about__feature-item">
                <FontAwesomeIcon icon={faHeart} />
                <div className="about__feature-text">
                  <h4>{t("gallery.about.features.passion.title")}</h4>
                  <p>{t("gallery.about.features.passion.description")}</p>
                </div>
              </div>
              <div className="about__feature-item">
                <FontAwesomeIcon icon={faUsers} />
                <div className="about__feature-text">
                  <h4>{t("gallery.about.features.community.title")}</h4>
                  <p>{t("gallery.about.features.community.description")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about__image">
            {images.length === 0 ? (
              <div className="about__empty-slider">
                <FontAwesomeIcon icon={faImage} size="3x" />
                <p>{t("gallery.noImages")}</p>
              </div>
            ) : (
              <div className="about__image-slider">
                <div
                  className="about__slider-wrapper"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {images.map((image) => (
                    <div key={image._id} className="about__slider-slide">
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
                <div className="about__slider-indicators">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`about__slider-indicator ${currentSlide === index ? "about__slider-indicator--active" : ""}`}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  className="about__slider-nav about__slider-nav--prev"
                  onClick={goToPrevious}
                  aria-label="Previous slide"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  className="about__slider-nav about__slider-nav--next"
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