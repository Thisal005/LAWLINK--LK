// controllers/noteController.js
import Note from "../models/note.model.js";
import User from "../models/user.model.js";
import Lawyer from "../models/lawyer.model.js";
import Case from "../models/case.model.js";

// Create a new note (Lawyer only)
export const createNote = async (req, res) => {
  try {
    const { content, clientId, caseId } = req.body;
    const lawyerId = req.user._id;

    // Ensure the user is a lawyer
    const lawyer = await Lawyer.findById(lawyerId);
    if (!lawyer) {
      return res.status(403).json({ msg: "Only lawyers can create notes" });
    }

    // Validate client exists
    const clientExists = await User.findById(clientId);
    if (!clientExists) {
      return res.status(404).json({ msg: "Client not found" });
    }

    // Validate case if provided
    if (caseId) {
      const caseExists = await Case.findById(caseId);
      if (!caseExists) {
        return res.status(404).json({ msg: "Case not found" });
      }
    }

    const newNote = new Note({
      content,
      lawyerId,
      clientId,
      caseId,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error("Error in createNote controller:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get notes for a client (Client only)
export const getClientNotes = async (req, res) => {
  try {
    const clientId = req.user._id;

    // Ensure the user is a client
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(403).json({ msg: "Only clients can view notes" });
    }

    const notes = await Note.find({ clientId })
      .populate("lawyerId", "fullName email")
      .populate("caseId", "caseName")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(notes);
  } catch (err) {
    console.error("Error in getClientNotes controller:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};