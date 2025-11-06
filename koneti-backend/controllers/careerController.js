/**
 * Career Controller - Kontroler za prijave za posao
 * Career Controller - Job applications controller
 */
import Career from "../models/Career.js";
import { logger } from "../utils/logger.js";
import { sendCareerApplicationEmail, sendCareerConfirmationEmail, sendCareerStatusEmail } from "../utils/nodemailer.js";
import cloudinary from "../middleware/cloudinary.js";

export const createCareerApplication = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, position, coverLetter } = req.body;
    
    let cvUrl = "";
    let cloudinaryId = "";

    // Upload CV ako postoji
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        {
          folder: "career",
          resource_type: "auto"
        }
      );
      cvUrl = result.secure_url;
      cloudinaryId = result.public_id;
    }

    const application = new Career({
      firstName,
      lastName,
      email,
      phone,
      position,
      coverLetter,
      cvUrl,
      cloudinary_id: cloudinaryId,
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
    
    // Obriši CV iz cloudinary-ja ako postoji
    if (application.cloudinary_id) {
      await cloudinary.uploader.destroy(application.cloudinary_id);
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