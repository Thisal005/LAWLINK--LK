// routes/todoRoutes.js
import express from "express";
import {
  createTodo,
  getTodos,
  updateTodoStatus,
} from "../controllers/todo.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const todoRouter = express.Router();

// Create a new to-do item (Lawyer only)
todoRouter.post("/", protectRoute, createTodo);

// Get all to-do items for the logged-in lawyer
todoRouter.get("/", protectRoute, getTodos);

// Update to-do item status (Lawyer only)
todoRouter.put("/:id", protectRoute, updateTodoStatus);

export default todoRouter;