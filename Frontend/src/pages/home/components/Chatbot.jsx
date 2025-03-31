import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatbaseUrl = "https://www.chatbase.co/chatbot-iframe/b-n-flyXNakozp4Al6ODB";

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="bg-white shadow-xl rounded-lg w-[400px] h-[510px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#1a4b84]">
              Ask from Lexi
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Close chatbot"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chatbase Chatbot Container */}
          <div className="flex-1">
            <iframe
              src={chatbaseUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Chatbase Chatbot"
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#5da9e9] focus:ring-opacity-50"
          aria-label="Open chatbot"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;