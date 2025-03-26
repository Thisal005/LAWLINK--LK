import { profile } from "console";
import userModel from "../models/user.model.js";

import jwt from 'jsonwebtoken';

export const getUserData = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.json({ success: false, message: 'Unauthorized. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      userData: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        contact: user.contact,
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

// controllers/user.controller.js
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
