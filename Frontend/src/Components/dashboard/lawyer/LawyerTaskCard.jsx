// components/LawyerTaskCard.jsx
import React from "react";

const LawyerTaskCard = ({ task }) => {
  return (
    <div className="p-5 bg-white text-gray-900 rounded-3xl shadow-xl mb-4 relative overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
  {/* Dynamic background elements */}
  <div className="absolute inset-0 opacity-20">
    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
    <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
  </div>

  {/* Content container */}
  <div className="relative z-10">
    <h3 className="text-lg font-semibold">{task.taskName}</h3>
    <p className="text-gray-600 mt-2">{task.description}</p>
    <p className="mt-2">
      Status:{" "}
      <span
        className={`font-semibold ${
          task.status === "completed" ? "text-green-500" : "text-orange-500"
        }`}
      >
        {task.status}
      </span>
    </p>
    <p className="text-sm text-gray-500 mt-1">
      Assigned on: {new Date(task.createdAt).toLocaleString()}
    </p>
  </div>
</div>
  );
};

export default LawyerTaskCard;