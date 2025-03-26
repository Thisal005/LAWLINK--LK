// hooks/useFetchTodos.js
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";

const useFetchTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl, lawyerData } = useContext(AppContext);

  const fetchTodos = async () => {
    if (!lawyerData) return;

    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/todos`, {
        withCredentials: true,
      });

      setTodos(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching todos:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Failed to fetch to-do items");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [backendUrl, lawyerData]);

  return { todos, loading, fetchTodos };
};

export default useFetchTodos;