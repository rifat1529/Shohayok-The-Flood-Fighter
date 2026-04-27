// const { Message } = require("../models");

// const activeMissions = {};
// const userLocations = {};

// const chatSocket = (io) => {
//   io.on("connection", (socket) => {
//     console.log("🟢 Connected:", socket.id);

//     // 🔹 JOIN ROOM
//     socket.on("joinConversation", (conversationId) => {
//       socket.join(conversationId);
//     });

//     // 🔹 SEND MESSAGE
//     socket.on("sendMessage", async ({ conversationId, senderId, message }) => {
//       try {
//         const saved = await Message.create({
//           message,
//           senderId,
//           ConversationId: conversationId
//         });

//         io.to(conversationId).emit("receiveMessage", saved);

//       } catch (err) {
//         console.error("❌ MESSAGE ERROR:", err);
//       }
//     });

//     // 🔹 ON DUTY
//     socket.on("on-duty", ({ missionId }) => {
//       if (!missionId) return;

//       activeMissions[missionId] = true;
//       console.log("🚨 ON DUTY:", missionId);
//     });

//     // 🔹 SEND LOCATION
//     socket.on("send-location", (data) => {
//       const { userId, lat, lng, missionId, role } = data;

//       if (!missionId || !activeMissions[missionId]) return;

//       userLocations[userId] = { lat, lng };

//       io.emit("receive-location", {
//         userId,
//         lat,
//         lng,
//         role,
//         missionId
//       });
//     });

//     // 🔹 MISSION COMPLETE
//     socket.on("mission-complete", ({ missionId }) => {
//       delete activeMissions[missionId];

//       io.emit("stop-tracking", { missionId });

//       Object.keys(userLocations).forEach((id) => {
//         delete userLocations[id];
//       });

//       console.log("✅ Mission completed:", missionId);
//     });

//     socket.on("disconnect", () => {
//       console.log("🔴 Disconnected:", socket.id);
//     });
//   });
// };

// module.exports = chatSocket;

// const { Message } = require("../models");
// const Conversation = require("../models/Conversation");
// const Location = require("../models/Location");
// const Mission = require("../models/Mission");
// const User = require("../models/User");
// const { awardPoints, MISSION_COMPLETED_POINTS } = require("../services/rewardService");

// const activeMissions = {};
// const userLocations = {};

// const chatSocket = (io) => {
//   io.on("connection", (socket) => {
//     console.log("🟢 Connected:", socket.id);

//     // 🔹 JOIN ROOM
//     socket.on("joinConversation", (conversationId) => {
//       socket.join(conversationId);
//     });

//     // 🔹 SEND MESSAGE
//     socket.on("sendMessage", async ({ conversationId, senderId, message }) => {
//       try {
//         const conversation = await Conversation.findByPk(conversationId);
//         if (!conversation || conversation.isClosed) return;

//         const saved = await Message.create({
//           message,
//           senderId,
//           ConversationId: conversationId
//         });

//         io.to(conversationId).emit("receiveMessage", saved);

//       } catch (err) {
//         console.error("❌ MESSAGE ERROR:", err);
//       }
//     });

//     // 🔹 ON DUTY
//     socket.on("on-duty", async ({ missionId }) => {
//   if (!missionId) return;

//   activeMissions[missionId] = true;

//   const mission = await Mission.findByPk(missionId);

//   const volunteers = await User.findAll({
//     where: {
//       role: "volunteer",
//       district: mission.district
//     }
//   });

//   volunteers.forEach(v => {
//     io.to(v.id).emit("mission-invite", {
//       missionId,
//       message: "🚨 Join mission?"
//     });
//   });

//   console.log("🚨 ON DUTY:", missionId);
// });


//     // 🔹 SEND LOCATION
//     socket.on("send-location", (data) => {
//       const { userId, lat, lng, missionId, role } = data;

//       if (!missionId || !activeMissions[missionId]) return;

//       userLocations[userId] = { lat, lng };

//       io.emit("receive-location", {
//         userId,
//         lat,
//         lng,
//         role,
//         missionId
//       });
//     });

// socket.on("mission-response", async ({ missionId, userId, status }) => {
//   try {
//     const mission = await Mission.findByPk(missionId);

//     if (!mission) return;

//     let volunteers = mission.volunteers || [];

//     // JSON safe
//     if (!Array.isArray(volunteers)) {
//       volunteers = JSON.parse(volunteers || "[]");
//     }

//     if (status === "joined") {
//       if (!volunteers.includes(userId)) {
//         volunteers.push(userId);
//       }
//     }

//     await mission.update({ volunteers });

//     // 🔥 send update to all
//     io.emit("mission-update", {
//       missionId,
//       volunteers
//     });

//     console.log("✅ Mission updated:", volunteers);

//   } catch (err) {
//     console.error("❌ mission-response error:", err);
//   }
// });
//     // 🔹 MISSION COMPLETE
//     socket.on("mission-complete", async ({ missionId }) => {
//       delete activeMissions[missionId];

