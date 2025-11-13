import express from "express";
import {
  getGalleryImages,
  getGalleryImageById,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../controllers/galleryController.js";
import { imageUpload } from "../middleware/imageUpload.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getGalleryImages);
router.get("/:id", getGalleryImageById);

// Protected routes (admin only)
router.post("/", protectAdmin, imageUpload.single("image"), createGalleryImage);
router.put("/:id", protectAdmin, imageUpload.single("image"), updateGalleryImage);
router.delete("/:id", protectAdmin, deleteGalleryImage);

export default router;
