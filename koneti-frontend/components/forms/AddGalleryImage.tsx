"use client";

import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import { apiRequest } from "@/utils/api";
import Spinner from "../ui/Spinner";
import "./AddGalleryImage.scss";

interface AddGalleryImageProps {
  onClose: () => void;
  onSuccess?: (image: unknown) => void;
  editData?: {
    _id?: string;
    title?: { sr?: string };
    description?: { sr?: string };
    image?: string;
  } | null;
}

const AddGalleryImage: React.FC<AddGalleryImageProps> = ({
  onClose,
  onSuccess,
  editData,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakeFields, setShakeFields] = useState<Record<string, boolean>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title?.sr || "",
        description: editData.description?.sr || "",
        image: null,
      });

      if (editData.image) {
        setImagePreview(editData.image);
      }
    }
  }, [editData]);

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // Handle file change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, image: file });
      setImagePreview(url);
      if (errors.image) setErrors({ ...errors, image: "" });
    }
  };

  // Validation
  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = t("admin.addGalleryImage.errors.titleSr");
    if (!editData && !formData.image) newErrors.image = t("admin.addGalleryImage.errors.image");
    return newErrors;
  };

  const triggerShake = (fields: string[]) => {
    const shakeObj: Record<string, boolean> = {};
    fields.forEach((f) => (shakeObj[f] = true));
    setShakeFields(shakeObj);
    setTimeout(() => setShakeFields({}), 500);
  };

  // Submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      triggerShake(Object.keys(validationErrors));
      toast.error(t("admin.addGalleryImage.errors.checkFormErrors"));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);

      if (formData.image instanceof File)
        payload.append("image", formData.image);

      const endpoint = editData
        ? `/gallery/${editData._id}`
        : `/gallery`;
      const method = editData ? "PUT" : "POST";

      const res = await apiRequest(endpoint, {
        method,
        body: payload,
        useToken: true
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(editData ? t("admin.addGalleryImage.imageUpdated") : t("admin.addGalleryImage.imageAdded"));
        onSuccess?.(data);
        onClose();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || t("admin.addGalleryImage.saveError"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("admin.addGalleryImage.serverError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-gallery-image__form">
      <Toaster position="top-right" />
      <h2>{editData ? t("admin.addGalleryImage.editTitle") : t("admin.addGalleryImage.title")}</h2>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="add-gallery-image__group">
          <label>{t("admin.addGalleryImage.titleSr")}</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={shakeFields.title ? "add-gallery-image__shake" : ""}
            placeholder={t("admin.addGalleryImage.titleSrPlaceholder")}
          />
          {errors.title && <span className="add-gallery-image__error">{errors.title}</span>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label>{t("admin.addGalleryImage.descriptionSr")}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder={t("admin.addGalleryImage.descriptionSrPlaceholder")}
          />
        </div>

        {/* Image */}
        <div className="add-gallery-image__group">
          <label>{t("admin.addGalleryImage.image")}</label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            ref={fileInputRef}
            className={shakeFields.image ? "add-gallery-image__shake" : ""}
          />
          {errors.image && <span className="add-gallery-image__error">{errors.image}</span>}

          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="add-gallery-image__preview" />
          )}
        </div>

        <button type="submit" className="add-gallery-image__submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Spinner size="sm" text={editData ? t("admin.addGalleryImage.savingChanges") : t("admin.addGalleryImage.saving")} />
          ) : (
            editData ? t("admin.addGalleryImage.saveChanges") : t("admin.addGalleryImage.save")
          )}
        </button>
      </form>
    </div>
  );
};

export default AddGalleryImage;
