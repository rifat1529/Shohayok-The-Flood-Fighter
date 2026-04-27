// import "../styles/volunteer.css";
// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import socket from "../socket/socket";
// import axios from "../api/axios";

// export default function VolunteerDashboard() {
//   const [mission, setMission] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   // ==========================
//   // 🔥 FETCH MISSION (IMPORTANT)
//   // ==========================
//   useEffect(() => {
//     const fetchMission = async () => {
//       try {
//         const res = await axios.get("/missions/volunteer/me");
//         if (res.data.length > 0) {
//           setMission(res.data[0]);
//           localStorage.setItem("mission", JSON.stringify(res.data[0]));
//         }
//       } catch (err) {
//         console.error("❌ fetch mission error:", err);
//       }
//     };

//     fetchMission();
//   }, []);

//   // ==========================
//   // 🔔 SOCKET (FILTERED)
//   // ==========================
//   useEffect(() => {
//     const handleMission = (data) => {
//       console.log("🚁 Mission received:", data);

//       // 🔥 DISTRICT CHECK (MOST IMPORTANT)
//       if (user?.district !== data.district) return;

//       alert(data.message);

//       const newMission = {
//         id: data.missionId,
//         area: data.district || "Unknown"
//       };

//       setMission(newMission);
//       localStorage.setItem("mission", JSON.stringify(newMission));
//     };

//     socket.on("mission", handleMission);

//     return () => socket.off("mission", handleMission);
//   }, [user]);

//   // ==========================
//   // 🔥 LOAD SAVED (fallback)
//   // ==========================
//   useEffect(() => {
//     const saved = localStorage.getItem("mission");
//     if (saved && !mission) {
//       setMission(JSON.parse(saved));
//     }
//   }, [mission]);

//   // ==========================
//   // 🔥 JOIN
//   // ==========================
//   const handleJoin = async () => {
//     if (!mission?.id) return;

//     setLoading(true);

//     try {
//       await axios.post(`/missions/${mission.id}/join`);
//       alert("✅ Joined mission!");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to join");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="vol-page">
//       <Navbar />

//       <div className="vol-wrap">

//         {/* HEADER */}
//         <div className="vol-header">
//           <div className="vol-header-left">
//             <p className="vol-tagline">// VOLUNTEER CONTROL</p>
//             <h2 className="vol-title">Volunteer Dashboard</h2>
//           </div>

//           <div className="vol-status">
//             <div className="vol-status-dot" />
//             <span>ONLINE</span>
//           </div>
//         </div>

//         {/* EMPTY */}
//         {!mission ? (
//           <div className="vol-empty">
//             <div className="vol-empty-icon">🟢</div>
//             <p>No active mission</p>
//           </div>
//         ) : (
//           <div className="request-card">

//             <div className="request-card-header">
//               <div>
//                 <p className="mission-label">ACTIVE MISSION</p>
//                 <h3 className="mission-title">{mission.area}</h3>
//               </div>

//               <div className="mission-badge">
//                 PRIORITY
//               </div>
//             </div>

//             <div className="mission-info">
//               <div className="mission-row">
//                 <span className="mission-row-label">Mission ID</span>
//                 <span className="mission-row-value">{mission.id}</span>
//               </div>

//               <div className="mission-divider" />

//               <div className="mission-row">
//                 <span className="mission-row-label">Area</span>
//                 <span className="mission-row-value">{mission.area}</span>
//               </div>
//             </div>

//             <button
//               className={`join-btn ${loading ? "loading" : ""}`}
//               onClick={handleJoin}
//             >
//               {loading ? "Joining..." : "✅ Join Mission"}
//             </button>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import "../styles/volunteer.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import socket from "../socket/socket";
import axios from "../api/axios";

export default function VolunteerDashboard() {
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ==========================
  // 🔥 FETCH MISSION
  // ==========================
  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await axios.get("/missions/volunteer/me");
        if (res.data.length > 0) {
          setMission(res.data[0]);
          localStorage.setItem("mission", JSON.stringify(res.data[0]));
        }
      } catch (err) {
        console.error("❌ fetch mission error:", err);
      }
    };

    fetchMission();
  }, []);

  // ==========================
  // 🔔 SOCKET (MISSION)
  // ==========================
  useEffect(() => {
    const handleMission = (data) => {
      console.log("🚁 Mission received:", data);

      if (user?.district !== data.district) return;

      alert(data.message);

      const newMission = {
        id: data.missionId,
        area: data.district || "Unknown"
      };

      setMission(newMission);
      localStorage.setItem("mission", JSON.stringify(newMission));
    };

    socket.on("mission", handleMission);

    return () => socket.off("mission", handleMission);
  }, [user]);

  // ==========================
  // 🔥 CHAT JOIN (CRITICAL FIX)
  // ==========================
  // useEffect(() => {
  //   if (!user?.id) return;

  //   const volunteerId = user.id;

  //   // ⚠️ TEMP user (Chat.jsx এর সাথে same রাখতে হবে)
  //   const userId = "a5a02731-807f-4e5e-a92f-63b5ecfb022c";

  //   const roomId = [userId, volunteerId].sort().join("_");

  //   console.log("🟢 VOLUNTEER JOIN ROOM:", roomId);

  //   socket.emit("joinConversation", roomId);

  //   // 🔥 receive message
  //   socket.on("receiveMessage", (data) => {
  //     console.log("📥 VOLUNTEER RECEIVED:", data);
  //   });

  //   return () => socket.off("receiveMessage");

  // }, [user?.id]);

  // 🔥 CHAT JOIN + RECEIVE
useEffect(() => {
  if (!user?.id) return;

  const volunteerId = user.id;

  // ⚠️ test user (same as Chat.jsx)
  const userId = "a5a02731-807f-4e5e-a92f-63b5ecfb022c";

  const roomId = [userId, volunteerId].sort().join("_");

  console.log("🟢 VOLUNTEER JOIN ROOM:", roomId);

  socket.emit("joinConversation", roomId);

  // 🔥 duplicate fix
  socket.off("receiveMessage");

  socket.on("receiveMessage", (data) => {
    console.log("📥 VOLUNTEER RECEIVED:", data);
  });

  return () => socket.off("receiveMessage");

}, [user?.id]);

  // ==========================
  // 🔥 LOAD SAVED
  // ==========================
  useEffect(() => {
    const saved = localStorage.getItem("mission");
    if (saved && !mission) {
      setMission(JSON.parse(saved));
    }
  }, [mission]);

  // ==========================
  // 🔥 JOIN MISSION
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
                <h3 className="mission-title">{mission.area}</h3>
              </div>

              <div className="mission-badge">
                PRIORITY
              </div>
            </div>

            <div className="mission-info">
              <div className="mission-row">
                <span className="mission-row-label">Mission ID</span>
                <span className="mission-row-value">{mission.id}</span>
              </div>

              <div className="mission-divider" />

              <div className="mission-row">
                <span className="mission-row-label">Area</span>
                <span className="mission-row-value">{mission.area}</span>
              </div>
            </div>

            <button
              className={`join-btn ${loading ? "loading" : ""}`}
              onClick={handleJoin}
            >
              {loading ? "Joining..." : "✅ Join Mission"}
            </button>

          </div>
        )}
      </div>
    </div>
  );
}