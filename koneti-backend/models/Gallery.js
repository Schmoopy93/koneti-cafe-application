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
  },
  { timestamps: true }
);

// Indexi za performanse
gallerySchema.index({ order: 1 });
gallerySchema.index({ "title.sr": 1 });
gallerySchema.index({ "title.en": 1 });

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
