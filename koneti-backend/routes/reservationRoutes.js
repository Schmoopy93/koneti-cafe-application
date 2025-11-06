import express from "express";
import { createReservation, getReservations, updateReservationStatus, deleteReservation, checkAvailability } from "../controllers/reservationController.js";
import { validateReservation, validateObjectId } from '../middleware/inputValidation.js';

import { reservationLimiter, generalLimiter } from "../middleware/security.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";
import { csrfProtection } from "../middleware/csrfProtection.js";

const router = express.Router();

// Create a new reservation
router.post("/", reservationLimiter, validateReservation, createReservation);

// Check availability for a date
router.get("/check-availability", generalLimiter, checkAvailability);

// Get all reservations (admin only)
router.get("/", protectAdmin, generalLimiter, getReservations);

// Update reservation status by ID (admin only)
router.patch("/:id", protectAdmin, generalLimiter, validateObjectId, updateReservationStatus);

// Delete reservation by ID (admin only)
router.delete("/:id", protectAdmin, generalLimiter, validateObjectId, deleteReservation);

export default router;
