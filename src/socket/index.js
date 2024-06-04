import { io } from "socket.io-client";

const socketInit = () => {
  const options = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  const socket = io(process.env.REACT_APP_IO_DOMAIN, options);

  // Log connection events for debugging
  socket.on("connect_error", (err) => {
    console.error("WebSocket connection error:", err);
  });

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });

  socket.on("reconnect_attempt", () => {
    console.log("Attempting to reconnect to WebSocket server");
  });

  socket.on("reconnect_failed", () => {
    console.log("Failed to reconnect to WebSocket server");
  });

  socket.on("reconnect_error", (error) => {
    console.error("Reconnection error:", error);
  });

  return socket;
};

export default socketInit;
