// frontend/src/pages/Dashboard/Client/Components/Header.jsx
import React, { useState, useContext, useRef, useEffect } from "react";
import { Calendar, HelpCircle, Bell, Settings, LogOut, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../../Context/AppContext";

import profilePic from "../../../assets/images/profilepic.jpg";


const Header = ({ displayName: propDisplayName, practiceAreas = "Client" }) => {
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const { userData, lawyerData, backendUrl, setIsLoggedIn, setUserData } = useContext(AppContext);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const currentUser = userData || lawyerData;
  const displayName = propDisplayName || currentUser?.fullName || "Guest";
  const unreadNotifications = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser?._id || !/^[0-9a-fA-F]{24}$/.test(currentUser._id)) {
        console.warn("Skipping notifications fetch: Invalid or missing user ID", {
          userData,
          lawyerData,
        });
        setNotifications([]);
        return;
      }

      setLoadingNotifications(true);
      try {
        const endpoint = lawyerData
          ? `${backendUrl}/api/case/lawyer/notifications`
          : `${backendUrl}/api/case/user/notifications`;
        console.log("Fetching notifications:", { endpoint, userId: currentUser._id });
        const response = await axios.get(endpoint, { withCredentials: true });
        console.log("Notifications response:", response.data);
        if (response.data.success) {
          setNotifications(response.data.data || []);
        } else {
          setNotifications([]);
          console.warn("No notification data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error.response?.data || error.message);
        setNotifications([]);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          setIsLoggedIn(false);
          setUserData(null);
          navigate("/login");
        }
      } finally {
        setLoadingNotifications(false);
      }
    };

    if (currentUser?._id) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser, backendUrl, navigate, setIsLoggedIn, setUserData, lawyerData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsVisible(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    setNotificationsVisible((prev) => !prev);
    if (userMenuVisible) setUserMenuVisible(false);
  };

  const toggleUserMenu = () => {
    setUserMenuVisible((prev) => !prev);
    if (notificationsVisible) setNotificationsVisible(false);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Logged out successfully!");
        setIsLoggedIn(false); // Reset login state
        setUserData(null); // Clear user data
        navigate("/login", { replace: true }); // Redirect to login
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to log out. Please try again.");
    }
  };
  const markAllAsRead = async () => {
    try {
      const endpoint = lawyerData
        ? `${backendUrl}/api/case/lawyer/notifications/mark-all-read`
        : `${backendUrl}/api/case/user/notifications/mark-all-read`;
      await axios.post(endpoint, {}, { withCredentials: true });
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking notifications as read:", error.response?.data || error.message);
      toast.error("Failed to mark notifications as read");
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.metadata?.caseId) {
      navigate(`/case/${notification.metadata.caseId}`);
      setNotificationsVisible(false);
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
            onClick={() => navigate("/case-history")}
          >
            
            <FileText className="w-5 h-5 text-white" />
          </button>
          <button
            className="p-2 hover:bg-blue-800 rounded-full transition-colors duration-200 flex items-center justify-center"
            aria-label="Help"
            title="Get Help"
            onClick={() => navigate("/help")}
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
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-hidden border border-gray-200 transition-all">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {loadingNotifications ? (
                    <div className="p-4 text-center text-gray-500">Loading...</div>
                  ) : notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          notification.unread ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex justify-between items-start">
                          <p
                            className={`text-sm text-gray-800 ${
                              notification.unread ? "font-semibold" : ""
                            }`}
                          >
                            {notification.message}
                          </p>
                          {notification.unread && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                  )}
                </div>
                <div className="p-3 text-center bg-gray-50 border-t border-gray-100">
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => navigate("/client-notifications")}
                  >
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
                src={profilePic}
                alt={`${displayName}'s profile`}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
          </button>
          {userMenuVisible && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <img
                  src={profilePic}
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
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-200"
                  onClick={() => navigate("/client-account-settings")}
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>Account Settings</span>
                </button>
              </div>
              <div className="py-1 border-t border-gray-100">
                <button
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;