import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { toast } from "react-toastify";
import { FaComments, FaVideo } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import useConversation from "../../zustand/useConversation";
import Header from "../../Components/dashboard/lawyer/LawyerHeader";
import Sidebar from "../../Components/dashboard/lawyer/LawyerSidebar";
import CaseCard from "../../Components/dashboard/lawyer/CaseCardForLawyer";
import TaskForm from "../../Components/dashboard/lawyer/assignTask";
import NoteForm from "../../Components/dashboard/lawyer/CreateNote";
import TodoList from "../../Components/ToDoList";
import AssignedTasks from "../../Components/dashboard/lawyer/AssignedTasks";
import LawyerAvailability from "../../Components/dashboard/lawyer/AvailabilityForMeetings";
import ChatButton from "../../Components/dashboard/lawyer/LawyerChatButton";
import PDFSummerizer from "../../Components/dashboard/lawyer/PdfSummerizer";
import ScheduledMeetings from "../../Components/ScheduledMeetings";
import video from "../../assets/images/case.mp4";

function Case() {
  const { backendUrl, userData } = useContext(AppContext);
  const { caseId } = useParams();
  const { setSelectedConversation } = useConversation();

  const [caseData, setCaseData] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      if (!caseId) {
        toast.error("No case ID provided");
        setLoading(false);
        return;
      }

      try {
        const caseRes = await axios.get(`${backendUrl}/api/case/${caseId}`, {
          withCredentials: true,
        });
        const caseDetails = caseRes.data.data || caseRes.data;
        setCaseData(caseDetails);

        const participantsRes = await axios.get(`${backendUrl}/api/case/${caseId}/participants`, {
          withCredentials: true,
        });

        if (participantsRes.data.success && participantsRes.data.data) {
          const clientIdFromParticipants = participantsRes.data.data.client?.id;
          if (clientIdFromParticipants) {
            setClientId(clientIdFromParticipants);
            setSelectedConversation({
              _id: clientIdFromParticipants,
              isLawyer: false,
            });
          } else {
            setClientId(caseDetails.clientId);
            setSelectedConversation({
              _id: caseDetails.clientId,
              isLawyer: false,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching case:", error.response?.data || error.message);
        if (error.response?.status === 403) {
          toast.error("You don’t have permission to view this case");
        } else if (error.response?.status === 404) {
          toast.error("Case not found");
        } else {
          toast.error(error.response?.data?.msg || "Failed to load case details");
        }
        setCaseData(null);
        setClientId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [caseId, backendUrl, setSelectedConversation]);

  useEffect(() => {
    console.log("Client ID updated:", clientId);
    console.log("Case ID:", caseId);
  }, [clientId, caseId]);

  return (
    <div>
      <Header />
      <Sidebar caseId={caseId} />
      <main className="ml-64 p-6 lg:p-8 pt-24">
        {/* Case Overview */}
        <div className="bg-white text-gray-900 rounded-3xl shadow-xl p-5 mb-5 mt-10 relative w-full">
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1 space-y-6">
              {loading ? (
                <p>Loading case details...</p>
              ) : caseData ? (
                <CaseCard caseId={caseId} />
              ) : (
                <p className="text-gray-600">No case details available.</p>
              )}
            </div>
            <div className="self-center md:self-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative z-20">
                <video
                  src={video}
                  autoPlay
                  loop
                  muted
                  className="w-full h-[180px] object-cover rounded-lg"
                  aria-label="Legal information video"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks and Assigned Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="h-[400px]">
              {loading ? (
                <p>Loading task form...</p>
              ) : caseData && clientId ? (
                <TaskForm caseId={caseId} clientId={clientId} />
              ) : (
                <p className="text-gray-600">No case selected to assign tasks.</p>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="h-[400px]">
              {loading ? (
                <p>Loading assigned tasks...</p>
              ) : caseData && clientId ? (
                <AssignedTasks caseId={caseId} />
              ) : (
                <p className="text-gray-600">No case selected to view tasks.</p>
              )}
            </div>
          </div>
        </div>

        {/* Notes, Scheduled Meetings, and Todo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="grid grid-rows-1 md:grid-rows-2 gap-5">
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
              <div className="h-[300px]">
                {loading ? (
                  <p>Loading note form...</p>
                ) : caseData && clientId ? (
                  <NoteForm caseId={caseId} clientId={clientId} />
                ) : (
                  <p className="text-gray-600">No case selected to add notes.</p>
                )}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
              <div className="h-[200px]">
                {loading ? (
                  <p>Loading scheduled meetings...</p>
                ) : (
                  <ScheduledMeetings />
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
            <div className="h-[550px]">
              <TodoList />
            </div>
          </div>
        </div>

        {/* Additional Components */}
        <PDFSummerizer />
        <LawyerAvailability />
        <ChatButton />
      </main>
    </div>
  );
}

export default Case;
