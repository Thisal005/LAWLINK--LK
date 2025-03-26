import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["available", "booked"], default: "available" },
}, { timestamps: true });

export default mongoose.model("Availability", availabilitySchema);