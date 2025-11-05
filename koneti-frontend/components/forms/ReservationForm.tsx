"use client";

import { useState, ChangeEvent, FormEvent, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faLaptop,
  faChampagneGlasses,
  faMedal,
  faStar,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { apiRequest } from "@/utils/api";
import Spinner from "../ui/Spinner";
import "./ReservationForm.scss";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import toast, { Toaster } from "react-hot-toast";

interface FormData {
  type: string;
  subType: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message: string;
}

interface PopupData {
  title?: string;
  description?: string;
  details?: string[];
  price?: string | null;
  extraInfo?: string | null;
}

type FormErrors = Partial<Record<keyof FormData, string>>;
type ShakeFields = Partial<
  Record<keyof FormData | "type" | "subType", boolean>
>;

export default function ReservationForm() {
  const router = useRouter();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<FormData>({
    type: "",
    subType: "",
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
    message: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showEventForm, setShowEventForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState<PopupData>({});
  const [shakeFields, setShakeFields] = useState<ShakeFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const types = [
    {
      id: "business",
      label: t("home.reservation.types.business"),
      icon: faLaptop,
    },
    {
      id: "experience",
      label: t("home.reservation.types.experience"),
      icon: faChampagneGlasses,
    },
  ];

  const subCategories: Record<
    string,
    { id: string; label: string; icon: any; colorClass: string }[]
  > = {
    business: [
      {
        id: "business_basic",
        label: t("home.reservation.packages.basic"),
        icon: faMedal,
        colorClass: "silver",
      },
      {
        id: "business_high",
        label: t("home.reservation.packages.premium"),
        icon: faStar,
        colorClass: "gold",
      },
    ],
    experience: [
      {
        id: "experience_start",
        label: t("home.reservation.packages.basic"),
        icon: faMedal,
        colorClass: "silver",
      },
      {
        id: "experience_classic",
        label: t("home.reservation.packages.premium"),
        icon: faStar,
        colorClass: "gold",
      },
      {
        id: "experience_celebration",
        label: t("home.reservation.packages.vip"),
        icon: faCrown,
        colorClass: "vip",
      },
    ],
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const triggerShake = (fields: string[]) => {
    const shakeObj: ShakeFields = {};
    fields.forEach((f) => (shakeObj[f as keyof ShakeFields] = true));
    setShakeFields(shakeObj);
    setTimeout(() => setShakeFields({}), 500);
  };

  const handleTypeSelect = (type: string) => {
    setFormData({
      type,
      subType: "",
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: 1,
      message: "",
    });
    setFormErrors({});
    setShowEventForm(false);
    setCurrentStep(2);
  };

  const handleSubTypeSelect = (subType: string) => {
    setFormData((prev) => ({ ...prev, subType }));
    setFormErrors({});
    setShowEventForm(true);
    setCurrentStep(3);
  };

  const openInfo = (type: string, e: MouseEvent) => {
    e.stopPropagation();
    const typeToKey: Record<string, string> = {
      business: "business",
      experience: "experience",
      business_basic: "basic",
      business_high: "premium",
      experience_start: "basic",
      experience_classic: "premium",
      experience_celebration: "vip",
    };
    const key = typeToKey[type] || type;
    const data: PopupData = {
      title: t(`home.reservation.popups.${key}.title`),
      description: t(`home.reservation.popups.${key}.description`),
      details: t(`home.reservation.popups.${key}.details`, {
        returnObjects: true,
      }) as string[],
      price: t(`home.reservation.popups.${key}.price`),
      extraInfo: t(`home.reservation.popups.${key}.extraInfo`),
    };
    setPopupData(data);
    setShowPopup(true);
  };

  const closePopup = () => setShowPopup(false);

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    if (!formData.type) errors.type = t("home.reservation.errors.type");
    if (!formData.subType)
      errors.subType = t("home.reservation.errors.subType");
    if (!formData.name) errors.name = t("home.reservation.errors.name");
    if (!formData.email) errors.email = t("home.reservation.errors.email");
    if (!formData.phone) errors.phone = t("home.reservation.errors.phone");
    if (!formData.date) {
      errors.date = t("home.reservation.errors.date");
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const minDate = new Date(today);
      minDate.setDate(today.getDate() + 2);
      
      if (selectedDate < minDate) {
        errors.date = t("home.reservation.errors.dateMinimum");
      }
    }
    if (!formData.time) errors.time = t("home.reservation.errors.time");
    if (!formData.guests || formData.guests < 1)
      errors.guests = t("home.reservation.errors.guests");
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      triggerShake(Object.keys(errors));
      toast.error(t("home.reservation.errors.fillRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiRequest('/reservations', {
        method: "POST",
        body: JSON.stringify(formData),
        useToken: false
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || t("home.reservation.errors.submitError"));
      }

      setFormData({
        type: "",
        subType: "",
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: 1,
        message: "",
      });
      setFormErrors({});
      setShowEventForm(false);
      setCurrentStep(1);
      
      toast.success(t("home.reservation.success.toast"));
      
      setPopupData({
        title: t("home.reservation.success.title"),
        description: t("home.reservation.success.description"),
      });
      setShowPopup(true);
      
      setTimeout(() => router.push("/"), 5000);
    } catch (error: any) {
      toast.error(error.message || t("home.reservation.errors.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reservation-wrapper">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* <h2 className="section-title">
        {t("home.reservation.title1")}{" "}
        <span className="highlight">{t("home.reservation.title2")}</span>
      </h2> */}
        
        <form className="reservation-form" onSubmit={handleSubmit}>
          <div className="intro-text">
            <p><span className="highlight">{t("home.reservation.intro1_highlight")}</span>{t("home.reservation.intro1_rest")}</p>
            <p>{t("home.reservation.intro2")}<span className="highlight">{t("home.reservation.intro2_highlight")}</span></p>
          </div>

        <div className="step-slider">
          <div className="slider-indicators">
            {[1, 2, 3].map((step) => (
              <div 
                key={step}
                className={`indicator ${currentStep === step ? 'active' : ''} ${step < currentStep ? 'clickable' : ''}`}
                onClick={() => step < currentStep && setCurrentStep(step)}
              >
                <span className="step-number">{step}</span>
                <span className="step-label">
                  {t(`home.reservation.steps.${step === 1 ? 'type' : step === 2 ? 'package' : 'details'}`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="slider-container">
          <div 
            className="slider-content"
            style={{transform: `translateX(-${(currentStep - 1) * 33.333}%)`}}
          >
            <div className="slide">
              <label className="section-label">{t("home.reservation.typeLabel")}</label>
              <div className="type-grid">
                {types.map(({ id, label, icon }) => (
                  <div
                    key={id}
                    className={`type-card ${formData.type === id ? "selected" : ""} ${
                      shakeFields.type ? "shake" : ""
                    }`}
                    onClick={() => handleTypeSelect(id)}
                  >
                    <div className="card-header">
                      <FontAwesomeIcon icon={icon} className="type-icon" />
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="info-icon"
                        data-tooltip-id={`tooltip-${id}`}
                        data-tooltip-content={t("home.reservation.tooltip")}
                        onClick={(e) => openInfo(id, e)}
                      />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">{label}</h3>
                      <p className="card-description">{t(`home.reservation.descriptions.${id === 'business' ? 'biznis' : 'koneti'}`)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {formErrors.type && <span className="error">{formErrors.type}</span>}
            </div>

            <div className="slide">
              <label className="section-label">{t("home.reservation.packageLabel")}</label>
              {formData.type && (
                <div
                  className={
                    subCategories[formData.type].length === 3
                      ? "type-grid-three"
                      : "type-grid-two"
                  }
                >
                  {subCategories[formData.type].map(
                    ({ id, label, icon, colorClass }) => (
                      <div
                        key={id}
                        className={`subtype-card ${
                          formData.subType === id ? "selected" : ""
                        } ${shakeFields.subType ? "shake" : ""} ${colorClass}`}
                        onClick={() => handleSubTypeSelect(id)}
                      >
                        <div className="card-header">
                          <FontAwesomeIcon
                            icon={icon}
                            className={`type-icon ${colorClass}`}
                          />
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="info-icon"
                            data-tooltip-id={`tooltip-${id}`}
                            data-tooltip-content={t("home.reservation.tooltip")}
                            onClick={(e) => openInfo(id, e)}
                          />
                        </div>
                        <div className="card-content">
                          <h3 className="card-title">{label}</h3>
                          <p className="card-description">{t(`home.reservation.packageDescriptions.${id.includes('business') ? 'basic' : id.includes('start') ? 'basic' : id.includes('classic') ? 'premium' : 'vip'}`)}</p>
                          <div className="card-price">{t(`home.reservation.packagePrices.${id.includes('business') ? 'basic' : id.includes('start') ? 'basic' : id.includes('classic') ? 'premium' : 'vip'}`)}</div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
              {formErrors.subType && (
                <span className="error">{formErrors.subType}</span>
              )}
            </div>

            <div className="slide">
              <label className="section-label">{t("home.reservation.steps.details")}</label>
              {showEventForm && (
                <div className="event-form">
                  {["name", "email", "phone", "date", "time", "guests"].map(
                    (field) => (
                      <div key={field}>
                        <input
                          name={field}
                          type={
                            field === "email"
                              ? "email"
                              : field === "phone"
                              ? "tel"
                              : field === "date"
                              ? "date"
                              : field === "time"
                              ? "time"
                              : field === "guests"
                              ? "number"
                              : "text"
                          }
                          min={field === "guests" ? 1 : undefined}
                          value={(formData as any)[field]}
                          onChange={handleChange}
                          placeholder={t(`home.reservation.form.${field}`)}
                          className={
                            shakeFields[field as keyof ShakeFields] ? "shake" : ""
                          }
                        />
                        {formErrors[field as keyof FormErrors] && (
                          <span className="error">
                            {formErrors[field as keyof FormErrors]}
                          </span>
                        )}
                      </div>
                    )
                  )}
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("home.reservation.form.message")}
                    className={shakeFields.message ? "shake" : ""}
                  />
                  {formErrors.message && (
                    <span className="error">{formErrors.message}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {formData.subType && (
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Spinner size="sm" text={t("home.reservation.submitting")} />
            ) : (
              t("home.reservation.submit")
            )}
          </button>
        )}
        </form>

      <Tooltip id="tooltip-business" />
      <Tooltip id="tooltip-experience" />
      <Tooltip id="tooltip-business_basic" />
      <Tooltip id="tooltip-business_high" />
      <Tooltip id="tooltip-experience_start" />
      <Tooltip id="tooltip-experience_classic" />
      <Tooltip id="tooltip-experience_celebration" />

      {showPopup && (
        <div className="popup-backdrop" onClick={closePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePopup}>
              ×
            </button>
            <h2 className="popup-title">{popupData.title}</h2>
            {popupData.description && popupData.description.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            {popupData.details && (
              <ul>
                {popupData.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
            {popupData.price && <p className="price">{popupData.price}</p>}
            {popupData.extraInfo && <p>{popupData.extraInfo}</p>}
          </div>
        </div>
      )}
    </div>
  );
}