import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  lawyerID: {
    type: String,
    required: true,
    unique: true,
  },
  documentForVerification: {
    type: String,
    default: "",
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
    type: String,
  },
  displayName: {
    type: String,
    default: "",
  },
  practiceAreas: {
    type: String,
    default: "",
  },
  district: {
    type: String,
    default: "",
  },
  caseType: {
    type: String,
    default: "",
  },
  qualificationPhotos: {
    type: [String],
    default: [],
  },
  professionalBio: {
    type: String,
    default: "",
  },
  isVerifiedLawyer: {
    type: Boolean,
    default: false,
  },
  verifyotp: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyOtpExpires: {
    type: Number,
    default: 0,
  },
  resetOtp: {
    type: String,
    default: "",
  },
  resetOtpExpires: {
    type: Number,
    default: 0,
  },
  publicKey: {
    type: String,
    default: "",
  },
  privateKey: {
    type: String,
    default: "",
  },
});

const Lawyer = mongoose.model("Lawyer", lawyerSchema);

export default Lawyer;