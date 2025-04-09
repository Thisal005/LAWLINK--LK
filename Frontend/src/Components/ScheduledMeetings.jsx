import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../Context/SocketContext";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const ScheduledMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const {backendUrl} = useContext(AppContext);
  const navigate = useNavigate();
  const { socket } = useSocketContext();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/meetings`, {
          withCredentials: true,
        });
        console.log("Fetched meetings:", res.data.data);
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

    return () => {
      if (socket) socket.off("newMeeting");
    };
  }, [socket]);

  const joinMeeting = async (meetingId) => {
    try {
      console.log("Attempting to join meeting:", meetingId);
      const res = await axios.get(
        `${backendUrl}/api/meetings/join/${meetingId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Join response:", res.data);
      if (res.data.success) {
        console.log("Navigating to:", `/meeting/${meetingId}`);
        navigate(`/meeting/${meetingId}`);
      }
    } catch (err) {
      console.error("Join error:", err.response?.data);
      toast.error(err.response?.data?.error || "Failed to join meeting");
    }
  };

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

  if (loading) return <p>Loading meetings...</p>;

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

      <div className="h-[5px] bg-yellow-500 w-120 rounded-full my-4 transition-all duration-300  hover:bg-yellow-300"></div>

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
        <div className="h-[210px] overflow-y-auto scrollbar-hide hover:scrollbar-default pr-2">
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
                  <div className="flex justify-between items-center mb-2">
                    
                    <div className="relative group">
                      <button className="p-1 rounded-full hover:bg-gray-200 transition-all">
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                        </svg>
                      </button>
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                        <div className="py-1">
                          <button
                            onClick={() => cancelMeeting(meeting.meetingId)}
                            disabled={!canCancel}
                            className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 disabled:text-gray-400 disabled:hover:bg-white disabled:cursor-not-allowed"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            Delete Meeting
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

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