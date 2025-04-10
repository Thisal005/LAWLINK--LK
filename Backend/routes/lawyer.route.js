import express from "express";
import Lawyer from "../models/lawyer.model.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { getLawyerData, updateLawyerProfile, upload } from "../controllers/lawyer.controller.js";

const router = express.Router();

// Get lawyer's data (for logged-in lawyer)
router.get("/data", protectRoute, getLawyerData);

// Get lawyer's public key by ID (for decryption)
router.get("/:id", protectRoute, async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id).select("publicKey");
    if (!lawyer) {
      return res.status(404).json({ success: false, error: "Lawyer not found" });
    }
    res.status(200).json({ success: true, data: { publicKey: lawyer.publicKey } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error", message: error.message });
  }
});

// Update lawyer profile
router.put(
  "/update",
  protectRoute,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "qualificationPhotos", maxCount: 10 },
  ]),
  updateLawyerProfile
);

export default router;