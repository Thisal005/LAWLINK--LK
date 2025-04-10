import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/dashboard/lawyer/LawyerSidebar";
import Header from "../../Components/dashboard/lawyer/LawyerHeader";
import CaseCard from "../../Components/dashboard/lawyer/CaseCardForLawyer"; // Assuming CaseCard is here
import Calender from "../../Components/dashboard/Calender";
import BasicLineChart from "../../Components/dashboard/Linechart";
import BasicTimeClock from "../../Components/dashboard/Clock";
import video from "../../assets/images/lawyer.mp4";
import axios from "axios"; // Add axios for API calls

function Home() {
  const { lawyerData, backendUrl } = useContext(AppContext); // Added backendUrl
  const navigate = useNavigate();

  // State for dynamic data
  const [notifications, setNotifications] = useState([]); // Empty initial state
  const [activeCases, setActiveCases] = useState([]);
  const [completedCasesCount, setCompletedCasesCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [scheduledMeetings, setScheduledMeetings] = useState([]); // Replace upcomingEvents

  // Fetch real data on mount
  useEffect(() => {
    const fetchLawyerStats = async () => {
      try {
        // Fetch active cases
        const casesResponse = await axios.get(`${backendUrl}/api/lawyer/cases`, {
          withCredentials: true,
        });
        const cases = casesResponse.data.cases || [];
        setActiveCases(cases.filter((c) => c.status === "active"));
        setCompletedCasesCount(cases.filter((c) => c.status === "completed").length);

        // Fetch clients
        const clientsResponse = await axios.get(`${backendUrl}/api/lawyer/clients`, {
          withCredentials: true,
        });
        setClientsCount(clientsResponse.data.clients?.length || 0);

        // Fetch scheduled meetings (replacing events)
        const meetingsResponse = await axios.get(`${backendUrl}/api/lawyer/meetings`, {
          withCredentials: true,
        });
        setScheduledMeetings(meetingsResponse.data.meetings || []);
      } catch (error) {
        console.error("Error fetching lawyer stats:", error);
        // Fallback to empty/default states if API fails
        setActiveCases([]);
        setCompletedCasesCount(0);
        setClientsCount(0);
        setScheduledMeetings([]);
      }
    };

    fetchLawyerStats();
  }, [backendUrl]);

  const addNotification = (message) => {
    setNotifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        message,
        date: "Just now",
        unread: true,
      },
    ]);
  };

  return (
    <div>
      {/* Application header with notifications */}
      <Header
        displayName={lawyerData?.fullName || "Counselor"}
        practiceAreas={lawyerData?.practiceAreas || "Corporate Law"}
        notifications={notifications}
        addNotification={addNotification}
      />

      {/* Sidebar */}
      <Sidebar activeTab="Dashboard" />

      {/* Main content container */}
      <main className="ml-64 p-6 lg:p-8 pt-24">
        {/* Welcome Card */}
        <div className="bg-white text-gray-900 rounded-3xl shadow-xl p-5 mb-6 mt-10 relative overflow-hidden transform transition-all duration-300 hover:shadow-2xl w-full">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                  Welcome back, {lawyerData?.fullName || "Counselor"}
                </h2>
                <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  {scheduledMeetings.length} scheduled meetings today
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="group bg-white border border-gray-200 p-6 rounded-2xl transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-gray-500 font-medium">Active Cases</h3>
                      <p className="mt-2 text-3xl font-bold text-gray-900">{activeCases.length}</p>
                      <p className="text-xs text-gray-400 mt-1">+{activeCases.length > 1 ? 2 : 0} from last week</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center relative" aria-hidden="true">
                      <span className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(34,197,94,0.3)]"></span>
                      <span className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] absolute animate-ping"></span>
                    </div>
                  </div>
                </div>
                <div className="group bg-white border border-gray-200 p-6 rounded-2xl hover:border-green-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-gray-500 font-medium">Completed Cases</h3>
                      <p className="mt-2 text-3xl font-bold text-gray-900">{completedCasesCount}</p>
                      <p className="text-xs text-gray-400 mt-1">+{completedCasesCount > 0 ? 1 : 0} from last week</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center relative" aria-hidden="true">
                      <span className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.3)]"></span>
                      <span className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] absolute animate-ping"></span>
                    </div>
                  </div>
                </div>
                <div className="group bg-white border border-gray-200 p-6 rounded-2xl hover:border-purple-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-gray-500 font-medium">Clients</h3>
                      <p className="mt-2 text-3xl font-bold text-gray-900">{clientsCount}</p>
                      <p className="text-xs text-gray-400 mt-1">+{clientsCount > 0 ? 3 : 0} from last week</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center relative" aria-hidden="true">
                      <span className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(34,197,94,0.3)]"></span>
                      <span className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] absolute animate-ping"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="self-center md:self-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transform transition-all duration-300 hover:shadow-lg">
                <video
                  src={video}
                  autoPlay
                  loop
                  muted
                  className="w-full h-[240px] object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Activity Chart and Scheduled Meetings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>
              Activity Overview
            </h2>
            <div className="h-[280px]">
              <BasicLineChart activeCases={activeCases} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block mr-2"></span>
              Scheduled Meetings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scheduledMeetings.length > 0 ? (
                scheduledMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{meeting.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{meeting.time}</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {meeting.type || "Meeting"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">No scheduled meetings.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;