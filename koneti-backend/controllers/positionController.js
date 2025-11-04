/**
 * Position Controller - Kontroler za pozicije
 * Position Controller - Job positions controller
 */
import Position from "../models/Position.js";
import { logger } from "../utils/logger.js";

export const getPositions = async (req, res) => {
  try {
    const positions = await Position.find({ isActive: true }).sort({ title: 1 });
    res.json(positions);
  } catch (err) {
    logger.error("Error fetching positions:", err);
    res.status(500).json({ success: false, message: "Greška pri učitavanju pozicija" });
  }
};

export const createPosition = async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, message: "Naziv pozicije je obavezan" });
    }

    const position = new Position({ title });
    await position.save();
    
    res.status(201).json({ success: true, data: position });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Pozicija već postoji" });
    }
    logger.error("Error creating position:", error);
    res.status(500).json({ success: false, message: "Greška pri kreiranju pozicije" });
  }
};