// d:\Projekti\koneti-cafe-application\koneti-backend\models\Gallery.js

import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      sr: { type: String, required: true, trim: true },
      en: { type: String, trim: true },
    },
    description: {
      sr: { type: String, default: "" },
      en: { type: String, default: "" },
    },
    image: {
      type: String, // URL slike sa Cloudinary
      required: true,
    },
    cloudinary_id: {
      type: String, // Cloudinary public_id za brisanje ili transformacije
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    showOnAbout: {
      type: Boolean,
      default: false, // Po default-u slike nisu prikazane na About stranici
    },
  },
  { timestamps: true }
);

// Indexi za performanse
gallerySchema.index({ order: 1 });
gallerySchema.index({ "title.sr": 1 });
gallerySchema.index({ "title.en": 1 });
gallerySchema.index({ showOnAbout: 1 }); // Index za brže filtriranje

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;