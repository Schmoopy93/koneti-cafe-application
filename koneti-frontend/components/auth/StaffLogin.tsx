"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import "./StaffLogin.scss";

interface FormData {
  email: string;
  password: string;
}

const StaffLogin: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !authLoading && isAuthenticated) {
      router.replace("/admin");
    }
  }, [mounted, authLoading, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(formData.email, formData.password);
      if (!success) {
        setError("Neuspešna prijava. Proverite email i lozinku.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Došlo je do greške";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || authLoading) {
    return (
      <div className="staff-login-section">
        <div className="staff-container">
          <div className="loading">Učitavanje...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-login-section">
      <div className="staff-header">
        <h2 className="section-title">{t("staffLogin.title")}</h2>
        <p className="section-subtitle">{t("staffLogin.subtitle")}</p>
      </div>

      <div className="staff-container">
        <form className="staff-form" onSubmit={handleSubmit}>
          {error && <p className="error" role="alert">{error}</p>}

          <div className="form-group">
            <label htmlFor="email">{t("staffLogin.emailLabel")}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("staffLogin.emailPlaceholder")}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t("staffLogin.passwordLabel")}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("staffLogin.passwordPlaceholder")}
              required
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className={`btn-submit ${loading ? "submitting" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <div className="loading-content">
                  <img
                    src="/koneti-logo.png"
                    alt="Koneti Logo"
                    className="logo-bounce"
                  />
                  <span>{t("staffLogin.loggingIn")}</span>
                </div>
              ) : (
                t("staffLogin.loginButton")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
