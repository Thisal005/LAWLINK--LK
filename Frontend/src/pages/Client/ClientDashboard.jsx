import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import useConversation from "../../zustand/useConversation";
import Header from "../../Components/dashboard/client/ClientHeader";
import ClientSidebar from "../../Components/dashboard/client/ClientSideBar";
import CaseCard from "../../Components/dashboard/client/CaseCardForClient";
import TaskList from "../../Components/TaskList";
import NoteList from "../../Components/NoteList";
import ScheduledMeetings from "../../Components/scheduledMeetings";
import ScheduleMeeting from "../../Components/ScheduleMeeting";
import ChatButton from "../../Components/dashboard/client/ClientChatButton";

function ClientDashboard() {
  const { userData, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const { setSelectedConversation } = useConversation();
  const [cases, setCases] = useState([]);
  const [lawyerId, setLawyerId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCasesAndParticipants = async () => {
      if (!userData?._id) {
        console.log("No user ID available");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch user's cases
        const res = await axios.get(`${backendUrl}/api/case/user/${userData._id}`, {
          withCredentials: true,
        });
        console.log("User cases response:", res.data);
        const allCases = res.data.data || [];
        const activeCases = allCases.filter(
          (caseItem) => caseItem.status !== "closed" && caseItem.status !== "completed"
        );
        setCases(activeCases);

        if (activeCases.length === 0) {
          toast.info("You currently have no active cases.");
          setLoading(false);
          return;
        }

        // Fetch participants for the first active case
        const caseId = activeCases[0]._id;
        const participantsRes = await axios.get(`${backendUrl}/api/case/${caseId}/participants`, {
          withCredentials: true,
        });

        if (participantsRes.data.success && participantsRes.data.data) {
          const lawyerIdFromParticipants = participantsRes.data.data.lawyer?.id;
          if (lawyerIdFromParticipants) {
            setLawyerId(lawyerIdFromParticipants);
            setSelectedConversation({
              _id: lawyerIdFromParticipants,
              isLawyer: true, // Set to true since this is the lawyer from the client's perspective
            });
          } else {
            toast.warn("No lawyer assigned to this case yet.");
          }
        }
      } catch (error) {
        console.error("Error fetching user cases or participants:", error.response?.data || error.message);
        if (error.response?.status === 403) {
          toast.error("You don’t have permission to view cases");
        } else if (error.response?.status === 404) {
          toast.error("Case or participants not found");
        } else {
          toast.error(error.response?.data?.msg || "Failed to fetch cases or participants");
        }
        setCases([]);
        setLawyerId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCasesAndParticipants();
  }, [userData, backendUrl, setSelectedConversation]);

  // Log lawyerId for debugging
  useEffect(() => {
    console.log("Lawyer ID updated:", lawyerId);
    console.log("Active Cases:", cases);
  }, [lawyerId, cases]);

  const caseId = cases.length > 0 ? cases[0]._id : null;

  return (
    <div>
      <Header />
      <ClientSidebar activeTab="Dashboard" />
      <main className="ml-64 p-6 lg:p-8 pt-24 mt-6">
        <div className="bg-white text-gray-900 rounded-3xl shadow-xl p-5 mb-6 mt-5 relative overflow-hidden transform transition-all duration-300 hover:shadow-2xl w-290">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                Welcome back, {userData?.fullName || "Counselor"}
              </h2>
              {loading ? (
                <p>Loading cases...</p>
              ) : caseId ? (
                <CaseCard caseId={caseId} />
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 text-lg">
                    It looks like you don’t have any active cases yet. Let’s get started!
                  </p>
                  <button
                    onClick={() => navigate("/post-case")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all"
                  >
                    Create Your First Case
                  </button>
                </div>
              )}
            </div>
            <div className="self-center md:self-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transform transition-all duration-300 hover:shadow-lg mt-4">
                <video
                  src="images/lawyer2.mp4"
                  autoPlay
                  loop
                  muted
                  className="w-full h-[240px] object-cover rounded-lg"
                  aria-label="Legal information video"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Guide - Hidden if user has an active case */}
        {cases.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Quick Start Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all">
                <h4 className="font-medium text-gray-800">Learn the Basics</h4>
                <p className="text-gray-600">Watch a tutorial on managing your cases.</p>
                <a href="/tutorial" className="text-indigo-600 hover:underline">
                  Watch Now
                </a>
              </div>
              <div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all">
                <h4 className="font-medium text-gray-800">Contact Support</h4>
                <p className="text-gray-600">Need help? Reach out to our team.</p>
                <button
                  onClick={() => navigate("/support")}
                  className="text-indigo-600 hover:underline"
                >
                  Get Support
                </button>
              </div>
              <div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all">
                <h4 className="font-medium text-gray-800">Explore Features</h4>
                <p className="text-gray-600">Discover what you can do with your dashboard.</p>
                <a href="/features" className="text-indigo-600 hover:underline">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-48 h-48 bg-green-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-56 h-56 bg-teal-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
            </div>
            <div className="relative z-10 h-[550px]">
              {loading ? (
                <p>Loading tasks...</p>
              ) : caseId ? (
                <TaskList caseId={caseId} />
              ) : (
                <div className="text-center text-gray-500">
                  <p className="text-lg">No tasks yet.</p>
                  <p>Create a case to start adding tasks!</p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-pink-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
            </div>
            <div className="relative z-10 h-[550px]">
              {loading ? (
                <p>Loading notes...</p>
              ) : caseId ? (
                <NoteList />
              ) : (
                <div className="text-center text-gray-500">
                  <p className="text-lg">No notes yet.</p>
                  <p>Add a case to start taking notes!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-48 h-48 bg-green-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-56 h-56 bg-teal-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
            </div>
            <div className="relative z-10 h-[550px]">
              {loading ? (
                <p>Loading schedule...</p>
              ) : caseId ? (
                <ScheduleMeeting caseId={caseId} />
              ) : (
                <div className="text-center text-gray-500">
                  <p className="text-lg">No meetings yet.</p>
                  <p>Create a case to schedule meetings!</p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-pink-100 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
            </div>
            <div className="relative z-10 h-[550px]">
              {loading ? (
                <p>Loading meetings...</p>
              ) : caseId ? (
                <ScheduledMeetings />
              ) : (
                <div className="text-center text-gray-500">
                  <p className="text-lg">No scheduled meetings yet.</p>
                  <p>Add a case to view meetings!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <ChatButton />
      </main>
    </div>
  );
}

export default ClientDashboard;