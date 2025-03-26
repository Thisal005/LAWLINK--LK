// routes/notification.route.js
import express from "express";
import Notification from "../models/notifications.model.js";
import { protectRoute } from "../middleware/protectRoute.js";

const notificationRouter = express.Router();

// Get all notifications for the logged-in lawyer
notificationRouter.get("/", protectRoute, async (req, res) => {
  try {
    const lawyerId = req.user._id;
    const notifications = await Notification.find({ recipientId: lawyerId }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

export default notificationRouter;