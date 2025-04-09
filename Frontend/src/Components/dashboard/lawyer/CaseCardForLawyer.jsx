import React, { useState, useContext } from "react";
import useFetchCase from "../../../hooks/useFetchCase";
import useFetchAssignedTasks from "../../../hooks/useFetchAssignedTask";
import { AppContext } from "../../../Context/AppContext";
import { Circle, Briefcase, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import LawyerTaskCard from "./LawyerTaskCard";

const CaseCard = ({ caseId, addNotification }) => {
  const { caseData, loading, refetch } = useFetchCase(caseId);
  const { backendUrl } = useContext(AppContext);
  const { tasks, loading: fetchLoading, fetchAssignedTasks } = useFetchAssignedTasks(caseId);
  const [localStatus, setLocalStatus] = useState(null);
  const [showClosePopup, setShowClosePopup] = useState(false);
  const [isSureChecked, setIsSureChecked] = useState(false);

  const capitalizeText = (text) => {
    if (!text || typeof text !== "string") return "N/A";
    return text
      .split(/[- ]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const capitalizeStatus = (status) => {
    if (!status || typeof status !== "string") return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleCloseCase = async () => {
    console.log("handleCloseCase triggered for caseId:", caseId);
    try {
      const response = await axios.put(
        `${backendUrl}/api/case/${caseId}/close`,
        {},
        { withCredentials: true }
      );
      console.log("Close case response:", response.data);
      if (response.data.success) {
        setLocalStatus("closed");
        refetch();
        toast.success("Case closed successfully!");
        if (addNotification && caseData?.subject) {
          addNotification(`You have closed the case "${caseData.subject}"`);
        }
      } else {
        throw new Error(response.data.msg || "Failed to close case");
      }
    } catch (error) {
      console.error("Error closing case:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Failed to close case.");
    } finally {
      setShowClosePopup(false);
      setIsSureChecked(false);
    }
  };

  const handleCloseClick = (e) => {
    e.stopPropagation();
    console.log("Close Case icon clicked");
    setShowClosePopup(true);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600 bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-sm">
        <Circle className="w-5 h-5 text-blue-500 animate-pulse" />
        <p>Loading case details...</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <p className="text-gray-600 bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-sm">
        Case not found.
      </p>
    );
  }

  const effectiveStatus = localStatus || caseData.status;
  const isClosed = effectiveStatus === "closed";

  return (
    <div className="relative">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`group bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 relative z-10 ${
          isClosed
            ? "opacity-75"
            : "hover:border-blue-500 hover:bg-blue-50/20 hover:shadow-xl"
        } ${showClosePopup ? "blur-sm" : ""}`}
        role="article"
        tabIndex="0"
        aria-label="View case details"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {caseData.subject || "Unnamed Case"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Client: {caseData.clientId?.fullName || "Unknown Client"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center relative">
              <span
                className={`w-4 h-4 rounded-full ${
                  effectiveStatus === "ongoing"
                    ? "bg-blue-500 animate-pulse"
                    : effectiveStatus === "pending"
                    ? "bg-yellow-500"
                    : effectiveStatus === "completed"
                    ? "bg-green-500"
                    : effectiveStatus === "closed"
                    ? "bg-gray-400"
                    : "bg-gray-500"
                } absolute`}
                style={{ filter: "drop-shadow(0 0 6px rgba(0, 0, 0, 0.2))" }}
              />
            </div>
            {!isClosed && (
              <button
                onClick={handleCloseClick}
                className="p-2 hover:bg-red-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Close case"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="red"
                  strokeWidth="2"
                  className="text-red-600"
                >
                  <circle cx="12" cy="12" r="10" stroke="red" fill="none" />
                  <line x1="6" y1="12" x2="18" y2="12" stroke="red" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">Case Type:</span>
            <span className="font-semibold text-gray-900">
              {capitalizeText(caseData.caseType)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">District:</span>
            <span className="font-semibold text-gray-900">
              {capitalizeText(caseData.district)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Circle
              className={`w-5 h-5 ${
                effectiveStatus === "ongoing"
                  ? "text-blue-500 animate-pulse"
                  : effectiveStatus === "pending"
                  ? "text-yellow-500"
                  : effectiveStatus === "completed"
                  ? "text-green-500"
                  : effectiveStatus === "closed"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            />
            <span className="text-gray-600">Status:</span>
            <span
              className={`font-semibold ${
                effectiveStatus === "ongoing"
                  ? "text-blue-600"
                  : effectiveStatus === "pending"
                  ? "text-yellow-600"
                  : effectiveStatus === "completed"
                  ? "text-green-600"
                  : effectiveStatus === "closed"
                  ? "text-gray-600"
                  : "text-gray-600"
              }`}
            >
              {capitalizeStatus(effectiveStatus)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">Court Date:</span>
            <span className="font-semibold text-gray-900">
              {caseData.courtDate
                ? new Date(caseData.courtDate).toLocaleDateString()
                : "TBD"}
            </span>
          </div>
        </div>
      </motion.article>

      {/* Modern Close Case Popup */}
      {showClosePopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl"
          onClick={() => setShowClosePopup(false)}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Confirm Case Closure
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Closing this case is permanent. Are you sure you want to proceed?
            </p>
            <div className="flex items-center gap-3 mb-6">
              <input
                type="checkbox"
                id="confirm-checkbox"
                checked={isSureChecked}
                onChange={(e) => setIsSureChecked(e.target.checked)}
                className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-offset-0 cursor-pointer"
              />
              <label
                htmlFor="confirm-checkbox"
                className="text-sm text-gray-700 font-medium cursor-pointer"
              >
                I confirm that I want to close this case.
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowClosePopup(false);
                  setIsSureChecked(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseCase}
                disabled={!isSureChecked}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isSureChecked
                    ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Close Case
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CaseCard;