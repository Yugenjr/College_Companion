const USER_ROOM_PREFIX = 'user:';

export const getUserNotificationRoom = (userId) => `${USER_ROOM_PREFIX}${userId}`;

export default {
  getUserNotificationRoom,
};
