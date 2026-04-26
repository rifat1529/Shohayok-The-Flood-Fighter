const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const sequelize = require("../config/database");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const User = require("../models/User");
const RewardLedger = require("../models/RewardLedger");
const { manualReward } = require("../services/rewardService");
const { createNotification } = require("../services/notificationService");

router.get("/leaderboard", authenticate, async (req, res) => {
  try {
    const where = { role: { [Op.in]: ["volunteer", "volunteer_head"] } };
    if (req.query.district) where.district = String(req.query.district).toLowerCase().trim();

    const volunteers = await User.findAll({
      where,
      attributes: ["id", "name", "email", "role", "district", "points"],
      order: [["points", "DESC"], ["createdAt", "ASC"]],
      limit: Math.min(Number(req.query.limit || 20), 100)
    });

    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

router.get("/ledger", authenticate, async (req, res) => {
  try {
    const where = {};
    if (req.user.role !== "admin") where.volunteerId = req.user.id;
    if (req.query.volunteerId && req.user.role === "admin") where.volunteerId = req.query.volunteerId;

    const rewards = await RewardLedger.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: Math.min(Number(req.query.limit || 20), 100)
    });

    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rewards" });
  }
});

router.post("/manual", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { volunteerId, points, note } = req.body;
    const reward = await manualReward({
      io: req.app.get("io"),
      volunteerId,
      points,
      awardedBy: req.user.id,
      note
    });

    res.status(201).json({ message: "Reward added", reward });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || "Failed to add reward" });
  }
});

router.post("/promote/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const promoted = await sequelize.transaction(async (transaction) => {
      const user = await User.findByPk(req.params.id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!user || user.role !== "volunteer") {
        const error = new Error("Only volunteers can be promoted");
        error.statusCode = 400;
        throw error;
      }

      const oldHead = await User.findOne({
        where: { role: "volunteer_head", district: user.district },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (oldHead) await oldHead.update({ role: "volunteer" }, { transaction });
      await user.update({ role: "volunteer_head", headId: null }, { transaction });
      await User.update({ headId: user.id }, { where: { district: user.district, role: "volunteer" }, transaction });

      await createNotification(
        {
          io: req.app.get("io"),
          receiverId: user.id,
          type: "role_promoted",
          messageText: "You have been promoted to Volunteer Head.",
          data: { district: user.district }
        },
        { transaction }
      );

      return user;
    });

    res.json({ message: "Volunteer promoted", user: promoted });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || "Failed to promote volunteer" });
  }
});

module.exports = router;
