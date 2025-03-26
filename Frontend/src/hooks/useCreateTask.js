// hooks/useCreateTask.js
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";

const useCreateTask = () => {
  const [loading, setLoading] = useState(false);
  const { backendUrl, userData, lawyerData } = useContext(AppContext);

  const createTask = async (taskName, description, clientId, caseId) => {
    if (!taskName.trim() || !description.trim() || !clientId || !caseId) {
      toast.error("All fields are required");
      return;
    }

    const currentUser = lawyerData; // Only lawyers can create tasks
    if (!currentUser) {
      toast.error("You must be a lawyer to assign tasks");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/tasks`,
        { taskName, description, clientId, caseId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success("Task assigned successfully!");
      setLoading(false);
      return res.data; // Return the created task
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to assign task");
      setLoading(false);
    }
  };

  return { loading, createTask };
};

export default useCreateTask;