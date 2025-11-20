"use client";

import {
  useState,
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useEffect,
  useRef,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

// =========================
// TYPES & INTERFACES
// =========================
interface FormData {
  type: string;
  subType: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  endTime: string;
  guests: number;
  message: string;
  duration: number;
}

interface PopupData {
  title?: string;
  description?: string;
  details?: string[];
  price?: string | null;
  extraInfo?: string | null;
}

type FormErrors = Partial<Record<keyof FormData, string>>;
type ShakeFields = Partial<Record<keyof FormData | "type" | "subType", boolean>>;

interface PackageConfig {
  id: string;
  label: string;
  icon: any;
  colorClass: string;
  translationKey: string;
  daysRequired: number;
  minDurationHours?: number;
}

interface TypeConfig {
  id: string;
  label: string;
  icon: any;
  translationKey: string;
}

// =========================
// CONSTANTS & CONFIGURATION
// =========================
const INITIAL_FORM_STATE: FormData = {
  type: "",
  subType: "",
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  endTime: "",
  guests: 0,
  message: "",
  duration: 2,
};

const PACKAGE_CONFIG: Record<string, PackageConfig[]> = {
  business: [
    {
      id: "business_basic",
      label: "basic",
      icon: faMedal,
      colorClass: "silver",
      translationKey: "business_basic",
      daysRequired: 2,
      minDurationHours: 1,
    },
    {
      id: "business_high",
      label: "premium",
      icon: faStar,
      colorClass: "gold",
      translationKey: "business_premium",
      daysRequired: 2,
      minDurationHours: 1,
    },
    {
      id: "business_corporate",
      label: "corporate_day",
      icon: faCrown,
      colorClass: "vip",
      translationKey: "business_corporate",
      daysRequired: 4,
      minDurationHours: 6,
    },
  ],
  experience: [
    {
      id: "experience_start",
      label: "experience_basic",
      icon: faMedal,
      colorClass: "silver",
      translationKey: "experience_basic",
      daysRequired: 2,
    },
    {
      id: "experience_classic",
      label: "experience_premium",
      icon: faStar,
      colorClass: "gold",
      translationKey: "experience_premium",
      daysRequired: 2,
    },
    {
      id: "experience_celebration",
      label: "experience_vip",
      icon: faCrown,
      colorClass: "vip",
      translationKey: "experience_vip",
      daysRequired: 7,
    },
  ],
};

const TYPE_CONFIG: TypeConfig[] = [
  {
    id: "business",
    label: "business",
    icon: faLaptop,
    translationKey: "biznis",
  },
  {
    id: "experience",
    label: "experience",
    icon: faChampagneGlasses,
    translationKey: "koneti",
  },
];

// =========================
// HELPER FUNCTIONS
// =========================
const getPackageBySubType = (subType: string): PackageConfig | undefined => {
  for (const packages of Object.values(PACKAGE_CONFIG)) {
    const found = packages.find((pkg) => pkg.id === subType);
    if (found) return found;
  }
  return undefined;
};

const getTranslationKey = (id: string): string => {
  // For main types
  if (id === "business" || id === "experience") return id;
  
  // For packages
  const pkg = getPackageBySubType(id);
  return pkg?.translationKey || id;
};

const calculateMinDate = (daysRequired: number): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + daysRequired);
  return minDate;
};

const getDateErrorKey = (daysRequired: number): string => {
  const errorKeys: Record<number, string> = {
    2: "dateMinimum2Days",
    4: "dateMinimum4Days",
    7: "dateMinimum7Days",
  };
  return errorKeys[daysRequired] || "date";
};

const calculateDurationMinutes = (startTime: string, endTime: string): number => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return endMinutes - startMinutes;
};

