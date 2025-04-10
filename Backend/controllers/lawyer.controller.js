import Lawyer from "../models/lawyer.model.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Existing getLawyerData controller
export const getLawyerData = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const lawyer = await Lawyer.findById(userId);
    if (!lawyer) {
      return res.status(404).json({ success: false, message: "Lawyer not found" });
    }

    res.status(200).json({
      success: true,
      UserData: {
        _id: lawyer._id,
        fullName: lawyer.fullName,
        email: lawyer.email,
        contactNumber: lawyer.contactNumber,
        displayName: lawyer.displayName,
        practiceAreas: lawyer.practiceAreas,
        district: lawyer.district,
        caseType: lawyer.caseType,
        qualificationPhotos: lawyer.qualificationPhotos,
        professionalBio: lawyer.professionalBio,
        isVerified: lawyer.isVerified,
        publicKey: lawyer.publicKey,
        privateKey: lawyer.privateKey,
        lawyerID: lawyer.lawyerID,
        documentForVerification: lawyer.documentForVerification,
        profilePicture: lawyer.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error in getLawyerData:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update lawyer profile
export const updateLawyerProfile = async (req, res) => {
  try {
    console.log("Received request to update lawyer profile");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const token = req.cookies.jwt;
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ success: false, message: "Unauthorized. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    console.log("Decoded userId:", userId);

    const lawyer = await Lawyer.findById(userId);
    if (!lawyer) {
      console.log("Lawyer not found for userId:", userId);
      return res.status(404).json({ success: false, message: "Lawyer not found" });
    }

    // Update fields from request body
    lawyer.displayName = req.body.displayName || lawyer.displayName;
    lawyer.practiceAreas = req.body.practiceAreas || lawyer.practiceAreas;
    lawyer.district = req.body.district || lawyer.district;
    lawyer.caseType = req.body.caseType || lawyer.caseType;
    lawyer.professionalBio = req.body.professionalBio || lawyer.professionalBio;
    lawyer.fullName = req.body.fullName || lawyer.fullName;
    lawyer.email = req.body.email || lawyer.email;
    lawyer.contactNumber = req.body.contactNumber || lawyer.contactNumber;

    // Handle profile picture upload
    if (req.files && req.files.profilePicture) {
      console.log("Profile picture uploaded:", req.files.profilePicture[0].filename);
      lawyer.profilePicture = `/uploads/${req.files.profilePicture[0].filename}`;
    }

    // Handle qualification photos upload
    if (req.files && req.files.qualificationPhotos) {
      console.log("Qualification photos uploaded:", req.files.qualificationPhotos.map(file => file.filename));
      const qualificationPhotoPaths = req.files.qualificationPhotos.map(
        (file) => `/uploads/${file.filename}`
      );
      lawyer.qualificationPhotos = qualificationPhotoPaths;
    }

    console.log("Updated lawyer data before save:", lawyer);
    await lawyer.save();
    console.log("Lawyer data saved successfully");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      UserData: {
        _id: lawyer._id,
        fullName: lawyer.fullName,
        email: lawyer.email,
        contactNumber: lawyer.contactNumber,
        displayName: lawyer.displayName,
        practiceAreas: lawyer.practiceAreas,
        district: lawyer.district,
        caseType: lawyer.caseType,
        qualificationPhotos: lawyer.qualificationPhotos,
        professionalBio: lawyer.professionalBio,
        isVerified: lawyer.isVerified,
        publicKey: lawyer.publicKey,
        privateKey: lawyer.privateKey,
        lawyerID: lawyer.lawyerID,
        documentForVerification: lawyer.documentForVerification,
        profilePicture: lawyer.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error in updateLawyerProfile:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export multer upload middleware for use in routes
export { upload };