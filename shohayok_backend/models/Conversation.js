const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Conversation = sequelize.define("Conversation", {
  type: {
    type: DataTypes.ENUM("user_volunteer", "admin_head"),
    allowNull: false,
  },
});

module.exports = Conversation;