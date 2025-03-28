// frontend/src/CaseHistory.jsx
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/dashboard/client/ClientSideBar";
import Header from "../../Components/dashboard/client/ClientHeader";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText, Clock, CheckCircle, Circle, MapPin, Briefcase, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const CaseHistory = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      if (!userData?._id) {
        toast.error("Please log in to view your cases.");
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/case/user/${userData._id}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setCases(response.data.data || []);
        } else {
          toast.error(response.data.msg || "Failed to fetch cases.");
          setCases([]);
        }
      } catch (error) {
        console.error("Error fetching cases:", error.response?.data || error.message);
        toast.error(error.response?.data?.msg || "Something went wrong.");
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [backendUrl, userData, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case "ongoing":
        return (
          <Circle
            className="w-6 h-6 text-blue-500 animate-pulse"
            style={{ filter: "drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))" }}
          />
        );
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "closed":
        return <Circle className="w-6 h-6 text-gray-400" />;
      default:
        return <Circle className="w-6 h-6 text-gray-500" />;
    }
  };

  const capitalizeText = (text) =>
    text
      ? text
          .split(/[- ]+/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "N/A";

  const handleCaseClick = (caseItem) => {
    if (caseItem.status === "closed" || caseItem.status === "completed") {
      navigate("/client-dashboard");
      toast.info("This case is closed or completed. Redirecting to dashboard.");
    } else {
      navigate(`/case/${caseItem._id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 text-gray-700"
        >
          <Circle
            className="w-8 h-8 text-blue-500 animate-pulse"
            style={{ filter: "drop-shadow(0 0 6px rgba(99, 102, 241, 0.5))" }}
          />
          <span className="text-xl font-semibold">Loading your cases...</span>
        </motion.div>
      </div>
    );
  }

  const displayName = userData?.fullName || "Client";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
        <Header displayName={displayName} practiceAreas="Client" />
        <main className="flex-1 p-6 pt-20 lg:pt-24 pb-16 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
              <h2 className="text-4xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                Your Case History
              </h2>
              <p className="mt-2 text-gray-600 text-lg">
                Review all your legal cases in one place.
              </p>
            </div>

            {cases.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/90 backdrop-blur-md rounded-xl p-10 shadow-lg border border-gray-100 text-center"
              >
                <FileText className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <p className="text-2xl font-semibold text-gray-800">
                  No Cases Found
                </p>
                <p className="mt-3 text-gray-600 text-base leading-relaxed">
                  It looks like you haven’t posted any cases yet. Get started by submitting your first case.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/post-case")}
                  className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-base font-medium"
                >
                  Post a Case
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="space-y-6"
              >
                {cases.map((caseItem) => (
                  <motion.div
                    key={caseItem._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`bg-white rounded-xl shadow-md p-8 transition-shadow border border-gray-100 ${
                      caseItem.status === "closed" || caseItem.status === "completed" ? "opacity-75 cursor-default" : "hover:shadow-xl cursor-pointer"
                    }`}
                    onClick={() => handleCaseClick(caseItem)}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-gray-800">
                          {caseItem.subject || "Untitled Case"}
                        </h3>
                        <p className="mt-3 text-gray-600 text-base leading-relaxed line-clamp-2">
                          {caseItem.description || "No description provided."}
                        </p>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-base">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span>
                              <span className="font-medium">Court Date:</span>{" "}
                              {caseItem.status === "closed" || caseItem.status === "completed"
                                ? "N/A"
                                : caseItem.courtDate
                                ? new Date(caseItem.courtDate).toLocaleDateString()
                                : "TBD"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <span>
                              <span className="font-medium">Created:</span>{" "}
                              {new Date(caseItem.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <span>
                              <span className="font-medium">District:</span>{" "}
                              {capitalizeText(caseItem.district)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                            <span>
                              <span className="font-medium">Type:</span>{" "}
                              {capitalizeText(caseItem.caseType)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full shadow-sm">
                        {getStatusIcon(caseItem.status)}
                        <span
                          className={`text-base font-semibold capitalize ${
                            caseItem.status === "pending"
                              ? "text-yellow-600"
                              : caseItem.status === "ongoing"
                              ? "text-blue-600"
                              : caseItem.status === "completed"
                              ? "text-green-600"
                              : caseItem.status === "closed"
                              ? "text-gray-600"
                              : "text-gray-600"
                          }`}
                        >
                          {caseItem.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default CaseHistory;