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

const { Message } = require("../models");
const Conversation = require("../models/Conversation");
const Location = require("../models/Location");
const Mission = require("../models/Mission");
const User = require("../models/User");
const { awardPoints, MISSION_COMPLETED_POINTS } = require("../services/rewardService");

const activeMissions = {};
const userLocations = {};

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    // 🔹 JOIN ROOM
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
    });

    // 🔹 SEND MESSAGE
    socket.on("sendMessage", async ({ conversationId, senderId, message }) => {
      try {
        const conversation = await Conversation.findByPk(conversationId);
        if (!conversation || conversation.isClosed) return;

        const saved = await Message.create({
          message,
          senderId,
          ConversationId: conversationId
        });

        io.to(conversationId).emit("receiveMessage", saved);

      } catch (err) {
        console.error("❌ MESSAGE ERROR:", err);
      }
    });

    // 🔹 ON DUTY
    socket.on("on-duty", async ({ missionId }) => {
  if (!missionId) return;

  activeMissions[missionId] = true;

  const mission = await Mission.findByPk(missionId);

  const volunteers = await User.findAll({
    where: {
      role: "volunteer",
      district: mission.district
    }
  });

  volunteers.forEach(v => {
    io.to(v.id).emit("mission-invite", {
      missionId,
      message: "🚨 Join mission?"
    });
  });

  console.log("🚨 ON DUTY:", missionId);
});


    // 🔹 SEND LOCATION
    socket.on("send-location", (data) => {
      const { userId, lat, lng, missionId, role } = data;

      if (!missionId || !activeMissions[missionId]) return;

      userLocations[userId] = { lat, lng };

      io.emit("receive-location", {
        userId,
        lat,
        lng,
        role,
        missionId
      });
    });

socket.on("mission-response", async ({ missionId, userId, status }) => {
  try {
    const mission = await Mission.findByPk(missionId);

    if (!mission) return;

    let volunteers = mission.volunteers || [];

    // JSON safe
    if (!Array.isArray(volunteers)) {
      volunteers = JSON.parse(volunteers || "[]");
    }

    if (status === "joined") {
      if (!volunteers.includes(userId)) {
        volunteers.push(userId);
      }
    }

    await mission.update({ volunteers });

    // 🔥 send update to all
    io.emit("mission-update", {
      missionId,
      volunteers
    });

    console.log("✅ Mission updated:", volunteers);

  } catch (err) {
    console.error("❌ mission-response error:", err);
  }
});
    // 🔹 MISSION COMPLETE
    socket.on("mission-complete", async ({ missionId }) => {
      delete activeMissions[missionId];

      const mission = await Mission.findByPk(missionId);
      if (mission && mission.status !== "completed") {
        await mission.update({ status: "completed", endedAt: new Date() });
        await Location.update({ isActive: false }, { where: { missionId, isActive: true } });
        await Conversation.update({ isClosed: true }, { where: { missionId } });

        const rewardIds = [...new Set([mission.volunteerHeadId, ...(mission.volunteers || [])].filter(Boolean))];
        for (const volunteerId of rewardIds) {
          const volunteer = await User.findByPk(volunteerId);
          if (volunteer && ["volunteer", "volunteer_head"].includes(volunteer.role)) {
            await awardPoints({
              io,
              volunteerId,
              missionId,
              points: MISSION_COMPLETED_POINTS,
              reason: "mission_completed",
              note: "Mission completed"
            });
          }
        }
      }

      io.emit("stop-tracking", { missionId });

      Object.keys(userLocations).forEach((id) => {
        delete userLocations[id];
      });

      console.log("✅ Mission completed:", missionId);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });
};

module.exports = chatSocket;
