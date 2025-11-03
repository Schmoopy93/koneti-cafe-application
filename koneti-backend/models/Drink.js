// models/Drink.js
import mongoose from "mongoose";

const drinkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String, // URL slike sa Cloudinary
      default: "",
    },
    cloudinary_id: {
      type: String, // Cloudinary public_id za brisanje ili transformacije
      default: "",
    },
  },
  { timestamps: true }
);

// Indexi za performanse
drinkSchema.index({ category: 1, name: 1 });
drinkSchema.index({ name: 'text' }); // Za text search

const Drink = mongoose.model("Drink", drinkSchema);

export default Drink;