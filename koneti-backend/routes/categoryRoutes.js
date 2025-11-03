import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Get all product categories
router.get("/", getCategories);

// Create a new category
router.post("/", createCategory);

// Update existing category by ID
router.put("/:id", updateCategory);

// Delete category by ID
router.delete("/:id", deleteCategory);

export default router;
