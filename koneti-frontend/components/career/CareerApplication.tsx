"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faTrash,
  faUser,
  faEnvelope,
  faPhone,
  faFileAlt,
  faPaperPlane,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { apiRequest } from "@/utils/api";
import toast from "react-hot-toast";
import Spinner from "../ui/Spinner";
import "./CareerApplication.scss";

interface JobPosition {
  _id: string;
  title: {
    sr: string;
    en?: string;
  };
}

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  coverLetter: string;
  cv?: File;
}

interface CareerApplicationProps {
  onSubmit?: (data: ApplicationData) => Promise<void>;
}

const CareerApplication: React.FC<CareerApplicationProps> = ({ onSubmit }) => {
  const { t, i18n } = useTranslation();
  const [availablePositions, setAvailablePositions] = useState<JobPosition[]>(
    []
  );

  const [formData, setFormData] = useState<ApplicationData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    coverLetter: "",
  });

  const [errors, setErrors] = useState<Partial<ApplicationData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    fetchPositions();
    return () => clearTimeout(timer);
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await apiRequest("/positions");
      if (response.ok) {
        const data = await response.json();
        setAvailablePositions(data);
      }
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ApplicationData> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = t("career.errors.firstName");
    if (!formData.lastName.trim())
      newErrors.lastName = t("career.errors.lastName");
    if (!formData.email.trim()) {
      newErrors.email = t("career.errors.email");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("career.errors.emailInvalid");
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t("career.errors.phone");
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = t("career.errors.phoneInvalid");
    }
    if (!formData.position.trim())
      newErrors.position = t("career.errors.position");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ApplicationData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(t("career.upload.fileTooLarge"));
        return;
      }
      if (
        ![
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type)
      ) {
        alert(t("career.upload.invalidFormat"));
        return;
      }
      setCvFile(file);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const applicationData: ApplicationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        coverLetter: formData.coverLetter,
        cv: cvFile || undefined,
      };

      if (onSubmit) {
        await onSubmit(applicationData);
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append("firstName", applicationData.firstName);
        formDataToSend.append("lastName", applicationData.lastName);
        formDataToSend.append("email", applicationData.email);
        formDataToSend.append("phone", applicationData.phone);
        formDataToSend.append("position", applicationData.position);
        formDataToSend.append("coverLetter", applicationData.coverLetter);

        if (applicationData.cv) {
          formDataToSend.append("cv", applicationData.cv);
        }

        const response = await apiRequest("/career", {
          method: "POST",
          body: formDataToSend,
          useToken: false,
          requireCSRF: true,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || t("career.errors.submitErrorGeneral")
          );
        }
      }

      toast.success(t("career.success.toast"));

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        coverLetter: "",
      });
      setCvFile(null);
      setErrors({});

      // Show success popup
      setShowPopup(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("career.errors.submitError");
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="career-application-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="career-application-container">
        <div className={`page-header ${isLoaded ? "loaded" : ""}`}>
          <div className="header-content">
            <h1 className="career-title">
              <FontAwesomeIcon icon={faBriefcase} className="title-icon" />
              {(() => {
                const text = t("career.joinTeam");
                const parts = text.split("Koneti");
                return (
                  <>
                    <span className="dark-text">{parts[0]}</span>
                    <span className="light-text">Koneti{parts[1]}</span>
                  </>
                );
              })()}
            </h1>
            <div className="intro-text">
              <p className="team-description">
                <span className="highlight">{t("career.teamDescription")}</span>
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`application-form ${isLoaded ? "loaded" : ""}`}
        >
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faBriefcase} />
              {t("career.form.position")}
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className={errors.position ? "error" : ""}
            >
              <option value="">{t("career.form.selectPosition")}</option>
              {availablePositions.map((pos) => (
                <option key={pos._id} value={pos.title.sr}>
                  {i18n.language === "en" && pos.title.en
                    ? pos.title.en
                    : pos.title.sr}
                </option>
              ))}
            </select>
            {errors.position && (
              <span className="error-text">{errors.position}</span>
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faUser} />
                {t("career.form.firstName")}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? "error" : ""}
                placeholder={t("career.placeholders.firstName")}
              />
              {errors.firstName && (
                <span className="error-text">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faUser} />
                {t("career.form.lastName")}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? "error" : ""}
                placeholder={t("career.placeholders.lastName")}
              />
              {errors.lastName && (
                <span className="error-text">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faEnvelope} />
                {t("career.form.email")}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "error" : ""}
                placeholder={t("career.placeholders.email")}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faPhone} />
                {t("career.form.phone")}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? "error" : ""}
                placeholder={t("career.placeholders.phone")}
              />
              {errors.phone && (
                <span className="error-text">{errors.phone}</span>
              )}
            </div>
          </div>

        <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faFileAlt} />
              {t("career.form.coverLetter")}
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              className={errors.coverLetter ? "error" : ""}
              placeholder={t("career.placeholders.coverLetter")}
              rows={6}
            />
            {errors.coverLetter && (
              <span className="error-text">{errors.coverLetter}</span>
            )}
          </div>

          <div className="form-group cv-upload">
            <label>
              <FontAwesomeIcon icon={faUpload} />
              {t("career.form.cv")}
            </label>
            <div className="upload-area">
              {!cvFile ? (
                <label className="upload-label">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    hidden
                  />
                  <FontAwesomeIcon icon={faUpload} />
                  <span>{t("career.upload.clickToUpload")}</span>
                  <small>{t("career.upload.fileFormats")}</small>
                </label>
              ) : (
                <div className="file-preview">
                  <FontAwesomeIcon icon={faFileAlt} />
                  <span>{cvFile.name}</span>
                  <button type="button" onClick={() => setCvFile(null)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner size="sm" text={t("career.form.submitting")} />
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  {t("career.form.submit")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {showPopup && (
        <div
          className="career-popup-backdrop"
          onClick={() => setShowPopup(false)}
        >
          <div className="career-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowPopup(false)}>
              ×
            </button>
            <h2>{t("career.success.title")}</h2>
            <p>{t("career.success.description")}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CareerApplication;
