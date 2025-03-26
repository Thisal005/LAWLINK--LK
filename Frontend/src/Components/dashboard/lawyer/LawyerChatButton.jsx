// ChatButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaComments } from "react-icons/fa"; // Using react-icons
import { motion } from "framer-motion"; // For smooth animations

function ChatButton() {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate("/lawyer-chat")}
      className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      aria-label="Chat with lawyer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        <FaComments className="w-8 h-8" />
        {/* Optional notification badge */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </div>
      {/* Tooltip - visible on hover on desktop */}
      <span className="absolute right-full mr-2 px-2 py-1 text-sm bg-gray-800 text-white rounded opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 hidden md:block">
        Chat Now
      </span>
    </motion.button>
  );
}

export default ChatButton;