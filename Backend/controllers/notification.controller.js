import Notification from "../models/notifications.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({ success: false, msg: "Invalid user ID" });
    }

    const userType = req.user.role === "lawyer" ? "Lawyer" : "User";
    const notifications = await Notification.find({ userId, userType })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

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

export const createNotification = async (userId, userType, message, caseId = null) => {
  try {
    const notification = new Notification({
      userId,
      userType,
      message,
      caseId,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error.message);
    throw error;
  }
};