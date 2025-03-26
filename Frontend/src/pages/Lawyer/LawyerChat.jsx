import React from "react";
import Sidebar from "../../Components/dashboard/lawyer/LawyerSidebar";
import Header from "../../Components/dashboard/lawyer/LawyerHeader";
import MessageContainer from "../../Components/messages/MessageContainer";
import ScheduledMeetings from "../../Components/scheduledMeetings";

function LawyerChat() {
  return (
    <div className="flex flex-col h-155 overflow-hidden">
      {/* Header - fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
        <Header />
      </div>

      {/* Main content area */}
      <div className="flex h-[calc(100vh-100px)] pt-[60px] mt-10"> {/* Adjust padding to match header height */}
        {/* Sidebar */}
        <Sidebar />

        {/* Message container */}
        <div className="flex-1 flex justify-center items-center lg:ml-70 mt-10">
          <MessageContainer />
        </div>
      </div>   
    </div>
  );
}

export default LawyerChat;
