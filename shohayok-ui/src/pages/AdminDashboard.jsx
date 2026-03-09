import { useState } from "react";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([
    { id: 1, name: "Rahim", location: "Sunamganj, Tahirpur", trapped: 6, need: "Rescue", status: "pending" },
    { id: 2, name: "Karim", location: "Sunamganj, Jamalganj", trapped: 4, need: "Medicine", status: "pending" },
  ]);

  const [reports, setReports] = useState([
    { id: 1, area: "Sunamganj", helped: 38, support: "Rescue + Medicine", status: "pending" },
  ]);

  const handleRequest = (id, action) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  const handleReport = (id, action) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        .admin-root {
          min-height: 100vh;
          background: #0a0c10;
          background-image: 
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(220,38,38,0.08) 0%, transparent 60%),
            linear-gradient(180deg, #0a0c10 0%, #0d1117 100%);
          font-family: 'Rajdhani', sans-serif;
          color: #e2e8f0;
          padding-bottom: 60px;
        }

        .admin-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .page-title {
          font-size: 13px;
          font-family: 'Share Tech Mono', monospace;
          color: #ef4444;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .page-heading {
          font-size: 36px;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: 1px;
          margin-bottom: 32px;
          line-height: 1;
        }

        /* Emergency Banner */
        .emergency-banner {
          background: linear-gradient(135deg, rgba(220,38,38,0.15), rgba(220,38,38,0.05));
          border: 1px solid rgba(220,38,38,0.4);
          border-left: 4px solid #ef4444;
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          overflow: hidden;
        }

        .emergency-banner::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 200px; height: 100%;
          background: radial-gradient(ellipse at right, rgba(220,38,38,0.1), transparent);
        }

        .emergency-pulse {
          width: 40px; height: 40px;
          background: rgba(220,38,38,0.2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(220,38,38,0); }
        }

        .emergency-label {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #ef4444;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }

        .emergency-area {
          font-size: 22px;
          font-weight: 700;
          color: #fca5a5;
        }

        .emergency-count {
          margin-left: auto;
          text-align: right;
        }

        .emergency-count .num {
          font-size: 48px;
          font-weight: 700;
          color: #ef4444;
          line-height: 1;
          font-family: 'Share Tech Mono', monospace;
        }

        .emergency-count .lbl {
          font-size: 11px;
          color: #94a3b8;
          letter-spacing: 2px;
        }

        /* Section */
        .section {
          margin-bottom: 28px;
        }

        .section-header {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #64748b;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        /* Request Card */
        .request-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 18px 20px;
          margin-bottom: 12px;
          transition: border-color 0.2s;
        }

        .request-card:hover {
          border-color: rgba(255,255,255,0.12);
        }

        .request-card.confirmed {
          border-color: rgba(34,197,94,0.3);
          background: rgba(34,197,94,0.04);
        }

        .request-card.declined {
          border-color: rgba(220,38,38,0.2);
          background: rgba(220,38,38,0.03);
          opacity: 0.5;
        }

        .card-top {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 14px;
        }

        .avatar {
          width: 38px; height: 38px;
          background: rgba(99,102,241,0.2);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700;
          font-size: 16px;
          color: #818cf8;
          flex-shrink: 0;
        }

        .card-name {
          font-size: 18px;
          font-weight: 700;
          color: #f1f5f9;
        }

        .card-location {
          font-size: 13px;
          color: #64748b;
          font-family: 'Share Tech Mono', monospace;
        }

        .card-tags {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .tag {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 100px;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 1px;
        }

        .tag-rescue { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
        .tag-medicine { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }
        .tag-people { background: rgba(255,255,255,0.05); color: #94a3b8; border: 1px solid rgba(255,255,255,0.08); }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 7px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 1px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-confirm {
          background: rgba(34,197,94,0.15);
          color: #4ade80;
          border: 1px solid rgba(34,197,94,0.3);
        }
        .btn-confirm:hover { background: rgba(34,197,94,0.25); }

        .btn-decline {
          background: rgba(220,38,38,0.1);
          color: #f87171;
          border: 1px solid rgba(220,38,38,0.25);
        }
        .btn-decline:hover { background: rgba(220,38,38,0.2); }

        .btn-approve {
          background: rgba(34,197,94,0.15);
          color: #4ade80;
          border: 1px solid rgba(34,197,94,0.3);
        }
        .btn-approve:hover { background: rgba(34,197,94,0.25); }

        .btn-return {
          background: rgba(251,146,60,0.12);
          color: #fb923c;
          border: 1px solid rgba(251,146,60,0.25);
        }
        .btn-return:hover { background: rgba(251,146,60,0.2); }

        .status-badge {
          margin-left: auto;
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          padding: 3px 10px;
          border-radius: 100px;
          letter-spacing: 1px;
        }

        .badge-confirmed { background: rgba(34,197,94,0.15); color: #4ade80; }
        .badge-declined { background: rgba(220,38,38,0.15); color: #f87171; }

        /* Mission Box */
        .mission-box {
          background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.08));
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 12px;
          padding: 22px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .mission-info .label {
          font-size: 11px;
          font-family: 'Share Tech Mono', monospace;
          color: #64748b;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }

        .mission-info .value {
          font-size: 28px;
          font-weight: 700;
          color: #818cf8;
        }

        .mission-info .sub {
          font-size: 13px;
          color: #475569;
        }

        .btn-mission {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: opacity 0.2s;
          white-space: nowrap;
        }

        .btn-mission:hover { opacity: 0.85; }
      `}</style>

      <div className="admin-root">
        <Navbar />
        <div className="admin-container">
          <h1 className="page-heading">Admin Dashboard</h1>

          {/* Emergency Alert */}
          <div className="emergency-banner">
            <div className="emergency-pulse">🚨</div>
            <div>
              <p className="emergency-label">ACTIVE EMERGENCY</p>
              <p className="emergency-area">Sunamganj</p>
            </div>
            <div className="emergency-count">
              <div className="num">34</div>
              <div className="lbl">HELP REQUESTS</div>
            </div>
          </div>

          {/* Pending Help Requests */}
          <div className="section">
            <p className="section-header">Pending Help Requests</p>

            {requests.map((r) => (
              <div key={r.id} className={`request-card ${r.status !== "pending" ? r.status : ""}`}>
                <div className="card-top">
                  <div className="avatar">{r.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div className="card-name">{r.name}</div>
                    <div className="card-location">📍 {r.location}</div>
                    <div className="card-tags">
                      <span className={`tag tag-${r.need.toLowerCase()}`}>{r.need}</span>
                      <span className="tag tag-people">👥 {r.trapped} trapped</span>
                    </div>
                  </div>
                  {r.status !== "pending" && (
                    <span className={`status-badge badge-${r.status}`}>
                      {r.status.toUpperCase()}
                    </span>
                  )}
                </div>

                {r.status === "pending" && (
                  <div className="card-actions">
                    <button className="btn btn-confirm" onClick={() => handleRequest(r.id, "confirmed")}>
                      ✓ Confirm
                    </button>
                    <button className="btn btn-decline" onClick={() => handleRequest(r.id, "declined")}>
                      ✕ Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mission Declaration */}
          <div className="section">
            <p className="section-header">Mission Control</p>
            <div className="mission-box">
              <div className="mission-info">
                <p className="label">CONFIRMED REQUESTS IN AREA</p>
                <p className="value">12</p>
                <p className="sub">Threshold met — ready to declare</p>
              </div>
              <button className="btn-mission">⚡ Declare Rescue Zone</button>
            </div>
          </div>

          {/* Report Approval */}
          <div className="section">
            <p className="section-header">Pending Operation Reports</p>

            {reports.map((r) => (
              <div key={r.id} className={`request-card ${r.status !== "pending" ? r.status : ""}`}>
                <div className="card-top">
                  <div className="avatar" style={{ background: "rgba(251,146,60,0.15)", color: "#fb923c" }}>📋</div>
                  <div style={{ flex: 1 }}>
                    <div className="card-name">Mission: {r.area}</div>
                    <div className="card-location">People Helped: {r.helped}</div>
                    <div className="card-tags">
                      <span className="tag tag-rescue">{r.support}</span>
                    </div>
                  </div>
                  {r.status !== "pending" && (
                    <span className={`status-badge badge-${r.status}`}>
                      {r.status.toUpperCase()}
                    </span>
                  )}
                </div>

                {r.status === "pending" && (
                  <div className="card-actions">
                    <button className="btn btn-approve" onClick={() => handleReport(r.id, "confirmed")}>
                      ✓ Approve
                    </button>
                    <button className="btn btn-return" onClick={() => handleReport(r.id, "declined")}>
                      ↩ Return for Correction
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
