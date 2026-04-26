const sequelize = require("../config/database");
const User = require("../models/User");
const RewardLedger = require("../models/RewardLedger");
const { createNotification } = require("./notificationService");

const MISSION_COMPLETED_POINTS = 50;
const POSITIVE_FEEDBACK_POINTS = 10;

function validatePoints(points) {
  const value = Number(points);
  if (!Number.isInteger(value) || value <= 0) {
    const error = new Error("Points must be a positive integer");
    error.statusCode = 400;
    throw error;
  }
  return value;
}

async function awardPoints({ io, volunteerId, missionId, feedbackId, awardedBy, points, reason, note }, options = {}) {
  const value = validatePoints(points);
  const volunteer = await User.findByPk(volunteerId, { transaction: options.transaction });

  if (!volunteer || !["volunteer", "volunteer_head"].includes(volunteer.role)) {
    const error = new Error("Reward recipient must be a volunteer or volunteer head");
    error.statusCode = 400;
    throw error;
  }

  const ledger = await RewardLedger.create(
    { volunteerId, missionId, feedbackId, awardedBy, points: value, reason, note },
    { transaction: options.transaction }
  );

  await volunteer.increment("points", { by: value, transaction: options.transaction });

  await createNotification(
    {
      io,
      receiverId: volunteerId,
      type: "reward_earned",
      messageText: `You earned ${value} reward points.`,
      data: { rewardId: ledger.id, missionId, feedbackId, reason, points: value }
    },
    options
  );

  return ledger;
}

async function awardPositiveFeedback({ io, feedback }, options = {}) {
  if (Number(feedback.rating) < 4) return null;

  const existing = await RewardLedger.findOne({
    where: { feedbackId: feedback.id, reason: "positive_feedback" },
    transaction: options.transaction
  });
  if (existing) return existing;

  return awardPoints(
    {
      io,
      volunteerId: feedback.volunteerId,
      missionId: feedback.missionId,
      feedbackId: feedback.id,
      points: POSITIVE_FEEDBACK_POINTS,
      reason: "positive_feedback",
      note: `${feedback.rating}-star feedback`
    },
    options
  );
}

async function manualReward({ io, volunteerId, points, awardedBy, note }) {
  return sequelize.transaction((transaction) =>
    awardPoints(
      { io, volunteerId, points, awardedBy, reason: "manual", note },
      { transaction }
    )
  );
}

module.exports = {
  MISSION_COMPLETED_POINTS,
  POSITIVE_FEEDBACK_POINTS,
  awardPoints,
  awardPositiveFeedback,
  manualReward
};
