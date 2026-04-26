// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const db = require("./config/database");

// dotenv.config();

// const app = express();

// // --- Middleware ---
// app.use(cors({
//   origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
//   credentials: true
// }));

// app.use(express.json({ limit: "1mb" }));
// app.use(express.urlencoded({ extended: true }));

// // --- ROUTES (ALL HERE) ---
// app.use("/auth", require("./routes/authRoutes"));
// app.use("/requests", require("./routes/requestRoutes"));
// app.use("/locations", require("./routes/locationRoutes"));
// app.use("/missions", require("./routes/missionRoutes"));
// app.use("/reports", require("./routes/reportRoutes"));
// app.use("/chat", require("./routes/chatRoutes"));
// app.use("/instructions", require("./routes/instructionRoutes"));

// // 🔥 ADD THIS (FIX)
// app.use("/api", require("./routes/userRoutes"));

// // --- DB check ---
// app.get("/db-check", async (req, res) => {
//   try {
//     await db.authenticate();
//     res.json({ message: "Database connection successful" });
//   } catch (err) {
//     console.error("Database connection failed:", err);
//     res.status(500).json({ message: "Database connection failed" });
//   }
// });

// // --- Health ---
// app.get("/health", (req, res) => {
//   res.json({ status: "ok" });
// });

// // --- 404 ---
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // --- Error ---
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ message: "Server error" });
// });

// module.exports = app;

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/database");

dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// --- ROUTES (ALL HERE) ---
app.use("/auth", require("./routes/authRoutes"));
app.use("/requests", require("./routes/requestRoutes"));
app.use("/locations", require("./routes/locationRoutes"));
app.use("/missions", require("./routes/missionRoutes"));
app.use("/reports", require("./routes/reportRoutes"));
app.use("/chat", require("./routes/chatRoutes"));
app.use("/instructions", require("./routes/instructionRoutes"));
app.use("/feedback", require("./routes/feedbackRoutes"));
app.use("/rewards", require("./routes/rewardRoutes"));
app.use("/notifications", require("./routes/notificationRoutes"));

// 🔥 ADD THIS (FIX)
app.use("/api", require("./routes/userRoutes"));

// --- DB check ---
app.get("/db-check", async (req, res) => {
  try {
    await db.authenticate();
    res.json({ message: "Database connection successful" });
  } catch (err) {
    console.error("Database connection failed:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// --- Health ---
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- Error ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

module.exports = app;
