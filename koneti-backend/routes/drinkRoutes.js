import express from "express";
import {
  createDrink,
  getDrinks,
  getDrinkById,
  updateDrink,
  deleteDrink,
} from "../controllers/drinkController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Create a new drink with image upload
router.post("/", upload.single("image"), createDrink);

// Update drink by ID with optional image upload
router.put("/:id", upload.single("image"), updateDrink);

// Get all drinks
router.get("/", getDrinks);

// Get drink by ID
router.get("/:id", getDrinkById);

// Delete drink by ID
router.delete("/:id", deleteDrink);

export default router;
