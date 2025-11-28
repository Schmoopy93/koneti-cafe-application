"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faMartiniGlass,
  faCalendarCheck,
  faUserShield,
  faBusinessTime,
  faImage
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import Image from "next/image";
import { useScrollLock } from "@/hooks/useScrollLock";
import "./Header.scss";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Extract current language from pathname
  const currentLang = pathname?.startsWith('/sr') ? 'sr' : pathname?.startsWith('/en') ? 'en' : 'sr';

  // Helper function to switch language in URL
  const switchLanguage = (newLang: string) => {
    const currentPath = pathname || '/';
    let newPath = currentPath;

    // Remove current language prefix
    if (currentPath.startsWith('/sr')) {
      newPath = currentPath.substring(3) || '/';
    } else if (currentPath.startsWith('/en')) {
      newPath = currentPath.substring(3) || '/';
    }

    // Add new language prefix
    newPath = `/${newLang}${newPath}`;

    router.push(newPath);
    setIsLangDropdownOpen(false);
    setIsOpen(false);
  };

  // Helper function to get localized path
  const getLocalizedPath = (path: string) => {
    return `/${currentLang}${path}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isLangDropdownOpen &&
        !target.closest(".language-dropdown") &&
        !target.closest(".mobile-language-switcher")
      ) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLangDropdownOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("body--no-scroll");
    } else {
      document.body.classList.remove("body--no-scroll");
    }
    // Clean up on unmount
    return () => {
      document.body.classList.remove("body--no-scroll");
    };
  }, [isOpen]);

  useScrollLock(isOpen);

  if (!mounted) {
    return (
      <header className="navbar" role="banner" aria-label={t("header.main") || "Glavna navigacija"}>
        <div className="nav-container">
          <Link 
            href="/" 
            className="logo"
            title={t("header.home") || "Početna"}
            aria-label="Koneti Café - Početna stranica"
          >
            <Image
              src="/koneti-logo-header.png"
              alt="Café Koneti Logo - Specialty Kafa i Proslave u Novom Sadu"
              width={150}
              height={50}
              priority
              className="logo-img"
            />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="navbar" role="banner" aria-label="Glavna navigacija">
      <div className="nav-container">
        {/* Logo vodi na login ako nije autentifikovan, / ako jeste */}
        <Link
          href={isAuthenticated ? getLocalizedPath("/") : getLocalizedPath("/login")}
          className="logo"
          title="Koneti Café - Početna stranica"
          aria-label="Koneti Café - Početna stranica"
        >
          <Image 
            src="/koneti-logo-header.png" 
            alt="Café Koneti Logo - Specialty Kafa i Proslave u Novom Sadu"
            width={150}
            height={50}
            priority
            className="logo-img"
          />
        </Link>

        <nav className={`nav-links ${isOpen ? "open" : ""}`} role="navigation" aria-label="Glavna navigacija">
          {isOpen && (
            <button className="mobile-close-btn" onClick={() => setIsOpen(false)} aria-label="Zatvori navigaciju">
              <X size={24} aria-hidden="true" />
            </button>
          )}
          <Link
            href={getLocalizedPath("/")}
            onClick={() => setIsOpen(false)}
            title={t("header.home")}
            aria-label={t("header.home")}
            style={{ '--delay': 1 } as React.CSSProperties}
          >
            <FontAwesomeIcon icon={faHouse} aria-hidden="true" /> {t("header.home")}
          </Link>
          <Link
            href={getLocalizedPath("/menu")}
            onClick={() => setIsOpen(false)}
            title={t("header.menu")}
            aria-label={t("header.menu")}
            style={{ '--delay': 2 } as React.CSSProperties}
          >
            <FontAwesomeIcon icon={faMartiniGlass} aria-hidden="true" /> {t("header.menu")}
          </Link>

          {!isAuthenticated && (
            <>
              <Link
                href={getLocalizedPath("/reservation")}
                onClick={() => setIsOpen(false)}
                title={t("header.reservation")}
                aria-label={t("header.reservation")}
                style={{ '--delay': 3 } as React.CSSProperties}
              >
                <FontAwesomeIcon icon={faCalendarCheck} aria-hidden="true" />{" "}
                {t("header.reservation")}
              </Link>
              <Link
                href={getLocalizedPath("/about")}
                onClick={() => setIsOpen(false)}
                title={t("header.about")}
                aria-label={t("header.about")}
                style={{ '--delay': 4 } as React.CSSProperties}
              >
                <FontAwesomeIcon icon={faImage} aria-hidden="true" />{" "}
                {t("header.about")}
              </Link>
              <Link
                href={getLocalizedPath("/career")}
                onClick={() => setIsOpen(false)}
                title={t("header.career")}
                aria-label={t("header.career")}
                style={{ '--delay': 5 } as React.CSSProperties}
              >
                <FontAwesomeIcon icon={faBusinessTime} aria-hidden="true" />{" "}
                {t("header.career")}
              </Link>
            </>
          )}

          {isAuthenticated && (
            <Link
              href={getLocalizedPath("/admin")}
              onClick={() => setIsOpen(false)}
              title={t("header.admin")}
              aria-label={t("header.admin")}
              style={{ '--delay': 3 } as React.CSSProperties}
            >
              <FontAwesomeIcon icon={faUserShield} aria-hidden="true" />  {t("header.admin")}
            </Link>
          )}

          {/* Mobile language switcher */}
          <div className="mobile-language-switcher">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="language-switcher-mobile"
              aria-label={`Promeni jezik - ${currentLang === "sr" ? "Srpski" : "Engleski"}`}
              aria-expanded={isLangDropdownOpen}
              aria-controls="mobile-lang-dropdown"
              type="button"
            >
              {currentLang === "sr" ? (
                <>
                  <ReactCountryFlag
                    countryCode="RS"
                    svg
                    style={{ width: 16, height: 12 }}
                    aria-hidden="true"
                  />
                  SR
                </>
              ) : (
                <>
                  <ReactCountryFlag
                    countryCode="GB"
                    svg
                    style={{ width: 16, height: 12 }}
                    aria-hidden="true"
                  />
                  EN
                </>
              )}
              <ChevronDown
                size={14}
                className={`language-dropdown-toggle ${
                  isLangDropdownOpen ? "open" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {isLangDropdownOpen && (
              <div className="language-dropdown-menu-mobile" id="mobile-lang-dropdown" role="menu">
                {currentLang === "sr" ? (
                  <button
                    onClick={() => switchLanguage("en")}
                    role="menuitem"
                    aria-label="Engleski"
                    type="button"
                  >
                    <ReactCountryFlag
                      countryCode="GB"
                      svg
                      style={{ width: 16, height: 12 }}
                      aria-hidden="true"
                    />{" "}
                    EN
                  </button>
                ) : (
                  <button
                    onClick={() => switchLanguage("sr")}
                    role="menuitem"
                    aria-label="Srpski"
                    type="button"
                  >
                    <ReactCountryFlag
                      countryCode="RS"
                      svg
                      style={{ width: 16, height: 12 }}
                      aria-hidden="true"
                    />{" "}
                    SR
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Desktop language dropdown */}
        <div className="header-right">
          <div className="language-dropdown">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="language-switcher"
              aria-label={`Promeni jezik - ${currentLang === "sr" ? "Srpski" : "Engleski"}`}
              aria-expanded={isLangDropdownOpen}
              aria-controls="desktop-lang-dropdown"
              type="button"
            >
              {currentLang === "sr" ? (
                <>
                  <ReactCountryFlag
                    countryCode="RS"
                    svg
                    style={{ width: 16, height: 12, marginRight: 6 }}
                    aria-hidden="true"
                  />
                  SR
                </>
              ) : (
                <>
                  <ReactCountryFlag
                    countryCode="GB"
                    svg
                    style={{ width: 16, height: 12, marginRight: 6 }}
                    aria-hidden="true"
                  />
                  EN
                </>
              )}
              <ChevronDown size={14} aria-hidden="true" />
            </button>

            {isLangDropdownOpen && (
              <div className="language-dropdown-menu" id="desktop-lang-dropdown" role="menu">
                {currentLang === "sr" ? (
                  <button
                    className="language-option"
                    onClick={() => switchLanguage("en")}
                    role="menuitem"
                    aria-label="Engleski"
                    type="button"
                  >
                    <ReactCountryFlag
                      countryCode="GB"
                      svg
                      style={{ width: 16, height: 12, marginRight: 6 }}
                      aria-hidden="true"
                    />{" "}
                    EN
                  </button>
                ) : (
                  <button
                    className="language-option"
                    onClick={() => switchLanguage("sr")}
                    role="menuitem"
                    aria-label="Srpski"
                    type="button"
                  >
                    <ReactCountryFlag
                      countryCode="RS"
                      svg
                      style={{ width: 16, height: 12, marginRight: 6 }}
                      aria-hidden="true"
                    />{" "}
                    SR
                  </button>
                )}
              </div>
            )}
          </div>

          <button 
            className="menu-toggle" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Zatvori meni" : "Otvori meni"}
            aria-expanded={isOpen}
            aria-controls="nav-menu"
            type="button"
          >
            {isOpen ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
