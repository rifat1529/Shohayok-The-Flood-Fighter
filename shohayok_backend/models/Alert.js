const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Alert = sequelize.define(
  "Alert",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    district: {
      type: DataTypes.STRING,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM("active", "resolved"),
      defaultValue: "active"
    },

    message: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "alerts",
    timestamps: true
  }
);

module.exports = Alert;