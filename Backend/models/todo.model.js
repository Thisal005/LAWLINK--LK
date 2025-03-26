// models/todo.model.js
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
    maxlength: 100, // Short tasks
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  lawyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lawyer",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;