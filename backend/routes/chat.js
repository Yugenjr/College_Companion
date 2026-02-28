// Chat API Routes
import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { getRoomMessages } from '../services/chatService.js';
const router = express.Router();

router.get('/room/:roomId', requireAuth, async (req, res) => {
  try {
    const messages = await getRoomMessages(req.params.roomId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
