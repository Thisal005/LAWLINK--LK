// components/TodoItem.jsx
import React from "react";
import useUpdateTodoStatus from "../../../hooks/useUpdateTodoStatus"; // We'll create this hook

const TodoItem = ({ todo, onUpdate }) => {
  const { loading, updateTodoStatus } = useUpdateTodoStatus();

  const handleStatusChange = async () => {
    const newStatus = todo.status === "pending" ? "completed" : "pending";
    const updatedTodo = await updateTodoStatus(todo._id, newStatus);
    if (updatedTodo) {
      onUpdate(); // Refresh the list
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-4 flex justify-between items-center transform transition-all duration-300 hover:shadow-xl group">
      <div>
        <h4
          className={`text-lg font-semibold ${
            todo.status === "completed" ? "line-through text-gray-500" : ""
          }`}
        >
          {todo.taskName}
        </h4>
        <p className="text-sm text-gray-500">
          {new Date(todo.createdAt).toLocaleString()}
        </p>
      </div>
      <button
        onClick={handleStatusChange}
        disabled={loading}
        className={`p-2 rounded-lg text-white ${
          todo.status === "pending"
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-orange-500 hover:bg-orange-600"
        } transition duration-200 disabled:bg-gray-300`}
      >
        {loading
          ? "Updating..."
          : todo.status === "pending"
          ? "Mark Done"
          : "Mark Pending"}
      </button>
    </div>
  );
};

export default TodoItem;