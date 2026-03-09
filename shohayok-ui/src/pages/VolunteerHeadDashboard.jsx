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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        .vhd-root {
          min-height: 100vh;
          background: #0a0c10;
          background-image: radial-gradient(ellipse 70% 35% at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 55%);
          font-family: 'Rajdhani', sans-serif;
          color: #e2e8f0;
          padding-bottom: 60px;
        }

        .vhd-container {
          max-width: 960px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .vhd-top {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .vhd-eyebrow {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #f59e0b;
          letter-spacing: 3px;
          margin-bottom: 4px;
        }

        .vhd-title {
          font-size: 34px;
          font-weight: 700;
          color: #f1f5f9;
          line-height: 1;
        }

        /* Duty Toggle */
        .duty-toggle {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 14px 20px;
          cursor: pointer;
          user-select: none;
          transition: border-color 0.2s;
        }

        .duty-toggle.on {
          border-color: rgba(74,222,128,0.3);
          background: rgba(74,222,128,0.05);
        }

        .duty-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #334155;
          transition: background 0.3s;
          flex-shrink: 0;
        }

        .duty-toggle.on .duty-dot {
          background: #4ade80;
          box-shadow: 0 0 8px #4ade80;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%,100%{opacity:1} 50%{opacity:0.5}
        }

        .duty-text {
          font-size: 14px;
          font-weight: 700;
          font-family: 'Share Tech Mono', monospace;
          color: #64748b;
          letter-spacing: 2px;
          transition: color 0.2s;
        }

        .duty-toggle.on .duty-text { color: #4ade80; }

        .duty-pill {
          font-size: 11px;
          padding: 4px 12px;
          border-radius: 100px;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 1px;
        }

        .duty-pill.off { background: rgba(255,255,255,0.06); color: #475569; border: 1px solid rgba(255,255,255,0.08); }
        .duty-pill.on-pill { background: rgba(74,222,128,0.15); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }

        /* Mission alert */
        .mission-alert {
          background: linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04));
          border: 1px solid rgba(245,158,11,0.25);
          border-left: 4px solid #f59e0b;
          border-radius: 14px;
          padding: 20px 24px;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .mission-alert-icon {
          font-size: 28px;
          flex-shrink: 0;
        }

        .mission-alert-label {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #f59e0b;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }

        .mission-alert-title {
          font-size: 20px;
          font-weight: 700;
          color: #fde68a;
          margin-bottom: 6px;
        }

        .mission-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .mission-tag {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 100px;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 1px;
        }

        .tag-r { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
        .tag-m { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }
        .tag-n { background: rgba(255,255,255,0.06); color: #94a3b8; border: 1px solid rgba(255,255,255,0.08); }

        /* Map zone */
        .map-zone {
          background: rgba(15,22,36,0.8);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
          height: 260px;
          margin-bottom: 28px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .map-zone::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .map-overlay-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 3px;
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .tracking-active {
          color: #4ade80;
          text-shadow: 0 0 20px rgba(74,222,128,0.5);
        }

        .tracking-inactive { color: #334155; }

        .tracking-pulse {
          width: 12px; height: 12px;
          background: #4ade80;
          border-radius: 50%;
          margin: 0 auto 12px;
          box-shadow: 0 0 16px #4ade80;
          animation: blink 1.5s infinite;
        }

        /* Map badge */
        .map-badge {
          position: absolute;
          top: 12px;
          left: 14px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #475569;
          letter-spacing: 2px;
        }

        /* Grid */
        .vhd-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 28px;
        }

        @media(max-width: 640px) { .vhd-grid { grid-template-columns: 1fr; } }

        /* Team card */
        .team-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 18px 20px;
          transition: border-color 0.2s;
        }

        .team-card:hover { border-color: rgba(255,255,255,0.12); }

        .tc-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .tc-emoji {
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .tc-name {
          font-size: 17px;
          font-weight: 700;
          color: #f1f5f9;
        }

        .tc-members {
          font-size: 12px;
          font-family: 'Share Tech Mono', monospace;
          color: #475569;
        }

        .tc-status {
          margin-left: auto;
          font-size: 11px;
          padding: 4px 12px;
          border-radius: 100px;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 1px;
        }

        .tc-status.active { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
        .tc-status.ready { background: rgba(245,158,11,0.12); color: #fbbf24; border: 1px solid rgba(245,158,11,0.2); }

        .tc-bar-bg {
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 4px;
          overflow: hidden;
        }

        .tc-bar-fill {
          height: 100%;
          border-radius: 4px;
        }

        /* Activity feed */
        .activity-feed {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 20px 22px;
          margin-bottom: 28px;
        }

        .feed-header {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #475569;
          letter-spacing: 3px;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .feed-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .feed-item:last-child { border-bottom: none; }

        .feed-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .feed-time {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #475569;
          white-space: nowrap;
          margin-top: 3px;
        }

        .feed-text {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.5;
        }

        /* Submit button */
        .submit-report-btn {
          display: block;
          width: 100%;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: white;
          border: none;
          border-radius: 14px;
          padding: 18px;
          font-size: 18px;
          font-weight: 700;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 2px;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.15s;
        }

        .submit-report-btn:hover { opacity: 0.87; transform: scale(1.01); }
      `}</style>

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
