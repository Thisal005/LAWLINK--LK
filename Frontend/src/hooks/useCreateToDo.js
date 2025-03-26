// hooks/useCreateTodo.js
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";

const useCreateTodo = () => {
  const [loading, setLoading] = useState(false);
  const { backendUrl, lawyerData } = useContext(AppContext);

  const createTodo = async (taskName) => {
    if (!taskName.trim()) {
      toast.error("Task name is required");
      return;
    }

    if (!lawyerData) {
      toast.error("You must be a lawyer to create to-do items");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/todos`,
        { taskName },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success("To-do item created successfully!");
      setLoading(false);
      return res.data;
    } catch (error) {
      console.error("Error creating todo:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Failed to create to-do item");
      setLoading(false);
    }
  };

  return { loading, createTodo };
};

export default useCreateTodo;