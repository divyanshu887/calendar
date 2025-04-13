import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

// Create a context
const SocketContext = createContext();

// Custom hook to use the socket context
export const useSocket = () => {
  return React.useContext(SocketContext);
};

// Socket provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to Socket.IO server
    const newSocket = io(`${"http://localhost:3000/"}`, {
      transports: ["websocket", "polling", "flashsocket"],
    });

    setSocket(newSocket);

    // // Clean up on unmount
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};