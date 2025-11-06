/**
 * Position Model - Model pozicija za posao
 * Position Model - Job positions model
 */
import mongoose from "mongoose";

const positionSchema = new mongoose.Schema({
  title: {
    sr: { type: String, required: true, trim: true },
    en: { type: String, trim: true }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

positionSchema.index({ "title.sr": 1 });

const Position = mongoose.model("Position", positionSchema);
export default Position;