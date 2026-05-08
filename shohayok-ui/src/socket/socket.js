import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],

  // 🔥 IMPORTANT
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,

  // optional but useful
  withCredentials: true,
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("🟢 Connected to socket:", socket.id);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user?.id) {
    socket.emit("join", user.id);
    console.log("✅ Joined user room:", user.id);
  }
});


socket.on("disconnect", () => {
  console.log("🔴 Disconnected from socket");
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket error:", err.message);
});

export default socket;
