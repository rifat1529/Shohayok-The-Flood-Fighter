const { Message } = require("../models");

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // 🔥 join room
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // 🔥 send message
    socket.on("send_message", async (data) => {
      try {
        const { roomId, senderId, message } = data;

        console.log("📩 Incoming:", data);

        // ✅ save to DB
        const savedMessage = await Message.create({
          message,
          senderId,
          ConversationId: roomId || null, // safe fallback
        });

        // ✅ clean response (frontend friendly)
        const response = {
          id: savedMessage.id,
          message: savedMessage.message,
          senderId: savedMessage.senderId,
          roomId,
          createdAt: savedMessage.createdAt,
        };

        // 🔥 send to all users in room
        io.to(roomId).emit("receive_message", response);

      } catch (err) {
        console.error("❌ Message save error:", err.message);

        // 🔥 send error to client (debug)
        socket.emit("error_message", {
          message: "Failed to send message",
        });
      }
    });

    // 🔴 disconnect
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};

module.exports = chatSocket;