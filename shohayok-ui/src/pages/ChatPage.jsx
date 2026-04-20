import Chat from "../components/Chat";

function ChatPage() {
  // 🔥 test values (later dynamic হবে)
  const userId = "test-user-1";
  const roomId = "room-1";

  return <Chat userId={userId} roomId={roomId} />;
}

export default ChatPage;