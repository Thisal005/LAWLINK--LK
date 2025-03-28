// frontend/src/pages/Dashboard/Lawyer/ViewCases.jsx
import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LawyerSidebar from "../Components/dashboard/lawyer/LawyerSidebar";
import Header from "../Components/dashboard/lawyer/LawyerHeader";
import ViewCaseCard from "../Components/dashboard/lawyer/ViewCaseCard";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase } from "lucide-react";

const ViewCases = () => {
  const { lawyerData, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCases = async () => {
      if (!lawyerData?._id) {
        console.log("No lawyer ID found:", lawyerData);
        toast.error("Please log in as a lawyer to view cases.");
        navigate("/lawyer-login");
        return;
      }

      setLoading(true);
      try {
        console.log("Fetching cases from:", `${backendUrl}/api/case/all`);
        const response = await axios.get(`${backendUrl}/api/case/all`, {
          withCredentials: true,
        });

        console.log("Full API Response:", response);
        if (response.data.success) {
          const caseData = response.data.data || [];
          // Filter out cases with status "closed" or "completed"
          const filteredCases = caseData.filter(
            (caseItem) => caseItem.status !== "closed" && caseItem.status !== "completed"
          );
          setCases(filteredCases);
          if (filteredCases.length === 0) {
            toast.info("No unassigned cases available at the moment.");
          }
        } else {
          toast.error(response.data.msg || "Failed to fetch cases.");
          setCases([]);
          if (response.data.msg === "Unauthorized") {
            navigate("/lawyer-login");
          }
        }
      } catch (error) {
        console.error("Error fetching cases:", error.response?.data || error.message);
        toast.error(error.response?.data?.msg || "Something went wrong fetching cases.");
        setCases([]);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          navigate("/lawyer-login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllCases();
  }, [lawyerData, backendUrl, navigate]);

  const handleSendOffer = async (caseId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/case/offer/${caseId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Offer sent to the client!");
        setCases(cases.filter((c) => c._id !== caseId));
      } else {
        toast.error(response.data.msg || "Failed to send offer.");
      }
    } catch (error) {
      console.error("Error sending offer:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Failed to send offer.");
      if (error.response?.status === 401) {
        navigate("/lawyer-login");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <LawyerSidebar activeTab="View Cases" />
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72">
        <Header
          displayName={lawyerData?.fullName || "Lawyer"}
          practiceAreas={lawyerData?.practiceAreas || "Lawyer"}
        />
        <main className="flex-1 p-6 pt-20 lg:pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                  <div>
                    <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
                      Available Cases
                    </h2>
                    <p className="mt-2 text-gray-600 text-lg">
                      Browse unassigned cases in your expertise and district.
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/lawyer-dashboard")}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </motion.button>
              </div>
            </div>

            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-700"
              >
                <span className="flex items-center justify-center gap-3 text-xl">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Loading available cases...
                </span>
              </motion.div>
            ) : cases.length > 0 ? (
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
                  >
                    <ViewCaseCard
                      title={caseItem.subject || "Untitled Case"}
                      description={caseItem.description || "No description provided."}
                      district={caseItem.district}
                      caseType={caseItem.caseType}
                      expanded={false}
                      onSendOffer={() => handleSendOffer(caseItem._id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/90 backdrop-blur-md rounded-xl p-10 shadow-lg border border-gray-100 text-center"
              >
                <svg
                  className="w-20 h-20 mx-auto text-gray-400 mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4M4 13h4m4-9v16"
                  />
                </svg>
                <p className="text-2xl font-semibold text-gray-800">No Cases Available</p>
                <p className="mt-3 text-gray-600 text-base">
                  There are currently no unassigned cases matching your criteria.
                </p>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ViewCases;