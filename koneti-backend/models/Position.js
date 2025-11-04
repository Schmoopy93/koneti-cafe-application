/**
 * Position Model - Model pozicija za posao
 * Position Model - Job positions model
 */
import mongoose from "mongoose";

const positionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, unique: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

positionSchema.index({ title: 1 });

const Position = mongoose.model("Position", positionSchema);
export default Position;