// routes/taskRoutes.js
import express from "express";
import {
  createTask,
  getTask,
  updateTaskStatus,
} from "../controllers/task.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import Task from "../models/tasks.model.js"; 

const taskRouter = express.Router();

// Assign a new task (Lawyer only)
taskRouter.post("/", protectRoute, createTask);

// Get task details by ID
taskRouter.get("/:id", protectRoute, getTask);

// Update task status (Client only)
taskRouter.put("/:id", protectRoute, updateTaskStatus);

// Get all tasks for a specific case
taskRouter.get("/case/:caseId", protectRoute, async (req, res) => {
  try {
    const { caseId } = req.params;
    const tasks = await Task.find({ caseId })
      .populate("clientId", "fullName email")
      .populate("lawyerId", "fullName email")
      .populate("caseId", "caseName");
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks by case:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Updated route: Get tasks assigned by the logged-in lawyer for a specific case
taskRouter.get("/assigned/:caseId", protectRoute, async (req, res) => {
  try {
    const { caseId } = req.params;
    const lawyerId = req.user._id; // Lawyer's ID from authenticated user

    const tasks = await Task.find({
      lawyerId, // Tasks created by this lawyer
      caseId,   // For this specific case
    })
      .populate("clientId", "fullName email") // Populate client details
      .populate("lawyerId", "fullName email") // Populate lawyer details
      .populate("caseId", "caseName")         // Populate case details
      .sort({ createdAt: -1 });               // Newest first

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching assigned tasks:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

export default taskRouter;