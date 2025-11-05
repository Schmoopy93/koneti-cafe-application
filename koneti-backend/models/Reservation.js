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
      values: ["business_basic", "business_high", "experience_start", "experience_classic", "experience_celebration"],
      message: "Podtip događaja nije validan",
    },
    required: [true, "Podtip je obavezan"],
    validate: {
      validator: function(value) {
        if (this.type === 'business') {
          return ['business_basic', 'business_high'].includes(value);
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
  guests: { type: Number, required: [true, "Broj gostiju je obavezan"] },
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

