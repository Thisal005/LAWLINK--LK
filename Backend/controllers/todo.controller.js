// controllers/todoController.js
import Todo from "../models/todo.model.js";
import Lawyer from "../models/lawyer.model.js";

// Create a new to-do item (Lawyer only)
export const createTodo = async (req, res) => {
  try {
    const { taskName } = req.body;
    const lawyerId = req.user._id;

    // Ensure the user is a lawyer
    const lawyer = await Lawyer.findById(lawyerId);
    if (!lawyer) {
      return res.status(403).json({ msg: "Only lawyers can create to-do items" });
    }

    const newTodo = new Todo({
      taskName,
      lawyerId,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.error("Error in createTodo controller:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all to-do items for the logged-in lawyer
export const getTodos = async (req, res) => {
  try {
    const lawyerId = req.user._id;

    // Ensure the user is a lawyer
    const lawyer = await Lawyer.findById(lawyerId);
    if (!lawyer) {
      return res.status(403).json({ msg: "Only lawyers can view to-do items" });
    }

    const todos = await Todo.find({ lawyerId }).sort({ createdAt: -1 }); // Newest first
    res.status(200).json(todos);
  } catch (err) {
    console.error("Error in getTodos controller:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update to-do item status (Lawyer only)
export const updateTodoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const lawyerId = req.user._id;

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ msg: "To-do item not found" });
    }

    // Ensure only the owning lawyer can update
    if (todo.lawyerId.toString() !== lawyerId.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    todo.status = status;
    await todo.save();

    res.status(200).json(todo);
  } catch (err) {
    console.error("Error in updateTodoStatus controller:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};