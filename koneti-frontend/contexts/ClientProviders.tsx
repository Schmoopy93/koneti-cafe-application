"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { AuthProvider } from "./AuthContext";
import Header from "../components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/utils/CookieConsent";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import OfflineNotice from "@/components/ui/OfflineNotice";
import Spinner from "../components/ui/Spinner";

export default function ClientProviders({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set the language in i18n when component mounts
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size="lg" text="Loading application..." />
      </div>
    );
  }

  // Initialize i18n with the correct language before rendering
  if (typeof window !== 'undefined' && i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary>
        <AuthProvider>
          <OfflineNotice />
          <Header />
          <main className="main-content">
            {children}
          </main>
          <Footer/>
          <CookieConsent />
        </AuthProvider>
      </ErrorBoundary>
    </I18nextProvider>
  );
}