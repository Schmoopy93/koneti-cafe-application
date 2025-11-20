import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Tip događaja je obavezan"],
    enum: ["business", "experience"],
  },
  subType: {
    type: String,
    enum: {
      values: ["business_basic", "business_high", "business_corporate", "experience_start", "experience_classic", "experience_celebration"],
      message: "Podtip događaja nije validan",
    },
    required: [true, "Podtip je obavezan"],
    validate: {
      validator: function(value) {
        if (this.type === 'business') {
          return ['business_basic', 'business_high', 'business_corporate'].includes(value);
        }
        if (this.type === 'experience') {
          return ['experience_start', 'experience_classic', 'experience_celebration'].includes(value);
        }
        return false;
      },
      message: 'Nevalidan podtip za izabrani tip događaja'
    }
  },
  name: { type: String, required: [true, "Ime je obavezno"] },
  email: { type: String, required: [true, "Email je obavezan"] },
  phone: { type: String, required: [true, "Telefon je obavezan"] },
  date: { type: Date, required: [true, "Datum je obavezan"] },
  time: { type: String, required: [true, "Vreme je obavezno"] },
  endTime: { 
    type: String,
    required: function() {
      // endTime is required only for business type reservations
      return this.type === 'business';
    },
    validate: {
      validator: function(value) {
        // Skip validation if not a business type
        if (this.type !== 'business') return true;
        
        // If business type, endTime must be present
        if (!value) return false;
        
        const startTime = this.time;
        if (!startTime) return true; // Let the time validation handle this
        
        // Parse times (format: HH:MM)
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = value.split(':').map(Number);
        
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        
        const durationMinutes = endMinutes - startMinutes;
        
        // Validate minimum duration based on subType
        if (this.subType === 'business_basic' || this.subType === 'business_high') {
          return durationMinutes >= 60; // Minimum 1 hour
        } else if (this.subType === 'business_corporate') {
          return durationMinutes >= 360; // Minimum 6 hours
        }
        
        return true;
      },
      message: function(props) {
        const subType = props.instance.subType;
        if (subType === 'business_basic' || subType === 'business_high') {
          return 'Minimalno trajanje rezervacije je 1 sat';
        } else if (subType === 'business_corporate') {
          return 'Minimalno trajanje rezervacije je 6 sati';
        }
        return 'Nevažeće vreme završetka';
      }
    }
  },
  // guests: { type: Number, required: [true, "Broj gostiju je obavezan"] },
  guests: { type: Number },
  message: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

// Indexi za performanse
reservationSchema.index({ date: 1, status: 1 });
reservationSchema.index({ email: 1 });

export default mongoose.model("Reservation", reservationSchema);

