// frontend/src/Components/CaseCard.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useFetchCase from "../../../hooks/useFetchCase";
import { AppContext } from "../../../Context/AppContext";
import { Circle, Briefcase, Calendar, MapPin, MoreVertical, X } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const CaseCard = ({ caseId }) => {
  const { caseData, loading, refetch } = useFetchCase(caseId);
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState(null);

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
    try {
      console.log("handleCloseCase - backendUrl:", backendUrl);
      console.log("handleCloseCase - caseId:", caseId);
      const response = await axios.put(
        `${backendUrl}/api/case/${caseId}/close`,
        {},
        { withCredentials: true }
      );
      console.log("handleCloseCase - response:", response.data);
      if (response.data.success) {
        setLocalStatus("closed");
        refetch();
        toast.success("Case closed successfully!");
      } else {
        throw new Error(response.data.msg || "Failed to close case");
      }
    } catch (error) {
      console.error("Error closing case:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Failed to close case.");
    } finally {
      setMenuOpen(false);
    }
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
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`group bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 ${
        isClosed
          ? "opacity-75 cursor-default"
          : "hover:border-blue-500 hover:bg-blue-50/20 hover:shadow-xl cursor-pointer"
      }`}
      role="button"
      tabIndex="0"
      aria-label="View your case details"
      onClick={!isClosed ? () => navigate(`/case/${caseData._id}`) : undefined}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            {caseData.subject || "Unnamed Case"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Client: {isClosed ? "Disconnected" : caseData.clientId?.fullName || "Unknown Client"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center relative"
            aria-hidden="true"
          >
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
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-40 z-10"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseCase();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Close Case
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
  );
};

export default CaseCard;