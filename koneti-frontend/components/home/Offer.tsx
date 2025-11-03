"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "./Offer.scss";

// Definicija tipa za svaki objekt usluge
interface Service {
  title: string;
  subtitle: string;
  text: string;
  features: string[];
  icon: string;
  img: string;
  link: string;
  linkText: string;
  color: string;
}

export default function Offer() {
  const { t } = useTranslation();
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Sigurnosna funkcija koja osigurava da su 'features' uvijek polje
  const getFeatures = (key: string): string[] => {
    const features = t(key, { returnObjects: true });
    return Array.isArray(features) ? (features as string[]) : [];
  };

  const services: Service[] = [
    {
      title: t('home.offer.services.coffee.title'),
      subtitle: t('home.offer.services.coffee.subtitle'),
      text: t('home.offer.services.coffee.description'),
      features: getFeatures('home.offer.services.coffee.features'),
      icon: "☕",
      img: "/espresso.jpg", // Putanja relativna na 'public' folder
      link: "/menu",
      linkText: t('home.offer.services.coffee.linkText'),
      color: "#8B4513"
    },
    {
      title: t('home.offer.services.business.title'),
      subtitle: t('home.offer.services.business.subtitle'),
      text: t('home.offer.services.business.description'),
      features: getFeatures('home.offer.services.business.features'),
      icon: "💼",
      img: "/business-meeting.jpg",
      link: "/reservation",
      linkText: t('home.offer.services.business.linkText'),
      color: "#2C3E50"
    },
    {
      title: t('home.offer.services.party.title'),
      subtitle: t('home.offer.services.party.subtitle'),
      text: t('home.offer.services.party.description'),
      features: getFeatures('home.offer.services.party.features'),
      icon: "🎉",
      img: "/party.jpg",
      link: "/reservation",
      linkText: t('home.offer.services.party.linkText'),
      color: "#E74C3C"
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const currentCards = cardsRef.current;
    currentCards.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      currentCards.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <section className="offer">
      <div className="offer-header">
        <h2 className="section-title">
          <span className="title-icon">💎</span>
          {t('home.offer.title')}
        </h2>
        <p className="section-subtitle">
          {t('home.offer.subtitle')}
        </p>
      </div>

      <div className="offer-grid">
        {services.map((service, index) => (
          <div
            key={index}
            className="service-card"
            ref={(el) => { cardsRef.current[index] = el; }}
            style={{
              transitionDelay: `${index * 0.2}s`,
              '--accent-color': service.color
            } as React.CSSProperties}
          >
            <div className="card-header">
              <Image
                src={service.img}
                alt={service.title}
                className="card-image"
                width={400}
                height={250}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            
            <div className="card-content">
              <div className="card-title-section">
                <h3>{service.title}</h3>
                <span className="subtitle">{service.subtitle}</span>
              </div>
              
              <p className="description">{service.text}</p>
              
              <div className="features">
                {service.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">
                    {feature}
                  </span>
                ))}
              </div>
              
              <Link href={service.link} className="btn-card">
                <span>{service.linkText}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}