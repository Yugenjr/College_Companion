import express from 'express';
import StudyRoomChat from '../models/StudyRoomChat.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/rbac.js';

const router = express.Router();

/**
 * GET /api/study-room-chat/:roomId
 * Get chat history for a specific room
 */
router.get('/:roomId', verifyFirebaseToken, async (req, res) => {
  try {
    const { roomId } = req.params;

    let chat = await StudyRoomChat.findOne({ roomId });
    
    if (!chat) {
      // Create new chat if doesn't exist
      chat = new StudyRoomChat({ roomId, messages: [] });
      await chat.save();
    }

    res.json({
      success: true,
      roomId,
      messages: chat.messages || [],
      totalMessages: chat.messages?.length || 0
    });
  } catch (error) {
    console.error('❌ Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat history'
    });
  }
});

/**
 * DELETE /api/study-room-chat/:roomId
 * Clear chat history for a room (moderator/admin)
 */
router.delete('/:roomId', verifyFirebaseToken, authorizeRoles('moderator'), async (req, res) => {
  try {
    const { roomId } = req.params;

    const chat = await StudyRoomChat.findOne({ roomId });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        error: 'Chat room not found'
      });
    }

    chat.messages = [];
    await chat.save();

    res.json({
      success: true,
      message: 'Chat history cleared',
      roomId
    });
  } catch (error) {
    console.error('❌ Error clearing chat history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear chat history'
    });
  }
});

/**
 * GET /api/study-room-chat/:roomId/stats
 * Get chat statistics for a room
 */
router.get('/:roomId/stats', verifyFirebaseToken, async (req, res) => {
  try {
    const { roomId } = req.params;

    const chat = await StudyRoomChat.findOne({ roomId });
    
    if (!chat) {
      return res.json({
        success: true,
        roomId,
        stats: {
          totalMessages: 0,
          userMessages: 0,
          aiMessages: 0,
          lastActivity: null
        }
      });
    }

    const userMessages = chat.messages.filter(m => m.sender === 'user').length;
    const aiMessages = chat.messages.filter(m => m.sender === 'assistant').length;
    const lastMessage = chat.messages[chat.messages.length - 1];

    res.json({
      success: true,
      roomId,
      stats: {
        totalMessages: chat.messages.length,
        userMessages,
        aiMessages,
        lastActivity: lastMessage?.timestamp || chat.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Error fetching chat stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat statistics'
    });
  }
});

export default router;
