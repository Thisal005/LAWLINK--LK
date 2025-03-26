// frontend/src/pages/Dashboard/Lawyer/ViewCaseCard.jsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Send, X } from "lucide-react";
import { motion } from "framer-motion";

const ViewCaseCard = ({ title, description, district, caseType, expanded, onSendOffer }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isSending, setIsSending] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);

  const capitalizeText = (text) =>
    text
      ? text
          .split(/[- ]+/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "N/A";

  const handleSendOfferClick = async (e) => {
    e.stopPropagation();
    setShowPopup(true);
  };

  const confirmSendOffer = async () => {
    if (!agreementChecked) {
      alert("Please agree to the terms before sending the offer.");
      return;
    }
    setIsSending(true);
    setShowPopup(false);
    try {
      await onSendOffer();
    } finally {
      setIsSending(false);
      setAgreementChecked(false);
    }
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
        whileHover={{ y: -2 }}
      >
        <div
          className="p-6 flex justify-between items-start cursor-pointer bg-gradient-to-r from-gray-50 to-white"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <p
              className={`mt-2 text-gray-600 text-sm leading-relaxed ${
                isExpanded ? "" : "line-clamp-2"
              }`}
            >
              {description}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              <span>District: {capitalizeText(district)}</span> |{" "}
              <span>Case Type: {capitalizeText(caseType)}</span>
            </div>
          </div>
          <button className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6 bg-gray-50 border-t border-gray-100"
          >
            <div className="mt-4 flex justify-between items-center gap-6">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-700">How I Can Assist You</h4>
                <ul className="mt-2 text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>
                      <strong>Document Review:</strong> I’ll analyze relevant paperwork to fully understand your case.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>
                      <strong>Negotiation:</strong> I’ll aim for an efficient resolution on your behalf.
                    </span>
                  </li>
                </ul>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 text-white font-medium rounded-lg flex items-center gap-2 shadow-sm ${
                  isSending
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleSendOfferClick}
                disabled={isSending}
              >
                <Send className="w-4 h-4" />
                {isSending ? "Sending..." : "Send Offer"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Confirmation Popup */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 relative"
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Sending Offer
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Before sending your offer, please review and agree to our terms of service.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-60 overflow-y-auto text-sm text-gray-700 mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Lawyer Offer Agreement</h4>
              <p>By sending an offer to this client, you agree to the following terms:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Professional Conduct:</strong> You will uphold the highest standards of professionalism and confidentiality in all interactions with the client.
                </li>
                <li>
                  <strong>Accuracy:</strong> The information provided in your offer must be accurate and reflect your genuine ability to assist.
                </li>
                <li>
                  <strong>Response Time:</strong> You commit to responding to client inquiries within 48 hours after the offer is accepted.
                </li>
                <li>
                  <strong>Fee Transparency:</strong> Any fees or costs will be clearly communicated to the client upon acceptance.
                </li>
                <li>
                  <strong>Platform Rules:</strong> You will adhere to LawLinkLK’s policies, including non-discrimination, fair practice, and respect for client anonymity until engagement.
                </li>
                <li>
                  <strong>Liability:</strong> LawLinkLK is not liable for disputes arising from your engagement with the client; you assume responsibility for your legal services.
                </li>
              </ul>
              <p className="mt-2">
                Failure to comply may result in suspension or termination of your account.
              </p>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                id="agreement"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="agreement" className="text-sm text-gray-700">
                I have read and agree to the Lawyer Offer Agreement.
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmSendOffer}
                disabled={isSending || !agreementChecked}
                className={`px-4 py-2 text-white font-medium rounded-lg flex items-center gap-2 ${
                  isSending || !agreementChecked
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <Send className="w-4 h-4" />
                {isSending ? "Sending..." : "Confirm Offer"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default ViewCaseCard;