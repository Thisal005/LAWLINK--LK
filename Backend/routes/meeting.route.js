import express from "express";
import { scheduleMeeting, getMeetings, joinMeeting, endMeeting, cancelMeeting, getMeetingById } from "../controllers/meeting.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/schedule", protectRoute, scheduleMeeting);
router.get("/", protectRoute, getMeetings);
router.get("/:meetingId", protectRoute, getMeetingById); // New route
router.get("/join/:meetingId", protectRoute, joinMeeting);
router.post("/end/:meetingId", protectRoute, endMeeting);
router.put("/cancel/:meetingId", protectRoute, cancelMeeting);

export default router;