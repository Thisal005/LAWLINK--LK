import express from "express";
import User from "../models/user.model.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Get user's data (for logged-in user)
router.get("/data", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, userData: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get user's public key by ID (for decryption)
router.get("/:id", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("publicKey");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true, data: { publicKey: user.publicKey } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error", message: error.message });
  }
});

export default router;