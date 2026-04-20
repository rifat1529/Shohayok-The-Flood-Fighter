import "../styles/map.css";
import { useState } from "react";
import Navbar from "../components/Navbar";

const PINS = [
  { id: 1, x: 38, y: 42, label: "Sunamganj", type: "rescue", count: 14 },
  { id: 2, x: 55, y: 30, label: "Sylhet", type: "food", count: 8 },
  { id: 3, x: 62, y: 58, label: "Habiganj", type: "medicine", count: 5 },
  { id: 4, x: 28, y: 65, label: "Netrokona", type: "rescue", count: 11 },
];

const TYPE_COLOR = {
  rescue: { bg: "#ef4444", glow: "rgba(239,68,68,0.4)", label: "Rescue" },
  food: { bg: "#f59e0b", glow: "rgba(245,158,11,0.4)", label: "Food" },
  medicine: { bg: "#3b82f6", glow: "rgba(59,130,246,0.4)", label: "Medicine" },
};

export default function MapView() {
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? PINS : PINS.filter((p) => p.type === filter);

  return (
    <>
      

      <div className="map-root">
        <Navbar />
        <div className="map-container">
          <div className="map-top">
            <div>
              <p className="map-eyebrow">// SITUATIONAL AWARENESS</p>
              <h2 className="map-title">Live Map View</h2>
            </div>
            <div className="filter-row">
              {["all", "rescue", "food", "medicine"].map((f) => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? `active-${f}` : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="map-layout">
            {/* Map */}
            <div>
              <div className="map-frame">
                <span className="map-label">BD RESCUE GRID · LIVE</span>
                <span className="map-coords">24.3636° N · 90.3896° E</span>

                {filtered.map((pin) => {
                  const c = TYPE_COLOR[pin.type];
                  return (
                    <div
                      key={pin.id}
                      className="map-pin"
                      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                      onClick={() => setActive(active?.id === pin.id ? null : pin)}
                    >
                      <div className="pin-dot" style={{ background: c.bg, boxShadow: `0 0 10px ${c.glow}` }}>
                        <div className="pin-ring" style={{ borderColor: c.bg }} />
                      </div>
                      <span className="pin-count" style={{ color: c.bg }}>{pin.count}</span>
                      {active?.id === pin.id && (
                        <div className="pin-tooltip">
                          <div className="tooltip-name">{pin.label}</div>
                          <div className="tooltip-detail">{c.label} · {pin.count} requests</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="stats-row">
                <div className="stat-box">
                  <div className="stat-num" style={{ color: "#ef4444" }}>38</div>
                  <div className="stat-lbl">TOTAL REQ</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num" style={{ color: "#4ade80" }}>4</div>
                  <div className="stat-lbl">ZONES</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num" style={{ color: "#818cf8" }}>18</div>
                  <div className="stat-lbl">TEAMS OUT</div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="map-sidebar">
              {PINS.map((pin) => {
                const c = TYPE_COLOR[pin.type];
                return (
                  <div
                    key={pin.id}
                    className={`sidebar-card ${active?.id === pin.id ? "selected" : ""}`}
                    onClick={() => setActive(active?.id === pin.id ? null : pin)}
                  >
                    <div className="sc-top">
                      <div className="sc-dot" style={{ background: c.bg, boxShadow: `0 0 6px ${c.glow}` }} />
                      <span className="sc-name">{pin.label}</span>
                      <span className="sc-count">{pin.count} REQ</span>
                    </div>
                    <div className="sc-bar-bg">
                      <div className="sc-bar-fill" style={{ width: `${(pin.count / 15) * 100}%`, background: c.bg }} />
                    </div>
                    <div style={{ fontSize: 12, color: "#475569", marginTop: 6, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>
                      {c.label.toUpperCase()} PRIORITY
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
