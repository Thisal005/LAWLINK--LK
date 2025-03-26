import React, { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../Components/dashboard/lawyer/LawyerSidebar";
import Header from "../../Components/dashboard/lawyer/LawyerHeader";
import axios from "axios";
import { toast } from "react-toastify";
import Calender from "../../Components/dashboard/Calender";
import BasicLineChart from "../../Components/dashboard/Linechart";
import BasicTimeClock from "../../Components/dashboard/Clock";


function Home() {
  const { lawyerData } = useContext(AppContext);

  // Hook for navigation
  const navigate = useNavigate();

  // Upcoming events data
  const upcomingEvents = [
    { id: 1, title: "Client Meeting - Smith vs. Jones", time: "Today, 2:00 PM", type: "Meeting" },
    { id: 2, title: "Court Hearing - Johnson Case", time: "Tomorrow, 9:30 AM", type: "Hearing" },
    { id: 3, title: "Document Submission Deadline", time: "Mar 5, 5:00 PM", type: "Deadline" }
  ];

  // Example client and case IDs (consider fetching these dynamically)
  const clientId = "67c893b3db23727fa64b7550";
  const caseId = "67cd4ab0240c311403203c96";

  return (
    <div>
      {/* Application header */}
      <Header />

      {/* Sidebar with active tab set to "Dashboard" */}
      <Sidebar activeTab="Dashboard" />

      {/* Main content container */}
      <main className="ml-64 p-6 lg:p-8 pt-24">

        {/* Welcome Card */}
        <div className="bg-white text-gray-900 rounded-3xl shadow-xl p-5 mb-6 mt-5 relative overflow-hidden transform transition-all duration-300 hover:shadow-2xl w-290">

          {/* Background effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
          </div>

          {/* Content container */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">

            {/* Left Section: Welcome message and stats */}
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                  Welcome back, {lawyerData?.fullName || "Counselor"}
                </h2>
                <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  {upcomingEvents.length} upcoming events today
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                {/* Active Cases Card */}
                <div className="group bg-white border border-gray-200 p-6 rounded-2xl hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-gray-500 font-medium">Active Cases</h3>
                      <p className="mt-2 text-3xl font-bold text-gray-900">3</p>
                      <p className="text-xs text-gray-400 mt-1">+2 from last week</p>
                    </div>

                    {/* Visual indicator */}
                    <div
                      className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center relative"
                      aria-hidden="true"
                    >
                      <span className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(34,197,94,0.3)]"></span>
                      <span className={`w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] absolute animate-ping`}></span>
                      <span className={`w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] absolute animate-ping`}></span>
                    </div>
                  </div>
                </div>

                {/* Completed Cases Card */}
                <div className="group bg-white border border-gray-200 p-6 rounded-2xl hover:border-green-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-gray-500 font-medium">Completed Cases</h3>
                      <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
                      <p className="text-xs text-gray-400 mt-1">+1 from last week</p>
                    </div>
                    <div
                      className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center relative"
                      aria-hidden="true"
                    >
                      <span className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.3)]"></span>
                      <span className={`w-4 h-4 rounded-full bg-green-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] absolute animate-ping`}></span>
                      <span className={`w-4 h-4 rounded-full bg-green-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] absolute animate-ping`}></span>
                    </div>
                  </div>
                </div>

                {/* Clients Card */}
                <div className="group bg-white border border-gray-200 p-6 rounded-2xl hover:border-purple-500 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xs uppercase tracking-wide text-gray-500 font-medium">Clients</h3>
                      <p className="mt-2 text-3xl font-bold text-gray-900">3</p>
                      <p className="text-xs text-gray-400 mt-1">+3 from last week</p>
                    </div>
                    <div
                      className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center relative"
                      aria-hidden="true"
                    >
                      <span className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(34,197,94,0.3)]"></span>
                      <span className={`w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] absolute animate-ping`}></span>
                      <span className={`w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] absolute animate-ping`}></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section: Video display */}
            <div className="self-center md:self-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transform transition-all duration-300 hover:shadow-lg">
                <video
                  src="images/lawyer.mp4"
                  autoPlay
                  loop
                  muted
                  className="w-full h-[240px] object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Chart and Upcoming Events in One Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">

          {/* Earnings Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>
              Earnings Overview
            </h2>
            <div className="h-[280px]">
              <BasicLineChart />
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block mr-2"></span>
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{event.time}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Home;
