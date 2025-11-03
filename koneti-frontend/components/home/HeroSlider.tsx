"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Settings } from "react-slick";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import "./HeroSlider.scss";

// Dinamički import Slider komponente da izbegnemo SSR probleme
const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
  loading: () => (
    <div className="hero-slider-loading">
      <div className="loading-spinner"></div>
    </div>
  ),
});

interface SlideData {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

const HeroSlider: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    arrows: false,
    pauseOnHover: false,
  };

  const slides: SlideData[] = [
    {
      image: "cafe1.jpg",
      title: t('home.hero.slide1.title'),
      subtitle: t('home.hero.slide1.subtitle'),
      description: t('home.hero.slide1.description')
    },
    {
      image: "cafe2.jpg",
      title: t('home.hero.slide2.title'),
      subtitle: t('home.hero.slide2.subtitle'),
      description: t('home.hero.slide2.description')
    },
    {
      image: "cafe3.jpg",
      title: t('home.hero.slide3.title'),
      subtitle: t('home.hero.slide3.subtitle'),
      description: t('home.hero.slide3.description')
    },
  ];

  const handleScrollDown = (): void => {
    if (typeof window !== "undefined") {
      window.scrollTo({ 
        top: window.innerHeight, 
        behavior: 'smooth' 
      });
    }
  };

  if (!mounted) {
    return (
      <div className="hero-slider">
        <div className="hero-slider-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-slider">
      <Slider {...settings}>
        {slides.map((slide: SlideData, index: number) => (
          <div key={index} className="slide">
            <div
              className="slide-image"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className="slide-overlay"></div>
            </div>
            <div className="slide-content">
              <div className="slide-text">
                <span className="slide-number">0{index + 1}</span>
                <h1 className="slide-title">{slide.title}</h1>
                <h2 className="slide-subtitle">{slide.subtitle}</h2>
                <p className="slide-description">{slide.description}</p>
                <div className="slide-actions">
                  <Link href="/menu" className="btn-primary">
                    <span>{t('home.hero.exploreMenu')}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M5 12h14m-7-7l7 7-7 7" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                  <Link href="/reservation" className="btn-secondary">
                    <span>{t('home.hero.reserveTable')}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      
      <div 
        className="hero-scroll-indicator" 
        onClick={handleScrollDown}
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleScrollDown();
          }
        }}
      >
        <div className="scroll-text">{t('home.hero.scrollDown')}</div>
        <div className="scroll-arrow">↓</div>
      </div>
    </div>
  );
};

export default HeroSlider;