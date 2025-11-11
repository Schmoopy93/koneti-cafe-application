/**
 * Career Routes - Rute za prijave za posao
 * Career Routes - Job applications routes
 */
import express from "express";
import { upload } from "../middleware/upload.js";
import {
  createCareerApplication,
  getCareerApplications,
  updateCareerApplicationStatus,
  deleteCareerApplication,
  downloadCV
} from "../controllers/careerController.js";
import { authMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Javne rute
router.post("/", upload.single("cv"), createCareerApplication);

// Admin rute
router.get("/", authMiddleware, getCareerApplications);
router.patch("/:id/status", authMiddleware, updateCareerApplicationStatus);
router.delete("/:id", authMiddleware, deleteCareerApplication);
router.get("/:id/download-cv", authMiddleware, downloadCV);

export default router;
