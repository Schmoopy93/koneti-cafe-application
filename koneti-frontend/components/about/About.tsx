"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faChevronLeft, faChevronRight, faCoffee, faHeart, faMusic, faBusinessTime, faUsers, faUserClock, faCalendarPlus, faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
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

interface AboutProps {
  initialImages?: GalleryImage[];
}

// Memozovane komponente za optimizaciju
const SliderImage = memo(({ image, isFirst, isActive, i18n }: {
  image: GalleryImage;
  isFirst: boolean;
  isActive: boolean;
  i18n: any;
}) => (
  <article className="about__welcome-slider-slide" itemScope itemType="https://schema.org/ImageObject">
    <img
      src={image.image}
      alt={i18n.language === "en" && image.title.en ? image.title.en : image.title.sr}
      loading={isFirst ? "eager" : "lazy"}
      itemProp="image"
      decoding="async"
    />
  </article>
), (prev, next) => prev.image._id === next.image._id && prev.isActive === next.isActive);

SliderImage.displayName = "SliderImage";

const SliderIndicators = memo(({ count, activeIndex, onSlideChange }: {
  count: number;
  activeIndex: number;
  onSlideChange: (index: number) => void;
}) => (
  <div className="about__welcome-slider-indicators" role="tablist" aria-label="Indikatori slajdova">
    {Array.from({ length: count }).map((_, index) => (
      <button
        key={index}
        className={`about__welcome-indicator ${activeIndex === index ? "about__welcome-indicator--active" : ""}`}
        onClick={() => onSlideChange(index)}
        role="tab"
        aria-selected={activeIndex === index}
        aria-label={`Slajd ${index + 1}`}
      />
    ))}
  </div>
));

SliderIndicators.displayName = "SliderIndicators";

const FeatureCard = memo(({ icon, title, description, itemProp }: {
  icon: any;
  title: string;
  description: string;
  itemProp?: string;
}) => (
  <article className="about__feature-card" role="listitem" itemScope itemType="https://schema.org/Service">
    <div className="about__feature-card-icon">
      <FontAwesomeIcon icon={icon} aria-hidden="true" />
    </div>
    <div className="about__feature-card-content">
      <h3 itemProp="name">{title}</h3>
      <p itemProp="description">{description}</p>
    </div>
  </article>
));

FeatureCard.displayName = "FeatureCard";

const OfferCard = memo(({ icon, text }: {
  icon: any;
  text: string;
}) => (
  <article className="about__offer-card" role="listitem" itemScope itemType="https://schema.org/Service">
    <div className="about__offer-icon">
      <FontAwesomeIcon icon={icon} aria-hidden="true" />
    </div>
    <h4 className="about__offer-text" itemProp="name">{text}</h4>
  </article>
));

OfferCard.displayName = "OfferCard";

const About: React.FC<AboutProps> = ({ initialImages = [] }) => {
  const { t, i18n } = useTranslation();
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [welcomeSlide, setWelcomeSlide] = useState(0);

  // Sync state sa initialImages
  useEffect(() => {
    if (initialImages.length > 0) {
      setImages(initialImages);
    }
  }, [initialImages]);

  // WELCOME SLIDER AUTO-ROTATE - memozovano
  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setWelcomeSlide((prev) => (prev + 1) % Math.min(10, images.length));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  // Memozovane slike
  const welcomeImages = useMemo(() => images.slice(0, Math.min(10, images.length)), [images]);

  // Handler za scroll
  const handleScrollToSection = useCallback(() => {
    const section = document.querySelector('.about__section') as HTMLElement;
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Handler za slider indicator click
  const handleSlideChange = useCallback((index: number) => {
    setWelcomeSlide(index);
  }, []);

  return (
    <motion.article
      className="about__management"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      role="main"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      {/* ===== HEADER ===== */}
      <header className="about__header">
        <h1 className="about__title" itemProp="name">
          <FontAwesomeIcon icon={faCoffee} aria-hidden="true" />
          {t("gallery.about.title")}
        </h1>
        <p className="about__subtitle" itemProp="description">{t("gallery.about.subtitle")}</p>
      </header>

      {/* ===== WELCOME SEKCIJA ===== */}
      <section className="about__welcome-section" aria-label="Dobrodošli odeljak">
        <div className="about__welcome-layout">
          {/* Leva strana - Tekst */}
          <div className="about__welcome-text-side">
            <p className="about__welcome-intro">{t("gallery.about.aboutPage.welcome")}</p>
            <div className="about__welcome-offers" role="list">
              <OfferCard icon={faBusinessTime} text={t("gallery.about.aboutPage.offer.business")} />
              <OfferCard icon={faCalendarWeek} text={t("gallery.about.aboutPage.offer.koneti")} />
            </div>
            <p className="about__welcome-cta">{t("gallery.about.aboutPage.cta")}</p>
          </div>

          {/* Desna strana - Slider sa 10 slika */}
          {images.length > 0 && (
            <div className="about__welcome-image-side">
              <div className="about__welcome-slider" role="region" aria-label="Galerija slika Koneti Café-a">
                <div
                  className="about__welcome-slider-wrapper"
                  style={{ transform: `translateX(-${welcomeSlide * 100}%)` }}
                >
                  {welcomeImages.map((image, idx) => (
                    <SliderImage 
                      key={image._id} 
                      image={image} 
                      isFirst={idx === 0}
                      isActive={welcomeSlide === idx}
                      i18n={i18n}
                    />
                  ))}
                </div>
                <SliderIndicators 
                  count={welcomeImages.length} 
                  activeIndex={welcomeSlide}
                  onSlideChange={handleSlideChange}
                />
              </div>
              
              {/* Scroll Arrow */}
              <button
                className="about__scroll-arrow"
                onClick={handleScrollToSection}
                aria-label="Skroluj ka odeljku O nama"
              >
                <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===== O NAMA SEKCIJA - SA TEKSTOM I FEATURES ===== */}
      <section className="about__section" aria-label="O nama odeljak">
        {/* GORNJI DEO - Tekst sa story-jem */}
        <div className="about__story-part">
          <header className="about__story-header">
            <h2>{t("gallery.about.sectionTitle")}</h2>
            <div className="about__story-divider"></div>
          </header>
          
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
        <div className="about__features-grid" role="list">
          <FeatureCard 
            icon={faCoffee}
            title={t("gallery.about.features.quality.title")}
            description={t("gallery.about.features.quality.description")}
          />
          <FeatureCard 
            icon={faMusic}
            title={t("gallery.about.features.passion.title")}
            description={t("gallery.about.features.passion.description")}
          />
          <FeatureCard 
            icon={faHeart}
            title={t("gallery.about.features.community.title")}
            description={t("gallery.about.features.community.description")}
          />
        </div>
      </section>
    </motion.article>
  );
};

export default About;