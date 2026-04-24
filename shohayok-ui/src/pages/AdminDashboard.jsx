import "../styles/admin.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "../api/axios"; // 🔥 USE AXIOS ONLY

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [missions, setMissions] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const mapItem = (r) => ({
    id: r.id,
    name: r.name || "Registered User",
    location: `${r.district}, ${r.subDistrict}, ${r.village}`,
    trapped: r.peopleCount,
    need: r.needType,
    status: r.status
  });

  // 🔥 FETCH ALL DATA
  const fetchRequests = async () => {
    try {
      const [reqRes, acceptedRes, missionRes, reportRes] = await Promise.all([
        axios.get("/requests"),
        axios.get("/requests/accepted"),
        axios.get("/missions"),
        axios.get("/reports")
      ]);

      const pending = reqRes.data.requests || [];
      const alertData = reqRes.data.alerts || [];

      setAlerts(alertData);
      setMissions(missionRes.data);
      setReports(reportRes.data);

      setRequests([
        ...acceptedRes.data.map(mapItem),
        ...pending.map(mapItem)
      ]);

    } catch (err) {
      console.error("FETCH ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 🔥 HANDLE REQUEST APPROVE / DECLINE
  const handleRequest = async (id, action) => {
    try {
      await axios.patch(`/requests/${id}/status`, {
        status: action
      });

      fetchRequests();
    } catch (err) {
      alert("Failed to update request");
    }
  };

  // 🔥 APPROVE REPORT
  const handleApproveReport = async (id) => {
    try {
      await axios.patch(`/reports/${id}/approve`);
      fetchRequests();
    } catch (err) {
      alert("Failed to approve report");
    }
  };

  // 🔥 RETURN REPORT
  const handleReturnReport = async (id) => {
    try {
      await axios.patch(`/reports/${id}/return`);
      fetchRequests();
    } catch (err) {
      alert("Failed to return report");
    }
  };

  const emergencyCount = requests.filter(r => r.status === "pending").length;

  return (
    <div className="admin-root">
      <Navbar />

      <div className="admin-container">

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 className="page-heading">Admin Dashboard</h1>

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        {/* ALERT */}
        {alerts.length > 0 ? (
          <div className="emergency-banner">
            <div className="emergency-pulse">🚨</div>
            <div>
              <p className="emergency-label">EMERGENCY ALERT</p>
              <p className="emergency-area">{alerts[0].area}</p>
            </div>
            <div className="emergency-count">
              <p className="lbl">Requests</p>
              <div className="num">{alerts[0].count}</div>
            </div>
          </div>
        ) : (
          <div className="emergency-banner">
            <div className="emergency-pulse">✅</div>
            <div>
              <p className="emergency-label">NO ACTIVE ALERT</p>
              <p className="emergency-area">All areas stable</p>
            </div>
            <div className="emergency-count">
              <p className="lbl">Requests</p>
              <div className="num">0</div>
            </div>
          </div>
        )}

        {/* MISSION */}
        {missions.length > 0 && (
          <div className="emergency-banner" style={{ borderColor: "#6366f1" }}>
            <div className="emergency-pulse">🚁</div>
            <div>
              <p className="emergency-label">ACTIVE MISSION</p>
              <p className="emergency-area">{missions[0].area}</p>
            </div>
            <div className="emergency-count">
              <p className="lbl">Status</p>
              <div className="num">ACTIVE</div>
            </div>
          </div>
        )}

        {/* COUNT */}
        <div className="emergency-banner">
          <div className="emergency-pulse">📊</div>
          <div>
            <p className="emergency-label">TOTAL PENDING</p>
            <p className="emergency-area">All Areas</p>
          </div>
          <div className="emergency-count">
            <p className="lbl">Requests</p>
            <div className="num">{emergencyCount}</div>
          </div>
        </div>

        {/* REQUESTS */}
        <div className="section">
          <p className="section-header">Help Requests</p>

          {requests.map((r) => (
            <div key={r.id} className={`request-card ${r.status !== "pending" ? r.status : ""}`}>
              <div className="card-top">
                <div className="avatar">{r.name ? r.name[0] : "U"}</div>

                <div style={{ flex: 1 }}>
                  <div className="card-name">{r.name}</div>
                  <div className="card-location">{r.location}</div>

                  <div className="card-tags">
                    <span className={`tag tag-${r.need.toLowerCase()}`}>
                      {r.need}
                    </span>
                    <span className="tag tag-people">
                      👥 {r.trapped} trapped
                    </span>
                  </div>
                </div>
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

        {/* REPORTS */}
        <div className="section">
  <p className="section-header">Reports (Pending Review)</p>

  {reports
    .filter((r) => r.status === "pending")
    .map((r) => (
      <div key={r.id} className="request-card">

        {r.image && (
          <img
            src={r.image}
            style={{ width: "100%", height: "180px", objectFit: "cover" }}
          />
        )}

        <div className="card-top">
          <div className="avatar">📋</div>

          <div style={{ flex: 1 }}>
            <div className="card-name">{r.area}</div>

            <div className="card-location">
              {r.helpType} • {r.peopleHelped} helped
            </div>

            <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "6px" }}>
              📝 {r.notes || "No notes"}
            </div>
          </div>
        </div>

        <div className="card-actions">
          <button
            className="btn btn-confirm"
            onClick={() => handleApproveReport(r.id)}
          >
            ✓ Approve
          </button>

          <button
            className="btn btn-decline"
            onClick={() => handleReturnReport(r.id)}
          >
            ✕ Return
          </button>
        </div>

      </div>
    ))}
</div>

      </div>
    </div>
  );
}