"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import Cropper from "react-easy-crop";
import toast, { Toaster } from "react-hot-toast";
import getCroppedImg from "../utils/getCroppedImg";
import type { Drink } from "@/app/[lang]/types/drink";
import type { Category } from "@/app/[lang]/types/category";
import { apiRequest } from "@/utils/api";
import Spinner from "../ui/Spinner";
import "./AddDrink.scss";

interface AddDrinkProps {
  onClose: () => void;
  onSuccess?: (drink: Drink) => void;
  editData?: Drink;
}

const AddDrink: React.FC<AddDrinkProps> = ({
  onClose,
  onSuccess,
  editData,
}) => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<{
    _id: string;
    name: { sr: string; en: string };
    price: string;
    categoryId: string;
    description?: string;
    image?: string | File | null;
  }>({
    _id: "",
    name: { sr: "", en: "" },
    price: "",
    categoryId: "",
    description: "",
    image: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakeFields, setShakeFields] = useState<Record<string, boolean>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(4 / 3);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiRequest("/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Greška pri učitavanju kategorija:", error);
      }
    };
    
    fetchCategories();

    if (editData) {
      const name = typeof editData.name === "object" ? editData.name.sr || editData.name.en || "" : editData.name;
      setFormData({
        _id: editData._id,
        name: { sr: name, en: "" },
        price: String(editData.price),
        categoryId: editData.category?._id || editData.categoryId || "",
        description: editData.description || "",
        image: null,
      });

      if (editData.image || editData.imageUrl) {
        setImagePreview(editData.image || editData.imageUrl || null);
      }
    }
  }, [editData]);

  // 🔹 Promene u inputima
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setFormData({ ...formData, name: { sr: value, en: "" } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // 🔹 Učitavanje slike
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, image: file });
      setImagePreview(url);
      setShowCropper(true);
      if (errors.image) setErrors({ ...errors, image: "" });
    }
  };

  // 🔹 Crop funkcionalnost
  const onCropComplete = (_: any, croppedPixels: any) =>
    setCroppedAreaPixels(croppedPixels);

  const saveCroppedImage = async () => {
    try {
      if (!imagePreview || !croppedAreaPixels || !formData.image) return;

      const croppedBlob = await getCroppedImg(imagePreview, croppedAreaPixels);
      const croppedFile = new File(
        [croppedBlob],
        (formData.image as File).name,
        {
          type: "image/jpeg",
        }
      );

      setFormData({ ...formData, image: croppedFile });
      setImagePreview(URL.createObjectURL(croppedFile));
      setShowCropper(false);
      toast.success("Slika uspešno obrađena!");
    } catch (err) {
      console.error("Image processing error:", err);
      toast.error("Greška pri obradi slike");
    }
  };

  // 🔹 Validacija
  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.sr.trim()) newErrors.name = t("admin.addDrink.errors.name");
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = t("admin.addDrink.errors.priceInvalid");
    if (!formData.categoryId) newErrors.categoryId = t("admin.addDrink.errors.category");
    if (!editData && !formData.image) newErrors.image = t("admin.addDrink.errors.image");
    return newErrors;
  };

  const triggerShake = (fields: string[]) => {
    const shakeObj: Record<string, boolean> = {};
    fields.forEach((f) => (shakeObj[f] = true));
    setShakeFields(shakeObj);
    setTimeout(() => setShakeFields({}), 500);
  };

  // 🔹 Submit forma
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      triggerShake(Object.keys(validationErrors));
      toast.error(t("admin.addDrink.errors.checkFormErrors"));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("name", JSON.stringify(formData.name));
      payload.append("price", String(formData.price));
      payload.append("category", String(formData.categoryId));
      if (formData.image instanceof File)
        payload.append("image", formData.image);

      const endpoint = editData
        ? `/drinks/${editData._id}`
        : `/drinks`;
      const method = editData ? "PUT" : "POST";

      const res = await apiRequest(endpoint, {
        method,
        body: payload,
        useToken: true
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(editData ? t("admin.addDrink.errors.drinkUpdated") : t("admin.addDrink.errors.drinkAdded"));
        onSuccess?.(data);
        onClose();
      } else {
        toast.error(t("admin.addDrink.errors.saveError"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("admin.addDrink.errors.serverError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-drink__form">
      <Toaster position="top-right" />
      <h2>{editData ? t("admin.addDrink.editTitle") : t("admin.addDrink.title")}</h2>

      <form onSubmit={handleSubmit}>
        {/* Naziv */}
        <div className="add-drink__group">
          <label>{t("admin.addDrink.name")}:</label>
          <input
            type="text"
            name="name"
            value={formData.name.sr}
            onChange={handleChange}
            placeholder={t("admin.addDrink.namePlaceholder")}
            className={shakeFields.name ? "add-drink__shake" : ""}
          />
          {errors.name && <span className="add-drink__error">{errors.name}</span>}
        </div>

        {/* Cena */}
        <div className="add-drink__group">
          <label>{t("admin.addDrink.price")}:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder={t("admin.addDrink.pricePlaceholder")}
            className={shakeFields.price ? "add-drink__shake" : ""}
          />
          {errors.price && <span className="add-drink__error">{errors.price}</span>}
        </div>

        {/* Kategorija */}
        <div className="add-drink__group">
          <label>{t("admin.addDrink.category")}:</label>
          <select
            name="categoryId"
            value={String(formData.categoryId)}
            onChange={handleChange}
            className={shakeFields.categoryId ? "add-drink__shake" : ""}
          >
            <option value="">{t("admin.addDrink.category")}</option>
            {categories.map((cat) => {
              const name =
                typeof cat.name === "object"
                  ? cat.name[i18n.language] ??
                    cat.name.sr ??
                    Object.values(cat.name)[0]
                  : cat.name;
              return (
                <option key={cat._id} value={cat._id}>
                  {name}
                </option>
              );
            })}
          </select>
          {errors.categoryId && (
            <span className="add-drink__error">{errors.categoryId}</span>
          )}
        </div>

        {/* Slika */}
        <div className="add-drink__group">
          <label>{t("admin.addDrink.image")}:</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            ref={fileInputRef}
            className={shakeFields.image ? "add-drink__shake" : ""}
          />
          {errors.image && <span className="add-drink__error">{errors.image}</span>}
          {imagePreview && !showCropper && (
            <img src={imagePreview} alt="Preview" className="add-drink__preview" />
          )}
        </div>

        {/* Cropper */}
        {showCropper && (
          <div className="add-drink__cropper-container">
            <div className="add-drink__cropper-wrapper">
              <Cropper
                image={imagePreview || ""}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="add-drink__cropper-controls">
              <div className="add-drink__aspect-ratio-selector">
                <label>{t("admin.addDrink.aspectRatio")}:</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(Number(e.target.value))}
                >
                  <option value={undefined}>{t("admin.addDrink.free")}</option>
                  <option value={1}>1:1 ({t("admin.addDrink.square")})</option>
                  <option value={4/3}>4:3 ({t("admin.addDrink.standard")})</option>
                  <option value={16/9}>16:9 ({t("admin.addDrink.wide")})</option>
                  <option value={3/4}>3:4 ({t("admin.addDrink.portrait")})</option>
                  <option value={2/3}>2:3 ({t("admin.addDrink.vertical")})</option>
                  <option value={5/4}>5:4 ({t("admin.addDrink.horizontal")})</option>
                  <option value={9/16}>9:16 ({t("admin.addDrink.vertical")})</option>
                  <option value={3/2}>3:2 ({t("admin.addDrink.horizontal")})</option>
                  <option value={4/5}>4:5 ({t("admin.addDrink.vertical")})</option>
                </select>
              </div>

              <div className="add-drink__zoom-control">
                <label>Zoom:</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
              </div>

              <div className="add-drink__cropper-buttons">
                <button
                  type="button"
                  className="add-drink__btn-confirm-crop"
                  onClick={saveCroppedImage}
                >
                  {t("admin.addDrink.confirmCrop")}
                </button>
                <button
                  type="button"
                  className="add-drink__btn-cancel-crop"
                  onClick={() => {
                    setShowCropper(false);
                    setImagePreview(null);
                    setFormData({ ...formData, image: null });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  {t("admin.addDrink.cancelCrop")}
                </button>
              </div>
            </div>
          </div>
        )}

        <button type="submit" className="add-drink__submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Spinner size="sm" text={editData ? t("admin.addDrink.savingChanges") : t("admin.addDrink.saving")} />
          ) : (
            editData ? t("admin.addDrink.saveChanges") : t("admin.addDrink.save")
          )}
        </button>
      </form>
    </div>
  );
};

export default AddDrink;
