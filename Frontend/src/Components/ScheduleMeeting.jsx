import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuthContext } from "../Context/AuthContext";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const ScheduleMeeting = ({ caseId }) => {
  // Access user and backend URL from context
  const { user } = useAuthContext();
  const { backendUrl } = useContext(AppContext);

  // State variables to manage available slots, selected slot, loading states, errors, and lawyer ID
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lawyerId, setLawyerId] = useState(null);

  // Fetch case details to get the lawyer ID
  useEffect(() => {
    const fetchCaseDetails = async () => {
      if (!caseId) {
        toast.error("No case ID provided");
        setFetchLoading(false);
        return;
      }

      try {
        // Fetch participants of the case
        const participantsRes = await axios.get(`${backendUrl}/api/case/${caseId}/participants`, {
          withCredentials: true,
        });

        // Extract lawyer ID from participants
        if (participantsRes.data.success && participantsRes.data.data) {
          const lawyerIdFromParticipants = participantsRes.data.data.lawyer?.id;
          if (lawyerIdFromParticipants) {
            setLawyerId(lawyerIdFromParticipants);
          } else {
            setLawyerId(null);
          }
        }
      } catch (error) {
        console.error("Error fetching case:", error.response?.data || error.message);
        setLawyerId(null);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCaseDetails();
  }, [caseId, backendUrl]);

  // Fetch available time slots for the lawyer
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!lawyerId) {
        setError("No lawyer specified");
        setFetchLoading(false);
        return;
      }

      setFetchLoading(true);
      setError(null);

      try {
        // Fetch available slots from the backend
        const response = await axios.get(
          `${backendUrl}/api/availability/${lawyerId}`,
          { withCredentials: true }
        );
        const slots = response.data.data || [];
        setAvailableSlots(slots);

        // Show error if no slots are available
        if (slots.length === 0) {
          setError("No available slots found for this lawyer");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || "Failed to fetch available slots";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setFetchLoading(false);
      }
    };

    if (lawyerId) {
      fetchAvailableSlots();
    }

    // Poll for available slots every 10 seconds
    const interval = setInterval(() => {
      if (lawyerId) {
        fetchAvailableSlots();
      }
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [lawyerId, backendUrl]);

  // Handle scheduling a meeting
  const handleSchedule = async () => {
    if (!selectedSlot) {
      setError("Please select a time slot");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Send request to schedule the meeting
      const res = await axios.post(
        `${backendUrl}/api/meetings/schedule`,
        { caseId, scheduledAt: selectedSlot },
        { withCredentials: true }
      );

      // Show success message and update available slots
      toast.success("Meeting scheduled successfully!");
      setAvailableSlots((prev) =>
        prev.filter((slot) => slot.startTime !== selectedSlot)
      );
      setSelectedSlot("");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to schedule meeting";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while fetching data
  if (fetchLoading) {
    return (
      <div className="p-6 bg-white rounded-lg h-[347px] border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_12px_rgba(147,51,234,0.3)]"></span>
            </div>
            <h2 id="notes-header" className="text-xl font-semibold text-gray-800">
              SCHEDULE A MEETING
            </h2>
          </div>
        </div>
        <div className="h-[5px] bg-red-500 max-w-[500px] rounded-full my-4 transition-all duration-300 hover:bg-red-300"></div>
        <div className="flex flex-col items-center justify-center h-[210px]">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600 font-medium">Loading available slots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg h-[347px] border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 hover:shadow-lg cursor-pointer">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_12px_rgba(147,51,234,0.3)]"></span>
          </div>
          <h2 id="notes-header" className="text-xl font-semibold text-gray-800">
            SCHEDULE A MEETING
          </h2>
        </div>
        <div className="text-sm text-gray-500 font-medium">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="h-[5px] bg-red-500 max-w-[500px] rounded-full my-4 transition-all duration-300 hover:bg-red-300"></div>

      {/* Dropdown to select available time slots */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
        <div className="relative">
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={loading || availableSlots.length === 0}
          >
            <option value="">Select a time slot</option>
            {availableSlots.map((slot) => (
              <option key={slot._id} value={slot.startTime}>
                {new Date(slot.startTime).toLocaleString()} -{" "}
                {new Date(slot.endTime).toLocaleString()}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Error message display */}
      {error && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 rounded">
          <p className="text-blue-700 text-sm">{error}</p>
        </div>
      )}

      {/* Button to schedule the meeting */}
      <button
        onClick={handleSchedule}
        disabled={loading || !selectedSlot}
        className={`w-full p-3 rounded-lg text-white font-medium transition-all ${
          loading || !selectedSlot
            ? "bg-blue-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Scheduling...
          </span>
        ) : (
          "Schedule Meeting"
        )}
      </button>

      {/* Message if no slots are available */}
      {availableSlots.length === 0 && !fetchLoading && (
        <p className="text-center text-sm text-gray-500 mt-4 mb-2">
          No time slots available. Please check back later.
        </p>
      )}
    </div>
  );
};

export default ScheduleMeeting;