import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuthContext } from "../Context/AuthContext";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const ScheduleMeeting = ({ caseId }) => {
  const { user } = useAuthContext();
  const { backendUrl } = useContext(AppContext);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);
   const [lawyerId, setLawyerId] = useState(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      if (!caseId) {
        toast.error("No case ID provided");
        setLoading(false);
        return;
      }

      try {
       
        const participantsRes = await axios.get(`${backendUrl}/api/case/${caseId}/participants`, {
          withCredentials: true,
        });

        if (participantsRes.data.success && participantsRes.data.data) {
          const lawyerIdFromParticipants = participantsRes.data.data.lawyer?.id;
          if (lawyerIdFromParticipants) {
            setLawyerId(lawyerIdFromParticipants);
            
          } else {
            // Fallback to caseDetails if participants endpoint doesn't provide client ID
            setLawyerId(caseDetails.lawyerId);
            
          }
        }
      } catch (error) {
        console.error("Error fetching case:", error.response?.data || error.message);
        setLawyerId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [lawyerId]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!lawyerId) {
        setError("No lawyer specified");
        return;
      }

      setFetchLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${backendUrl}/api/availability/${lawyerId}`,
          { withCredentials: true }
        );
        const slots = response.data.data || [];
        setAvailableSlots(slots);
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

    fetchAvailableSlots();
  }, [lawyerId, backendUrl]);

  const handleSchedule = async () => {
    if (!selectedSlot) {
      setError("Please select a time slot");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${backendUrl}/api/meetings/schedule`,
        { caseId, scheduledAt: selectedSlot },
        { withCredentials: true }
      );
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

  return (
    <div className="p-6 bg-white rounded-lg h-[340px] border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 hover:shadow-lg cursor-pointer">
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

      <div className="h-[5px] bg-red-500 w-120 rounded-full my-4 transition-all duration-300 hover: hover:bg-red-300"></div>

      {fetchLoading ? (
        <div className="flex flex-col items-center py-6">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600 font-medium">Loading available slots...</p>
        </div>
      ) : (
        <>
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

          {error && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 rounded">
              <p className="text-blue-700 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleSchedule}
            disabled={loading || !selectedSlot || fetchLoading}
            className={`w-full p-3 rounded-lg text-white font-medium transition-all ${
              loading || !selectedSlot || fetchLoading
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

          {availableSlots.length === 0 && !fetchLoading && (
            <p className="text-center text-sm text-gray-500 mt-4">
              No time slots available. Please check back later.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ScheduleMeeting;