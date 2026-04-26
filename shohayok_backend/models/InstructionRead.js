const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const InstructionRead = sequelize.define(
  "InstructionRead",
  {
    instructionId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: "instruction_reads",
    timestamps: true,
    indexes: [
      { fields: ["userId", "readAt"] },
      { fields: ["instructionId"] }
    ]
  }
);

module.exports = InstructionRead;
