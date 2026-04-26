// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");

// const Instruction = sequelize.define("Instruction", {
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//     primaryKey: true
//   },

//   title: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },

//   content: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },

//   // 🔥 type: user / volunteer / alert
//   type: {
//     type: DataTypes.ENUM("user", "volunteer", "alert"),
//     allowNull: false
//   },

//   // 🔥 optional location based
//   district: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },

//   // 🔥 priority
//   priority: {
//     type: DataTypes.ENUM("low", "medium", "high"),
//     defaultValue: "low"
//   }

// }, {
//   tableName: "instructions",
//   timestamps: true
// });

// module.exports = Instruction;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Instruction = sequelize.define("Instruction", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  // 🔥 type: user / volunteer / alert
  type: {
    type: DataTypes.ENUM("user", "volunteer", "alert"),
    allowNull: false
  },

  // 🔥 optional location based
  district: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // 🔥 priority
  priority: {
    type: DataTypes.ENUM("low", "medium", "high"),
    defaultValue: "low"
  },

  // Advanced delivery target. Existing type/priority fields stay for backward compatibility.
  targetType: {
    type: DataTypes.ENUM("mission", "volunteer_head", "all_volunteers", "public"),
    defaultValue: "public"
  },

  missionId: {
    type: DataTypes.UUID,
    allowNull: true
  },

  receiverId: {
    type: DataTypes.UUID,
    allowNull: true
  },

  instructionType: {
    type: DataTypes.ENUM("urgent", "general"),
    defaultValue: "general"
  }

}, {
  tableName: "instructions",
  timestamps: true
});

module.exports = Instruction;
