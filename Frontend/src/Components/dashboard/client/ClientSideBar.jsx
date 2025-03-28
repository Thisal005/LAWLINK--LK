import React, { useState, useEffect, useContext } from "react";
import { Grid, FileText, Settings, Menu, X, Rocket, Lock } from "lucide-react";
import { RiMailSendLine, RiChatAiLine } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../../Context/AppContext"; // Path from first code
import axios from "axios";

import logo from "../../../assets/images/hori.png";


const ClientSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, backendUrl } = useContext(AppContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userCase, setUserCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingCasesCount, setPendingCasesCount] = useState(0);

  // Fetch user case and pending cases count
  useEffect(() => {
    const fetchUserCase = async () => {
      if (!userData?._id) {
        console.error("User ID not found in AppContext.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/case/user/${userData._id}`, {
          withCredentials: true,
        });
        const cases = response.data.data || [];
        const activeCase =
          cases.find((c) => c.status === "ongoing") ||
          cases.find((c) => c.status === "pending") ||
          null;
        setUserCase(activeCase);
      } catch (error) {
        console.error("Failed to fetch user case:", error.response?.data || error.message);
        setUserCase(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchPendingCases = async () => {
      if (!userData?._id) return;
      try {
        const response = await axios.get(`${backendUrl}/api/case/pending-count/${userData._id}`, {
          withCredentials: true,
        });
        setPendingCasesCount(response.data.data?.count || 0);
      } catch (error) {
        console.error("Error fetching pending cases:", error.response?.data || error.message);
        setPendingCasesCount(0);
      }
    };

    fetchUserCase();
    fetchPendingCases();
  }, [userData, backendUrl]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Navigation items from first code, with logic from second code
  const navItems = [
    { path: "/client-dashboard", label: "Dashboard", icon: Grid },
    {
      path: "/post-case",
      label: "Post Case",
      icon: RiMailSendLine,
      locked: pendingCasesCount >= 3,
    },
    { path: "/chatbot", label: "LexBot", icon: RiChatAiLine },
  ];

  return (
    <>
      {/* Sidebar with first code's styles */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-600 to-blue-900 text-white flex-shrink-0 rounded-tr-3xl rounded-br-3xl z-40 transition-all duration-300 w-64 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo Section */}
          <div className="flex items-center gap-2 mb-12">
            <div className="text-2xl font-bold tracking-tight">
              <img
                onClick={() => {
                  navigate("/client-dashboard"); // Updated to client-dashboard from "/"
                  setIsSidebarOpen(false);
                }}
                style={{ cursor: "pointer" }}
                src={logo}
                alt="Sidebar Logo"
                className="block"
              />
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden ml-auto text-white focus:outline-none"
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Menu with first code's styles */}
          <nav className="space-y-4 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <a
                  key={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.locked) return;
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  aria-label={`Go to ${item.label}`}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    item.locked
                      ? "opacity-50 cursor-not-allowed"
                      : isActive
                      ? "bg-blue-500 text-white"
                      : "text-white/90 hover:text-white hover:bg-blue-500/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.locked && <Lock className="w-4 h-4 ml-2" />}
                </a>
              );
            })}
          </nav>

          {/* Active Cases Section with dynamic data */}
          {!loading && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-4 px-4 text-white/70">ACTIVE CASES</h3>
              <div className="space-y-3">
                {userCase ? (
                  <div
                    className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700/50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      navigate(`/case/${userCase._id}`);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        userCase.status === "ongoing" ? "bg-emerald-400" : "bg-orange-400"
                      }`}
                    ></div>
                    <span className="font-medium truncate">{userCase.subject}</span>
                  </div>
                ) : (
                  <div className="px-4 py-2 text-white/70 text-sm">
                    No active cases found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 mt-16"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 p-2 bg-blue-600 text-white rounded-lg lg:hidden z-50 focus:outline-none"
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
};

export default ClientSidebar;