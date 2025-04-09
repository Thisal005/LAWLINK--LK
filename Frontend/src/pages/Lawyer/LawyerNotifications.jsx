import React from "react";
import LawyerSidebar from "../../Components/dashboard/lawyer/LawyerSidebar";
import Header from "../../Components/dashboard/lawyer/LawyerHeader";
import LawyerNotificationList from "../../Components/LawyerNotificationList";

const LawyerNotifications = ({ notifications, addNotification }) => { // Receive props from parent
  return (
    <div>
      <Header />
      <LawyerSidebar activeTab="Notifications" />

      {/* Main content section */}
      <main className="ml-64 p-6 lg:p-8 pt-24">
        <div
          className="bg-white text-gray-900 rounded-3xl shadow-xl p-5 mb-5 mt-5 
                      relative overflow-hidden transform transition-all duration-300 
                      hover:shadow-2xl w-290"
        >
          <LawyerNotificationList 
            notifications={notifications} 
            addNotification={addNotification} 
          />
        </div>
      </main>
    </div>
  );
};

export default LawyerNotifications;