// const User = require("./User");
// const Conversation = require("./Conversation");
// const Message = require("./Message");
// const Alert = require("./Alert");

// // Associations
// User.hasMany(Conversation, { foreignKey: "userId" });
// Conversation.belongsTo(User, { foreignKey: "userId" });

// Conversation.hasMany(Message, { foreignKey: "conversationId" });
// Message.belongsTo(Conversation, { foreignKey: "conversationId" });

// Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });

// Alert.hasMany(Message, { foreignKey: "alertId" });
// Message.belongsTo(Alert, { foreignKey: "alertId" });

// module.exports = {
//   User,
//   Conversation,
//   Message,
// };

const User = require("./User");
const Conversation = require("./Conversation");
const Message = require("./Message");
const Alert = require("./Alert");
const Mission = require("./Mission");
const Instruction = require("./Instruction");
const InstructionRead = require("./InstructionRead");
const Notification = require("./Notification");
const Feedback = require("./Feedback");
const RewardLedger = require("./RewardLedger");

// Associations
User.hasMany(Conversation, { foreignKey: "userId" });
Conversation.belongsTo(User, { foreignKey: "userId" });

Conversation.hasMany(Message, { foreignKey: "conversationId" });
Message.belongsTo(Conversation, { foreignKey: "conversationId" });

Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });

Alert.hasMany(Message, { foreignKey: "alertId" });
Message.belongsTo(Alert, { foreignKey: "alertId" });

Instruction.hasMany(InstructionRead, { foreignKey: "instructionId" });
InstructionRead.belongsTo(Instruction, { foreignKey: "instructionId" });

User.hasMany(InstructionRead, { foreignKey: "userId" });
InstructionRead.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Notification, { foreignKey: "receiverId" });
Notification.belongsTo(User, { foreignKey: "receiverId" });

Mission.hasMany(Feedback, { foreignKey: "missionId" });
Feedback.belongsTo(Mission, { foreignKey: "missionId" });

User.hasMany(Feedback, { as: "givenFeedback", foreignKey: "userId" });
User.hasMany(Feedback, { as: "receivedFeedback", foreignKey: "volunteerId" });

User.hasMany(RewardLedger, { foreignKey: "volunteerId" });
RewardLedger.belongsTo(User, { foreignKey: "volunteerId" });

module.exports = {
  User,
  Conversation,
  Message,
  Alert,
  Mission,
  Instruction,
  InstructionRead,
  Notification,
  Feedback,
  RewardLedger
};
