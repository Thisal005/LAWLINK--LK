import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

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
        // Try client first
        let data;
        try {
          const clientResponse = await axios.get(`${backendUrl}/api/user/data`, {
            withCredentials: true,
          });
          data = clientResponse.data;
          if (data.success) {
            setIsLoggedIn(true);
            setUserData(data.userData);
            setPrivateKey(data.userData.privateKey);
            return; // Exit if client auth succeeds
          }
        } catch (clientError) {
          console.log("Client auth check failed:", clientError.response?.data || clientError.message);
        }

        // If client fails, try lawyer
        const lawyerResponse = await axios.get(`${backendUrl}/api/lawyer-data/data`, {
          withCredentials: true,
        });
        data = lawyerResponse.data;
        if (data.success) {
          setIsLoggedIn(true);
          setLawyerData(data.UserData);
          setPrivateKey(data.UserData.privateKey);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
          setLawyerData(null);
        }
      } catch (error) {
        console.log("Auth check failed:", error.response?.data || error.message);
        setIsLoggedIn(false);
        setUserData(null);
        setLawyerData(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkLoginStatus();
  }, [backendUrl]);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
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
      const { data } = await axios.get(`${backendUrl}/api/lawyer-data/data`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
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
      
      if (!data.success) {
        console.warn(`Failed to fetch public key for ${isLawyer ? "lawyer" : "user"} ${userId}:`, data.message);
        return null;
      }
      if (!data.data?.publicKey) {
        console.warn(`Public key missing in response for ${userId}`);
        return null;
      }
      return data.data.publicKey;
    } catch (error) {
      console.error(
        "Error fetching public key:",
        error.response?.data || error.message,
        { userId, isLawyer }
      );
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