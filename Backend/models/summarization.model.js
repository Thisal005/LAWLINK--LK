// models/summarization.model.js
import mongoose from "mongoose";

const summarizationSchema = new mongoose.Schema({
  lawyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lawyer",
    required: true,
  },
  originalFilename: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  audioFileName: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Summarization = mongoose.model("Summarization", summarizationSchema);

export default Summarization;