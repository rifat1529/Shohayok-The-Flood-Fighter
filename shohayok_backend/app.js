const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// --- Security / Core Middleware ---
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// --- Health Check ---
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// --- Routes ---
app.use("/auth", require("./routes/authRoutes"));

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;