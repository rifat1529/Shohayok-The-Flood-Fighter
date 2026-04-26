import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],

  // 🔥 IMPORTANT
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,

  // optional but useful
  withCredentials: true,
});

// ==========================
// 🔔 DEBUG LOGS
// ==========================
socket.on("connect", () => {
  console.log("🟢 Connected to socket:", socket.id);
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected from socket");
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket error:", err.message);
});

export default socket;