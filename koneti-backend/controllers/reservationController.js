import Reservation from "../models/Reservation.js";
import { logger } from "../utils/logger.js";
import {
  sendUserConfirmationEmail,
  sendAdminNotificationEmail,
  sendApprovedEmail,
  sendRejectedEmail,
} from "../utils/nodemailer.js";

/**
 * Kreira novu rezervaciju.
 * Šalje potvrdu korisniku i obaveštenje administratoru.
 */
export const createReservation = async (req, res) => {
  try {
    const { type, subType } = req.body;
    
    // Validate subType based on type
    if (type === 'biznis' && !['basic', 'vip'].includes(subType)) {
      return res.status(400).json({
        success: false,
        message: 'Biznis događaji mogu biti samo basic ili vip'
      });
    }
    
    if (type === 'koneti' && !['basic', 'premium', 'vip'].includes(subType)) {
      return res.status(400).json({
        success: false,
        message: 'Koneti događaji mogu biti basic, premium ili vip'
      });
    }

    const newReservation = new Reservation({
      ...req.body,
      status: "pending",
    });
    await newReservation.save();

    await Promise.all([
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
    ]);

    res.status(201).json({
      success: true,
      message:
        "Rezervacija je uspešno primljena. Proverite svoj email za potvrdu.",
      data: newReservation,
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
