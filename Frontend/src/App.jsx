import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./Context/ProtectRoute";
import Home from "./pages/home/Home";
import ClientCreateAcc from "./pages/Client/Login&Signup/ClientCreateAcc";
import Clientlogin from "./pages/Client/Login&Signup/Clientlogin";
import ClientDashboard from "./pages/Client/ClientDashboard";
import VerifyEmail from "./pages/Client/Login&Signup/Verify-email";
import PasswordRest from "./pages/Client/Login&Signup/Password-Rest";
import EmailForResetPass from "./pages/Client/Login&Signup/EmailForResetPass";
import Newpassword from "./pages/Client/Login&Signup/Newpassword";
import LawyerCreateAcc from "./pages/Lawyer/Login&Signup/LawyerCreateAcc ";
import LawyerVerifyEmail from "./pages/Lawyer/Login&Signup/Lawyer-verify-email ";
import Lawyerlogin from "./pages/Lawyer/Login&Signup/Lawyerlogin";
import LawyerEmailForResetPass from "./pages/Lawyer/Login&Signup/LawyerEmailForResetPass";
import LawyerNewpassword from "./pages/Lawyer/Login&Signup/LawyerNewpassword";
import LawyerRestPasswordOtp from "./pages/Lawyer/Login&Signup/LawyerPassword-Rest ";
import LawyerDasgboard from "./pages/Lawyer/LawyerDashboard";
import Chatbot from "./pages/Client/Chatbot";
import LawyerChat from "./pages/Lawyer/LawyerChat";
import ClientChat from "./pages/Client/ClientChat";
import ClientAccountSettings from "./pages/Client/ClientAccountSettings";
import Meeting from "./pages/Meeting";
import NotFound from "./pages/NotFound";
import CaseDetails from "./pages/Client/CaseDetails";
import Case from "./pages/Lawyer/CaseDashboard";
import LawyerAccountSettings from "./pages/Lawyer/LawyerAccountSettings";
import ViewCases from "./pages/ViewCases";
import LawyerNotifications from "./pages/Lawyer/LawyerNotifications";
import ClientNotifications from "./pages/Client/ClientNotifications";
import { ToastContainer } from "react-toastify";
import { AppContentProvider } from "./Context/AppContext";
import { AuthContextProvider,useAuthContext } from "./Context/AuthContext";
import { SocketProvider } from "./Context/SocketContext";
import "react-toastify/dist/ReactToastify.css";
import PostCaseForm from "./pages/Client/CreatePostForm";
import CaseHistory from "./pages/Client/CaseHistory";



function App() {
  return (
    

    <AuthContextProvider>
      <AppContentProvider>
      <SocketProvider>
        <div>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/client-dashboard" element={<ProtectedRoute><ClientDashboard/></ProtectedRoute>} />
            <Route path="/lawyer-dashboard" element={<ProtectedRoute><LawyerDasgboard/></ProtectedRoute>} />
            <Route path="/create-account" element={<ClientCreateAcc />} />
            <Route path="/login" element={<Clientlogin />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/password-rest" element={<PasswordRest />} />
            <Route path="/email-for-password-reset" element={<EmailForResetPass />} />
            <Route path="/create-new-password" element={<Newpassword />} />
            <Route path="/lawyer-create-account" element={<LawyerCreateAcc />} />
            <Route path="/lawyer-verify-email" element={<LawyerVerifyEmail />} />
            <Route path="/lawyer-login" element={<Lawyerlogin />} />
            <Route path="/lawyer-email-for-password-reset" element={<LawyerEmailForResetPass />} />
            <Route path="/lawyer-create-new-password" element={<LawyerNewpassword />} />
            <Route path="/lawyer-password-rest" element={<LawyerRestPasswordOtp />} />
            <Route path="/meeting/:meetingId" element={<Meeting />} />
            <Route path="/lawyer-chat" element={<ProtectedRoute><LawyerChat/></ProtectedRoute>} />
            <Route path="/client-chat" element={<ProtectedRoute><ClientChat/></ProtectedRoute>} />
            <Route path="/case-dashboard/:caseId" element={<ProtectedRoute><Case/></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><Chatbot/></ProtectedRoute>} />
            <Route path="/case/:id" element={<ProtectedRoute><CaseDetails/></ProtectedRoute>} />
            <Route path="/lawyer-notifications" element={<ProtectedRoute><LawyerNotifications/></ProtectedRoute>} />
            <Route path="/client-notifications" element={<ProtectedRoute><ClientNotifications/></ProtectedRoute>} />
            <Route path="/view-cases" element={<ProtectedRoute><ViewCases/></ProtectedRoute>} />
            <Route path="/lawyer-account-settings" element={<ProtectedRoute><LawyerAccountSettings/></ProtectedRoute>} />
            <Route path="/post-case" element={<ProtectedRoute><PostCaseForm/></ProtectedRoute>} />
            <Route path="/case-history" element={<ProtectedRoute><CaseHistory/></ProtectedRoute>} />
            <Route path="/client-account-settings" element={<ProtectedRoute><ClientAccountSettings/></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </div>
    </SocketProvider>

      </AppContentProvider>
    </AuthContextProvider>
  );
}

export default App