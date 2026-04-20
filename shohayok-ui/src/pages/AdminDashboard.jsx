import "../styles/admin.css";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api/http";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const emergencyCount = requests.length;

const emergencyArea = (() => {
  if (!requests.length) return "N/A";
  const freq = {};
  requests.forEach((r) => {
    const key = r.location?.split(",")[0]?.trim() || "Unknown";
    freq[key] = (freq[key] || 0) + 1;
  });
  return Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0];
})();

  useEffect(() => {
    const fetchRequests = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    const pendingDeclined = await apiRequest("/requests", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });

    const accepted = await apiRequest("/requests/accepted", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });

    const mapItem = (r) => ({
      id: r.id,
      name: r.name || "Registered User",
      location: `${r.district}, ${r.subDistrict}, ${r.village}`,
      trapped: r.peopleCount,
      need: r.needType,
      status: r.status
    });

    const merged = [...accepted.map(mapItem), ...pendingDeclined.map(mapItem)];
    setRequests(merged);
  } catch (err) {
    console.error("Failed to fetch requests", err);
  }
};

    fetchRequests();
  }, []);

  const handleRequest = async (id, action) => {
     
    try {
      const token = localStorage.getItem("accessToken");
      await apiRequest(`/requests/${id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: action })
      });

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: action } : r))
      );
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  };

  const handleReport = (id, action) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  return (
    <>
     

      <div className="admin-root">
        <Navbar />
        <div className="admin-container">
          <h1 className="page-heading">Admin Dashboard</h1>

          {/* Emergency Alert */}
          <div className="emergency-banner">
            <div className="emergency-pulse">🚨</div>
            <div>
              <p className="emergency-label">ACTIVE EMERGENCY</p>
            <p className="emergency-area">{emergencyArea}</p>
            </div>
            <div className="emergency-count">
                <p className="lbl">Total Requests</p>
              <div className="num">{emergencyCount}</div>
            </div>
          </div>

          {/* Pending Help Requests */}
          <div className="section">
            <p className="section-header">Pending Help Requests</p>

            {requests.map((r) => (
              <div key={r.id} className={`request-card ${r.status !== "pending" ? (r.status === "confirmed" ? "confirmed" : r.status) : ""}`}>
                <div className="card-top">
                  <div className="avatar">{r.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div className="card-name">{r.name}</div>
                    <div className="card-location"> {r.location}</div>
                    <div className="card-tags">
                      <span className={`tag tag-${r.need.toLowerCase()}`}>{r.need}</span>
                      <span className="tag tag-people">👥 {r.trapped} trapped</span>
                    </div>
                  </div>
                  {r.status !== "pending" && (
                    <span className={`status-badge badge-${r.status === "approved" ? "confirmed" : r.status}`}>
                      {r.status === "approved" ? "CONFIRMED" : r.status.toUpperCase()}
                    </span>
                  )}
                </div>

                {r.status === "pending" && (
                  <div className="card-actions">
                    <button className="btn btn-confirm" onClick={() => handleRequest(r.id, "approved")}>
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