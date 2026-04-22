const express = require("express");
const router = express.Router();
const Mission = require("../models/Mission");

// ✅ GET ALL MISSIONS
router.get("/", async (req, res) => {
  try {
    const missions = await Mission.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json(missions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch missions" });
  }
});

module.exports = router;