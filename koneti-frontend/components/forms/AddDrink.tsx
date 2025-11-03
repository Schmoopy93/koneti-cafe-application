"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import Cropper from "react-easy-crop";
import toast, { Toaster } from "react-hot-toast";
import getCroppedImg from "../utils/getCroppedImg";
import { Drink } from "@/app/types/drink";
import { Category } from "@/app/types/category";
import { apiRequest } from "@/utils/api";
import "./AddDrink.scss";

interface AddDrinkProps {
  onClose: () => void;
  onSuccess?: (drink: Drink) => void;
  editData?: Drink;
}

export default function AddDrink({
  onClose,
  onSuccess,
  editData,
}: AddDrinkProps) {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<
    Omit<Drink, "image"> & {
      description?: string;
      image?: string | File | null;
    }
  >({
    _id: "",
    name: "",
    price: 0,
    categoryId: "",
    description: "",
    image: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakeFields, setShakeFields] = useState<Record<string, boolean>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 🔹 Učitaj kategorije i ako je edit - popuni formu
  useEffect(() => {
    apiRequest("/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);

    if (editData) {
      setFormData({
        ...editData,
        categoryId: editData.category?._id || editData.categoryId || "",
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
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
      toast.success("Crop je sačuvan!");
    } catch (err) {
      console.error(err);
      toast.error("Greška prilikom cropovanja slike");
    }
  };

  // 🔹 Validacija
  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Naziv je obavezan";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Cena mora biti validan broj";
    if (!formData.categoryId) newErrors.categoryId = "Kategorija je obavezna";
    if (!editData && !formData.image) newErrors.image = "Slika je obavezna";
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
      toast.error("Proverite greške u formi!");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
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
        toast.success(editData ? "Piće ažurirano!" : "Piće dodato!");
        onSuccess?.(data);
        onClose();
      } else {
        toast.error("Greška prilikom slanja podataka");
      }
    } catch (err) {
      console.error(err);
      toast.error("Greška na serveru");
    }
  };

  return (
    <div className="add-drink-form">
      <Toaster position="top-right" />
      <h2>{editData ? "Uredi piće" : "Dodaj novo piće"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Naziv */}
        <div className="form-group">
          <label>Naziv:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={shakeFields.name ? "shake" : ""}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        {/* Cena */}
        <div className="form-group">
          <label>Cena:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={shakeFields.price ? "shake" : ""}
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>

        {/* Kategorija */}
        <div className="form-group">
          <label>Kategorija:</label>
          <select
            name="categoryId"
            value={String(formData.categoryId)}
            onChange={handleChange}
            className={shakeFields.categoryId ? "shake" : ""}
          >
            <option value="">Izaberi kategoriju</option>
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
            <span className="error">{errors.categoryId}</span>
          )}
        </div>

        {/* Slika */}
        <div className="form-group">
          <label>Slika:</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            ref={fileInputRef}
            className={shakeFields.image ? "shake" : ""}
          />
          {errors.image && <span className="error">{errors.image}</span>}

          {imagePreview && !showCropper && (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          )}
        </div>

        {/* Cropper */}
        {showCropper && (
          <div className="cropper-container">
            <div className="cropper-wrapper">
              <Cropper
                image={imagePreview || ""}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="cropper-controls">
              <label>Zoom:</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
              <div className="cropper-buttons">
                <button
                  type="button"
                  className="btn-confirm-crop"
                  onClick={saveCroppedImage}
                >
                  Potvrdi crop
                </button>
                <button
                  type="button"
                  className="btn-cancel-crop"
                  onClick={() => {
                    setShowCropper(false);
                    setImagePreview(null);
                    setFormData({ ...formData, image: null });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  Otkaži
                </button>
              </div>
            </div>
          </div>
        )}

        <button type="submit" className="submit-btn">
          {editData ? "Sačuvaj izmene" : "Sačuvaj"}
        </button>
      </form>
    </div>
  );
}
