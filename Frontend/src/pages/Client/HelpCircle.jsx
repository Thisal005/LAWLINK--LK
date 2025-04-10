import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion } from "framer-motion";
import ClientHeader from "../../Components/dashboard/client/ClientHeader"; // Adjusted path
import ClientSidebar from "../../Components/dashboard/client/ClientSideBar"; // Adjusted path (corrected 'ClientSideBar')

const HelpCircle = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const sections = [
    {
      title: "How to Post a Case",
      content: (
        <>
          <ol className="list-decimal pl-5 space-y-3 text-gray-600">
            <li>Log in to your lawyer dashboard.</li>
            <li>Go to "Cases" in the sidebar.</li>
            <li>Click "Post a Case."</li>
            <li>Enter Title, Description, Case Type, and District.</li>
            <li>Upload relevant documents (PDFs or images).</li>
            <li>Click "Submit" to publish the case.</li>
          </ol>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 text-gray-700">
            <strong className="text-gray-800">Tip:</strong> Write clear descriptions to attract clients.
          </div>
        </>
      ),
    },
    {
      title: "How to Schedule an Online Meeting",
      content: (
        <>
          <ol className="list-decimal pl-5 space-y-3 text-gray-600">
            <li>Navigate to "Meetings" from your dashboard.</li>
            <li>Click "Schedule Meeting."</li>
            <li>Enter Date, Time, Client Email, and Purpose.</li>
            <li>Select "Online" as the meeting type.</li>
            <li>Save to generate a meeting link.</li>
            <li>Share the link with your client.</li>
          </ol>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 text-gray-700">
            <strong className="text-gray-800">Tip:</strong> Test your camera and microphone beforehand.
          </div>
        </>
      ),
    },
    {
      title: "Viewing Case Details",
      content: (
        <>
          <p className="text-gray-600 mb-3">
            You can view detailed information about your active cases directly from the sidebar:
          </p>
          <ol className="list-decimal pl-5 space-y-3 text-gray-600">
            <li>Locate the "Active Cases" section in the sidebar.</li>
            <li>Click on a case to view its details, such as status, client info, and attached documents.</li>
            <li>Use this section to monitor ongoing cases efficiently.</li>
          </ol>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 text-gray-700">
            <strong className="text-gray-800">Tip:</strong> Regularly check this section to stay updated on your cases.
          </div>
        </>
      ),
    },
    {
      title: "Ask Lex Bot",
      content: (
        <>
          <p className="text-gray-600 mb-3">
            Lex Bot is an AI-powered assistant that answers general questions about the law in Sri Lanka:
          </p>
          <ol className="list-decimal pl-5 space-y-3 text-gray-600">
            <li>Access Lex Bot from the dashboard or help section.</li>
            <li>
              Ask questions like "What are the requirements for a will in Sri Lanka?" or "How long does a civil case take?"
            </li>
            <li>Receive instant responses based on Sri Lankan legal principles.</li>
            <li>For detailed advice, consult a qualified lawyer.</li>
          </ol>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 text-gray-700">
            <strong className="text-gray-800">Tip:</strong> Lex Bot is great for quick clarifications, not legal representation.
          </div>
        </>
      ),
    },
    {
      title: "Explore All Features",
      content: (
        <>
          <p className="text-gray-600">Enhance your practice with these tools:</p>
          <ol className="list-decimal pl-5 space-y-3 mt-2 text-gray-600">
            <li>
              <strong>Profile Management:</strong> Update bio and qualifications in "Account Settings."
            </li>
            <li>
              <strong>Case Management:</strong> Track cases in the "Cases" tab.
            </li>
            <li>
              <strong>Messaging:</strong> Securely chat with clients via "Messages."
            </li>
            <li>
              <strong>Analytics:</strong> View stats in "Dashboard Analytics."
            </li>
            <li>
              <strong>Notifications:</strong> Get real-time alerts for updates.
            </li>
          </ol>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 text-gray-700">
            <strong className="text-gray-800">Tip:</strong> Keep your profile updated for credibility.
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <ClientSidebar className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg z-40" />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <ClientHeader className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md z-50" />

        {/* Help Content */}
        <main className="p-8 pt-24 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Help Center</h2>
            <section className="space-y-6">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full flex justify-between items-center p-5 text-left text-lg font-semibold text-gray-800 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {section.title}
                    {activeSection === index ? (
                      <FaChevronUp className="text-gray-500" />
                    ) : (
                      <FaChevronDown className="text-gray-500" />
                    )}
                  </button>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: activeSection === index ? "auto" : 0,
                      opacity: activeSection === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 border-t border-gray-200">{section.content}</div>
                  </motion.div>
                </motion.div>
              ))}
            </section>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default HelpCircle;