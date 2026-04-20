const express = require("express");
const router = express.Router();

const {
  startMission,
  endMission,
  purgeMissionLocations
} = require("../controllers/missionController");

router.post("/start", startMission);
router.patch("/end/:id", endMission);
router.delete("/purge/:id", purgeMissionLocations);

module.exports = router;