import { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import { toast } from "react-toastify";

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      return;
    }

    const newSocket = io("http://localhost:5000", {
      query: { userId: user._id },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => console.log("Connected to WebSocket server"));
    newSocket.on("disconnect", () => setSocket(null));
    newSocket.on("connect_error", (err) => console.error("Socket connection error:", err.message));
    newSocket.on("getOnlineUsers", (users) => setOnlineUsers(users));
    newSocket.on("newMeeting", (meeting) => {
      toast.info(`New meeting scheduled at ${new Date(meeting.scheduledAt).toLocaleString()}`);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};