import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
  },
  message: {
    type: String,
    required: false,
  },
  nonce: {
    type: String,
    required: false,
  },
  documents: [{
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    encrypted: { type: Boolean, default: false }
  }],
  isRead: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  }
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);