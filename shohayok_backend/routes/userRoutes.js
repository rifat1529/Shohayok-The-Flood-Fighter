const express = require("express");
const router = express.Router();

const { makeVolunteerHead } = require("../controllers/userController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const User = require("../models/User");

// ==========================
// 🔥 GET ALL USERS (ADMIN ONLY)
// ==========================
router.get("/users", authenticate, authorize("admin"), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "district", "points"],
      order: [["createdAt", "DESC"]]
    });

    res.json(users);

  } catch (err) {
    console.error("❌ USER FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ==========================
// 🔥 MAKE VOLUNTEER HEAD
// ==========================
router.patch(
  "/users/:id/make-head",
  authenticate,
  authorize("admin"),
  makeVolunteerHead
);

module.exports = router;