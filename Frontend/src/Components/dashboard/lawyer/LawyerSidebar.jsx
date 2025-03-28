// frontend/src/pages/Dashboard/Lawyer/Components/Sidebar.jsx
import React, { useState, useEffect, useContext } from "react";
import { Grid, Eye, MessageSquare, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../../Context/AppContext";

import logo from "../../../assets/images/hori.png";


const Sidebar = ({ activeTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lawyerData, backendUrl } = useContext(AppContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      if (!lawyerData?._id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/case/user/${lawyerData._id}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setCases(data.data || []);
        } else {
          setCases([]);
        }
      } catch (error) {
        console.error("Failed to fetch lawyer cases:", error);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [lawyerData, backendUrl]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { path: "/lawyer-dashboard", label: "Dashboard", icon: Grid },
    { path: "/view-cases", label: "View Cases", icon: Eye },
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
                  navigate("/lawyer-dashboard");
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
              const isActive = location.pathname === item.path || activeTab === item.label;

              return (
                <a
                  key={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  aria-label={`Go to ${item.label}`}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-white/90 hover:text-white hover:bg-blue-500/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Active Cases Section with first code's styling approach */}
          {!loading && cases.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-4 text-white/70 uppercase tracking-wide">
                Active Cases
              </h3>
              <div className="space-y-4">
                {cases.slice(0, 3).map((caseItem) => (
                  <div
                    key={caseItem._id}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-white/90 hover:text-white hover:bg-blue-500/50 cursor-pointer"
                    onClick={() => {
                      navigate(`/case-dashboard/${caseItem._id}`);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></div>
                    <span className="font-medium truncate">{caseItem.subject}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile with first code's styles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 mt-16 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Hamburger Menu Button with first code's styles */}
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

export default Sidebar;