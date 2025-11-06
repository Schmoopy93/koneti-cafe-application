/**
 * Position Controller - Kontroler za pozicije
 * Position Controller - Job positions controller
 */
import Position from "../models/Position.js";
import translate from "@iamtraction/google-translate";
import { logger } from "../utils/logger.js";

export const getPositions = async (req, res) => {
  try {
    const positions = await Position.find({ isActive: true }).sort({ "title.sr": 1 });
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

    let titleEn;
    try {
      const translation = await translate(title, { from: "sr", to: "en" });
      titleEn = translation.text;
    } catch (translateError) {
      logger.warn("Translation failed, using original title:", translateError);
      titleEn = title;
    }

    const position = new Position({ 
      title: { sr: title, en: titleEn }
    });
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