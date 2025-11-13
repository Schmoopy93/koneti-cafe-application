/**
 * Career Controller - Kontroler za prijave za posao
 * Career Controller - Job applications controller
 */
import Career from "../models/Career.js";
import { logger } from "../utils/logger.js";
import { sendCareerApplicationEmail, sendCareerConfirmationEmail, sendCareerStatusEmail } from "../utils/nodemailer.js";
import path from "path";
import fs from "fs";

export const createCareerApplication = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, position, coverLetter } = req.body;

    let cvPath = "";
    let cvUrl = "";

    // Save CV locally ako postoji
    if (req.file) {
      const careerDir = path.join(process.cwd(), 'uploads', 'career');
      if (!fs.existsSync(careerDir)) {
        fs.mkdirSync(careerDir, { recursive: true });
      }

      const filename = `cv_${Date.now()}_${req.file.originalname}`;
      const filePath = path.join(careerDir, filename);

      // Move file from temp to career directory
      fs.renameSync(req.file.path, filePath);

      cvPath = path.relative(process.cwd(), filePath);
      cvUrl = `/uploads/career/${filename}`;
    }

    const application = new Career({
      firstName,
      lastName,
      email,
      phone,
      position,
      coverLetter,
      cvUrl,
      cvPath,
      status: "pending"
    });

    await application.save();

    // Pošalji response odmah
    res.status(201).json({
      success: true,
      message: "Prijava je uspešno poslata. Kontaktiraćemo Vas uskoro.",
      data: application
    });

    // Pošalji email-ove u pozadini
    Promise.all([
      sendCareerConfirmationEmail(application).catch((err) =>
        logger.error("Career confirmation email failed to send but proceeding.", err)
      ),
      sendCareerApplicationEmail(application).catch((err) =>
        logger.error("Career application email failed to send but proceeding.", err)
      )
    ]);

  } catch (error) {
    logger.error("Error creating career application:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Podaci nisu validni.",
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Došlo je do greške na serveru."
    });
  }
};

export const getCareerApplications = async (req, res) => {
  try {
    const applications = await Career.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    logger.error("Error fetching career applications:", err);
    res.status(500).json({
      success: false,
      message: "Greška prilikom pribavljanja prijava."
    });
  }
};

export const updateCareerApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "reviewed", "contacted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Nevažeći status."
      });
    }

    const application = await Career.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Prijava nije pronađena."
      });
    }

    // Pošalji email korisniku o promeni statusa
    if (status === "contacted") {
      sendCareerStatusEmail(application, status).catch((err) =>
        logger.error(`Failed to send status email for application ${id}`, err)
      );
    }

    logger.info(`Career application ${id} status updated to ${status}`);
    return res.json({ success: true, data: application });
  } catch (err) {
    logger.error(`Error updating career application status for ID ${req.params.id}:`, err);
    res.status(500).json({
      success: false,
      message: "Greška prilikom ažuriranja statusa prijave."
    });
  }
};

export const deleteCareerApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Career.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Prijava nije pronađena."
      });
    }

    // Obriši lokalni CV fajl ako postoji
    if (application.cvPath) {
      const filePath = path.join(process.cwd(), application.cvPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Career.findByIdAndDelete(id);

    logger.info(`Career application ${id} deleted`);
    res.json({ success: true, message: "Prijava je obrisana." });
  } catch (error) {
    logger.error("Error deleting career application:", error);
    res.status(500).json({
      success: false,
      message: "Greška prilikom brisanja prijave."
    });
  }
};

export const downloadCV = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Career.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Prijava nije pronađena."
      });
    }

    if (!application.cvPath) {
      return res.status(404).json({
        success: false,
        message: "CV fajl nije pronađen."
      });
    }

    // Serve the local file
    const filePath = path.join(process.cwd(), application.cvPath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "CV fajl nije pronađen."
      });
    }

    logger.info(`CV download initiated for application ${id}: ${filePath}`);

    // Set headers for download
    const filename = `CV_${application.firstName}_${application.lastName}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    logger.error("Error downloading CV:", error);
    res.status(500).json({
      success: false,
      message: "Greška prilikom preuzimanja CV-ja."
    });
  }
};
