import "../styles/volhead.css";
import { useState } from "react";
import Navbar from "../components/Navbar";

const TEAMS = [
  { id: 1, name: "Rescue Team", emoji: "🚁", status: "Active", members: 6, color: "#ef4444", glow: "rgba(239,68,68,0.3)", progress: 80 },
  { id: 2, name: "Food Team", emoji: "🍱", status: "Ready", members: 4, color: "#f59e0b", glow: "rgba(245,158,11,0.3)", progress: 50 },
  { id: 3, name: "Medicine Team", emoji: "💊", status: "Active", members: 5, color: "#3b82f6", glow: "rgba(59,130,246,0.3)", progress: 70 },
];

const ACTIVITY = [
  { time: "10:42", text: "Rescue Team reached Tahirpur checkpoint", type: "rescue" },
  { time: "10:28", text: "Medicine Team dispatched to Jamalganj", type: "medicine" },
  { time: "10:15", text: "Food distribution started at Sunamganj", type: "food" },
  { time: "09:58", text: "Mission zone declared — Sunamganj", type: "mission" },
];

const ACTIVITY_COLOR = {
  rescue: "#ef4444",
  medicine: "#3b82f6",
  food: "#f59e0b",
  mission: "#818cf8",
};

export default function VolunteerHeadDashboard() {
  const [onDuty, setOnDuty] = useState(false);

  return (
    <>
      
      <div className="vhd-root">
        <Navbar />
        <div className="vhd-container">

          {/* Header row */}
          <div className="vhd-top">
            <div>
              <p className="vhd-eyebrow">// FIELD COMMAND</p>
              <h2 className="vhd-title">Volunteer Head Dashboard</h2>
            </div>
            <div
              className={`duty-toggle ${onDuty ? "on" : ""}`}
              onClick={() => setOnDuty(!onDuty)}
            >
              <div className="duty-dot" />
              <span className="duty-text">ON DUTY</span>
              <span className={`duty-pill ${onDuty ? "on-pill" : "off"}`}>
                {onDuty ? "ACTIVE" : "OFF"}
              </span>
            </div>
          </div>

          {/* Mission Alert */}
          <div className="mission-alert">
            <div className="mission-alert-icon">🚨</div>
            <div>
              <p className="mission-alert-label">NEW MISSION ASSIGNED</p>
              <p className="mission-alert-title">Sunamganj Relief Operation</p>
              <div className="mission-tags">
                <span className="mission-tag tag-r">Rescue</span>
                <span className="mission-tag tag-m">Medicine</span>
                <span className="mission-tag tag-n">14 requests</span>
              </div>
            </div>
          </div>

          {/* Tracking Map */}
          <div className="map-zone">
            <span className="map-badge">LIVE TEAM TRACKING</span>
            {onDuty ? (
              <div className="map-overlay-label tracking-active">
                <div className="tracking-pulse" />
                GPS TRACKING ACTIVE
              </div>
            ) : (
              <div className="map-overlay-label tracking-inactive">
                TURN ON DUTY TO ENABLE TRACKING
              </div>
            )}
          </div>

          {/* Teams Grid */}
          <div className="vhd-grid">
            {TEAMS.map((t) => (
              <div key={t.id} className="team-card">
                <div className="tc-top">
                  <div className="tc-emoji" style={{ background: `rgba(${t.color === "#ef4444" ? "239,68,68" : t.color === "#f59e0b" ? "245,158,11" : "59,130,246"},0.15)` }}>
                    {t.emoji}
                  </div>
                  <div>
                    <div className="tc-name">{t.name}</div>
                    <div className="tc-members">👥 {t.members} members</div>
                  </div>
                  <span className={`tc-status ${t.status.toLowerCase()}`}>{t.status}</span>
                </div>
                <div className="tc-bar-bg">
                  <div className="tc-bar-fill" style={{ width: `${t.progress}%`, background: t.color, boxShadow: `0 0 8px ${t.glow}` }} />
                </div>
                <div style={{ fontSize: 11, color: "#334155", marginTop: 6, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1 }}>
                  DEPLOYMENT {t.progress}%
                </div>
              </div>
            ))}

            {/* Stats card */}
            <div className="team-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, fontFamily: "'Share Tech Mono',monospace", color: "#475569", letterSpacing: 2, marginBottom: 16 }}>MISSION STATS</div>
              {[
                { label: "People Helped", value: "62", color: "#4ade80" },
                { label: "Areas Covered", value: "3", color: "#818cf8" },
                { label: "Active Hours", value: "5.4h", color: "#f59e0b" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 14, color: "#64748b" }}>{s.label}</span>
                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontWeight: 700, fontSize: 18, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="activity-feed">
            <div className="feed-header">RECENT ACTIVITY</div>
            {ACTIVITY.map((a, i) => (
              <div key={i} className="feed-item">
                <div className="feed-dot" style={{ background: ACTIVITY_COLOR[a.type], boxShadow: `0 0 6px ${ACTIVITY_COLOR[a.type]}` }} />
                <span className="feed-time">{a.time}</span>
                <span className="feed-text">{a.text}</span>
              </div>
            ))}
          </div>

          {/* Submit Report CTA */}
          <a href="/submit-report" className="submit-report-btn">
            📤 SUBMIT OPERATION REPORT
          </a>

        </div>
      </div>
    </>
  );
}
