import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler, notFound } from "./middleware/secureErrorHandler.js";
import { securityHeaders } from "./middleware/securityHeaders.js";

import { generalLimiter, authLimiter, adminLimiter } from "./middleware/security.js";
import { sanitizeInput } from "./middleware/inputValidation.js";
import { logger } from "./utils/logger.js";

import reservationRoutes from "./routes/reservationRoutes.js";
import reservationTypesRoutes from "./routes/reservationTypesRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoriesRoutes from "./routes/categoryRoutes.js";
import drinkRoutes from "./routes/drinkRoutes.js";

// === Init ===
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// === Security Middleware ===
app.set("trust proxy", 1);

// PRIVREMENO ISKLJUČENO - Security middleware
// const isDeploy = process.env.RENDER || process.env.VERCEL || process.env.CI;
// if (!isDeploy) {
//   app.use(helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         styleSrc: ["'self'", "'unsafe-inline'"],
//         scriptSrc: ["'self'"],
//         imgSrc: ["'self'", "data:", "https:"],
//       },
//     },
//   }));
//   app.use(securityHeaders);
//   app.use(generalLimiter);
// }
app.use(compression());

// CORS konfiguracija
if (NODE_ENV === 'development') {
  // Development - dozvoli sve
  app.use(cors({
    origin: true,
    credentials: true
  }));
} else {
  // Production - striktna kontrola
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blokiran za origin: ${origin}`);
        callback(new Error('Nije dozvoljeno od strane CORS politike'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token']
  }));
}

app.use(cookieParser());
app.use(express.json({ limit: "5mb" })); // Smanjen limit
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Globalna sanitizacija input-a - PRIVREMENO ISKLJUČENO
// app.use(sanitizeInput);


// === Security logging - PRIVREMENO ISKLJUČENO ===
// if (!isDeploy) {
//   import('./middleware/securityLogger.js').then(({ securityLogger }) => {
//     app.use(securityLogger);
//   }).catch(() => {});
// } else {
//   // U produkciji uvek koristi security logging
//   import('./middleware/securityLogger.js').then(({ securityLogger }) => {
//     app.use(securityLogger);
//   }).catch(() => {});
// }

// === Static Files (bezbedno) ===
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  dotfiles: 'deny',
  index: false,
  setHeaders: (res, path) => {
    // Sprečava izvršavanje skriptova
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
  }
}));
app.use(express.static(path.join(__dirname, "public"), {
  dotfiles: 'deny',
  index: false
}));

// === Routes ===
app.use("/api/reservations", reservationRoutes);
app.use("/api/reservation-types", reservationTypesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/drinks", drinkRoutes);

// === Health check ===
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Koneti backend radi ☕",
    env: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// === Error Handling ===
app.use(notFound);
app.use(errorHandler);

// === MongoDB ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// === Start ===
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});

// Graceful shutdown za Render
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});
