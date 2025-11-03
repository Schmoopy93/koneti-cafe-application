"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { AuthProvider } from "./AuthContext";
import Header from "../components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <Header />
        <main className="main-content">
          {children}
        </main>
        <Footer/>
      </AuthProvider>
    </I18nextProvider>
  );
}