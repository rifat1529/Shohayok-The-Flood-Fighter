
import { useEffect, useRef, useState } from "react";
import socket from "../socket/socket";
import "../styles/chat.css";

export default function Chat() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  // const userId = currentUser?.id;
  console.log("CURRENT USER:", currentUser);

  const userId = String(currentUser?.id || "");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  const ROOM = "global_chat";

  // 🔥 JOIN ROOM
  useEffect(() => {
    socket.emit("joinConversation", ROOM);

    socket.off("receiveMessage");

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      conversationId: ROOM,
      senderId: userId,
      message,
    });

    setMessage("");
  };

  return (
    <div className="chat-container">

      {/* HEADER */}
      <div className="chat-header">
        <h3 style={{ color: "white" }}>Group Chat</h3>
      </div>

      {/* BODY */}
      <div className="chat-body">
        
        {messages.map((msg, i) => {
  const isMe = String(msg.senderId) === String(userId);
          console.log("MSG SENDER:", msg.senderId); 
  return (
    <div
      key={i}
      style={{
        display: "flex",
        justifyContent: isMe ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          background: isMe ? "#dcf8c6" : "#ffffff",
          padding: "10px",
          borderRadius: "10px",
          maxWidth: "60%",
        }}
      >
        {msg.message}
      </div>
    </div>
  );
})}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}