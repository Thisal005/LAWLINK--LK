import express from "express";
import Lawyer from "../models/lawyer.model.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Get lawyer's data (for logged-in lawyer)
router.get("/data", protectRoute, async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.user._id).select("-password");
    if (!lawyer) {
      return res.status(404).json({ success: false, message: "Lawyer not found" });
    }
    res.status(200).json({ success: true, UserData: lawyer }); // Match case with frontend
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

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

export default router;