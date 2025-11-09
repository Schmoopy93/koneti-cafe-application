import express from "express";
import { createAdmin, loginAdmin, getAdmins, deleteAdmin, verifyToken, getDashboardData } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";
import Admin from "../models/Admin.js";
import { csrfProtection, getCSRFToken } from "../middleware/csrfProtection.js";

import { validateAdminCreate, validateAdminLogin, validateObjectId } from "../middleware/inputValidation.js";
import { authLimiter, adminLimiter } from "../middleware/security.js";

const router = express.Router();

// Get CSRF token
router.get("/csrf-token", getCSRFToken);

// Get dashboard data - sve (rezervacije, pića, kategorije) u jedan zahtjev
router.get("/dashboard", protectAdmin, getDashboardData);

// Get current logged-in admin information
router.get("/me", protectAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

// Logout - clear the authentication cookie
router.post("/logout", csrfProtection, (req, res) => {
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/'
  });
  res.json({ message: "Logged out successfully" });
});

// Create a new admin user (samo jedan dozvoljeno)
router.post("/create", adminLimiter, csrfProtection, validateAdminCreate, createAdmin);

// Admin login - sets authentication cookie
router.post("/login", authLimiter, validateAdminLogin, loginAdmin);

// Verify token validity
router.post("/verify-token", authLimiter, verifyToken);

// Get all admin users (protected route)
router.get("/", protectAdmin, adminLimiter, getAdmins);

// Delete admin by ID (protected route)
router.delete("/:id", protectAdmin, adminLimiter, validateObjectId, csrfProtection, deleteAdmin);

export default router;
