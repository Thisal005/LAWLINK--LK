// frontend/src/Chatbot.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../../Context/AppContext";
import ClietnSidebar from "../../Components/dashboard/client/ClientSideBar";
import Header from "../../Components/dashboard/client/ClientHeader"; 
import { PaperAirplaneIcon, ArrowPathIcon, Bars3Icon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
const Chatbot = () => {
  const { backendUrl, userData, lawyerData } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(Date.now());
  const [showChatSidebar, setShowChatSidebar] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const AI_NAME = "Lexi";
  const MESSAGE_LIMIT = 20;

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatHistory(savedHistory);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/chatbot/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.msg || "Failed to process request");
      }

      const botReply = { sender: "bot", text: data.response };
      setMessages((prev) => {
        const newMessages = [...prev, botReply];
        saveChatHistory(newMessages);
        return newMessages;
      });
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const saveChatHistory = (newMessages) => {
    setChatHistory((prevHistory) => {
      const chatName = newMessages.find((msg) => msg.sender === "user")?.text.slice(0, 20) || `Chat ${new Date().toLocaleTimeString()}`;
      const updatedHistory = [
        { id: currentChatId, name: chatName, messages: newMessages, timestamp: Date.now() },
        ...prevHistory.filter((chat) => chat.id !== currentChatId),
      ].slice(0, 10);
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const deleteChat = (chatId) => {
    setChatHistory((prevHistory) => {
      const updatedHistory = prevHistory.filter((chat) => chat.id !== chatId);
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      if (chatId === currentChatId) {
        setMessages([]);
        setCurrentChatId(Date.now());
      }
      return updatedHistory;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(Date.now());
    setShowChatSidebar(false);
  };

  const loadChat = (chatId) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setShowChatSidebar(false);
    }
  };

  const isChatLimitReached = messages.length >= MESSAGE_LIMIT;

  return (
    <div >
      < ClietnSidebar />
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
        <Header
          displayName={userData?.fullName || lawyerData?.fullName || "User"}
          practiceAreas={lawyerData ? "Legal Assistance" : "Client"}
        />
        <div className="flex-1 flex items-center justify-center p-6 mt-16">
          <div className="w-full  bg-gradient-to-br from-blue-50 to-blue-200 rounded-xl shadow-2xl h-[80vh] relative overflow-hidden transition-all duration-300">
            {/* Main Chat Area */}
            <div className="flex flex-col h-full">
              {/* Toggle Sidebar Button - Hidden when sidebar is open */}
              {!showChatSidebar && (
                <button
                  onClick={() => setShowChatSidebar(true)}
                  className="absolute top-4 left-4 p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-md z-10"
                  title="Show Chat History"
                >
                  <Bars3Icon className="h-5 w-5" />
                </button>
              )}

              {messages.length === 0 ? (
                // Empty State: Rounded Input Centered
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <p className="text-blue-700 text-lg font-medium mb-6 animate-[fadeIn_0.5s_ease-in-out]">
                    Ask Lexi anything about Sri Lankan law!
                  </p>
                  <div className="flex items-center gap-4 w-full max-w-md">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your question..."
                      ref={inputRef}
                      className="flex-1 p-3 bg-white border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 disabled:bg-gray-200 transition-all duration-200 shadow-sm"
                      disabled={loading || isChatLimitReached}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={loading || isChatLimitReached}
                      className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                // Chat State: Messages Above, Input Below
                <>
                  <div className="flex-1 overflow-y-auto p-6 pt-16 bg-gradient-to-b from-blue-50 to-blue-100">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4 animate-[slideUp_0.3s_ease-out]`}
                      >
                        <div
                          className={`max-w-md p-4 rounded-xl shadow-md ${
                            msg.sender === "user"
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                              : "bg-white text-gray-900 border-l-4 border-blue-500"
                          }`}
                          style={{ whiteSpace: "pre-wrap" }}
                          dangerouslySetInnerHTML={{ __html: msg.text }}
                        />
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start mb-4">
                        <div className="p-4 rounded-xl bg-white text-blue-700 flex items-center gap-2 shadow-sm">
                          <span className="animate-pulse text-lg">...</span>
                        </div>
                      </div>
                    )}
                    {isChatLimitReached && (
                      <div className="text-center text-blue-600 text-sm mb-4 font-medium animate-[fadeIn_0.5s_ease-in-out]">
                        Chat limit reached. Start a new chat!
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-6 bg-blue-100 border-t border-blue-200">
                    <div className="flex items-center gap-4 w-full max-w-md mx-auto">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your question..."
                        ref={inputRef}
                        className="flex-1 p-3 bg-white border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 disabled:bg-gray-200 transition-all duration-200 shadow-sm"
                        disabled={loading || isChatLimitReached}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={loading || isChatLimitReached}
                        className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                      >
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Chatbot Sidebar - Overlay with Delete Button */}
            {showChatSidebar && (
              <div className="absolute inset-y-0 left-0 w-72 bg-gradient-to-b from-blue-50 to-blue-100 border-r border-teal-200 p-4 flex flex-col shadow-lg z-20 animate-[slideIn_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-blue-800">Chat History</h3>
                  <button
                    onClick={() => setShowChatSidebar(false)}
                    className="p-1 bg-blue-200 hover:bg-blue-300 rounded-full transition-all duration-200"
                    title="Hide Sidebar"
                  >
                    <XMarkIcon className="h-5 w-5 text-blue-600" />
                  </button>
                </div>
                <button
                  onClick={startNewChat}
                  className="w-full p-2 mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-md"
                >
                  New Chat
                </button>
                <div className="flex-1 overflow-y-auto">
                  {chatHistory.length === 0 ? (
                    <p className="text-blue-500 text-sm">No chats yet</p>
                  ) : (
                    chatHistory.map((chat) => (
                      <div key={chat.id} className="flex items-center justify-between p-3 text-blue-700 hover:bg-blue-200 rounded-md text-sm transition-all duration-150">
                        <button
                          onClick={() => loadChat(chat.id)}
                          className="flex-1 text-left truncate"
                        >
                          {chat.name}
                        </button>
                        <button
                          onClick={() => deleteChat(chat.id)}
                          className="p-1 bg-red-200 hover:bg-red-300 rounded-full transition-all duration-200"
                          title="Delete Chat"
                        >
                          <TrashIcon className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;