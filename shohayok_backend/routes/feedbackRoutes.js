const express = require("express");
const router = express.Router();
const sequelize = require("../config/database");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const Feedback = require("../models/Feedback");
const Mission = require("../models/Mission");
const User = require("../models/User");
const { awardPositiveFeedback } = require("../services/rewardService");
const { createNotification } = require("../services/notificationService");

router.post("/", authenticate, authorize("user"), async (req, res) => {
  try {
    const { missionId, volunteerId, rating, comments } = req.body;
    const value = Number(rating);

    if (!missionId || !volunteerId || !Number.isInteger(value) || value < 1 || value > 5) {
      return res.status(400).json({ message: "missionId, volunteerId, and rating 1-5 are required" });
    }

    const feedback = await sequelize.transaction(async (transaction) => {
      const mission = await Mission.findByPk(missionId, { transaction });
      if (!mission || mission.status !== "completed") {
        const error = new Error("Feedback is available only after mission completion");
        error.statusCode = 400;
        throw error;
      }

      const volunteer = await User.findByPk(volunteerId, { transaction });
      if (!volunteer || !["volunteer", "volunteer_head"].includes(volunteer.role)) {
        const error = new Error("Feedback target must be a volunteer or volunteer head");
        error.statusCode = 400;
        throw error;
      }

      const [row, created] = await Feedback.findOrCreate({
        where: { missionId, volunteerId, userId: req.user.id },
        defaults: { rating: value, comments },
        transaction
      });

      if (!created) {
        await row.update({ rating: value, comments }, { transaction });
      }

      await createNotification(
        {
          io: req.app.get("io"),
          receiverId: volunteerId,
          type: "feedback_received",
          messageText: `You received ${value}-star mission feedback.`,
          data: { missionId, feedbackId: row.id, rating: value }
        },
        { transaction }
      );

      await awardPositiveFeedback({ io: req.app.get("io"), feedback: row }, { transaction });
      return row;
    });

    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || "Failed to submit feedback" });
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
    const where = {};

    if (req.query.missionId) where.missionId = req.query.missionId;
    if (req.query.volunteerId) where.volunteerId = req.query.volunteerId;
    if (req.user.role === "user") where.userId = req.user.id;
    if (["volunteer", "volunteer_head"].includes(req.user.role)) where.volunteerId = req.user.id;

    const result = await Feedback.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset: (page - 1) * limit
    });

    res.json({
      rows: result.rows,
      pagination: { page, limit, total: result.count, pages: Math.ceil(result.count / limit) }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
});

module.exports = router;
