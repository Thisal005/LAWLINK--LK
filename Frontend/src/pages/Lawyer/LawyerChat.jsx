import React from "react";
import Sidebar from "../../Components/dashboard/lawyer/LawyerSidebar";
import Header from "../../Components/dashboard/lawyer/LawyerHeader";
import MessageContainer from "../../Components/messages/MessageContainer";

function LawyerChat() {
  return (
    <div className="flex flex-col h-170 overflow-hidden">
      {/* Header - fixed at top */}
      <div >
        <Header />
      </div>

      {/* Main content area */}
      <div > {/* Adjust padding to match header height */}
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
