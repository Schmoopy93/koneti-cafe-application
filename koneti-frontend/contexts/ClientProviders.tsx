"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { AuthProvider } from "./AuthContext";
import Header from "../components/layout/Header";
import Footer from "@/components/layout/Footer";
import Spinner from "../components/ui/Spinner";

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size="lg" text="Loading application..." />
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