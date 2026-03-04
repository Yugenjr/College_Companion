import mongoose from 'mongoose';
import {
  getNotificationsForUser,
  markNotificationAsRead,
} from '../services/notificationService.js';

export const getNotifications = async (req, res) => {
  try {
    const { uid } = req.user;
    const { limit } = req.query;

    const notifications = await getNotificationsForUser(uid, limit);

    return res.json({
      success: true,
      notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.error('❌ Get notifications error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications',
      message: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid notification id',
      });
    }

    const updatedNotification = await markNotificationAsRead(id, uid);

    if (!updatedNotification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
      });
    }

    return res.json({
      success: true,
      message: 'Notification marked as read',
      notification: updatedNotification,
    });
  } catch (error) {
    console.error('❌ Mark notification as read error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to update notification',
      message: error.message,
    });
  }
};

export default {
  getNotifications,
  markAsRead,
};
