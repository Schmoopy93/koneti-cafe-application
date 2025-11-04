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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  const types = [
    {
      id: "biznis",
      label: t("home.reservation.types.business"),
      icon: faLaptop,
    },
    {
      id: "koneti",
      label: t("home.reservation.types.experience"),
      icon: faChampagneGlasses,
    },
  ];

  const subCategories: Record<
    string,
    { id: string; label: string; icon: any; colorClass: string }[]
  > = {
    biznis: [
      {
        id: "basic",
        label: t("home.reservation.packages.basic"),
        icon: faMedal,
        colorClass: "silver",
      },
      {
        id: "premium",
        label: t("home.reservation.packages.premium"),
        icon: faStar,
        colorClass: "gold",
      },
    ],
    koneti: [
      {
        id: "basic",
        label: t("home.reservation.packages.basic"),
        icon: faMedal,
        colorClass: "silver",
      },
      {
        id: "premium",
        label: t("home.reservation.packages.premium"),
        icon: faStar,
        colorClass: "gold",
      },
      {
        id: "vip",
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
  };

  const handleSubTypeSelect = (subType: string) => {
    setFormData((prev) => ({ ...prev, subType }));
    setFormErrors({});
    setShowEventForm(true);
    setTimeout(() => {
      document
        .querySelector(".event-form")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const openInfo = (type: string, e: MouseEvent) => {
    e.stopPropagation();
    const typeToKey: Record<string, string> = {
      biznis: "business",
      koneti: "experience",
      basic: "basic",
      premium: "premium",
      vip: "vip",
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
      console.log('[DEBUG] Sending reservation request:', formData);
      const res = await apiRequest('/reservations', {
        method: "POST",
        body: JSON.stringify(formData),
        useToken: false
      });
      
      console.log('[DEBUG] Reservation response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('[DEBUG] Reservation error:', errorData);
        throw new Error(errorData.message || t("home.reservation.errors.submitError"));
      }

      // Handle 204 No Content ili prazan response
      let responseData = null;
      if (res.status !== 204) {
        try {
          responseData = await res.json();
        } catch (e) {
          console.warn('[DEBUG] No JSON response body, treating as success');
        }
      }
      console.log('[DEBUG] Reservation success:', responseData);
      
      // Reset forme
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
      
      // Prikaži success toast
      toast.success(t("home.reservation.success.toast"));
      
      // Prikaži popup
      setPopupData({
        title: t("home.reservation.success.title"),
        description: t("home.reservation.success.description"),
      });
      setShowPopup(true);
      
      setTimeout(() => router.push("/"), 5000);
    } catch (error: any) {
      console.error('Greška pri slanju rezervacije:', error);
      toast.error(error.message || t("home.reservation.errors.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reservation-wrapper">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="section-title animated-title">
        {t("home.reservation.title1")}{" "}
        <span className="highlight">{t("home.reservation.title2")}</span>
        <span className="title-emoji">✨</span>
      </h2>

      <form className="reservation-form" onSubmit={handleSubmit}>
        <div className="intro-text">
          <p>{t("home.reservation.intro")}</p>
        </div>

        <label>{t("home.reservation.typeLabel")}</label>
        <div className="type-grid">
          {types.map(({ id, label, icon }) => (
            <div
              key={id}
              className={`type-card ${formData.type === id ? "selected" : ""} ${
                shakeFields.type ? "shake" : ""
              }`}
              onClick={() => handleTypeSelect(id)}
            >
              <FontAwesomeIcon icon={icon} className="type-icon" />
              {label}
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="info-icon"
                data-tooltip-id={`tooltip-${id}`}
                data-tooltip-content={t("home.reservation.tooltip")}
                onClick={(e) => openInfo(id, e)}
              />
            </div>
          ))}
        </div>
        {formErrors.type && <span className="error">{formErrors.type}</span>}

        {formData.type && (
          <>
            <label>{t("home.reservation.packageLabel")}</label>
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
                    } ${shakeFields.subType ? "shake" : ""}`}
                    onClick={() => handleSubTypeSelect(id)}
                  >
                    <FontAwesomeIcon
                      icon={icon}
                      className={`type-icon ${colorClass}`}
                    />
                    {label}
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                      data-tooltip-id={`tooltip-${id}`}
                      data-tooltip-content={t("home.reservation.tooltip")}
                      onClick={(e) => openInfo(id, e)}
                    />
                  </div>
                )
              )}
            </div>
            {formErrors.subType && (
              <span className="error">{formErrors.subType}</span>
            )}
          </>
        )}

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

      <Tooltip id="tooltip-biznis" />
      <Tooltip id="tooltip-koneti" />
      <Tooltip id="tooltip-basic" />
      <Tooltip id="tooltip-premium" />
      <Tooltip id="tooltip-vip" />

      {showPopup && (
        <div className="popup-backdrop" onClick={closePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePopup}>
              ×
            </button>
            <h2>{popupData.title}</h2>
            <p>{popupData.description}</p>
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
