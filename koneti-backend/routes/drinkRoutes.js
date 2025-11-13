import express from "express";
import {
  createDrink,
  getDrinks,
  getDrinkById,
  updateDrink,
  deleteDrink,
} from "../controllers/drinkController.js";
import { imageUpload } from "../middleware/imageUpload.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";
import { generalLimiter } from "../middleware/security.js";

const router = express.Router();

// Get all drinks (public - za meni)
router.get("/", getDrinks);

// Get drink by ID (public - za meni)
router.get("/:id", getDrinkById);

// Create a new drink with image upload (admin only)
router.post("/", protectAdmin, generalLimiter, imageUpload.single("image"), createDrink);

// Update drink by ID with optional image upload (admin only)
router.put("/:id", protectAdmin, generalLimiter, imageUpload.single("image"), updateDrink);

// Delete drink by ID (admin only)
router.delete("/:id", protectAdmin, generalLimiter, deleteDrink);

export default router;
