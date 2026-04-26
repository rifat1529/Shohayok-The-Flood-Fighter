const express = require("express");
const router = express.Router();
const Mission = require("../models/Mission");

// ==========================
// 🔹 GET ALL MISSIONS (ADMIN)
// ==========================

router.get("/volunteer/me", async (req, res) => {
  try {
    const userId = req.query.userId;

    const mission = await Mission.findOne({
      where: { status: "active" },
      order: [["createdAt", "DESC"]]
    });

    if (!mission) return res.json(null);

    let volunteers = mission.volunteers || [];

    if (!Array.isArray(volunteers)) {
      volunteers = JSON.parse(volunteers || "[]");
    }

    res.json({
      ...mission.toJSON(),
      volunteers
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch mission" });
  }
});

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