import "../styles/chat.css";
import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

const INITIAL_MESSAGES = [
  { id: 1, from: "system", text: "Support channel active — responders online", time: "10:04" },
  { id: 2, from: "other", name: "Responder Hasan", text: "We're on the way to Sunamganj. ETA 45 mins.", time: "10:06" },
];

export default function Chat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((prev) => [...prev, { id: Date.now(), from: "me", text, time }]);
    setInput("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="chat-root">
        <Navbar />
        <div className="chat-wrap">

          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-icon">📡</div>
              <div>
                <div className="chat-title">Support Chat</div>
                <div className="chat-subtitle">SECURE · ENCRYPTED</div>
              </div>
            </div>
            <div className="chat-status-badge">
              <div className="chat-status-dot" />
              <span className="chat-status-text">LIVE</span>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-window">
            {messages.map((m) =>
              m.from === "system" ? (
                <div key={m.id} className="msg-system">
                  <div className="msg-system-line" />
                  <span>{m.text}</span>
                  <div className="msg-system-line" />
                </div>
              ) : (
                <div key={m.id} className={`msg-row ${m.from === "me" ? "me" : ""}`}>
                  <div className={`msg-avatar ${m.from === "me" ? "me-av" : ""}`}>
                    {m.from === "me" ? "You" : (m.name?.[0] ?? "R")}
                  </div>
                  <div className="msg-body">
                    <div className="msg-name">
                      {m.from === "me" ? "You" : m.name}
                    </div>
                    <div className="msg-bubble">{m.text}</div>
                    <div className="msg-time">{m.time}</div>
                  </div>
                </div>
              )
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <div className="chat-input-row">
              <input
                className="chat-input"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button className="chat-send" onClick={send} aria-label="Send message">
                ➤
              </button>
            </div>
            <div className="chat-input-hint">Press Enter to send</div>
          </div>

        </div>
      </div>
    </>
  );
}
