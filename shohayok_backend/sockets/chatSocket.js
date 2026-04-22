const { Message } = require("../models");

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // ✅ JOIN ROOM
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      console.log("Joined:", conversationId);
    });

    // ✅ SEND MESSAGE
    socket.on("sendMessage", async (data) => {
      try {
        console.log("📩 Incoming:", data);

        const { conversationId, senderId, message } = data;

        // 🔥 save DB
        const saved = await Message.create({
          message,
          senderId,
          ConversationId
        });

        const response = {
          id: saved.id,
          message: saved.message,
          senderId: saved.senderId,
          createdAt: saved.createdAt
        };

        // 🔥 emit to room
        io.to(conversationId).emit("receiveMessage", response);

      } catch (err) {
        console.error("❌ ERROR:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });
};

module.exports = chatSocket;