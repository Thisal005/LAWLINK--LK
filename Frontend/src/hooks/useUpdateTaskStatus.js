// hooks/useUpdateTaskStatus.js
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";

const useUpdateTaskStatus = () => {
  const [loading, setLoading] = useState(false);
  const { backendUrl, userData } = useContext(AppContext);

  const updateTaskStatus = async (taskId, status) => {
    if (!taskId || !status) {
      toast.error("Task ID and status are required");
      return;
    }

    if (!userData) {
      toast.error("You must be logged in to update task status");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.put(
        `${backendUrl}/api/tasks/${taskId}`,
        { status },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success("Task status updated successfully!");
      setLoading(false);
      return res.data;
    } catch (error) {
      console.error("Error updating task status:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Failed to update task status");
      setLoading(false);
    }
  };

  return { loading, updateTaskStatus };
};

export default useUpdateTaskStatus;