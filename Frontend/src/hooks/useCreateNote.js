// hooks/useCreateNote.js
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";

const useCreateNote = () => {
  const [loading, setLoading] = useState(false);
  const { backendUrl, lawyerData } = useContext(AppContext);

  const createNote = async (content, clientId, caseId) => {
    if (!content.trim() || !clientId) {
      toast.error("Content and client ID are required");
      return;
    }

    if (!lawyerData) {
      toast.error("You must be a lawyer to create notes");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/notes`,
        { content, clientId, caseId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success("Note created successfully!");
      setLoading(false);
      return res.data;
    } catch (error) {
      console.error("Error creating note:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Failed to create note");
      setLoading(false);
    }
  };

  return { loading, createNote };
};

export default useCreateNote;