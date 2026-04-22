import { io } from "socket.io-client";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

let socket;

export const initSocket = () => {
  if (!socket) {
    socket = io(API_BASE, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to WebSocket server");
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from WebSocket server");
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
