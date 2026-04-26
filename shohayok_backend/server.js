const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database");

const http = require("http");
const { Server } = require("socket.io");

const chatSocket = require("./sockets/chatSocket");
const Mission = require("./models/Mission");
const User = require("./models/User"); // 🔥 MISSING ছিল
const authRoutes = require("./routes/authRoutes");
const missionRoutes = require("./routes/missionRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const instructionRoutes = require("./routes/instructionRoutes");
const requestRoutes = require("./routes/requestRoutes");
require("./models");

dotenv.config();

const PORT = process.env.PORT || 5000;

// ❌ REMOVE duplicate app import
// const app = require("./app");

const app = express();

const cors = require("cors");
app.use(cors({
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/missions", missionRoutes);
app.use("/rewards", rewardRoutes);
app.use("/", userRoutes);
app.use("/reports", reportRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/instructions", instructionRoutes);
app.use("/requests", requestRoutes);

// ==========================
// 🔥 SERVER + SOCKET
// ==========================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// 🔥 GLOBAL SOCKET ACCESS
app.set("io", io);

// ==========================
// 🔥 SOCKET EVENTS
// ==========================
io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  // 🔥 JOIN USER ROOM
  socket.on("join", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log("✅ User joined:", userId);
    }
  });

  // =========================
  // 🔥 HEAD ON DUTY
  // =========================
  socket.on("on-duty", async ({ missionId, headId }) => {
    try {
      const mission = await Mission.findByPk(missionId);
      if (!mission) return;

      const volunteers = await User.findAll({
        where: {
          role: "volunteer",
          district: mission.district,
        },
      });

      volunteers.forEach((v) => {
        io.to(v.id).emit("mission-invite", {
          missionId,
          message: "🚨 Join mission?",
        });
      });

      console.log("🚨 Invite sent to volunteers");

    } catch (err) {
      console.error("❌ on-duty error:", err);
    }
  });

  // =========================
  // 🔥 VOLUNTEER RESPONSE
  // =========================
  socket.on("mission-response", async ({ missionId, userId, status }) => {
    try {
      const mission = await Mission.findByPk(missionId);
      if (!mission) return;

      let volunteers = mission.volunteers || [];

      // 🔥 FIX JSON issue
      if (!Array.isArray(volunteers)) {
        volunteers = JSON.parse(volunteers || "[]");
      }

      if (status === "joined") {
        if (!volunteers.includes(userId)) {
          volunteers.push(userId);
        }
      }

      await mission.update({ volunteers });

      // 🔔 notify head
      io.to(mission.volunteerHeadId).emit("volunteer-update", {
        missionId,
        volunteers,
      });

      console.log("✅ Volunteer response saved:", volunteers);

    } catch (err) {
      console.error("❌ mission-response error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

// 🔥 CHAT SOCKET (separate)
chatSocket(io);

// ==========================
// 🔥 START SERVER
// ==========================
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("✅ Models synced");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
})();