import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import ClientSidebar from "../../Components/dashboard/client/ClientSideBar";
import Header from "../../Components/dashboard/client/ClientHeader";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Trash2,
  ArrowLeft,
  Clock,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Calendar,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

const CaseDetails = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      if (!userData?._id) {
        toast.error("Please log in to view case details.");
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/case/${id}`, {
          withCredentials: true,
        });
        if (response.data.success && response.data.data) {
          const fetchedCase = response.data.data;
          setCaseData(fetchedCase);
          if (fetchedCase.status === "closed") {
            toast.info("This case is closed. Redirecting to dashboard.");
            navigate("/client-dashboard");
          }
        } else {
          throw new Error(response.data.msg || "No case data found");
        }
      } catch (error) {
        console.error("Failed to fetch case details:", error.response?.data || error.message);
        toast.error(error.response?.data?.msg || "Failed to load case details.");
        navigate("/client-dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [id, backendUrl, userData, navigate]);

  const handleDelete = async () => {
    setShowConfirm(false);
    try {
      const response = await axios.delete(`${backendUrl}/api/case/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success("Case deleted successfully!");
        navigate("/client-dashboard");
      } else {
        throw new Error(response.data.msg || "Failed to delete case");
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Failed to delete case.");
    }
  };

  const canDeleteCase = () => caseData?.status === "pending" && !caseData?.lawyerId && caseData?.status !== "closed";

  const capitalizeText = (text) =>
    text
      ? text
          .split(/[- ]+/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "N/A";

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 text-gray-700"
        >
          <Clock className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-xl font-semibold">Loading Case Details...</span>
        </motion.div>
      </div>
    );
  }

  if (!caseData) return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <ClientSidebar />
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
        <Header displayName={userData?.fullName || "Client"} practiceAreas="Client" />
        <main className="flex-1 p-6 pt-20 lg:pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-8 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">{caseData.subject}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Case ID: {caseData._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                </div>
                {canDeleteCase() && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConfirm(true)}
                    className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Case
                  </motion.button>
                )}
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <FileText className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <p className="text-gray-700 text-base leading-relaxed">
                      {caseData.description || "No description provided."}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Case Type</label>
                    <p className="text-gray-800 text-base font-semibold">
                      {capitalizeText(caseData.caseType) || "General"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">District</label>
                    <p className="text-gray-800 text-base font-semibold">
                      {capitalizeText(caseData.district) || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle
                    className={`w-6 h-6 ${
                      caseData.status === "ongoing"
                        ? "text-blue-500 animate-pulse"
                        : caseData.status === "completed"
                        ? "text-green-500"
                        : caseData.status === "closed"
                        ? "text-gray-400"
                        : "text-yellow-500"
                    }`}
                    style={
                      caseData.status === "ongoing"
                        ? { filter: "drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))" }
                        : {}
                    }
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <p
                      className={`text-lg font-semibold capitalize ${
                        caseData.status === "ongoing"
                          ? "text-blue-600"
                          : caseData.status === "completed"
                          ? "text-green-600"
                          : caseData.status === "closed"
                          ? "text-gray-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {caseData.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created At</label>
                    <p className="text-gray-700 text-base">
                      {new Date(caseData.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Court Date</label>
                    <p className="text-gray-700 text-base">
                      {caseData.status === "closed"
                        ? "N/A"
                        : caseData.courtDate
                        ? new Date(caseData.courtDate).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "To Be Determined"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-600" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Assigned Lawyer</label>
                    <p className="text-gray-800 text-base font-semibold">
                      {caseData.status === "closed"
                        ? "Disconnected"
                        : caseData.lawyerId?.fullName || "Awaiting Assignment"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-gray-200 bg-gray-50">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/client-dashboard")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 text-base font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </motion.button>
            </div>
          </motion.div>

          {showConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  Confirm Deletion
                </h3>
                <p className="text-gray-600 mb-6 text-base leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-800">"{caseData.subject}"</span>? This
                  action is irreversible and can only be performed before a lawyer accepts the case.
                </p>
                <div className="flex gap-4 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2 text-base font-medium"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConfirm(false)}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-sm flex items-center gap-2 text-base font-medium"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CaseDetails;