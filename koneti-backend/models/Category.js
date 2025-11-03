import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      sr: { type: String, required: true, trim: true },
      en: { type: String, trim: true },
    },
    icon: {
      type: String,
      required: true,
    },
    description: {
      sr: { type: String, default: "" },
      en: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// Indexi za performanse
categorySchema.index({ "name.sr": 1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;
