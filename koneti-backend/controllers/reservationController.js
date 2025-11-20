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
 * Helper function to check if two time ranges overlap
 */
const doTimeRangesOverlap = (start1, end1, start2, end2) => {
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const start1Min = toMinutes(start1);
  const end1Min = toMinutes(end1);
  const start2Min = toMinutes(start2);
  const end2Min = toMinutes(end2);
  
  // Two ranges overlap if one starts before the other ends
  return start1Min < end2Min && start2Min < end1Min;
};

/**
 * Helper function to get end time for a reservation
 * For business type, it uses endTime field
 * For experience type, it assumes 3 hours duration
 */
const getReservationEndTime = (reservation) => {
  if (reservation.type === 'business' && reservation.endTime) {
    return reservation.endTime;
  }
  
  // For experience type, assume 3 hours duration
  const [hours, minutes] = reservation.time.split(':').map(Number);
  const endHours = hours + 3;
  return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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
          errorKey: 'experienceMinimum2Days',
        });
      }
    }
    
    // Validate subType based on type
    if (type === 'business' && !['business_basic', 'business_high', 'business_corporate'].includes(subType)) {
      return res.status(400).json({
        success: false,
        errorKey: 'invalidBusinessSubType',
      });
    }
    
    if (type === 'experience' && !['experience_start', 'experience_classic', 'experience_celebration'].includes(subType)) {
      return res.status(400).json({
        success: false,
        errorKey: 'invalidExperienceSubType',
      });
    }

    // Validate endTime for business reservations
    if (type === 'business') {
      if (!endTime) {
        return res.status(400).json({
          success: false,
          errorKey: 'endTimeRequired',
        });
      }

      const durationMinutes = calculateDurationMinutes(time, endTime);

      // Check minimum duration based on subType
      if (subType === 'business_basic' || subType === 'business_high') {
        if (durationMinutes < 60) {
          return res.status(400).json({
            success: false,
            errorKey: 'minDuration1Hour',
          });
        }
      } else if (subType === 'business_corporate') {
        if (durationMinutes < 360) {
          return res.status(400).json({
            success: false,
            errorKey: 'minDuration6Hours',
          });
        }
      }

      // Ensure endTime is after startTime
      if (durationMinutes <= 0) {
        return res.status(400).json({
          success: false,
          errorKey: 'endTimeBeforeStart',
        });
      }
    }

    // CHECK FOR TIME OVERLAP WITH EXISTING RESERVATIONS
    const requestedDate = new Date(date);
    requestedDate.setHours(0, 0, 0, 0);
    
    // Find all approved or pending reservations on the same date
    const existingReservations = await Reservation.find({
      date: {
        $gte: requestedDate,
        $lt: new Date(requestedDate.getTime() + 24 * 60 * 60 * 1000)
      },
      status: { $in: ['pending', 'approved'] }
    });

    // Calculate end time for the new reservation
    const newEndTime = type === 'business' ? endTime : (() => {
      const [hours, minutes] = time.split(':').map(Number);
      const endHours = hours + 3; // Experience events are assumed to be 3 hours
      return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    })();

    // Check for overlap with existing reservations
    for (const existing of existingReservations) {
      const existingEndTime = getReservationEndTime(existing);
      
      if (doTimeRangesOverlap(time, newEndTime, existing.time, existingEndTime)) {
        return res.status(409).json({
          success: false,
          errorKey: 'timeSlotAlreadyReserved',
          params: {
            startTime: existing.time,
            endTime: existingEndTime
          }
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
        errorKey: 'validationError',
        errors: error.errors,
      });
    }
    res
      .status(500)
      .json({ success: false, errorKey: 'serverError' });
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
    const { date, time, endTime, type } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        errorKey: 'dateRequired',
      });
    }

    // Sanitize date input
    const sanitizedDate = new Date(date);
    if (isNaN(sanitizedDate.getTime())) {
      return res.status(400).json({
        success: false,
        errorKey: 'invalidDateFormat',
      });
    }

    // If time is provided, check for time conflicts
    if (time) {
      const requestedDate = new Date(sanitizedDate);
      requestedDate.setHours(0, 0, 0, 0);
      
      const existingReservations = await Reservation.find({
        date: {
          $gte: requestedDate,
          $lt: new Date(requestedDate.getTime() + 24 * 60 * 60 * 1000)
        },
        status: { $in: ['pending', 'approved'] }
      });

      // Calculate end time for the requested reservation
      const requestedEndTime = type === 'business' && endTime ? endTime : (() => {
        const [hours, minutes] = time.split(':').map(Number);
        const endHours = hours + 3;
        return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      })();

      // Check for overlap
      for (const existing of existingReservations) {
        const existingEndTime = getReservationEndTime(existing);
        
        if (doTimeRangesOverlap(time, requestedEndTime, existing.time, existingEndTime)) {
          return res.status(409).json({
            success: false,
            available: false,
            errorKey: 'timeSlotAlreadyReserved',
            params: {
              startTime: existing.time,
              endTime: existingEndTime
            }
          });
        }
      }
    }

    res.json({
      success: true,
      available: true,
    });
  } catch (error) {
    logger.error("Error checking availability:", error);
    res.status(500).json({
      success: false,
      errorKey: 'serverError',
    });
  }
};