import "../styles/volunteer.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import socket from "../socket/socket";
import axios from "../api/axios";

export default function VolunteerDashboard() {
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [feedback, setFeedback] = useState([]);
 
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ==========================
  // 🔥 FETCH MISSION (IMPORTANT)
  // ==========================
 useEffect(() => {
  const fetchMission = async () => {
    try {
      const res = await axios.get(`/missions/volunteer/me?userId=${user.id}`);

      console.log("MISSION API:", res.data);

      if (res.data) {
        setMission(res.data);

        localStorage.setItem("mission", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("❌ fetch mission error:", err);
    }
  };

  fetchMission();
}, []);

useEffect(() => {
  socket.on("mission-update", (data) => {
    console.log("🔥 UPDATE RECEIVED:", data);

    if (mission?.id === data.missionId) {
      setMission(prev => ({
        ...prev,
        volunteers: data.volunteers
      }));
    }
  });

  return () => socket.off("mission-update");
}, [mission]);

  useEffect(() => {
    const handleNotification = () => {
      axios.get("/rewards/ledger").then((res) => setRewards(Array.isArray(res.data) ? res.data : [])).catch(() => {});
      axios.get("/feedback").then((res) => setFeedback(Array.isArray(res.data?.rows) ? res.data.rows : [])).catch(() => {});
    };

    socket.on("notification", handleNotification);
    return () => socket.off("notification", handleNotification);
  }, []);

  useEffect(() => {
  socket.on("mission-invite", (data) => {
    const join = confirm(data.message);

    socket.emit("mission-response", {
      missionId: data.missionId,
      userId: user.id,
      status: join ? "joined" : "rejected"
    });
  });

  return () => {
    socket.off("mission-invite");
  };
}, []);

  // ==========================
  // 🔔 SOCKET (FILTERED)
  // ==========================
  useEffect(() => {
  const handleMission = (data) => {
    console.log("🚁 Mission received:", data);

    alert(data.message);

    setMission(data.mission);

    localStorage.setItem("mission", JSON.stringify(data.mission));
  };

  socket.on("mission", handleMission);

  return () => socket.off("mission", handleMission);
}, []);

  // ==========================
  // 🔥 LOAD SAVED (fallback)
  // ==========================
 useEffect(() => {
  const saved = localStorage.getItem("mission");

  if (saved && !mission) {
    setMission(JSON.parse(saved));
  }
}, []);

  // ==========================
  // 🔥 JOIN
  // ==========================
  const handleJoin = async () => {
    if (!mission?.id) return;

    setLoading(true);

    try {
      await axios.post(`/missions/${mission.id}/join`);
      alert("✅ Joined mission!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to join");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vol-page">
      <Navbar />

      <div className="vol-wrap">

        {/* HEADER */}
        <div className="vol-header">
          <div className="vol-header-left">
            <p className="vol-tagline">// VOLUNTEER CONTROL</p>
            <h2 className="vol-title">Volunteer Dashboard</h2>
          </div>

          <div className="vol-status">
            <div className="vol-status-dot" />
            <span>ONLINE</span>
          </div>
        </div>

        {/* EMPTY */}
{!mission ? (
  <div className="vol-empty">
    <div className="vol-empty-icon">🟢</div>
    <p>No active mission</p>
  </div>
) : (
  <div className="request-card">

    <div className="request-card-header">
      <div>
        <p className="mission-label">ACTIVE MISSION</p>
        <h3 className="mission-title">{mission?.district}</h3>
      </div>

      <div className="mission-badge">
        PRIORITY
      </div>
    </div>

    {/* 🔥 ACTION BUTTONS */}
    <div style={{ marginBottom: "15px" }}>
      {!mission?.volunteers?.includes(user?.id) ? (
        <>
          <button
            className="join-btn"
            onClick={() => {
              socket.emit("mission-response", {
                missionId: mission.id,
                userId: user?.id,
                status: "joined"
              });
            }}
          >
            ✅ Join Mission
          </button>

          <button
            className="join-btn"
            style={{ marginLeft: "10px", background: "#ff4d4f" }}
            onClick={() => {
              socket.emit("mission-response", {
                missionId: mission.id,
                userId: user?.id,
                status: "rejected"
              });
            }}
          >
            ❌ Reject
          </button>
        </>
      ) : (
        <p style={{ color: "lime", fontWeight: "bold" }}>
          ✅ Joined
        </p>
      )}
    </div>

    {/* 🔥 STATUS */}
    {!mission?.volunteers?.includes(user?.id) && (
      <p style={{ color: "#ff4d4f" }}>❌ Not Joined</p>
    )}

    {/* INFO */}
    <div className="mission-info">
      <div className="mission-row">
        <span className="mission-row-label">Mission ID</span>
        <span className="mission-row-value">{mission.id}</span>
      </div>

      <div className="mission-divider" />

      <div className="mission-row">
        <span className="mission-row-label">Area</span>
        <span className="mission-row-value">{mission?.district}</span>
      </div>
    </div>

  </div>
)}

        <div className="request-card">
          <div className="request-card-header">
            <div>
              <p className="mission-label">REWARDS</p>
              <h3 className="mission-title">{rewards.reduce((sum, r) => sum + Number(r.points || 0), 0)} points</h3>
            </div>
          </div>

          {rewards.slice(0, 4).map((reward) => (
            <div key={reward.id} className="mission-row">
              <span className="mission-row-label">{reward.reason}</span>
              <span className="mission-row-value">+{reward.points}</span>
            </div>
          ))}
        </div>

        <div className="request-card">
          <div className="request-card-header">
            <div>
              <p className="mission-label">FEEDBACK</p>
              <h3 className="mission-title">{feedback.length} reviews</h3>
            </div>
          </div>

          {feedback.slice(0, 3).map((item) => (
            <div key={item.id} className="mission-row">
              <span className="mission-row-label">{item.rating}/5</span>
              <span className="mission-row-value">{item.comments || "No comment"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
