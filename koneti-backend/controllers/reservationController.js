import Reservation from "../models/Reservation.js";
import { logger } from "../utils/logger.js";
import mongoose from "mongoose";
import {
  sendUserConfirmationEmail,
  sendAdminNotificationEmail,
  sendApprovedEmail,
  sendRejectedEmail,
} from "../utils/nodemailer.js";

/**
 * Helper function to calculate duration in minutes between two times
 */
const calculateDurationMinutes = (startTime, endTime) => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return endMinutes - startMinutes;
};

/**
 * Kreira novu rezervaciju.
 * Šalje potvrdu korisniku i obaveštenje administratoru.
 */
export const createReservation = async (req, res) => {
  try {
    const { type, subType, date, time, endTime } = req.body;
    
    // Validate date - minimum 2 days in advance only for Koneti Experience events
    if (date && type === 'experience') {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const minDate = new Date(today);
      minDate.setDate(today.getDate() + 2);
      
      if (selectedDate < minDate) {
        return res.status(400).json({
          success: false,
          message: 'Koneti Experience rezervacija mora biti minimum 2 dana unapred'
        });
      }
    }
    
    // Validate subType based on type
    if (type === 'business' && !['business_basic', 'business_high', 'business_corporate'].includes(subType)) {
      return res.status(400).json({
        success: false,
        message: 'Biznis događaji mogu biti samo business_basic, business_high ili business_corporate'
      });
    }
    
    if (type === 'experience' && !['experience_start', 'experience_classic', 'experience_celebration'].includes(subType)) {
      return res.status(400).json({
        success: false,
        message: 'Koneti događaji mogu biti experience_start, experience_classic ili experience_celebration'
      });
    }

    // Validate endTime for business reservations
    if (type === 'business') {
      if (!endTime) {
        return res.status(400).json({
          success: false,
          message: 'Vreme završetka je obavezno za biznis rezervacije'
        });
      }

      const durationMinutes = calculateDurationMinutes(time, endTime);

      // Check minimum duration based on subType
      if (subType === 'business_basic' || subType === 'business_high') {
        if (durationMinutes < 60) {
          return res.status(400).json({
            success: false,
            message: 'Minimalno trajanje rezervacije za ovaj paket je 1 sat'
          });
        }
      } else if (subType === 'business_corporate') {
        if (durationMinutes < 360) {
          return res.status(400).json({
            success: false,
            message: 'Minimalno trajanje rezervacije za Corporate Day paket je 6 sati'
          });
        }
      }

      // Ensure endTime is after startTime
      if (durationMinutes <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Vreme završetka mora biti posle vremena početka'
        });
      }
    }

    const newReservation = new Reservation({
      ...req.body,
      status: "pending",
    });
    await newReservation.save();

    // Pošalji response odmah
    res.status(201).json({
      success: true,
      message: "Rezervacija je uspešno primljena. Proverite svoj email za potvrdu.",
      data: newReservation,
    });

    // Pošalji email-ove u pozadini (ne blokira response)
    Promise.all([
      sendUserConfirmationEmail(newReservation).catch((err) =>
        logger.error(
          "User confirmation email failed to send but proceeding.",
          err
        )
      ),
      sendAdminNotificationEmail(newReservation).catch((err) =>
        logger.error(
          "Admin notification email failed to send but proceeding.",
          err
        )
      ),
    ]).then(() => {
      console.log('[DEBUG] Emails sent successfully for reservation:', newReservation._id);
    }).catch((err) => {
      logger.error('Email sending failed for reservation:', newReservation._id, err);
    });
  } catch (error) {
    logger.error("Error creating reservation:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Podaci za rezervaciju nisu validni.",
        errors: error.errors,
      });
    }
    res
      .status(500)
      .json({ success: false, message: "Došlo je do greške na serveru." });
  }
};

/**
 * Ažurira podatke rezervacije.
 * Šalje email korisniku ako je rezervacija odobrena/odbijena.
 */
export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ date: 1, time: 1 });
    res.json(reservations);
  } catch (err) {
    logger.error("Error fetching reservations:", err);
    res.status(500).json({
      success: false,
      message: "Greška prilikom pribavljanja rezervacija.",
    });
  }
};

/**
 * Ažurira status rezervacije (npr. pending -> approved/rejected).
 * Šalje email korisniku ako je rezervacija odobrena.
 */
export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Nevažeći status." });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Nevažeći ID rezervacije." });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Rezervacija nije pronađena." });
    }

    // Ako je rezervacija odobrena, pošalji email korisniku
    if (status === "approved") {
      await sendApprovedEmail(reservation).catch((err) => {
        logger.error(
          `Failed to send approval email for reservation ${id}, but status was updated.`,
          err
        );
      });
    }

    // Ako je rezervacija odbijena, pošalji email korisniku
    if (status === "rejected") {
      await sendRejectedEmail(reservation).catch((err) => {
        logger.error(
          `Failed to send rejection email for reservation ${id}, but status was updated.`,
          err
        );
      });
    }

    logger.info(`Reservation ${id} status updated to ${status}`);
    return res.json({ success: true, data: reservation });
  } catch (err) {
    logger.error(
      `Error updating reservation status for ID ${req.params.id}:`,
      err
    );
    res.status(500).json({
      success: false,
      message: "Greška prilikom ažuriranja statusa rezervacije.",
    });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Nevažeći ID rezervacije." });
    }
    
    const reservation = await Reservation.findByIdAndDelete(id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Rezervacija nije pronađena."
      });
    }
    
    logger.info(`Reservation ${id} deleted`);
    res.json({ success: true, message: "Rezervacija je obrisana." });
  } catch (error) {
    logger.error("Error deleting reservation:", error);
    res.status(500).json({
      success: false,
      message: "Greška prilikom brisanja rezervacije."
    });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Datum je obavezan"
      });
    }

    // Sanitize date input
    const sanitizedDate = new Date(date);
    if (isNaN(sanitizedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Nevažeći format datuma"
      });
    }

    const existingReservation = await Reservation.findOne({
      date: sanitizedDate.toISOString().split('T')[0],
      guests: { $gt: 15 },
      status: "approved"
    });

    if (existingReservation) {
      return res.status(409).json({
        success: false,
        message: "Objekat nije raspoloživ za iznajmljivanje tog dana"
      });
    }

    res.json({
      success: true,
      message: "Prostor je dostupan"
    });
  } catch (error) {
    logger.error("Error checking availability:", error);
    res.status(500).json({
      success: false,
      message: "Greška prilikom provere dostupnosti"
    });
  }
};
