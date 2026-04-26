// import "../styles/volhead.css";
// import { useState, useEffect, use } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import socket from "../socket/socket";

// const TEAMS = [
//   { id: 1, name: "Rescue Team", emoji: "🚁", status: "Active", members: 6, color: "#ef4444", glow: "rgba(239,68,68,0.3)", progress: 80 },
//   { id: 2, name: "Food Team", emoji: "🍱", status: "Ready", members: 4, color: "#f59e0b", glow: "rgba(245,158,11,0.3)", progress: 50 },
//   { id: 3, name: "Medicine Team", emoji: "💊", status: "Active", members: 5, color: "#3b82f6", glow: "rgba(59,130,246,0.3)", progress: 70 },
// ];

// export default function VolunteerHeadDashboard() {
//   const [onDuty, setOnDuty] = useState(false);
//   const [mission, setMission] = useState(null);
//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   // ==========================
//   // 🔥 FETCH MISSION (FIXED)
//   // ==========================

//  useEffect(() => {
//   const handleMission = (data) => {
//     console.log("🚁 Received:", data);

//     // 🔥 ONLY SAME DISTRICT
//     if (user?.district?.toLowerCase().trim() !== data.district?.toLowerCase().trim ()) return;

//     alert(data.message);

//   if (user?.id) {
//       fetch(`http://localhost:5000/missions/head/${user.id}`)
//         .then(res => res.json())
//         .then(data => {
//           if (data.length > 0) {
//             setMission(data[0]);
//           }
//         });
//     }
//   };


//   socket.on("mission", handleMission);

//   return () => socket.off("mission", handleMission);

// }, [user?.id, user?.district]);
//   useEffect(() => {

//     const handleMission = (data) => {
//       alert(data.message);

//       // 🔥 reload না করে refetch
//       if (user?.id) {
//         fetch(`http://localhost:5000/missions/head/${user.id}`)
//           .then(res => res.json())
//           .then(data => {
//             if (data.length > 0) {
//               setMission(data[0]);
//             }
//           });
//       }
//     };

//     socket.on("mission", handleMission);

//     return () => {
//       socket.off("mission", handleMission); // ✅ FIX
//     };

//   }, [user?.id]);

//   // ==========================
//   // 🔥 ON DUTY
//   // ==========================
//   const handleDutyToggle = () => {
//     const newState = !onDuty;
//     setOnDuty(newState);

//     if (newState && mission) {
//       socket.emit("on-duty", {
//         missionId: mission.id,
//         headId: user.id
//       });
      
//       socket.emit("notify-volunteers", {
//         missionId: mission.id,
//         district: mission.district
//       });
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <div className="vhd-root">
//       <Navbar />
//       <div className="vhd-container">

//         {/* HEADER */}
//         <div className="vhd-top">
//           <div>
//             <p className="vhd-eyebrow">// FIELD COMMAND</p>
//             <h2 className="vhd-title">Volunteer Head Dashboard</h2>
//           </div>

//           <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//             <div
//               className={`duty-toggle ${onDuty ? "on" : ""}`}
//               onClick={handleDutyToggle}
//             >
//                 <div className="duty-dot" />
//                       <span className="duty-text">ON DUTY</span>
//                       <span className={`duty-pill ${onDuty ? "on-pill" : "off"}`}>
//                                {onDuty ? "ACTIVE" : "OFF"}
//                       </span>
//                 </div>

//             <button className="logout-btn" onClick={handleLogout}>
//               🚪 Logout
//             </button>
//           </div>
//         </div>

//         {/* 🔥 MISSION */}
//         {mission && (
//           <div className="mission-alert">
//             <div className="mission-alert-icon">🚨</div>
//             <div>
//               <p className="mission-alert-label">MISSION ASSIGNED</p>
//               <p className="mission-alert-title">
//                 {mission.district}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* ACTIONS */}
//         {mission && (
//           <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            
//             <button
//               className="logout-btn"
//               onClick={() => navigate("/submit-report")}
//             >
//               📋 Submit Report
//             </button>

//             <button
//               className="logout-btn"
//               style={{ background: "#ef4444" }}
//               onClick={() => {
//                 setOnDuty(false);

