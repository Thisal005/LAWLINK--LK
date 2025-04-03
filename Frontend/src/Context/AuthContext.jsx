import { createContext, useContext, useState, useEffect } from "react";
import { AppContext } from "./AppContext";
import axios from "axios";

const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
    const { backendUrl} = useContext(AppContext);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Try fetching client data first
        try {
          const clientRes = await axios.get(`${backendUrl}/api/user/data`,{
            withCredentials: true,
          });
          console.log("Client data response:", clientRes.data);
          setUser(clientRes.data.userData || clientRes.data.UserData); // Handle both cases
        } catch (clientErr) {
          console.log("Client fetch failed, trying lawyer:", clientErr.response?.status);
          if (clientErr.response?.status === 401 || clientErr.response?.status === 404) {
            const lawyerRes = await axios.get(`${backendUrl}/api/lawyer-data/data`, {
              withCredentials: true,
            });
            console.log("Lawyer data response:", lawyerRes.data);
            setUser(lawyerRes.data.UserData); // Match lawyer.controller.js response
          } else {
            throw clientErr; // Unexpected error, propagate it
          }
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};