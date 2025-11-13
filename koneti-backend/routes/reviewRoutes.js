import express from "express";
import { getApprovedReviews, testGoogleReviews, clearGoogleReviewsCache } from "../controllers/reviewController.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";
import { csrfProtection } from "../middleware/csrfProtection.js";
import { generalLimiter } from "../middleware/security.js";

const router = express.Router();

// Public routes
router.get("/approved", generalLimiter, getApprovedReviews);

// Google Reviews admin routes
router.get("/google/test", protectAdmin, testGoogleReviews);
router.post("/google/clear-cache", protectAdmin, csrfProtection, clearGoogleReviewsCache);

export default router;
