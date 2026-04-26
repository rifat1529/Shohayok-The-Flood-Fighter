const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RewardLedger = sequelize.define(
  "RewardLedger",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    volunteerId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    missionId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    feedbackId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    awardedBy: {
      type: DataTypes.UUID,
      allowNull: true
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reason: {
      type: DataTypes.ENUM("mission_completed", "positive_feedback", "manual"),
      allowNull: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "reward_ledger",
    timestamps: true,
    indexes: [
      { fields: ["volunteerId"] },
      { fields: ["missionId"] },
      { fields: ["feedbackId"] },
      { fields: ["reason"] }
    ]
  }
);

module.exports = RewardLedger;
