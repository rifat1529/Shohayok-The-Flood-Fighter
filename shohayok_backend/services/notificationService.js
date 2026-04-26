const Notification = require("../models/Notification");

const userRoom = (userId) => `user:${userId}`;
const roleRoom = (role) => `role:${role}`;
const missionRoom = (missionId) => `mission:${missionId}`;

async function createNotification({ io, receiverId, messageText, type, data }, options = {}) {
  if (!receiverId || !messageText) return null;

  const notification = await Notification.create(
    { receiverId, messageText, type, data },
    { transaction: options.transaction }
  );

  if (io) {
    io.to(userRoom(receiverId)).emit("notification", notification);
  }

  return notification;
}

async function createNotifications({ io, receiverIds, messageText, type, data }, options = {}) {
  const uniqueIds = [...new Set((receiverIds || []).filter(Boolean))];
  const notifications = [];

  for (const receiverId of uniqueIds) {
    const notification = await createNotification(
      { io, receiverId, messageText, type, data },
      options
    );
    if (notification) notifications.push(notification);
  }

  return notifications;
}

module.exports = {
  createNotification,
  createNotifications,
  missionRoom,
  roleRoom,
  userRoom
};
