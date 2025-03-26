import React from "react";
import useUpdateTaskStatus from "../../../hooks/useUpdateTaskStatus";
import { FaCheck, FaMinus } from "react-icons/fa"; // Import icons from react-icons

const TaskCard = ({ task, onUpdate }) => {
  const { loading, updateTaskStatus } = useUpdateTaskStatus();

  const handleStatusChange = async () => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    const updatedTask = await updateTaskStatus(task._id, newStatus);
    if (updatedTask) {
      onUpdate(); // Trigger a refresh of the task list
    }
  };

  return (
    <div
      className="bg-white text-gray-900 rounded-xl shadow-lg p-4 mb-4 relative overflow-hidden transform transition-all duration-300 hover:shadow-xl group"
      role="article"
      aria-labelledby={`task-name-${task._id}`}
    >
      {/* Dynamic background gradient */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full filter blur-2xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full filter blur-2xl opacity-50 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Task Name and Description */}
        <h3
          id={`task-name-${task._id}`}
          className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200"
        >
          {task.taskName}
        </h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>

        {/* Status and Toggle Button */}
        <div className="mt-3 flex items-center justify-between">
          {/* Visual Status Indicator */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                task.status === "completed" ? "bg-green-500" : "bg-orange-500"
              }`}
              aria-hidden="true"
            ></span>
            <p className="text-xs text-gray-600">
              Status:{" "}
              <span
                className={`font-semibold ${
                  task.status === "completed"
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </p>
          </div>

          {/* Enhanced Toggle Button with React Icons */}
          <button
            onClick={handleStatusChange}
            disabled={loading}
            className={`
              w-10 h-10 flex items-center justify-center rounded-full border 
              transition-all duration-300 ease-in-out transform 
              ${
                task.status === "completed"
                  ? "bg-green-50 border-green-200 hover:bg-green-100 hover:scale-105"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:scale-105"
              } 
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-offset-2 
              ${
                task.status === "completed"
                  ? "focus:ring-green-300"
                  : "focus:ring-gray-300"
              }
            `}
            aria-label={
              task.status === "pending"
                ? "Mark as completed"
                : "Mark as pending"
            }
          >
            {loading ? (
              <div
                className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              ></div>
            ) : task.status === "completed" ? (
              <FaCheck
                className={`text-green-600 text-lg ${
                  loading ? "opacity-50" : ""
                }`}
                aria-hidden="true"
              />
            ) : (
              <FaMinus
                className={`text-gray-600 text-lg ${
                  loading ? "opacity-50" : ""
                }`}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;