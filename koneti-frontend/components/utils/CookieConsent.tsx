"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./CookieConsent.scss";

const CookieConsent: React.FC = () => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent !== "accepted") {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-content">
        <p>{t("cookieConsent.message")}</p>
        <button onClick={acceptCookies} className="accept-btn">
          {t("cookieConsent.accept")}
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
