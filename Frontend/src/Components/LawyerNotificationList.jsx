import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";

const LawyerNotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/notifications`, {
          withCredentials: true,
        });
        setNotifications(res.data.data || res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lawyer notifications:", error);
        toast.error("Failed to fetch notifications");
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [backendUrl]);

  const getNotificationStyle = (message) => {
    if (message.includes("New case available")) return "bg-green-100 text-green-800";
    if (message.includes("Offer accepted")) return "bg-blue-100 text-blue-800";
    if (message.includes("Case closed")) return "bg-red-100 text-red-800";
    if (message.includes("Meeting scheduled")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 hover:shadow-lg cursor-pointer">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]"></span>
        </div>
        <h2 id="lawyer-notifications-header" className="text-2xl font-semibold text-gray-800">
          LAWYER NOTIFICATIONS
        </h2>
      </div>
      <div className="h-[5px] bg-blue-500 w-64 rounded-full my-5 transition-all duration-300 hover:bg-purple-300 mb-10"></div>
      {loading ? (
        <p className="text-gray-600">Loading notifications...</p>
      ) : notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-3 mb-2 rounded-lg ${
              notification.unread
                ? getNotificationStyle(notification.message)
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <p className="font-medium">{notification.message}</p>
            <p className="text-sm">{new Date(notification.createdAt).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No notifications found.</p>
      )}
    </div>
  );
};

export default LawyerNotificationList;