import express from "express";
import User from "../models/user.model.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserData, getPublicKey, updateUserProfile, upload } from "../controllers/user.controller.js";

const router = express.Router();

// Get user's data (for logged-in user)
router.get("/data", protectRoute, getUserData);

// Get user's public key by ID (for decryption)
router.get("/:id", protectRoute, getPublicKey);

// Update user profile
router.put("/update", protectRoute, upload.single("profilePicture"), updateUserProfile);

export default router;