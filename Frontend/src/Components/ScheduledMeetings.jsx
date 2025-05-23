import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../Context/SocketContext";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const ScheduledMeetings = () => {
  // State to store meetings and loading status
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Access backend URL and socket from context
  const { backendUrl } = useContext(AppContext);
  const { socket } = useSocketContext();

  // Navigation hook
  const navigate = useNavigate();

  // Fetch meetings from the backend
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/meetings`, {
          withCredentials: true,
        });
        // Filter out completed or cancelled meetings
        const activeMeetings = res.data.data.filter(
          (meeting) => meeting.status !== "completed" && meeting.status !== "cancelled"
        );
        setMeetings(activeMeetings);
      } catch (err) {
        console.error("Error fetching meetings:", err);
        toast.error("Failed to fetch meetings");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();

    // Poll for new meetings every second
    const interval = setInterval(() => {
      fetchMeetings();
    }, 1000);

    // Listen for new meetings via socket
    if (socket) {
      socket.on("newMeeting", (meeting) => {
        if (meeting.status !== "completed" && meeting.status !== "cancelled") {
          setMeetings((prev) => [...prev, meeting]);
          toast.info(
            `New meeting scheduled: ${meeting.caseTitle} at ${new Date(
              meeting.scheduledAt
            ).toLocaleString()}`
          );
        }
      });
    }

    // Cleanup on component unmount
    return () => {
      if (socket) socket.off("newMeeting");
      clearInterval(interval);
    };
  }, [socket, backendUrl]);

  // Join a meeting
  const joinMeeting = async (meetingId) => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/meetings/join/${meetingId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        navigate(`/meeting/${meetingId}`);
      }
    } catch (err) {
      console.error("Join error:", err.response?.data);
      toast.error(err.response?.data?.error || "Failed to join meeting");
    }
  };

  // Cancel a meeting
  const cancelMeeting = async (meetingId) => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/meetings/cancel/${meetingId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setMeetings((prev) =>
          prev.filter((meeting) => meeting.meetingId !== meetingId)
        );
        toast.success("Meeting cancelled successfully");
      }
    } catch (err) {
      console.error("Cancel error:", err.response?.data);
      toast.error(err.response?.data?.error || "Failed to cancel meeting");
    }
  };

  // Show loading spinner while fetching meetings
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg h-[347px] border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_12px_rgba(147,51,234,0.3)]"></span>
            </div>
            <h2 id="notes-header" className="text-xl font-semibold text-gray-800">
              SCHEDULED & ONGOING MEETINGS
            </h2>
          </div>
        </div>
        <div className="h-[5px] bg-yellow-500 max-w-[500px] rounded-full my-4 transition-all duration-300 hover:bg-yellow-300"></div>
        <div className="flex flex-col items-center justify-center h-[210px]">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600 font-medium">Loading meetings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg h-[300px] border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_12px_rgba(147,51,234,0.3)]"></span>
          </div>
          <h2 id="notes-header" className="text-xl font-semibold text-gray-800">
            SCHEDULED & ONGOING MEETINGS
          </h2>
        </div>
      </div>

      <div className="h-[5px] bg-yellow-500 max-w-[500px] rounded-full my-4 transition-all duration-300 hover:bg-yellow-300"></div>

      {/* Show a message if no meetings are available */}
      {meetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[180px] text-gray-500">
          <svg
            className="w-16 h-16 mb-4 text-yellow-200"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            ></path>
          </svg>
          <p className="font-medium">No scheduled or ongoing meetings</p>
        </div>
      ) : (
        // Display the list of meetings
        <div className="h-[180px] overflow-y-auto scrollbar-hide hover:scrollbar-default pr-2">
          <ul className="space-y-4">
            {meetings.map((meeting) => {
              const now = new Date();
              const scheduledAt = new Date(meeting.scheduledAt);
              const minutesUntilStart = (scheduledAt - now) / (1000 * 60);
              const canJoin =
                minutesUntilStart <= 5 && meeting.status === "ongoing";
              const canCancel =
                meeting.status === "scheduled" && minutesUntilStart > 15;

              return (
                <li
                  key={meeting._id}
                  className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white transition-all shadow-sm hover:shadow h-[160px]"
                >
                  {/* Meeting details */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      {scheduledAt.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          meeting.status === "ongoing"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {meeting.status}
                      </span>
                    </div>
                  </div>

                  {/* Join or cancel buttons */}
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => joinMeeting(meeting.meetingId)}
                      className={`px-4 py-2 rounded-lg text-white font-medium transition-all ${
                        canJoin
                          ? "bg-green-500 hover:bg-green-600 shadow-sm hover:shadow"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Join Meeting
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScheduledMeetings;