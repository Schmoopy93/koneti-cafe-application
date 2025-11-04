/**
 * Position Routes - Rute za pozicije
 * Position Routes - Job positions routes
 */
import express from "express";
import { getPositions, createPosition } from "../controllers/positionController.js";
import { authMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getPositions);
router.post("/", authMiddleware, createPosition);

export default router;