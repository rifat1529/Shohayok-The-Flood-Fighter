import "../styles/admin.css";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ FIX
import Navbar from "../components/Navbar";
import axios from "../api/axios";
import socket from "../socket/socket";
export default function AdminDashboard() {
const [requests, setRequests] = useState([]);
const [reports, setReports] = useState([]);
const [alerts, setAlerts] = useState([]);
const [missions, setMissions] = useState([]);
const [instructions, setInstructions] = useState([]);
const [users, setUsers] = useState([]);

const [emergency, setEmergency] = useState(false);
const [mission, setMission] = useState(false);

const navigate = useNavigate();
const token = localStorage.getItem("token");

// 🔥 SAFE ALERT HANDLING
const hasAlert = emergency || alerts.length > 0;
const currentAlert = alerts.length > 0 ? alerts[0] : null;

// 🔥 SAFE MISSION
const hasMission = missions.length > 0;
const currentMission = missions.length > 0 ? missions[0] : null;
  useEffect(() => {
    if (!token) {
      alert("Please login first");
      navigate("/login");
    }
  }, []);

  useEffect(() => {

  socket.on("volunteer-joined", (data) => {
    console.log("👥 Updated Count:", data);

    setMissions(prev =>
      prev.map(m =>
        m.id === data.missionId
          ? { ...m, volunteerCount: data.count }
          : m
      )
    );
  });

  return () => socket.off("volunteer-joined");

}, []);
// 🔔 SOCKET LISTENER (separate)
useEffect(() => {

  const handleConnect = () => {
    console.log("🟢 Connected to socket:", socket.id);
  };

  const handleEmergency = (data) => {
    alert(data.message);
    setEmergency(true);
  };

  const handleMission = (data) => {
    console.log("🚁 Mission received:", data);

    if (!data?.missionId) return;

    alert(data.message);

    setMissions(prev => {
      const exists = prev.some(m => m.id === data.missionId);
      if (exists) return prev;

      return [
        {
          id: data.missionId,
          district: data.district
        },
        ...prev
      ];
    });
  };

  // 🔥 attach listeners
  socket.on("connect", handleConnect);
  socket.on("emergency-alert", handleEmergency);
  socket.on("mission", handleMission);

  // 🔥 CLEANUP (VERY IMPORTANT)
  return () => {
    socket.off("connect", handleConnect);
    socket.off("emergency-alert", handleEmergency);
    socket.off("mission", handleMission);
  };

}, []); // 🔥 run only once

useEffect(() => {

  socket.on("emergency-alert", (data) => {
    alert(data.message); // 🔥 popup
    setEmergency(true);
  });

  return () => {
    socket.off("emergency-alert");
  };

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
      const [reqRes, acceptedRes, missionRes, reportRes, instRes , userRes] =
        await Promise.all([
          axios.get("/requests"),
          axios.get("/requests/accepted"),
          axios.get("/missions"),
          axios.get("/reports"),
          axios.get("/instructions"),
          axios.get("/api/users")
        ]);

      console.log("REPORT DATA:", reportRes.data);
      console.log("INSTRUCTION DATA:", instRes.data);
      console.log("USER DATA:", userRes.data);

      const pending = Array.isArray(reqRes.data?.requests)
        ? reqRes.data.requests
        : [];

      const alertData = Array.isArray(reqRes.data?.alerts)
        ? reqRes.data.alerts
        : [];

      const instructionsData = Array.isArray(instRes.data)
        ? instRes.data
        : [];

      setAlerts(alertData);
      setMissions(Array.isArray(missionRes.data) ? missionRes.data : []);
      setReports(Array.isArray(reportRes.data) ? reportRes.data : []);
      setInstructions(instructionsData);
      setUsers(Array.isArray(userRes.data) ? userRes.data : []);

      setRequests([
        ...(Array.isArray(acceptedRes.data)
          ? acceptedRes.data.map(mapItem)
          : []),
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
  const handleMakeHead = async (id) => {
  if (!window.confirm("Make this user Volunteer Head?")) return;

  try {
    await axios.patch(`/api/users/${id}/make-head`);
    alert("Promoted to Volunteer Head!");
    fetchRequests();
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Failed to promote");
  }
};
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

  // 🔥 DELETE INSTRUCTION
  const handleDeleteInstruction = async (id) => {
    if (!window.confirm("Delete instruction?")) return;

   try {
    await axios.delete(`/instructions/${id}`); // ✅ no headers here
    setInstructions((prev) => prev.filter((i) => i.id !== id));
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Failed to delete instruction");
  }
};

  const emergencyCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="admin-root">
      <Navbar />

      <div className="admin-container">

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 className="page-heading">Admin Dashboard</h1>

          {/* <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button> */}
        </div>

       {/* 🔥 INSTRUCTION SECTION */}
<div className="section">

  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
    <p className="section-header">📢 Instructions</p>

    <Link to="/admin/instruction">
      <button className="submit-btn" style={{ padding: "8px 14px", fontSize: "13px" }}>
        ➕ Add
      </button>
    </Link>
  </div>

  {Array.isArray(instructions) && instructions.length === 0 ? (
    <p>No instructions</p>
  ) : (
    (Array.isArray(instructions) ? instructions : []).map((i, index) => (
      <div key={i.id} className="request-card"> {/* CSS match */}

        <div className="card-top">
          <div className="avatar">📢</div>

          <div style={{ flex: 1 }}>
            <div className="card-name">
              {index + 1}. {i.title}
            </div>

            <div className="card-location">
              {i.type} • {i.district || "All"}
            </div>
          </div>
        </div>

        <p style={{ marginTop: "10px", fontSize: "14px", color: "#cbd5f5" }}>
          {i.content}
        </p>

        <div className="card-actions">
          <button onClick={() => handleDeleteInstruction(i.id)}>
            ❌ Delete
          </button>
        </div>

      </div>
    ))
  )}
</div>

<div className="section">
          <p className="section-header">🤝 Volunteers</p>

          {users
            .filter((u) => u.role === "volunteer")
            .map((u, index) => (
              <div key={u.id} className="request-card">

                <div className="card-top">
                  <div className="avatar">{u.name?.[0]}</div>

                  <div style={{ flex: 1 }}>
                    <div className="card-name">
                      {index + 1}. {u.name}
                    </div>

                    <div className="card-location">
                      {u.district} • Points: {u.points || 0}
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                  <button onClick={() => handleMakeHead(u.id)}>
                    ⭐ Make Head
                  </button>
                </div>

              </div>
            ))}
        </div>

        {/* ALERT */}
        <div className="emergency-banner">
  <div className="emergency-pulse">
    {hasAlert ? "🚨" : "✅"}
  </div>

  <div>
    <p className="emergency-label">
      {hasAlert ? "EMERGENCY ALERT" : "NO ACTIVE ALERT"}
    </p>
    <p className="emergency-area">
      {currentAlert?.area || "All areas stable"}
    </p>
  </div>

  <div className="emergency-count">
    <p className="lbl">Requests</p>
    <div className="num">{currentAlert?.count || 0}</div>
  </div>
</div>

        {/* MISSION */}
        {hasMission && (
          <div className="emergency-banner" style={{ borderColor: "#6366f1" }}>
            <div className="emergency-pulse">🚁</div>
            <div>
              <p className="emergency-label">ACTIVE MISSION</p>
              <p className="emergency-area">{currentMission?.district}</p>
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

          {(Array.isArray(reports) ? reports : [])
            .filter((r) => r.status === "pending")
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
                    <div className="card-name">{r.district}</div>
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