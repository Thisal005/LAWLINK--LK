import express from "express";
import { getNotifications, markAllAsRead } from "../controllers/notification.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const notificationRouter = express.Router();

notificationRouter.get("/", protectRoute, getNotifications);
notificationRouter.put("/mark-read", protectRoute, markAllAsRead);

export default notificationRouter;