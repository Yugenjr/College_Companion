import Notification from '../models/Notification.js';
import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

// Get notifications for current user
router.get('/', verifyFirebaseToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.uid }).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark notification as read
router.post('/:id/read', verifyFirebaseToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      { $set: { read: true } },
      { new: true }
    );
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
