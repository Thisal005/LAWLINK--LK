import React, { useState } from "react";

const ClientNotificationList = () => {
  // Hardcoded notifications
  const [notifications] = useState([
    {
      _id: "1",
      message: "You have successfully posted a case",
      unread: true,
      createdAt: new Date("2025-04-04T10:00:00Z"),
    },
    {
      _id: "2",
      message: "A lawyer has been assigned to your case",
      unread: true,
      createdAt: new Date("2025-04-04T12:00:00Z"),
    },
    {
      _id: "3",
      message: "Lawyer has sent a note",
      unread: true,
      createdAt: new Date("2025-04-04T14:00:00Z"),
    },
    {
      _id: "4",
      message: "A new task has been assigned by your lawyer",
      unread: true,
      createdAt: new Date("2025-04-04T15:00:00Z"),
    },
    {
      _id: "5",
      message: "Lawyer has scheduled a meeting on 2025-04-10 at 10:00 AM",
      unread: true,
      createdAt: new Date("2025-04-04T16:00:00Z"),
    },
  ]);

  const getNotificationStyle = (message) => {
    if (message.includes("You have successfully posted a case")) 
      return "bg-green-100 text-green-800";
    if (message.includes("A lawyer has been assigned to your case")) 
      return "bg-blue-100 text-blue-800";
    if (message.includes("Lawyer has sent a note")) 
      return "bg-yellow-100 text-yellow-800";
    if (message.includes("A new task has been assigned by your lawyer")) 
      return "bg-orange-100 text-orange-800";
    if (message.includes("Lawyer has scheduled a meeting")) 
      return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800"; // Default for other unread notifications
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-300 hover:shadow-lg cursor-pointer">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]"></span>
        </div>
        <h2 id="client-notifications-header" className="text-2xl font-semibold text-gray-800">
          CLIENT NOTIFICATIONS
        </h2>
      </div>

      <div className="h-[5px] bg-blue-500 w-265 rounded-full my-5 transition-all duration-300 hover:bg-purple-300 mb-10"></div>
      {notifications.length > 0 ? (
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
            <p className="text-sm">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No notifications found.</p>
      )}
    </div>
  );
};

export default ClientNotificationList;