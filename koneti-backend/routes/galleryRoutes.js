import express from "express";
import {
  getGalleryImages,
  getGalleryImageById,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  toggleShowOnAbout,
  getAboutPageImages,
} from "../controllers/galleryController.js";
import { imageUpload } from "../middleware/imageUpload.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getGalleryImages);
router.get("/about", getAboutPageImages); // Moved before /:id route
router.get("/:id", getGalleryImageById);

// Protected routes (admin only)
router.post("/", protectAdmin, imageUpload.single("image"), createGalleryImage);
router.put("/:id", protectAdmin, imageUpload.single("image"), updateGalleryImage);
router.delete("/:id", protectAdmin, deleteGalleryImage);
router.patch("/:id/toggle-about", protectAdmin, toggleShowOnAbout);

export default router;
