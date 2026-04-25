import "../styles/admin.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "../api/axios";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [missions, setMissions] = useState([]);
  const navigate = useNavigate();

  // 🔥 TOKEN CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const mapItem = (r) => ({
    id: r.id,
    name: r.name || "User",
    location: `${r.district || ""}, ${r.subDistrict || ""}, ${r.village || ""}`,
    trapped: r.peopleCount || 0,
    need: r.needType || "unknown",
    status: r.status
  });

  // 🔥 FETCH DATA SAFE WAY
  const fetchRequests = async () => {
    try {
      const [reqRes, acceptedRes, missionRes, reportRes] = await Promise.all([
        axios.get("/requests"),
        axios.get("/requests/accepted"),
        axios.get("/missions"),
        axios.get("/reports")
      ]);

      console.log("REPORT DATA:", reportRes.data);

      const pending = reqRes.data?.requests || [];
      const alertData = reqRes.data?.alerts || [];

      setAlerts(alertData);
      setMissions(missionRes.data || []);
      setReports(reportRes.data || []);

      setRequests([
        ...(acceptedRes.data || []).map(mapItem),
        ...pending.map(mapItem)
      ]);

    } catch (err) {
      console.error("❌ FETCH ERROR:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        alert("Session expired. Login again.");
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 🔥 REQUEST ACTION
  const handleRequest = async (id, action) => {
    try {
      await axios.patch(`/requests/${id}/status`, { status: action });
      fetchRequests();
    } catch {
      alert("Failed to update request");
    }
  };

  // 🔥 REPORT ACTIONS
  const handleApproveReport = async (id) => {
    try {
      await axios.patch(`/reports/${id}/approve`);
      fetchRequests();
    } catch {
      alert("Failed to approve report");
    }
  };

  const handleReturnReport = async (id) => {
    try {
      await axios.patch(`/reports/${id}/return`);
      fetchRequests();
    } catch {
      alert("Failed to return report");
    }
  };

  const emergencyCount = requests.filter(r => r.status === "pending").length;

  return (
    <div className="admin-root">
      <Navbar />

      <div className="admin-container">

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 className="page-heading">Admin Dashboard</h1>

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        {/* ALERT */}
        <div className="emergency-banner">
          <div className="emergency-pulse">
            {alerts.length > 0 ? "🚨" : "✅"}
          </div>

          <div>
            <p className="emergency-label">
              {alerts.length > 0 ? "EMERGENCY ALERT" : "NO ACTIVE ALERT"}
            </p>
            <p className="emergency-area">
              {alerts[0]?.area || "All areas stable"}
            </p>
          </div>

          <div className="emergency-count">
            <p className="lbl">Requests</p>
            <div className="num">{alerts[0]?.count || 0}</div>
          </div>
        </div>

        {/* MISSION */}
        {missions.length > 0 && (
          <div className="emergency-banner" style={{ borderColor: "#6366f1" }}>
            <div className="emergency-pulse">🚁</div>
            <div>
              <p className="emergency-label">ACTIVE MISSION</p>
              <p className="emergency-area">{missions[0].area}</p>
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
            <div className="num">{emergencyCount}</div>
          </div>
        </div>

        {/* REQUESTS */}
        <div className="section">
          <p className="section-header">Help Requests</p>

          {requests.map((r) => (
            <div key={r.id} className="request-card">
              <div className="card-top">
                <div className="avatar">{r.name[0]}</div>

                <div style={{ flex: 1 }}>
                  <div className="card-name">{r.name}</div>
                  <div className="card-location">{r.location}</div>

                  <div className="card-tags">
                    <span className="tag">{r.need}</span>
                    <span className="tag">👥 {r.trapped}</span>
                  </div>
                </div>
              </div>

              {r.status === "pending" && (
                <div className="card-actions">
                  <button onClick={() => handleRequest(r.id, "approved")}>
                    ✓ Confirm
                  </button>
                  <button onClick={() => handleRequest(r.id, "declined")}>
                    ✕ Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* REPORTS */}
        <div className="section">
          <p className="section-header">Reports (Pending)</p>

          {reports.filter(r => r.status === "pending").length === 0 && (
            <p>No reports yet</p>
          )}

          {reports
            .filter(r => r.status === "pending")
            .map((r) => (
              <div key={r.id} className="request-card">

                {r.image && (
                  <img
                    src={r.image}
                    style={{ width: "100%", height: "180px", objectFit: "cover" }}
                  />
                )}
                <div style={{ marginTop: "10px", fontSize: "14px" }}>
  📊 Requests: {r.totalRequests} <br />
  ✅ Accepted: {r.acceptedRequests} <br />
  👥 Needed: {r.totalPeopleRequested} <br />
  ❤️ Helped: {r.peopleHelped} <br />

  <hr />

  🚁 Rescue: {r.rescueCount} <br />
  🍱 Food: {r.foodCount} <br />
  💊 Medicine: {r.medicineCount}
</div>
                <div className="card-top">
                  <div className="avatar">📋</div>

                  <div style={{ flex: 1 }}>
                    <div className="card-name">{r.area}</div>
                    <div className="card-location">
                      {r.helpType} • {r.peopleHelped}
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                  <button onClick={() => handleApproveReport(r.id)}>
                    ✓ Approve
                  </button>

                  <button onClick={() => handleReturnReport(r.id)}>
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