//       const mission = await Mission.findByPk(missionId);
//       if (mission && mission.status !== "completed") {
//         await mission.update({ status: "completed", endedAt: new Date() });
//         await Location.update({ isActive: false }, { where: { missionId, isActive: true } });
//         await Conversation.update({ isClosed: true }, { where: { missionId } });

//         const rewardIds = [...new Set([mission.volunteerHeadId, ...(mission.volunteers || [])].filter(Boolean))];
//         for (const volunteerId of rewardIds) {
//           const volunteer = await User.findByPk(volunteerId);
//           if (volunteer && ["volunteer", "volunteer_head"].includes(volunteer.role)) {
//             await awardPoints({
//               io,
//               volunteerId,
//               missionId,
//               points: MISSION_COMPLETED_POINTS,
//               reason: "mission_completed",
//               note: "Mission completed"
//             });
//           }
//         }
//       }

//       io.emit("stop-tracking", { missionId });

//       Object.keys(userLocations).forEach((id) => {
//         delete userLocations[id];
//       });

//       console.log("✅ Mission completed:", missionId);
//     });

//     socket.on("disconnect", () => {
//       console.log("🔴 Disconnected:", socket.id);
//     });
//   });
// };

// module.exports = chatSocket;


const Mission = require("../models/Mission");

// ─── Safe JSON parse for volunteers array ──────────────────────────────────
function parseVolunteers(raw) {
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw || "[]"); } catch { return []; }
}

// ─── Haversine distance (km) ───────────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
}

// ─── In-memory location store: { userId: { lat, lng, role, missionId } } ──
const locationStore = {};

module.exports = function chatSocket(io) {

  io.on("connection", (socket) => {

    // ── Join personal room ───────────────────────────────────────────────
    socket.on("join", (userId) => {
      if (!userId) return;
      socket.join(String(userId));
      console.log(`✅ [chatSocket] User ${userId} joined room`);
    });

    // ── send-location → receive-location ────────────────────────────────
    socket.on("send-location", async ({ userId, lat, lng, role, missionId }) => {
      if (!userId || lat == null || lng == null) return;

      try {
        // Optional: validate mission is active
        if (missionId) {
          const mission = await Mission.findByPk(missionId);
          if (!mission || mission.status === "completed") {
            socket.emit("tracking-error", { message: "Mission not active" });
            return;
          }

          // Check user is a participant (volunteer or head)
          if (role === "volunteer") {
            const volunteers = parseVolunteers(mission.volunteers);
            if (!volunteers.includes(String(userId))) {
              socket.emit("tracking-error", { message: "Not a mission volunteer" });
              return;
            }
          }
        }

        // Save to store
        locationStore[userId] = { lat, lng, role, missionId };

        // Find volunteer_head location for distance
        let headLocation = null;
        for (const [uid, info] of Object.entries(locationStore)) {
          if (info.role === "volunteer_head" && info.missionId === missionId) {
            headLocation = { lat: info.lat, lng: info.lng, userId: uid };
            break;
          }
        }

        const distance = headLocation
          ? haversine(headLocation.lat, headLocation.lng, lat, lng)
          : null;

        // Broadcast to everyone in the mission room
        // (or globally if no missionId — useful for testing)
        const payload = { userId, lat, lng, role, missionId, distance };

        if (missionId) {
          // Emit to all sockets in the mission's socket room
          io.to(`mission:${missionId}`).emit("receive-location", payload);
        } else {
          io.emit("receive-location", payload);
        }

      } catch (err) {
        console.error("❌ [send-location] error:", err.message);
      }
    });

    // ── Join mission room (for map viewers) ───────────────────────────────
    socket.on("join-mission-map", (missionId) => {
      if (!missionId) return;
      socket.join(`mission:${missionId}`);
      console.log(`🗺️  Socket ${socket.id} joined mission map: ${missionId}`);

      // Send all current locations to the new viewer
      for (const [userId, info] of Object.entries(locationStore)) {
        if (info.missionId === missionId) {
          socket.emit("receive-location", { userId, ...info });
        }
      }
    });

    // ── Volunteer stops sharing ────────────────────────────────────────────
    socket.on("stop-sharing-location", ({ userId, missionId }) => {
      if (!userId) return;
      delete locationStore[userId];
      console.log(`🛑 ${userId} stopped sharing location`);

      if (missionId) {
        io.to(`mission:${missionId}`).emit("user-left-map", { userId });
      }
    });

    // ── Chat message ───────────────────────────────────────────────────────
    socket.on("send-message", ({ room, message, senderId, senderName }) => {
      if (!room || !message) return;
      io.to(room).emit("receive-message", {
        message,
        senderId,
        senderName,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("join-chat", (room) => {
      if (room) socket.join(room);
    });

    // ── Disconnect: clean up location ─────────────────────────────────────
    socket.on("disconnect", () => {
      // We can't easily map socket.id → userId here without a separate map,
      // so location cleanup happens via "stop-sharing-location" event or timeout.
      console.log(`🔴 [chatSocket] disconnected: ${socket.id}`);
    });
  });
};