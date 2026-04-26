const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Request = sequelize.define(
  "Request",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    district: {
      type: DataTypes.STRING(80),
      allowNull: false,
      set(value) {
        this.setDataValue("district", String(value).toLowerCase().trim());
      }
    },
    subDistrict: {
      type: DataTypes.STRING(80),
      allowNull: false,
      set(value) {
        this.setDataValue("subDistrict", String(value).toLowerCase().trim());
      }
    },
    village: {
      type: DataTypes.STRING(120),
      allowNull: false,
      set(value) {
        this.setDataValue("village", String(value).toLowerCase().trim());
      }
    },
    peopleCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    needType: {
      type: DataTypes.ENUM("rescue", "food", "medicine", "shelter"),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "declined"),
       defaultValue: "pending"
        
    }
  },
  {
    tableName: "requests",
    timestamps: true
  }
);

module.exports = Request;