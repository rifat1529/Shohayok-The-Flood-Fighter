const express = require("express");
const router = express.Router();

const { makeVolunteerHead } = require("../controllers/userController");
const auth = require("../middleware/authenticate"); // ⚠️ file name ঠিক রাখো
const User = require("../models/User");

// 🔥 GET ALL USERS (ADMIN)
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "district", "points"]
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// 🔥 MAKE VOLUNTEER HEAD
router.patch("/users/:id/make-head", auth, makeVolunteerHead);

module.exports = router;