// routes/noteRoutes.js
import express from "express";
import { createNote, getClientNotes } from "../controllers/note.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const noteRouter = express.Router();

// Create a new note (Lawyer only)
noteRouter.post("/", protectRoute, createNote);

// Get all notes for the logged-in client (Client only)
noteRouter.get("/client", protectRoute, getClientNotes);

export default noteRouter;