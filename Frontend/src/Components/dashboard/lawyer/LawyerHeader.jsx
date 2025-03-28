import React, { useState, useContext, useRef, useEffect } from "react";
import { Calendar, HelpCircle, Bell, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../../Context/AppContext";
import LawyerAvailability from "./AvailabilityForMeetings";

import profilepic from "../../../assets/images/profilepic.jpg";


const Header = ({ displayName: propDisplayName, practiceAreas = "Corporate Law" }) => {
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const { userData, lawyerData, backendUrl, setIsLoggedIn, setUserData } = useContext(AppContext);
  const[isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const currentUser = userData || lawyerData;
  const displayName = propDisplayName || userData?.fullName || lawyerData?.fullName || "Guest";

  // Notifications data
  const notifications = [
    {
      id: 1,
      message: "New case file uploaded: Smith vs. Johnson",
      date: "10 minutes ago",
      unread: true,
    },
    {
      id: 2,
      message: "Meeting scheduled with client tomorrow at 2 PM",
      date: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      message: "Document review deadline approaching",
      date: "2 hours ago",
      unread: false,
    },
  ];

  const unreadNotifications = notifications.filter(notification => notification.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsVisible(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setNotificationsVisible(!notificationsVisible);
    if (userMenuVisible) setUserMenuVisible(false);
  };

  const toggleUserMenu = () => {
    setUserMenuVisible(!userMenuVisible);
    if (notificationsVisible) setNotificationsVisible(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/api/lawyer/logout`, {}, { withCredentials: true });
      setIsLoggedIn(false);
      setUserData(null);
      setLawyerData(null); // Clear lawyerData as well
      navigate("/lawyer-login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-50rem)] lg:w-[calc(100%-16.5rem)] bg-gradient-to-l from-blue-800 to-blue-600 h-16 flex items-center justify-end px-4 sm:px-6 shadow-sm z-50 md:rounded-tl-full md:rounded-bl-full mt-1">
      <div className="flex items-center gap-2 sm:gap-5">
        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-3">
          <button
            className="p-2 hover:bg-blue-800 rounded-full transition-colors duration-200 flex items-center justify-center"
            aria-label="Calendar"
            title="Open Calendar"
            onClick={() => setIsAvailabilityModalOpen(true)}
          >
            <Calendar className="w-5 h-5 text-white" />
          </button>
          <button
            className="p-2 hover:bg-blue-800 rounded-full transition-colors duration-200 flex items-center justify-center"
            aria-label="Help"
            title="Get Help"
          >
            <HelpCircle className="w-5 h-5 text-white" />
          </button>
          <div className="relative" ref={notificationRef}>
            <button
              className={`p-2 ${notificationsVisible ? "bg-blue-800" : "hover:bg-blue-800"} rounded-full transition-colors duration-200 flex items-center justify-center relative`}
              onClick={toggleNotifications}
              aria-expanded={notificationsVisible}
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {unreadNotifications}
                </span>
              )}
            </button>
            {notificationsVisible && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-hidden border border-gray-200 transition-all" role="menu">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium" onClick={() => console.log("Mark all as read")}>
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${notification.unread ? "bg-blue-50" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <p className={`text-sm text-gray-800 ${notification.unread ? "font-semibold" : ""}`}>
                            {notification.message}
                          </p>
                          {notification.unread && <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                  )}
                </div>
                <div className="p-3 text-center bg-gray-50 border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium" onClick={() => navigate("/lawyer-notifications")}>
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* User Profile */}
        <div className="relative pl-3 border-l border-blue-500" ref={userMenuRef}>
          <button
            className="flex items-center gap-3 hover:bg-blue-800 rounded-full py-1 px-2 transition-colors duration-200"
            onClick={toggleUserMenu}
            aria-expanded={userMenuVisible}
            aria-label="User menu"
          >
            <div className="text-right hidden sm:block">
              <div className="font-medium text-white text-sm">{displayName}</div>
              <div className="text-xs text-blue-100">{practiceAreas}</div>
            </div>
            <div className="relative">
              <img
                  src={profilepic}
                  alt={`${displayName}'s profile`}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
              />
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white`}></div>
            </div>
          </button>
          {userMenuVisible && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200" role="menu">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <img
                  src={profilepic}
                  alt={`${displayName}'s profile`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">{displayName}</p>
                  <p className="text-xs text-gray-500">{practiceAreas}</p>
                </div>
              </div>
              <div className="py-1">
                
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => navigate("/lawyer-account-settings")}
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>Account Settings</span>
                </button>
              </div>
              <div className="py-1 border-t border-gray-100">
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <LawyerAvailability open={isAvailabilityModalOpen} onClose={() => setIsAvailabilityModalOpen(false)} />
    </header>
  );
};

export default Header;