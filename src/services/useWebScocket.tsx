// No filepath: React client component
import { useEffect, useState } from "react";
import io from "socket.io-client";
import socketInstance from "./socketInstance"; // Adjust the import path as necessary

export const useWebSocket = (user:any) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const socketInstance = io("http://localhost:4011", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("🔌 Connected to WebSocket");
      setConnected(true);

      // Authenticate user
      socketInstance.emit("authenticate", JSON.stringify(user));
    });

    socketInstance.on("authenticated", (data) => {
      console.log("✅ WebSocket authenticated:", data);
    });

    socketInstance.on("service-update", (update) => {
      console.log("📡 Service update received:", update);
      // Handle real-time updates here
    });

    socketInstance.on("disconnect", () => {
      console.log("🔌 Disconnected from WebSocket");
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return { socket, connected };
};
