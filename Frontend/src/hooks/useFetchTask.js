// hooks/useFetchTasks.js
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";

const useFetchTasks = (caseId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);

  const fetchTasks = async () => {
    if (!caseId) return;

    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/tasks/case/${caseId}`, {
        withCredentials: true,
      });

      setTasks(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [caseId, backendUrl]);

  return { tasks, loading, fetchTasks };
};

export default useFetchTasks;