const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    messageText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(
        "request_approved",
        "request_declined",
        "mission_created",
        "admin_instruction",
        "reward_earned",
        "feedback_received",
        "role_promoted",
        "emergency_alert"
      ),
      defaultValue: "admin_instruction"
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    readStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notificationTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "notifications",
    timestamps: true,
    indexes: [
      { fields: ["receiverId", "readStatus"] },
      { fields: ["type"] },
      { fields: ["createdAt"] }
    ]
  }
);

module.exports = Notification;