// =========================
// MAIN COMPONENT
// =========================
export default function ReservationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showEventForm, setShowEventForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState<PopupData>({});
  const [shakeFields, setShakeFields] = useState<ShakeFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // =========================
  // EFFECTS
  // =========================
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && (typeParam === "business" || typeParam === "experience")) {
      handleTypeSelect(typeParam);
    }
  }, [searchParams]);

  // =========================
  // HANDLERS
  // =========================
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
      ...INITIAL_FORM_STATE,
      type,
      duration: type === "business" ? 2 : 3,
    });
    setFormErrors({});
    setShowEventForm(false);
    setCurrentStep(2);
  };

  const handleSubTypeSelect = (subType: string) => {
    setFormData((prev) => ({ ...prev, subType, endTime: "" }));
    setFormErrors({});
    setShowEventForm(true);
    setCurrentStep(3);
  };

  const openInfo = (type: string, e: MouseEvent) => {
    e.stopPropagation();
    const key = getTranslationKey(type);
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

    // Required fields validation
    if (!formData.type) errors.type = t("home.reservation.errors.type");
    if (!formData.subType) errors.subType = t("home.reservation.errors.subType");
    if (!formData.name) errors.name = t("home.reservation.errors.name");
    if (!formData.email) errors.email = t("home.reservation.errors.email");
    if (!formData.phone) errors.phone = t("home.reservation.errors.phone");
    if (!formData.time) errors.time = t("home.reservation.errors.time");
    // if (!formData.guests || formData.guests < 1)
    //   errors.guests = t("home.reservation.errors.guests");

    // Date validation with package-specific requirements
    if (!formData.date) {
      errors.date = t("home.reservation.errors.date");
    } else {
      const pkg = getPackageBySubType(formData.subType);
      if (pkg && pkg.daysRequired > 0) {
        const selectedDate = new Date(formData.date);
        const minDate = calculateMinDate(pkg.daysRequired);

        if (selectedDate < minDate) {
          const errorKey = getDateErrorKey(pkg.daysRequired);
          errors.date = t(`home.reservation.errors.${errorKey}`);
        }
      }
    }

    // EndTime validation for business type
    if (formData.type === 'business') {
      if (!formData.endTime) {
        errors.endTime = t("home.reservation.errors.endTime");
      } else if (formData.time) {
        const durationMinutes = calculateDurationMinutes(formData.time, formData.endTime);
        
        if (durationMinutes <= 0) {
          errors.endTime = t("home.reservation.errors.endTimeBeforeStart");
        } else {
          const pkg = getPackageBySubType(formData.subType);
          if (pkg && pkg.minDurationHours) {
            const minMinutes = pkg.minDurationHours * 60;
            if (durationMinutes < minMinutes) {
              errors.endTime = t("home.reservation.errors.minDuration", {
                hours: pkg.minDurationHours
              });
            }
          }
        }
      }
    }

    return errors;
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors({});
    setShowEventForm(false);
    setCurrentStep(1);
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
      // Prepare data - exclude endTime for experience type
      const submitData = formData.type === 'experience' 
        ? { ...formData, endTime: undefined }
        : formData;

      const res = await apiRequest("/reservations", {
        method: "POST",
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Greška pri slanju rezervacije!");
      }

      resetForm();
      toast.success(t("home.reservation.success.toast"));

      setPopupData({
        title: t("home.reservation.success.title"),
        description: t("home.reservation.success.description"),
      });
      setShowPopup(true);

      formRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error: any) {
      toast.error(error.message || t("home.reservation.errors.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  // =========================
  // RENDER HELPERS
  // =========================
  const renderTypeCard = ({ id, label, icon, translationKey }: TypeConfig) => (
    <div
      key={id}
      className={`reservation-form-type-card ${
        formData.type === id ? "reservation-form-selected" : ""
      } ${shakeFields.type ? "reservation-form-shake" : ""}`}
      onClick={() => handleTypeSelect(id)}
    >
      <div className="reservation-form-card-header">
        <FontAwesomeIcon icon={icon} className="reservation-form-type-icon" />
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="reservation-form-info-icon"
          data-tooltip-id="reservation-tooltip"
          data-tooltip-content={t("home.reservation.tooltip")}
          data-tooltip-hidden={showPopup}
          onClick={(e) => openInfo(id, e)}
        />
      </div>
      <div className="reservation-form-card-content">
        <h3 className="reservation-form-card-title">
          {t(`home.reservation.types.${label}`)}
        </h3>
        <p className="reservation-form-card-description">
          {t(`home.reservation.descriptions.${translationKey}`)}
        </p>
      </div>
    </div>
  );

  const renderPackageCard = ({
    id,
    label,
    icon,
    colorClass,
    translationKey,
  }: PackageConfig) => (
    <div
      key={id}
      className={`reservation-form-subtype-card ${
        formData.subType === id ? "reservation-form-selected" : ""
      } ${shakeFields.subType ? "reservation-form-shake" : ""} reservation-form-${colorClass}`}
      onClick={() => handleSubTypeSelect(id)}
    >
      <div className="reservation-form-card-header">
        <FontAwesomeIcon
          icon={icon}
          className={`reservation-form-type-icon reservation-form-${colorClass}`}
        />
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="reservation-form-info-icon"
          data-tooltip-id="reservation-tooltip"
          data-tooltip-content={t("home.reservation.tooltip")}
          data-tooltip-hidden={showPopup}
          onClick={(e) => openInfo(id, e)}
        />
      </div>
      <div className="reservation-form-card-content">
        <h3 className="reservation-form-card-title">
          {t(`home.reservation.packages.${label}`)}
        </h3>
        <p className="reservation-form-card-description">
          {t(`home.reservation.packageDescriptions.${translationKey}`)}
        </p>
        <div className="reservation-form-card-price">
          {t(`home.reservation.packagePrices.${translationKey}`)}
        </div>
      </div>
    </div>
  );

  const renderFormField = (field: string) => {
    const fieldConfig: Record<string, { type: string; min?: number }> = {
      email: { type: "email" },
      phone: { type: "tel" },
      date: { type: "date" },
      time: { type: "time" },
      endTime: { type: "time" },
      guests: { type: "number", min: 1 },
      name: { type: "text" },
    };

    const config = fieldConfig[field] || { type: "text" };

    return (
      <div key={field}>
        <input
          name={field}
          type={config.type}
          min={config.min}
          value={
            field === "guests"
              ? formData.guests === 0
                ? ""
                : formData.guests
              : (formData as any)[field]
          }
          onChange={handleChange}
          placeholder={t(`home.reservation.form.${field}`)}
          className={
            shakeFields[field as keyof ShakeFields]
              ? "reservation-form-shake"
              : ""
          }
        />
        {formErrors[field as keyof FormErrors] && (
          <span className="reservation-form-error">
            {formErrors[field as keyof FormErrors]}
          </span>
        )}
      </div>
    );
  };

  const renderStepIndicator = (step: number) => {
    const stepLabels = ["type", "package", "details"];
    return (
      <div
        key={step}
        className={`reservation-form-indicator ${
          currentStep === step ? "reservation-form-active" : ""
        } ${step < currentStep ? "reservation-form-clickable" : ""}`}
        onClick={() => handleStepClick(step)}
      >
        <span className="reservation-form-step-number">{step}</span>
        <span className="reservation-form-step-label">
          {t(`home.reservation.steps.${stepLabels[step - 1]}`)}
        </span>
      </div>
    );
  };

  // Determine which fields to show based on type
  const getFormFields = () => {
    const baseFields = ["name", "email", "phone", "date"];
    
    if (formData.type === 'business') {
      return [...baseFields, "time", "endTime", "guests"];
    } else {
      return [...baseFields, "time", "guests"];
    }
  };

  // =========================
  // RENDER
  // =========================
  const sliderTransform = `translateX(-${(currentStep - 1) * 33.333}%)`;

  return (
    <div className="reservation-form-wrapper" ref={formRef}>
      <Toaster position="top-right" reverseOrder={false} />

      <form className="reservation-form" onSubmit={handleSubmit}>
        {/* Intro Text */}
        <div className="reservation-form-intro-text">
          <p>
            <span className="reservation-form-highlight">
              {t("home.reservation.intro1_highlight")}
            </span>
            {t("home.reservation.intro1_rest")}
          </p>
          <p>
            {t("home.reservation.intro2")}
            <span className="reservation-form-highlight">
              {t("home.reservation.intro2_highlight")}
            </span>
          </p>
        </div>

        {/* Step Indicators */}
        <div className="reservation-form-step-slider">
          <div className="reservation-form-slider-indicators">
            {[1, 2, 3].map(renderStepIndicator)}
          </div>
        </div>

        {/* Slider Container */}
        <div className="reservation-form-slider-container">
          <div
            className="reservation-form-slider-content"
            style={{ transform: sliderTransform }}
          >
            {/* Step 1: Type Selection */}
            <div className="reservation-form-slide">
              <label className="reservation-form-section-label">
                {t("home.reservation.typeLabel")}
              </label>
              <div className="reservation-form-type-grid">
                {TYPE_CONFIG.map(renderTypeCard)}
              </div>
              {formErrors.type && (
                <span className="reservation-form-error">{formErrors.type}</span>
              )}
            </div>

            {/* Step 2: Package Selection */}
            <div className="reservation-form-slide">
              <label className="reservation-form-section-label">
                {t("home.reservation.packageLabel")}
              </label>
              {formData.type && (
                <div
                  className={
                    PACKAGE_CONFIG[formData.type].length === 3
                      ? "reservation-form-type-grid-three"
                      : "reservation-form-type-grid-two"
                  }
                >
                  {PACKAGE_CONFIG[formData.type].map(renderPackageCard)}
                </div>
              )}
              {formErrors.subType && (
                <span className="reservation-form-error">
                  {formErrors.subType}
                </span>
              )}
            </div>

            {/* Step 3: Details Form */}
            <div className="reservation-form-slide">
              <label className="reservation-form-section-label">
                {t("home.reservation.steps.details")}
              </label>
              {showEventForm && (
                <div className="reservation-form-event-form">
                  {getFormFields().map(renderFormField)}
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("home.reservation.form.message")}
                    className={
                      shakeFields.message ? "reservation-form-shake" : ""
                    }
                  />
                  {formErrors.message && (
                    <span className="reservation-form-error">
                      {formErrors.message}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        {formData.subType && (
          <button
            type="submit"
            className="reservation-form-btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner size="sm" text={t("home.reservation.submitting")} />
            ) : (
              t("home.reservation.submit")
            )}
          </button>
        )}
      </form>

      {/* Popup Modal */}
      {showPopup && (
        <div className="reservation-popup-backdrop" onClick={closePopup}>
          <div className="reservation-popup" onClick={(e) => e.stopPropagation()}>
            <button className="reservation-form-close-btn" onClick={closePopup}>
              ×
            </button>
            <h2>{popupData.title}</h2>
            {popupData.description &&
              popupData.description
                .split("\n\n")
                .map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {popupData.details && (
              <ul>
                {popupData.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
            {popupData.price && (
              <p className="reservation-form-price">{popupData.price}</p>
            )}
            {popupData.extraInfo && <p>{popupData.extraInfo}</p>}
          </div>
        </div>
      )}

      {/* Single Tooltip for all info icons */}
      <Tooltip id="reservation-tooltip" place="top" offset={15} />
    </div>
  );
}