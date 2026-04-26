const User = require("./User");
const Conversation = require("./Conversation");
const Message = require("./Message");
const Alert = require("./Alert");

// Associations
User.hasMany(Conversation, { foreignKey: "userId" });
Conversation.belongsTo(User, { foreignKey: "userId" });

Conversation.hasMany(Message, { foreignKey: "conversationId" });
Message.belongsTo(Conversation, { foreignKey: "conversationId" });

Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });

Alert.hasMany(Message, { foreignKey: "alertId" });
Message.belongsTo(Alert, { foreignKey: "alertId" });

module.exports = {
  User,
  Conversation,
  Message,
};