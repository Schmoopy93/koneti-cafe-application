"use client";

import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPhone } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import "./ContactForm.scss";

interface IFormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

interface IFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const ContactForm: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<IFormData>({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<IFormErrors>({});
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): IFormErrors => {
    const errors: IFormErrors = {};
    if (!formData.fullName) errors.fullName = t("home.contact.form.fullName.error");
    if (!formData.email) {
      errors.email = t("home.contact.form.email.error");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t("home.contact.form.email.invalid");
    }
    if (!formData.phone) errors.phone = t("home.contact.form.phone.error");
    if (!formData.message) errors.message = t("home.contact.form.message.error");
    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFormData({ fullName: "", email: "", phone: "", message: "" });
    setFormErrors({});
    setIsSubmitting(false);

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 4000);
  };

  return (
    <section id="contact-section" className="contact-form-section" ref={sectionRef}>
      <div className="contact-header">
        <h2 className="section-title">💬 {t("home.contact.title")}</h2>
        <p className="section-subtitle">{t("home.contact.subtitle")}</p>
      </div>

      <div className="contact-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">{t("home.contact.form.fullName.label")}</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder={t("home.contact.form.fullName.placeholder")}
              value={formData.fullName}
              onChange={handleChange}
              className={formErrors.fullName ? "input-error" : ""}
            />
            {formErrors.fullName && <span className="error">{formErrors.fullName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">{t("home.contact.form.email.label")}</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder={t("home.contact.form.email.placeholder")}
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? "input-error" : ""}
              />
              {formErrors.email && <span className="error">{formErrors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t("home.contact.form.phone.label")}</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder={t("home.contact.form.phone.placeholder")}
                value={formData.phone}
                onChange={handleChange}
                className={formErrors.phone ? "input-error" : ""}
              />
              {formErrors.phone && <span className="error">{formErrors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">{t("home.contact.form.message.label")}</label>
            <textarea
              id="message"
              name="message"
              placeholder={t("home.contact.form.message.placeholder")}
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={formErrors.message ? "input-error" : ""}
            />
            {formErrors.message && <span className="error">{formErrors.message}</span>}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className={`btn-submit ${isSubmitting ? "submitting" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  {t("home.contact.form.submit.sending")}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  {t("home.contact.form.submit.send")}
                </>
              )}
            </button>

            <div className="contact-options">
              <span className="or-text">{t("home.contact.form.call.or")}</span>
              <a href="tel:+38165637371" className="btn-call">
                <FontAwesomeIcon icon={faPhone} />
                {t("home.contact.form.call.call")}
              </a>
            </div>
          </div>
        </form>
      </div>

      {showPopup && (
        <div className="success-popup">
          <div className="popup-content">
            <div className="success-icon">✅</div>
            <h4>{t("home.contact.form.success.title")}</h4>
            <p>{t("home.contact.form.success.message")}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactForm;