//                 socket.emit("mission-complete", {
//                   missionId: mission.id,
//                   headId: user.id
//                 });

//                 setMission(null);
//                 navigate("/submit-report");
//               }}
//             >
//               ✅ Complete Mission
//             </button>

//           </div>
//         )}

//         {/* MAP */}
//         <div className="map-zone">
//           <span className="map-badge">LIVE TEAM TRACKING</span>

//           {onDuty ? (
//             <>
//               <div className="map-overlay-label tracking-active">
//                 GPS TRACKING ACTIVE
//               </div>

//               <button
//                 className="logout-btn"
//                 style={{ marginTop: "15px" }}
//                 onClick={() => navigate("/map")}
//               >
//                 🗺️ Open Live Map
//               </button>
//             </>
//           ) : (
//             <div className="map-overlay-label tracking-inactive">
//               TURN ON DUTY TO ENABLE TRACKING
//             </div>
//           )}
//         </div>

//         {/* TEAMS */}
//         <div className="vhd-grid">
//           {TEAMS.map((t) => (
//             <div key={t.id} className="team-card">
//               <div className="tc-top">
//                 <div className="tc-emoji">{t.emoji}</div>
//                 <div>
//                   <div className="tc-name">{t.name}</div>
//                   <div className="tc-members">👥 {t.members}</div>
//                 </div>
//                 <span className={`tc-status ${t.status.toLowerCase()}`}>
//                   {t.status}
//                 </span>
//               </div>

//               <div className="tc-bar-bg">
//                 <div
//                   className="tc-bar-fill"
//                   style={{
//                     width: `${t.progress}%`,
//                     background: t.color
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }

import "../styles/volhead.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import socket from "../socket/socket";
import axios from "../api/axios";

const TEAMS = [
  { id: 1, name: "Rescue Team", emoji: "🚁", status: "Active", members: 6, color: "#ef4444", glow: "rgba(239,68,68,0.3)", progress: 80 },
  { id: 2, name: "Food Team", emoji: "🍱", status: "Ready", members: 4, color: "#f59e0b", glow: "rgba(245,158,11,0.3)", progress: 50 },
  { id: 3, name: "Medicine Team", emoji: "💊", status: "Active", members: 5, color: "#3b82f6", glow: "rgba(59,130,246,0.3)", progress: 70 },
];

