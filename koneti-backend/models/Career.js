/**
 * Career Model - Model za prijave za posao
 * Career Model - Job applications model
 */
import mongoose from "mongoose";

const careerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  coverLetter: { type: String },
  cvUrl: { type: String }, // URL do CV-ja na Cloudinary
  cloudinary_id: { type: String }, // Cloudinary public_id
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'contacted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

// Indexi za performanse
careerSchema.index({ email: 1 });
careerSchema.index({ position: 1 });
careerSchema.index({ status: 1 });

const Career = mongoose.model("Career", careerSchema);
export default Career;