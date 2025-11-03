import path from "path";
import Drink from "../models/Drink.js";
import Category from "../models/Category.js";
import cloudinary from "../middleware/cloudinary.js";

/* Create a new drink with optional image upload to Cloudinary */
export const createDrink = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    let imageUrl = "";
    let cloudinaryId = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        {
          folder: "drinks",
        }
      );
      imageUrl = result.secure_url;
      cloudinaryId = result.public_id;
    }

    // Validation
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category does not exist." });
    }

    // Save to MongoDB
    const drink = new Drink({
      name,
      price,
      category,
      description,
      image: imageUrl,
      cloudinary_id: cloudinaryId,
    });

    await drink.save();
    res.status(201).json(drink);
  } catch (err) {
    console.error("Error creating drink:", err);
    res.status(500).json({ message: err.message });
  }
};

/* Update drink by ID with optional image upload */
export const getDrinks = async (req, res) => {
  try {
    console.log('Fetching drinks...');
    const drinks = await Drink.find().populate("category", "name");
    console.log('Found drinks:', drinks.length);
    res.json(drinks);
  } catch (err) {
    console.error('Error in getDrinks:', err);
    res.status(500).json({ message: err.message });
  }
};

/* Get drink by ID with populated category */
export const getDrinkById = async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id).populate("category", "name");
    if (!drink) {
      return res.status(404).json({ message: "Drink not found." });
    }
    res.json(drink);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Delete drink by ID */
export const updateDrink = async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);
    if (!drink) {
      return res.status(404).json({ message: "Drink not found." });
    }

    const { name, price, category, description } = req.body;

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Category does not exist." });
      }
      drink.category = category;
    }

    if (name) drink.name = name;
    if (price) drink.price = price;
    if (description) drink.description = description;

    if (req.file) {
      // Remove previous image from Cloudinary if exists
      if (drink.cloudinary_id) {
        try {
          await cloudinary.uploader.destroy(drink.cloudinary_id);
        } catch (e) {
          console.warn("Warning: failed to delete old image from Cloudinary", e?.message || e);
        }
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        { folder: 'drinks' }
      );
      drink.image = result.secure_url;
      drink.cloudinary_id = result.public_id;
    }

    await drink.save();
    res.json(drink);
  } catch (err) {
    console.error("Error updating drink:", err);
    res.status(500).json({ message: err.message });
  }
};

/* Delete drink by ID */
export const deleteDrink = async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);
    if (!drink) {
      return res.status(404).json({ message: "Drink not found." });
    }

    // Delete image from Cloudinary if exists
    if (drink.cloudinary_id) {
      try {
        await cloudinary.uploader.destroy(drink.cloudinary_id);
      } catch (e) {
        console.warn("Warning: failed to delete image from Cloudinary", e?.message || e);
      }
    }

    await Drink.deleteOne({ _id: drink._id });

    res.json({ message: "Drink successfully deleted." });
  } catch (err) {
    console.error("Error deleting drink:", err);
    res.status(500).json({ message: err.message });
  }
};
