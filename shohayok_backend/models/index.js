const User = require("./User");
const Conversation = require("./Conversation");
const Message = require("./Message");

Conversation.hasMany(Message, { foreignKey: "ConversationId" });
Message.belongsTo(Conversation, { foreignKey: "ConversationId" });

Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });

module.exports = {
  User,
  Conversation,
  Message,
};