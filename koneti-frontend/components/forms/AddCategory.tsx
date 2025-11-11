"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee, faMugHot, faBeer, faWineGlassAlt, faWineBottle,
  faGlassWhiskey, faCocktail, faGlassMartiniAlt, faGlassCheers,
  faChampagneGlasses, faGlassWater, faBottleDroplet, faBlender,
  faJugDetergent, faIceCream, faLemon,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";

import toast, { Toaster } from "react-hot-toast";
import { apiRequest } from "@/utils/api";
import Spinner from "../ui/Spinner";
import "./AddCategory.scss";

// ✅ Tipovi
interface AddCategoryProps {
  onClose?: () => void;
  onSuccess?: (data: any) => void;
}

interface CategoryPayload {
  name: Record<string, string>;
  icon: string;
  description: Record<string, string>;
}

interface IconOption {
  name: string;
  icon: IconDefinition;
  label: {
    sr: string;
    en: string;
  };
}

interface FormData {
  name: string;
  icon: string;
}

interface Errors {
  name?: string;
  icon?: string;
}

interface ShakeFields {
  name?: boolean;
  icon?: boolean;
}

const iconOptions: IconOption[] = [
  { name: "faCoffee", icon: faCoffee, label: { sr: "Kafa", en: "Coffee" } },
  { name: "faMugHot", icon: faMugHot, label: { sr: "Topli napici", en: "Hot drinks" } },
  { name: "faBeer", icon: faBeer, label: { sr: "Pivo", en: "Beer" } },
  { name: "faWineGlassAlt", icon: faWineGlassAlt, label: { sr: "Vino", en: "Wine" } },
  { name: "faWineBottle", icon: faWineBottle, label: { sr: "Vinska boca", en: "Wine bottle" } },
  { name: "faGlassWhiskey", icon: faGlassWhiskey, label: { sr: "Viski", en: "Whiskey" } },
  { name: "faCocktail", icon: faCocktail, label: { sr: "Koktel", en: "Cocktail" } },
  { name: "faGlassMartiniAlt", icon: faGlassMartiniAlt, label: { sr: "Martini", en: "Martini" } },
  { name: "faGlassCheers", icon: faGlassCheers, label: { sr: "Šampanjac", en: "Champagne" } },
  { name: "faChampagneGlasses", icon: faChampagneGlasses, label: { sr: "Proslava", en: "Celebration" } },
  { name: "faGlassWater", icon: faGlassWater, label: { sr: "Voda", en: "Water" } },
  { name: "faBottleDroplet", icon: faBottleDroplet, label: { sr: "Sok / flaširano", en: "Juice / bottled" } },
  { name: "faBlender", icon: faBlender, label: { sr: "Smoothie", en: "Smoothie" } },
  { name: "faIceCream", icon: faIceCream, label: { sr: "Milkšejk / desert", en: "Milkshake / dessert" } },
  { name: "faLemon", icon: faLemon, label: { sr: "Limunada", en: "Lemonade" } },
];

export default function AddCategory({ onClose, onSuccess }: AddCategoryProps) {
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState<FormData>({ name: "", icon: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [shakeFields, setShakeFields] = useState<ShakeFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof Errors]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleIconSelect = (iconName: string) => {
    setFormData({ ...formData, icon: iconName });
    if (errors.icon) setErrors({ ...errors, icon: "" });
  };

  const validate = (): Errors => {
    const newErrors: Errors = {};
    if (!formData.name.trim()) newErrors.name = t("admin.addCategory.errors.name");
    if (!formData.icon) newErrors.icon = t("admin.addCategory.errors.icon");
    return newErrors;
  };

  const triggerShake = (fields: string[]) => {
    const shakeObj: ShakeFields = {};
    fields.forEach((f) => (shakeObj[f as keyof ShakeFields] = true));
    setShakeFields(shakeObj);
    setTimeout(() => setShakeFields({}), 500);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      triggerShake(Object.keys(validationErrors));
      toast.error(t("admin.addCategory.errors.checkFormErrors"));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CategoryPayload = {
        name: { sr: formData.name },
        icon: formData.icon,
        description: { sr: "" },
      };

      const res = await apiRequest("/categories", {
        method: "POST",
        body: JSON.stringify(payload),
        useToken: true
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(t("admin.addCategory.errors.categoryAdded"));
        setFormData({ name: "", icon: "" });
        setErrors({});
        setShakeFields({});
        if (onSuccess) onSuccess(data);
      } else {
        const err = await res.json();
        toast.error(err.message || t("admin.addCategory.errors.saveError"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("admin.addCategory.errors.serverError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-category-form">
      <Toaster position="top-right" reverseOrder={false} />
      <h3>{t("admin.addCategory.title")}</h3>

      <form onSubmit={handleSubmit}>
        {/* Naziv kategorije */}
        <div className="form-group">
          <label>{t("admin.addCategory.name")}:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={shakeFields.name ? "shake" : ""}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        {/* Izbor ikone */}
        <div className="form-group">
          <label>{t("admin.addCategory.icon")}:</label>
          <div className={`icon-picker ${shakeFields.icon ? "shake" : ""}`}>
            {iconOptions.map((option) => {
              const lang = i18n.language?.startsWith("en") ? "en" : "sr";
              const labelText = option.label?.[lang] || option.label?.sr || "";
              return (
                <div key={option.name} className="icon-wrap">
                  <button
                    type="button"
                    aria-label={labelText}
                    className={`icon-btn ${formData.icon === option.name ? "selected" : ""}`}
                    onClick={() => handleIconSelect(option.name)}
                  >
                    <FontAwesomeIcon icon={option.icon} />
                  </button>
                  <div className="icon-tooltip koneti-tooltip">{labelText}</div>
                </div>
              );
            })}
          </div>
          {errors.icon && <span className="error">{errors.icon}</span>}
        </div>

        <button type="submit" className="gradient-btn" disabled={isSubmitting}>
          {isSubmitting ? (
            <Spinner size="sm" text={t("admin.addCategory.saving")} />
          ) : (
            t("admin.addCategory.save")
          )}
        </button>
      </form>
    </div>
  );
}
