// Chat Service for message persistence
import ChatMessage from '../models/ChatMessage.js';

export async function saveMessage({ roomId, username, message }) {
  const chatMsg = new ChatMessage({ roomId, username, message });
  await chatMsg.save();
  return chatMsg;
}

export async function getRoomMessages(roomId, limit = 50) {
  return ChatMessage.find({ roomId }).sort({ timestamp: -1 }).limit(limit);
}
