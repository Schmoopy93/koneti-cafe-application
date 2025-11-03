import Category from "../models/Category.js";
import translate from "@iamtraction/google-translate";

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ "name.sr": 1 });
    res.status(200).json(categories);
  } catch (err) {
    console.error("❌ getCategories error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { name, icon, description } = req.body;

    if (!name?.sr) {
      return res.status(400).json({ message: "name.sr is required" });
    }

    let nameEn = name?.en;
    let descEn = description?.en;

    if (!nameEn) {
      const translation = await translate(name.sr, { from: "sr", to: "en" });
      nameEn = translation.text;
    }

    if (description?.sr && !descEn) {
      const translation = await translate(description.sr, { from: "sr", to: "en" });
      descEn = translation.text;
    }

    const category = new Category({
      name: { sr: name.sr, en: nameEn },
      icon,
      description: { sr: description?.sr || "", en: descEn || "" }
    });

    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedData = { ...req.body };

    if (name?.sr && !name?.en) {
      const translation = await translate(name.sr, { from: "sr", to: "en" });
      updatedData.name = { sr: name.sr, en: translation.text };
    }

    if (description?.sr && !description?.en) {
      const translation = await translate(description.sr, { from: "sr", to: "en" });
      updatedData.description = { sr: description.sr, en: translation.text };
    }

    const updated = await Category.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
