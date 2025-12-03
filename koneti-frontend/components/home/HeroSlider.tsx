"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Settings } from "react-slick";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import Spinner from "../ui/Spinner";
import Image from "next/image";
import "./HeroSlider.scss";

// Dinamički import Slider komponente da izbegnemo SSR probleme
const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
  loading: () => <Spinner size="lg" text="Loading slider..." />,
});

interface SlideData {
  image?: string;
  video?: string;
  title: string;
  subtitle: string;
  description: string;
  type: 'image' | 'video';
  poster?: string;
}

const HeroSlider: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  const pathname = usePathname();

  // Extract current language from pathname
  const currentLang = pathname?.startsWith('/sr') ? 'sr' : pathname?.startsWith('/en') ? 'en' : 'sr';

  // Helper function to get localized path
  const getLocalizedPath = (path: string) => {
    return `/${currentLang}${path}`;
  };

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
      video: "/koneti-promo.mp4",
      type: 'video',
      title: t('home.hero.slide1.title'),
      subtitle: t('home.hero.slide1.subtitle'),
      description: t('home.hero.slide1.description'),
      poster: "/koneti-hero-poster.jpg" // Placeholder slika dok se video učitava
    },
    // {
    //   image: "cafe2.jpg",
    //   type: 'image',
    //   title: t('home.hero.slide2.title'),
    //   subtitle: t('home.hero.slide2.subtitle'),
    //   description: t('home.hero.slide2.description')
    // },
    // {
    //   image: "cafe3.jpg",
    //   type: 'image',
    //   title: t('home.hero.slide3.title'),
    //   subtitle: t('home.hero.slide3.subtitle'),
    //   description: t('home.hero.slide3.description')
    // },
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
        <Spinner size="lg" text="Loading slider..." />
      </div>
    );
  }

  return (
    <section className="hero-slider" role="region" aria-label="Sekcija sa hero sadržajem">
      <Slider {...settings}>
        {slides.map((slide: SlideData, index: number) => (
          <article key={index} className="slide" role="group" aria-roledescription="slide">
            {slide.type === 'video' ? (
              <div className="slide-video">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="video-background"
                  style={{ filter: 'brightness(0.8)' }}
                  preload="metadata"
                  crossOrigin="anonymous"
                  poster={slide.poster}
                >
                  <source src={slide.video} type="video/mp4" />
                </video>
                <div className="slide-overlay"></div>
              </div>
            ) : (
              <div
                className="slide-image"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                {slide.image && (
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    width={1200}
                    height={400}
                    style={{ objectFit: 'cover', width: '100%', height: '400px' }}
                    priority
                  />
                )}
                <div className="slide-overlay"></div>
              </div>
            )}
            <div className="slide-content">
              <div className="slide-text">
                {/* <span className="slide-number">0{index + 1}</span> */}
                <h1 className="slide-title">{slide.title}</h1>
                <h2 className="slide-subtitle">{slide.subtitle}</h2>
                <p className="slide-description">{slide.description}</p>
                <div className="slide-actions">
                  <Link href={getLocalizedPath("/menu")} className="btn-primary">
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
                  <Link href={getLocalizedPath("/reservation")} className="btn-secondary">
                    <span>{t('home.hero.reserveTable')}</span>
                  </Link>
                </div>
              </div>
            </div>
          </article>
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
    </section>
  );
};

export default HeroSlider;