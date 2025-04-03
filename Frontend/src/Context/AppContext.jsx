import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCookie } from "../utills/cookies";

export const AppContext = createContext();

export const AppContentProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [lawyerData, setLawyerData] = useState(null);
  const [email, setEmail] = useState("");
  const [privateKey, setPrivateKey] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 

  useEffect(() => {
    const checkLoginStatus = async () => {
      setIsCheckingAuth(true);
      try {
        try {
          const { data } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
          console.log("User data response:", data);
          if (data.success) {
            setIsLoggedIn(true);
            setUserData(data.userData);
            setPrivateKey(data.userData.privateKey);
            return;
          }
        } catch (error) {
          console.log("User auth check failed:", error.response?.data || error.message);
        }

        try {
          const { data } = await axios.get(`${backendUrl}/api/lawyer-data/data`, { withCredentials: true });
          console.log("Lawyer data response:", data); 
          if (data.success) {
            setIsLoggedIn(true);
            setLawyerData(data.UserData);
            setPrivateKey(data.UserData.privateKey);
            return;
          }
        } catch (error) {
          console.log("Lawyer auth check failed:", error.response?.data || error.message);
        }

        setIsLoggedIn(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkLoginStatus();
  }, [backendUrl]);

  const getUserData = async () => {
    try {
      const token = getCookie("jwt");
      if (!token) {
        console.log("No JWT token found");
        setIsLoggedIn(false);
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("Fetched user data:", data); 
      if (data.success) {
        setUserData(data.userData);
        setPrivateKey(data.userData.privateKey);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const getLawyerData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/lawyer-data/data`, { withCredentials: true });
      console.log("Fetched lawyer data:", data);
      if (data.success) {
        setLawyerData(data.UserData);
        setPrivateKey(data.UserData.privateKey);
        setIsLoggedIn(true);
      } else {
        toast.error(data.message || "Failed to retrieve lawyer data.");
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching lawyer data:", error.response?.data || error.message);
      toast.error("Error fetching lawyer data.");
      setIsLoggedIn(false);
    }
  };

  const getPublicKey = async (userId, isLawyer = false) => {
    try {
      const endpoint = isLawyer ? `/api/lawyer-data/${userId}` : `/api/user/${userId}`;
      const { data } = await axios.get(`${backendUrl}${endpoint}`, { withCredentials: true });
      console.log(`Public key response for ${userId}:`, data); 
      if (data.success && data.data.publicKey) {
        return data.data.publicKey;
      }
      throw new Error("Public key not found in response");
    } catch (error) {
      console.error("Error fetching public key:", error.response?.data || error.message);
      toast.error(`Failed to fetch public key for ${isLawyer ? "lawyer" : "user"} ${userId}`);
      return null;
    }
  };

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    getUserData,
    getLawyerData,
    userData,
    setUserData,
    lawyerData,
    setLawyerData,
    email,
    setEmail,
    privateKey,
    getPublicKey,
    isCheckingAuth, 
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};