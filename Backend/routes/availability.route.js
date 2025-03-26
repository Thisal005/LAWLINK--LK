import express from "express";
import { addAvailability, getAvailableSlots, getAllSlots, removeAvailability } from "../controllers/availability.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/add", protectRoute, addAvailability);
router.get("/:lawyerId", protectRoute, getAvailableSlots);
router.get("/all/:lawyerId", protectRoute, getAllSlots); 
router.delete("/:slotId", protectRoute, removeAvailability); 

export default router;