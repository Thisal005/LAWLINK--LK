// hooks/useUpdateTodoStatus.js
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";

const useUpdateTodoStatus = () => {
  const [loading, setLoading] = useState(false);
  const { backendUrl, lawyerData } = useContext(AppContext);

  const updateTodoStatus = async (todoId, status) => {
    if (!todoId || !status) {
      toast.error("To-do ID and status are required");
      return;
    }

    if (!lawyerData) {
      toast.error("You must be a lawyer to update to-do items");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.put(
        `${backendUrl}/api/todos/${todoId}`,
        { status },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success("To-do status updated successfully!");
      setLoading(false);
      return res.data;
    } catch (error) {
      console.error("Error updating todo status:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Failed to update to-do status");
      setLoading(false);
    }
  };

  return { loading, updateTodoStatus };
};

export default useUpdateTodoStatus;