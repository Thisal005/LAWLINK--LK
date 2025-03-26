// hooks/useFetchCase.js
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";

const useFetchCase = (caseId) => {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { backendUrl } = useContext(AppContext);

  const fetchCase = async () => {
    if (!caseId || !/^[0-9a-fA-F]{24}$/.test(caseId)) {
      console.warn("useFetchCase - Invalid or missing caseId:", caseId);
      setCaseData(null);
      setLoading(false);
      setError("Invalid case ID");
      return;
    }

    setLoading(true);
    setError(null); // Reset error state before fetch
    try {
      const res = await axios.get(`${backendUrl}/api/case/${caseId}`, {
        withCredentials: true,
      });

      console.log("useFetchCase - caseId:", caseId, "Full Response:", res.data);

      if (res.data.success && res.data.data) {
        setCaseData(res.data.data);
        console.log("useFetchCase - Set caseData:", res.data.data);
      } else {
        console.warn("useFetchCase - No valid case data:", res.data);
        setCaseData(null);
        setError(res.data.msg || "No case data returned");
      }
    } catch (error) {
      console.error("useFetchCase - Error fetching case:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.msg || error.message;
      setError(errorMsg);

      if (error.response?.status === 403) {
        console.log("useFetchCase - Access denied to case:", caseId);
        toast.error("You are not authorized to view this case.");
        setCaseData(null);
      } else if (error.response?.status === 404) {
        console.log("useFetchCase - Case not found:", caseId);
        toast.error("Case not found.");
        setCaseData(null);
      } else {
        toast.error(errorMsg || "Failed to fetch case details");
        setCaseData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [caseId, backendUrl]);

  // Add refetch function to allow manual refresh
  const refetch = () => {
    fetchCase();
  };

  return { caseData, loading, error, refetch };
};

export default useFetchCase;