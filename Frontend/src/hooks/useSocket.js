import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const useSocket = (userId) => {
  const [connected, setConnected] = useState(false);
  const [newMessage, setNewMessage] = useState(null);
  const socketRef = useRef(null);
  
  useEffect(() => {
    if (!userId) return;
    
    // Initialize socket connection
   // SocketContext.jsx
const socketUrl = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
const newSocket = io(socketUrl, {
  query: { userId: user._id },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

    // Setup event listeners
    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    socketRef.current.on('newMessage', (message) => {
      console.log('New message received', message);
      setNewMessage(message);
    });

    socketRef.current.on('messageDelivered', (messageId) => {
      console.log('Message delivered', messageId);
      // You can update message status here
    });

    socketRef.current.on('messageRead', (messageId) => {
      console.log('Message read', messageId);
      // You can update message status here
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  // Function to manually emit socket events
  const emitEvent = (event, data) => {
    if (socketRef.current && connected) {
      socketRef.current.emit(event, data);
    }
  };

  return { 
    socket: socketRef.current,
    connected,
    newMessage,
    emitEvent
  };
};

export default useSocket;