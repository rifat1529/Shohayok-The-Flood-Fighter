const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Feedback = sequelize.define(
  "Feedback",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    missionId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    volunteerId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "feedback",
    timestamps: true,
    indexes: [
      { fields: ["missionId"] },
      { fields: ["volunteerId"] },
      { fields: ["userId"] },
      { unique: true, fields: ["missionId", "volunteerId", "userId"] }
    ]
  }
);

module.exports = Feedback;
