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
  faBusinessTime
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import "./Header.scss";

const Header: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
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

  if (!mounted) {
    return (
      <header className="navbar">
        <div className="nav-container">
          <Link href="/" className="logo">
            <img
              src="/koneti-logo-header.png"
              alt="Café Koneti"
              className="logo-img"
            />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Logo vodi na /login ako nije autentifikovan, / ako jeste */}
        <Link
          href={mounted && !loading && isAuthenticated ? getLocalizedPath("/") : "/login"}
          className="logo"
        >
          <img
            src="/koneti-logo-header.png"
            alt="Café Koneti"
            className="logo-img"
          />
        </Link>

        <nav className={`nav-links ${isOpen ? "open" : ""}`}>
          {isOpen && (
            <button className="mobile-close-btn" onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          )}
          <Link
            href={getLocalizedPath("/")}
            onClick={() => setIsOpen(false)}
            title={t("header.home")}
            style={{ '--delay': 1 } as React.CSSProperties}
          >
            <FontAwesomeIcon icon={faHouse} /> {t("header.home")}
          </Link>
          <Link
            href={getLocalizedPath("/menu")}
            onClick={() => setIsOpen(false)}
            title={t("header.menu")}
            style={{ '--delay': 2 } as React.CSSProperties}
          >
            <FontAwesomeIcon icon={faMartiniGlass} /> {t("header.menu")}
          </Link>

          {!loading && !isAuthenticated && (
            <Link
              href={getLocalizedPath("/reservation")}
              onClick={() => setIsOpen(false)}
              title={t("header.reservation")}
              style={{ '--delay': 3 } as React.CSSProperties}
            >
              <FontAwesomeIcon icon={faCalendarCheck} />{" "}
              {t("header.reservation")}
            </Link>
          )}

          
          {!loading && !isAuthenticated && (
            <Link
              href={getLocalizedPath("/career")}
              onClick={() => setIsOpen(false)}
              title={t("header.career")}
              style={{ '--delay': 4 } as React.CSSProperties}
            >
              <FontAwesomeIcon icon={faBusinessTime} />{" "}
              {t("header.career")}
            </Link>
          )}

          {!loading && isAuthenticated && (
            <Link
              href={getLocalizedPath("/admin")}
              onClick={() => setIsOpen(false)}
              title={t("header.admin")}
              style={{ '--delay': 3 } as React.CSSProperties}
            >
              <FontAwesomeIcon icon={faUserShield} />  {t("header.admin")}
            </Link>
          )}

          {/* Mobile language switcher */}
          <div className="mobile-language-switcher">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="language-switcher-mobile"
            >
              {currentLang === "sr" ? (
                <>
                  <ReactCountryFlag
                    countryCode="RS"
                    svg
                    style={{ width: 16, height: 12 }}
                  />
                  SR
                </>
              ) : (
                <>
                  <ReactCountryFlag
                    countryCode="GB"
                    svg
                    style={{ width: 16, height: 12 }}
                  />
                  EN
                </>
              )}
              <ChevronDown
                size={14}
                className={`language-dropdown-toggle ${
                  isLangDropdownOpen ? "open" : ""
                }`}
              />
            </button>

            {isLangDropdownOpen && (
              <div className="language-dropdown-menu-mobile">
                {currentLang === "sr" ? (
                  <button
                    onClick={() => switchLanguage("en")}
                  >
                    <ReactCountryFlag
                      countryCode="GB"
                      svg
                      style={{ width: 16, height: 12 }}
                    />{" "}
                    EN
                  </button>
                ) : (
                  <button
                    onClick={() => switchLanguage("sr")}
                  >
                    <ReactCountryFlag
                      countryCode="RS"
                      svg
                      style={{ width: 16, height: 12 }}
                    />{" "}
                    SR
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Desktop language dropdown */}
        {/* Desktop language dropdown */}
        <div className="header-right">
          <div className="language-dropdown">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="language-switcher"
            >
              {currentLang === "sr" ? (
                <>
                  <ReactCountryFlag
                    countryCode="RS"
                    svg
                    style={{ width: 16, height: 12, marginRight: 6 }}
                  />
                  SR
                </>
              ) : (
                <>
                  <ReactCountryFlag
                    countryCode="GB"
                    svg
                    style={{ width: 16, height: 12, marginRight: 6 }}
                  />
                  EN
                </>
              )}
              <ChevronDown size={14} />
            </button>

            {isLangDropdownOpen && (
              <div className="language-dropdown-menu">
                {currentLang === "sr" ? (
                  <button
                    className="language-option"
                    onClick={() => switchLanguage("en")}
                  >
                    <ReactCountryFlag
                      countryCode="GB"
                      svg
                      style={{ width: 16, height: 12, marginRight: 6 }}
                    />{" "}
                    EN
                  </button>
                ) : (
                  <button
                    className="language-option"
                    onClick={() => switchLanguage("sr")}
                  >
                    <ReactCountryFlag
                      countryCode="RS"
                      svg
                      style={{ width: 16, height: 12, marginRight: 6 }}
                    />{" "}
                    SR
                  </button>
                )}
              </div>
            )}
          </div>

          <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
