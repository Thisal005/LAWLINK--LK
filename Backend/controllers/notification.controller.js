// controllers/notification.controller.js
import Notification from "../models/notification.model.js"; // Fixed typo in your import

// Get all notifications for the logged-in user or lawyer
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?._id; // From protectRoute middleware
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({ success: false, msg: "Invalid user ID" });
    }

    const userType = req.user.role === "lawyer" ? "Lawyer" : "User"; // Assuming role in req.user
    const notifications = await Notification.find({ userId, userType })
      .sort({ createdAt: -1 })
      .limit(50); // Cap for performance

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({ success: false, msg: "Invalid user ID" });
    }

    const userType = req.user.role === "lawyer" ? "Lawyer" : "User";
    await Notification.updateMany({ userId, userType, unread: true }, { unread: false });

    res.status(200).json({ success: true, msg: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};