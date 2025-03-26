import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["client", "lawyer"],
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    profilePic: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contact: {
        type: String,
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
        default: 0
    },
    resetOtp :{
        type: String,
        default: "",
    },
    resetOtpExpires: {
        type: Number,
        default: 0
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

const User = mongoose.model("User", userSchema);

export default User;
