const express = require("express");
const router = express.Router();
const Mission = require("../models/Mission");

// ==========================
// 🔹 GET ALL MISSIONS (ADMIN)
// ==========================
router.get("/", async (req, res) => {
  try {
    const missions = await Mission.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json(missions);

  } catch (err) {
    console.error("🔥 GET ALL MISSIONS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// 🔹 GET VOLUNTEER HEAD MISSIONS (FIXED)
// ==========================
router.get("/head/:volunteerId", async (req, res) => {
  try {
    const missions = await Mission.findAll({
      where: {
        volunteerHeadId: req.params.volunteerId,
        status: "active"
      },
      order: [["createdAt", "DESC"]]
    });

    res.json(missions);

  } catch (err) {
    console.error("🔥 HEAD MISSION ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;