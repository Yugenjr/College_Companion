import express from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import {
  getNotifications,
  markAsRead,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', verifyFirebaseToken, getNotifications);
router.patch('/:id/read', verifyFirebaseToken, markAsRead);

export default router;
