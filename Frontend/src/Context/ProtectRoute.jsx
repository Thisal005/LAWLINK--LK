import React, { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const ProtectedRoute = ({ children }) => {
  const {
    isLoggedIn,
    userData,
    lawyerData,
    getUserData,
    getLawyerData,
    isCheckingAuth,
  } = useContext(AppContext);
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn && !userData && !lawyerData) {
      if (location.pathname.includes("lawyer")) {
        getLawyerData();
      } else {
        getUserData();
      }
    }
  }, [isLoggedIn, userData, lawyerData, getUserData, getLawyerData, location.pathname]);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    // Determine the redirect based on the current path or previous user type
    const isLawyerRoute = location.pathname.includes("lawyer");
    const redirectTo = isLawyerRoute ? "/lawyer-login" : "/login";
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;