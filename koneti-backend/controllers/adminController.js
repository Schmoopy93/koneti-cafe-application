import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";
import Category from "../models/Category.js";
import Drink from "../models/Drink.js";
import Reservation from "../models/Reservation.js";
import crypto from "crypto";
import { sendAdminActivationEmail } from "../utils/nodemailer.js";

// Create a new admin user
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, masterKey } = req.body;

    // Proveri master key za kreiranje prvog admin-a
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      // Prvi admin - zahteva master key
      if (!masterKey || masterKey !== process.env.MASTER_ADMIN_KEY) {
        logger.warn(`Neautorizovan pokušaj kreiranja prvog admin-a sa IP: ${req.ip}`);
        return res.status(403).json({ 
          success: false,
          message: "Neautorizovan pristup" 
        });
      }
    } else {
      // Ostali admin-i - zahtevaju autentifikaciju
      if (!req.admin) {
        return res.status(401).json({ 
          success: false,
          message: "Potrebna je autentifikacija" 
        });
      }
    }

    // Ograniči na 2 admin-a
    if (adminCount >= 2) {
      logger.warn(`Pokušaj kreiranja viška admin-a. Trenutno: ${adminCount}`);
      return res.status(403).json({ 
        success: false,
        message: "Maksimalno 2 admin korisnika dozvoljeno" 
      });
    }

    // Proveri da li admin već postoji
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      logger.warn(`Pokušaj kreiranja postojećeg admin-a: ${email}`);
      return res.status(400).json({ 
        success: false,
        message: "Korisnik sa ovom email adresom već postoji" 
      });
    }

    // Kreiraj admin-a
    const activationToken = crypto.randomBytes(32).toString("hex");
    const newAdmin = new Admin({ 
      name: name.trim(), 
      email: email.toLowerCase(), 
      password, 
      role: "admin",
      isActive: false,
      activationToken,
    });
    await newAdmin.save();

    // Pošalji email
    const activationLink = `${process.env.SERVER_URL}/api/admin/activate/${activationToken}`;
    await sendAdminActivationEmail(newAdmin, activationLink);

    logger.info(`Novi admin kreiran: ${email}`);
    return res.status(201).json({ 
      success: true,
      message: "Admin uspešno kreiran. Aktivacioni link je poslat na email.", 
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email
      }
    });
  } catch (err) {
    logger.error('Greška pri kreiranju admin-a:', err);
    return res.status(500).json({ 
      success: false,
      message: "Greška servera" 
    });
  }
};

// Admin login - authenticates and sets httpOnly cookie
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Pronađi admin-a (case insensitive)
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    if (!admin) {
      logger.warn(`Neuspešan pokušaj prijave: ${email}`);
      return res.status(401).json({ 
        success: false,
        message: "Neispravna email adresa ili lozinka" 
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      logger.warn(`Neispravna lozinka za: ${email}`);
      return res.status(401).json({ 
        success: false,
        message: "Neispravna email adresa ili lozinka" 
      });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "8h" }
    );

    // Bezbedni cookie za produkciju
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: "/",
      maxAge: 8 * 60 * 60 * 1000, // 8 sati
    });

    logger.info(`Uspešna prijava: ${email}`);
    return res.json({ 
      success: true,
      message: "Uspešna prijava",
      token: token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    logger.error('Greška pri prijavi:', err);
    return res.status(500).json({ 
      success: false,
      message: "Greška servera" 
    });
  }
};

// Get all admin users
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    return res.json(admins);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get current authenticated admin info
export const getMe = async (req, res) => {
  res.json({ admin: req.admin });
};

// Proveri validnost tokena
export const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ 
        success: false,
        valid: false, 
        message: "Token nije dostavljen" 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");
    
    if (!admin) {
      logger.warn(`Pokušaj pristupa sa nevalidnim token-om: ${decoded.id}`);
      return res.status(401).json({ 
        success: false,
        valid: false, 
        message: "Neautorizovan" 
      });
    }
    
    res.json({ 
      success: true,
      valid: true, 
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    logger.warn('Nevalidan token pokušaj:', err.message);
    res.status(401).json({ 
      success: false,
      valid: false, 
      message: "Token nije validan" 
    });
  }
};

// Logout - clears the authentication cookie
export const logout = (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: "/"
  });
  logger.info(`Admin se odjavio: ${req.admin?.email || 'nepoznat'}`);
  res.json({ 
    success: true,
    message: "Uspešno ste se odjavili" 
  });
};

// Delete admin by ID
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    await Admin.findByIdAndDelete(id);

    return res.json({ message: "Admin deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Učitaj sve podatke za admin dashboard - jedan zahtjev umjesto 3
export const getDashboardData = async (req, res) => {
  try {
    const [reservations, drinks, categories] = await Promise.all([
      Reservation.find().sort({ createdAt: -1 }),
      Drink.find(),
      Category.find()
    ]);

    return res.json({
      success: true,
      reservations,
      drinks,
      categories
    });
  } catch (err) {
    logger.error('Greška pri učitavanju dashboard podataka:', err);
    return res.status(500).json({
      success: false,
      message: "Greška pri učitavanju podataka"
    });
  }
};

// Activate admin account
export const activateAdmin = async (req, res) => {
  const { token } = req.params;
  const admin = await Admin.findOne({ activationToken: token });
  if (!admin) return res.status(400).json({ message: "Nevažeći token" });

  admin.isActive = true;
  admin.activationToken = undefined;
  await admin.save();

  res.json({ message: "Nalog je uspešno aktiviran!" });
};
