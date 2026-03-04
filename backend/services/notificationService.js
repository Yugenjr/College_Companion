import Notification from '../models/Notification.js';
import { getIO } from '../config/socket.js';
import { getUserNotificationRoom } from '../utils/socketRooms.js';

export const createAndEmitNotification = async ({ userId, message, type = 'general' }) => {
  if (!userId || !message) {
    throw new Error('userId and message are required to create notification');
  }

  const notification = await Notification.create({
    userId,
    message,
    type,
    isRead: false,
  });

  const payload = {
    _id: notification._id,
    userId: notification.userId,
    message: notification.message,
    type: notification.type,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  };

  try {
    const io = getIO();
    io.to(getUserNotificationRoom(userId)).emit('new-notification', payload);
  } catch (socketError) {
    console.warn(`⚠️ Notification created but socket emit failed for user ${userId}:`, socketError.message);
  }

  return notification;
};

export const getNotificationsForUser = async (userId, limit = 50) => {
  const parsedLimit = Number.isFinite(Number(limit))
    ? Math.min(Math.max(parseInt(limit, 10), 1), 100)
    : 50;

  return Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(parsedLimit)
    .lean();
};

export const markNotificationAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { $set: { isRead: true } },
    { new: true }
  ).lean();
};

export default {
  getUserNotificationRoom,
  createAndEmitNotification,
  getNotificationsForUser,
  markNotificationAsRead,
};
