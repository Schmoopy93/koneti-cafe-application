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
  
  // ODVOJENI SLIDE STATES
  const [welcomeSlide, setWelcomeSlide] = useState(0);

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

  // WELCOME SLIDER AUTO-ROTATE
  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setWelcomeSlide((prev) => (prev + 1) % Math.min(3, images.length));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const welcomeImages = images.slice(0, Math.min(3, images.length));
  const maxWelcomeSlide = welcomeImages.length;

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
      {/* ===== HEADER ===== */}
      <div className="about__header">
        <h1 className="about__title">
          <FontAwesomeIcon icon={faCoffee} />
          {t("gallery.about.title")}
        </h1>
        <p className="about__subtitle">{t("gallery.about.subtitle")}</p>
      </div>

      {/* ===== WELCOME SEKCIJA ===== */}
      <section className="about__welcome-section">
        <div className="about__welcome-layout">
          {/* Leva strana - Tekst */}
          <div className="about__welcome-text-side">
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

          {/* Desna strana - Slider sa 3 slike */}
          {images.length > 0 && (
            <div className="about__welcome-image-side">
              <div className="about__welcome-slider">
                <div
                  className="about__welcome-slider-wrapper"
                  style={{ transform: `translateX(-${welcomeSlide * 100}%)` }}
                >
                  {welcomeImages.map((image) => (
                    <div key={image._id} className="about__welcome-slider-slide">
                      <img
                        src={image.image}
                        alt={i18n.language === "en" && image.title.en ? image.title.en : image.title.sr}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                <div className="about__welcome-slider-indicators">
                  {welcomeImages.map((_, index) => (
                    <button
                      key={index}
                      className={`about__welcome-indicator ${welcomeSlide === index ? "about__welcome-indicator--active" : ""}`}
                      onClick={() => setWelcomeSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Scroll Arrow */}
              <button
                className="about__scroll-arrow"
                onClick={() => {
                  document.querySelector('.about__section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                aria-label="Scroll to about section"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===== O NAMA SEKCIJA - SA TEKSTOM I FEATURES ===== */}
      <section className="about__section">
        {/* GORNJI DEO - Tekst sa story-jem */}
        <div className="about__story-part">
          <div className="about__story-header">
            <h2>{t("gallery.about.sectionTitle")}</h2>
            <div className="about__story-divider"></div>
          </div>
          
          <div className="about__story-content">
            <div className="about__story-text">
              <p>{t("gallery.about.intro1")}<strong>{t("gallery.about.intro1_highlight")}</strong>{t("gallery.about.intro2")}</p>
            </div>
            
            <div className="about__story-text">
              <p>{t("gallery.about.intro3")}<strong>{t("gallery.about.intro3_highlight")}</strong>{t("gallery.about.intro3_rest")}</p>
            </div>
            
            <div className="about__story-mission">
              <p>{t("gallery.about.mission")}</p>
            </div>
          </div>
        </div>

        {/* DONJI DEO - Features Grid */}
        <div className="about__features-grid">
          <div className="about__feature-card">
            <div className="about__feature-card-icon">
              <FontAwesomeIcon icon={faCoffee} />
            </div>
            <div className="about__feature-card-content">
              <h3>{t("gallery.about.features.quality.title")}</h3>
              <p>{t("gallery.about.features.quality.description")}</p>
            </div>
          </div>

          <div className="about__feature-card">
            <div className="about__feature-card-icon">
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <div className="about__feature-card-content">
              <h3>{t("gallery.about.features.passion.title")}</h3>
              <p>{t("gallery.about.features.passion.description")}</p>
            </div>
          </div>

          <div className="about__feature-card">
            <div className="about__feature-card-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="about__feature-card-content">
              <h3>{t("gallery.about.features.community.title")}</h3>
              <p>{t("gallery.about.features.community.description")}</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Gallery;