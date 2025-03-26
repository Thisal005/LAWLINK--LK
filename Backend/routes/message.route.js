import express from "express";
import { sendMessage, getMessages, downloadDocument } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import upload from "../config/documentUpload.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, upload.array('documents', 5), sendMessage);
router.get("/download/:messageId/:documentIndex", protectRoute, downloadDocument);

export default router;