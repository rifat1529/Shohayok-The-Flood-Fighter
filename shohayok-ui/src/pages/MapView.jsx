import "../styles/map.css";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function MapView() {
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("all");

  // 🔐 user check (optional safety)
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <div style={{ padding: "20px" }}>Please login to view map</div>;
  }

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

  const filtered =
    filter === "all" ? PINS : PINS.filter((p) => p.type === filter);

  return (
    <div className="map-root">
      <Navbar />

      <div className="map-container">
        <h2>Live Map View</h2>

        <div className="filter-row">
          {["all", "rescue", "food", "medicine"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="map-frame">
          {filtered.map((pin) => {
            const c = TYPE_COLOR[pin.type];

            return (
              <div
                key={pin.id}
                className="map-pin"
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                onClick={() =>
                  setActive(active?.id === pin.id ? null : pin)
                }
              >
                <div
                  className="pin-dot"
                  style={{ background: c.bg }}
                />

                {active?.id === pin.id && (
                  <div className="pin-tooltip">
                    {pin.label} ({pin.count})
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}