// hooks/useFetchNotes.js
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";

const useFetchNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl, userData } = useContext(AppContext);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!userData) return;

      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/notes/client`, {
          withCredentials: true,
        });

        setNotes(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notes:", error.response?.data || error.message);
        toast.error(error.response?.data?.msg || "Failed to fetch notes");
        setLoading(false);
      }
    };

    fetchNotes();
  }, [backendUrl, userData]);

  return { notes, loading };
};

export default useFetchNotes;