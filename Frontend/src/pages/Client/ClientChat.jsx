import React from "react";
import ClietnSidebar from "../../Components/dashboard/client/ClientSideBar";
import Header from "../../Components/dashboard/client/ClientHeader";   
import MessageContainer from "../../Components/messages/MessageContainer";
import ScheduledMeetings from "../../Components/ScheduledMeetings";

function ClientChat() {
  return (
    <div className="flex flex-col h-170 overflow-hidden">
      {/* Header - fixed at top */}
      <div >
        <Header />
      </div>

      {/* Main content area */}
      <div > {/* Adjust padding to match header height */}
        {/* Sidebar */}
        <ClietnSidebar />

        {/* Message container */}
        <div className="flex-1 flex justify-center items-center lg:ml-70 mt-10">
          <MessageContainer />
        </div>
      </div>   
    </div>
  );
}

export default ClientChat;
