// routes/summarization.route.js
import express from "express";
import {
  summarizePDF,
  getSummarizationHistory,
} from "../controllers/summarization.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const summarizationRouter = express.Router();

summarizationRouter.post("/summarize", protectRoute, summarizePDF);
summarizationRouter.get("/history", protectRoute, getSummarizationHistory);

export default summarizationRouter;