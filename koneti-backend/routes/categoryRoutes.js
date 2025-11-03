import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";
import { generalLimiter } from "../middleware/security.js";

const router = express.Router();

// Get all product categories (public - za meni)
router.get("/", getCategories);

// Create a new category (admin only)
router.post("/", protectAdmin, generalLimiter, createCategory);

// Update existing category by ID (admin only)
router.put("/:id", protectAdmin, generalLimiter, updateCategory);

// Delete category by ID (admin only)
router.delete("/:id", protectAdmin, generalLimiter, deleteCategory);

export default router;
