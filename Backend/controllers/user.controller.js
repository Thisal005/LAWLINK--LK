import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import multer from "multer"; // Add multer for file handling
import path from "path"; // For file path handling

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists in your project root
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage: storage });

// Existing getUserData controller
export const getUserData = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.json({ success: false, message: "Unauthorized. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        contact: user.contact,
        province: user.province, // Added
        address: user.address, // Added
        dateOfBirth: user.dateOfBirth, // Added
        isVerified: user.isVerified,
        publicKey: user.publicKey,
        privateKey: user.privateKey,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Existing getPublicKey controller
export const getPublicKey = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId).select("publicKey");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ publicKey: user.publicKey });
  } catch (err) {
    console.error("Error in getPublicKey controller:", err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

// New controller to update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update fields from request body
    user.province = req.body.province || user.province;
    user.address = req.body.address || user.address;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;

    // Handle profile picture upload
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`; // Store relative path
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      userData: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        contact: user.contact,
        province: user.province,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
        publicKey: user.publicKey,
        privateKey: user.privateKey,
      },
    });
  } catch (error) {
    console.error("Error in updateUserProfile:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export multer upload middleware for use in routes
export { upload };