export default function VolunteerHeadDashboard() {
  const [onDuty, setOnDuty] = useState(false);
  const [mission, setMission] = useState(null);
  const [instructions, setInstructions] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ==========================
  // 🔥 FETCH MISSION (FIXED)
  // ==========================

 useEffect(() => {
  const handleMission = (data) => {
    console.log("🚁 Received:", data);

    alert(data.message);

    if (user?.id) {
      fetch(`http://localhost:5000/missions/head/${user.id}`)
        .then(res => res.json())
        .then(data => {
          console.log("MY MISSIONS:", data);

          if (data.length > 0) {
            setMission(data[0]);
            localStorage.setItem("activeMission", JSON.stringify(data[0]));
          }
        })
        .catch(err => console.error(err));
    }
  };

  socket.on("mission", handleMission);

  return () => {
    socket.off("mission", handleMission);
  };
}, [user?.id]);

useEffect(() => {
  if (user?.id) {
    fetch(`http://localhost:5000/missions/head/${user.id}`)
      .then(res => res.json())
      .then(data => {
        console.log("INITIAL MISSIONS:", data);

        if (data.length > 0) {
          setMission(data[0]);
        }
      });
  }
}, [user?.id]);


  useEffect(() => {
    axios.get("/instructions/my")
      .then((res) => setInstructions(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});

    const handleInstruction = (instruction) => {
      setInstructions((prev) => [instruction, ...prev.filter((i) => i.id !== instruction.id)]);
    };

    socket.on("admin-instruction", handleInstruction);
    socket.on("instruction:new", handleInstruction);

    return () => {
      socket.off("admin-instruction", handleInstruction);
      socket.off("instruction:new", handleInstruction);
    };
  }, []);

  const markInstructionRead = async (id, read) => {
    await axios.patch(`/instructions/${id}/read`, { read });
    setInstructions((prev) =>
      prev.map((item) => item.id === id ? { ...item, readAt: read ? new Date().toISOString() : null } : item)
    );
  };

  // ==========================
  // 🔥 ON DUTY
  // ==========================
  const handleDutyToggle = () => {
    const newState = !onDuty;
    setOnDuty(newState);

    if (newState && mission) {
      socket.emit("on-duty", {
        missionId: mission.id,
        headId: user.id
      });
      
      socket.emit("notify-volunteers", {
        missionId: mission.id,
        district: mission.district
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="vhd-root">
      <Navbar />
      <div className="vhd-container">

        {/* HEADER */}
        <div className="vhd-top">
          <div>
            <p className="vhd-eyebrow">// FIELD COMMAND</p>
            <h2 className="vhd-title">Volunteer Head Dashboard</h2>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div
              className={`duty-toggle ${onDuty ? "on" : ""}`}
              onClick={handleDutyToggle}
            >
                <div className="duty-dot" />
                      <span className="duty-text">ON DUTY</span>
                      <span className={`duty-pill ${onDuty ? "on-pill" : "off"}`}>
                               {onDuty ? "ACTIVE" : "OFF"}
                      </span>
                </div>

            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* 🔥 MISSION */}
        {mission && (
          <div className="mission-alert">
            <div className="mission-alert-icon">🚨</div>
            <div>
              <p className="mission-alert-label">MISSION ASSIGNED</p>
              <p className="mission-alert-title">
                {mission.district}
              </p>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        {mission && (
          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            
            <button
              className="logout-btn"
              onClick={() => navigate("/submit-report")}
            >
              📋 Submit Report
            </button>

            <button
              className="logout-btn"
              style={{ background: "#ef4444" }}
              onClick={() => {
                setOnDuty(false);

                socket.emit("mission-complete", {
                  missionId: mission.id,
                  headId: user.id
                });

                localStorage.setItem("activeMission", JSON.stringify(mission));
                setMission(null);
                navigate("/submit-report");
              }}
            >
              ✅ Complete Mission
            </button>

          </div>
        )}

        {/* MAP */}
        <div className="map-zone">
          <span className="map-badge">LIVE TEAM TRACKING</span>

          {onDuty ? (
            <>
              <div className="map-overlay-label tracking-active">
                GPS TRACKING ACTIVE
              </div>

              <button
                className="logout-btn"
                style={{ marginTop: "15px" }}
                onClick={() => navigate("/map")}
              >
                🗺️ Open Live Map
              </button>
            </>
          ) : (
            <div className="map-overlay-label tracking-inactive">
              TURN ON DUTY TO ENABLE TRACKING
            </div>
          )}
        </div>

        <div className="vhd-grid" style={{ marginBottom: "20px" }}>
          <div className="team-card" style={{ gridColumn: "1 / -1" }}>
            <div className="tc-top">
              <div className="tc-emoji">📢</div>
              <div>
                <div className="tc-name">Admin Instructions</div>
                <div className="tc-members">{instructions.filter((i) => !i.readAt).length} unread</div>
              </div>
            </div>

            {instructions.slice(0, 5).map((instruction) => (
              <div key={instruction.id} style={{ marginTop: "12px", color: "#cbd5e1" }}>
                <strong>{instruction.instructionType === "urgent" ? "URGENT: " : ""}{instruction.title}</strong>
                <div>{instruction.content}</div>
                <button
                  className="logout-btn"
                  style={{ marginTop: "8px", padding: "6px 10px" }}
                  onClick={() => markInstructionRead(instruction.id, !instruction.readAt)}
                >
                  {instruction.readAt ? "Mark Unread" : "Mark Read"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* TEAMS */}
        <div className="vhd-grid">
          {TEAMS.map((t) => (
            <div key={t.id} className="team-card">
              <div className="tc-top">
                <div className="tc-emoji">{t.emoji}</div>
                <div>
                  <div className="tc-name">{t.name}</div>
                  <div className="tc-members">👥 {t.members}</div>
                </div>
                <span className={`tc-status ${t.status.toLowerCase()}`}>
                  {t.status}
                </span>
              </div>

              <div className="tc-bar-bg">
                <div
                  className="tc-bar-fill"
                  style={{
                    width: `${t.progress}%`,
                    background: t.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
