import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";

const useFetchAssignedTasks = (caseId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl, lawyerData } = useContext(AppContext);

  const fetchAssignedTasks = async () => {
    if (!caseId || !lawyerData) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${backendUrl}/api/tasks/assigned/${caseId}`,
        { withCredentials: true }
      );

      setTasks(res.data);
    } catch (error) {
      console.error(
        "Error fetching assigned tasks:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.msg || "Failed to fetch assigned tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedTasks();
  }, [caseId, backendUrl, lawyerData]);

  return { tasks, loading, fetchAssignedTasks };
};

export default useFetchAssignedTasks;