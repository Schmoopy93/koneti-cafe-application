"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  hasAcceptedCookies, 
  acceptAllCookies, 
  getCookiePreferences, 
  saveCookiePreferences,
  getDefaultCookiePreferences,
  type CookiePreferences 
} from "@/utils/cookies";
import "./CookieConsent.scss";

const CookieConsent: React.FC = () => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(getDefaultCookiePreferences());

  useEffect(() => {
    if (!hasAcceptedCookies()) {
      setShowBanner(true);
    }
    setPreferences(getCookiePreferences());
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setShowBanner(false);
  };

  const acceptSelectedCookies = () => {
    saveCookiePreferences(preferences);
    setShowBanner(false);
  };

  const handlePreferenceChange = (category: keyof CookiePreferences, value: boolean) => {
    if (category === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({ ...prev, [category]: value }));
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-content">
        <div className="cookie-header">
          <h3>🍪 {t("cookieConsent.title")}</h3>
          <p>{t("cookieConsent.message")}</p>
        </div>
        
        {showDetails && (
          <div className="cookie-details">
            <div className="cookie-category">
              <label>
                <input 
                  type="checkbox" 
                  checked={preferences.necessary} 
                  disabled 
                />
                <span>{t("cookieConsent.categories.necessary")}</span>
                <small>{t("cookieConsent.descriptions.necessary")}</small>
              </label>
            </div>
            
            <div className="cookie-category">
              <label>
                <input 
                  type="checkbox" 
                  checked={preferences.analytics} 
                  onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                />
                <span>{t("cookieConsent.categories.analytics")}</span>
                <small>{t("cookieConsent.descriptions.analytics")}</small>
              </label>
            </div>
            
            <div className="cookie-category">
              <label>
                <input 
                  type="checkbox" 
                  checked={preferences.preferences} 
                  onChange={(e) => handlePreferenceChange('preferences', e.target.checked)}
                />
                <span>{t("cookieConsent.categories.preferences")}</span>
                <small>{t("cookieConsent.descriptions.preferences")}</small>
              </label>
            </div>
          </div>
        )}
        
        <div className="cookie-actions">
          <button onClick={() => setShowDetails(!showDetails)} className="details-btn">
            {showDetails ? t("cookieConsent.hideDetails") : t("cookieConsent.showDetails")}
          </button>
          
          {showDetails && (
            <button onClick={acceptSelectedCookies} className="accept-selected-btn">
              {t("cookieConsent.acceptSelected")}
            </button>
          )}
          
          <button onClick={handleAcceptAll} className="accept-all-btn">
            {t("cookieConsent.acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
