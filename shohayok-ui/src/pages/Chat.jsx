import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

const INITIAL_MESSAGES = [
  { id: 1, from: "system", text: "Support channel active. Responders are online.", time: "10:04" },
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        .chat-root {
          min-height: 100vh;
          background: #0a0c10;
          font-family: 'Rajdhani', sans-serif;
          color: #e2e8f0;
          display: flex;
          flex-direction: column;
        }

        .chat-wrap {
          max-width: 760px;
          margin: 0 auto;
          padding: 28px 20px;
          width: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }

        .chat-status-dot {
          width: 10px; height: 10px;
          background: #4ade80;
          border-radius: 50%;
          box-shadow: 0 0 8px #4ade80;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .chat-title {
          font-size: 22px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: 1px;
        }

        .chat-subtitle {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #4ade80;
          letter-spacing: 2px;
        }

        .chat-window {
          flex: 1;
          min-height: 380px;
          max-height: 480px;
          overflow-y: auto;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
          scroll-behavior: smooth;
        }

        .chat-window::-webkit-scrollbar { width: 4px; }
        .chat-window::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .msg-system {
          text-align: center;
          margin: 10px 0 18px;
        }

        .msg-system span {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #475569;
          background: rgba(255,255,255,0.04);
          padding: 4px 14px;
          border-radius: 100px;
          letter-spacing: 1px;
        }

        .msg-row {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .msg-row.me {
          flex-direction: row-reverse;
        }

        .msg-avatar {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: rgba(99,102,241,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          color: #818cf8;
          flex-shrink: 0;
          font-weight: 700;
        }

        .msg-avatar.me-av {
          background: rgba(59,130,246,0.2);
          color: #60a5fa;
        }

        .msg-body {
          max-width: 75%;
        }

        .msg-name {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #64748b;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .msg-row.me .msg-name { text-align: right; }

        .msg-bubble {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px 12px 12px 4px;
          padding: 10px 14px;
          font-size: 15px;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .msg-row.me .msg-bubble {
          background: rgba(59,130,246,0.15);
          border-color: rgba(59,130,246,0.25);
          border-radius: 12px 12px 4px 12px;
          color: #bfdbfe;
        }

        .msg-time {
          font-size: 10px;
          font-family: 'Share Tech Mono', monospace;
          color: #334155;
          margin-top: 4px;
        }

        .msg-row.me .msg-time { text-align: right; }

        /* Input */
        .chat-input-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .chat-input {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 15px;
          font-family: 'Rajdhani', sans-serif;
          color: #e2e8f0;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input::placeholder { color: #475569; }
        .chat-input:focus { border-color: rgba(99,102,241,0.4); }

        .chat-send {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border: none;
          border-radius: 12px;
          width: 50px; height: 50px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: opacity 0.2s;
          flex-shrink: 0;
          font-size: 20px;
        }

        .chat-send:hover { opacity: 0.8; }
      `}</style>

      <div className="chat-root">
        <Navbar />
        <div className="chat-wrap">
          <div className="chat-header">
            <div className="chat-status-dot" />
            <div>
              <div className="chat-title">Support Chat</div>
              <div className="chat-subtitle">SECURE CHANNEL · ENCRYPTED</div>
            </div>
          </div>

          <div className="chat-window">
            {messages.map((m) =>
              m.from === "system" ? (
                <div key={m.id} className="msg-system">
                  <span>{m.text}</span>
                </div>
              ) : (
                <div key={m.id} className={`msg-row ${m.from === "me" ? "me" : ""}`}>
                  <div className={`msg-avatar ${m.from === "me" ? "me-av" : ""}`}>
                    {m.from === "me" ? "Y" : m.name?.[0] ?? "R"}
                  </div>
                  <div className="msg-body">
                    <div className="msg-name">{m.from === "me" ? "You" : m.name}</div>
                    <div className="msg-bubble">{m.text}</div>
                    <div className="msg-time">{m.time}</div>
                  </div>
                </div>
              )
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="chat-send" onClick={send}>➤</button>
          </div>
        </div>
      </div>
    </>
  );
}
