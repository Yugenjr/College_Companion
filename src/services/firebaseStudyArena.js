/**
 * Firebase Realtime Database Service for Study Arena
 * 
 * RTDB Structure:
 * /rooms
 *   /<roomId>
 *     /meta
 *       - roomCode: string (6-digit code)
 *       - createdAt: timestamp
 *       - activeUsersCount: number
 *       - maxUsers: number (default 5)
 *     /users
 *       /<userId>
 *         - username: string
 *         - joinedAt: timestamp
 *         - lastSeen: timestamp
 *     /typing
 *       /<userId>: boolean
 * 
 * Note: Chat messages and notes are stored in MongoDB (not RTDB)
 */

import { 
  ref, 
  set, 
  get, 
  update, 
  remove, 
  onValue,
  serverTimestamp,
  runTransaction,
  off
} from "firebase/database";
import { db } from "@/firebase/config";

const MAX_USERS_PER_ROOM = 5;

/**
 * Generate a random 6-digit room code
 * @returns {string} 6-digit room code
 */
export const generateRoomCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Create a new study room with initial metadata
 * @param {string} userId - Creator's user ID
 * @param {string} username - Creator's username
 * @returns {Promise<{roomId: string, roomCode: string}>}
 */
export const createRoom = async (userId, username) => {
  try {
    const roomCode = generateRoomCode();
    const roomId = roomCode; // Using roomCode as roomId for simplicity
    const roomRef = ref(db, `rooms/${roomId}`);

    // Check if room already exists (rare collision)
    const snapshot = await get(roomRef);
    if (snapshot.exists()) {
      // Recursive call to generate new code
      return createRoom(userId, username);
    }

    // Initialize room structure
    const roomData = {
      meta: {
        roomCode,
        createdAt: Date.now(),
        createdBy: userId,
        activeUsersCount: 1,
        maxUsers: MAX_USERS_PER_ROOM,
      },
      users: {
        [userId]: {
          username,
          joinedAt: Date.now(),
          lastSeen: Date.now(),
        },
      },
      typing: {
        [userId]: false,
      },
    };

    await set(roomRef, roomData);

    // TODO: Create room entry in MongoDB for chat/notes storage
    // await createMongoDBRoom(roomId, { roomCode, createdBy: userId });

    return { roomId, roomCode };
  } catch (error) {
    console.error("Error creating room:", error);
    throw new Error("Failed to create room. Please try again.");
  }
};

/**
 * Join an existing room
 * @param {string} roomId - Room ID (6-digit code)
 * @param {string} userId - User's ID
 * @param {string} username - User's username
 * @returns {Promise<void>}
 * @throws {Error} If room doesn't exist, is full, or user is already in room
 */
export const joinRoom = async (roomId, userId, username) => {
  try {
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);

    // Check if room exists
    if (!snapshot.exists()) {
      throw new Error("Room not found. Please check the room code.");
    }

    const roomData = snapshot.val();

    // Check if user is already in the room
    if (roomData.users && roomData.users[userId]) {
      // User rejoining - just update lastSeen
      await update(ref(db, `rooms/${roomId}/users/${userId}`), {
        lastSeen: Date.now(),
      });
      return;
    }

    // Check room capacity using transaction for thread-safety
    const metaRef = ref(db, `rooms/${roomId}/meta`);
    
    await runTransaction(metaRef, (currentMeta) => {
      if (!currentMeta) {
        throw new Error("Room metadata not found");
      }

      const currentCount = currentMeta.activeUsersCount || 0;
      const maxUsers = currentMeta.maxUsers || MAX_USERS_PER_ROOM;

      if (currentCount >= maxUsers) {
        throw new Error(`Room is full. Maximum ${maxUsers} users allowed.`);
      }

      // Increment user count
      return {
        ...currentMeta,
        activeUsersCount: currentCount + 1,
      };
    });

    // Add user to room
    const updates = {
      [`rooms/${roomId}/users/${userId}`]: {
        username,
        joinedAt: Date.now(),
        lastSeen: Date.now(),
      },
      [`rooms/${roomId}/typing/${userId}`]: false,
    };

    await update(ref(db), updates);

    // TODO: Add user to MongoDB room membership
    // await addUserToMongoDBRoom(roomId, userId, username);

  } catch (error) {
    console.error("Error joining room:", error);
    throw error;
  }
};

/**
 * Leave a room (remove user from RTDB)
 * @param {string} roomId - Room ID
 * @param {string} userId - User's ID
 * @returns {Promise<void>}
 */
export const leaveRoom = async (roomId, userId) => {
  try {
    const userRef = ref(db, `rooms/${roomId}/users/${userId}`);
    const typingRef = ref(db, `rooms/${roomId}/typing/${userId}`);
    
    // Remove user and typing status
    await remove(userRef);
    await remove(typingRef);

    // Decrement active users count using transaction
    const metaRef = ref(db, `rooms/${roomId}/meta`);
    await runTransaction(metaRef, (currentMeta) => {
      if (!currentMeta) return currentMeta;
      
      return {
        ...currentMeta,
        activeUsersCount: Math.max(0, (currentMeta.activeUsersCount || 1) - 1),
      };
    });

    // TODO: Update MongoDB to mark user as left
    // await removeUserFromMongoDBRoom(roomId, userId);

  } catch (error) {
    console.error("Error leaving room:", error);
    throw new Error("Failed to leave room. Please try again.");
  }
};

/**
 * Update user's last seen timestamp (heartbeat)
 * @param {string} roomId - Room ID
 * @param {string} userId - User's ID
 * @returns {Promise<void>}
 */
export const updateUserPresence = async (roomId, userId) => {
  try {
    const userRef = ref(db, `rooms/${roomId}/users/${userId}`);
    await update(userRef, {
      lastSeen: Date.now(),
    });
  } catch (error) {
    console.error("Error updating user presence:", error);
    // Don't throw - presence updates are non-critical
  }
};

/**
 * Listen to all users in a room (real-time)
 * @param {string} roomId - Room ID
 * @param {Function} callback - Callback function receives array of users
 * @returns {Function} Cleanup function to unsubscribe
 */
export const listenForUsers = (roomId, callback) => {
  const usersRef = ref(db, `rooms/${roomId}/users`);
  
  const unsubscribe = onValue(
    usersRef,
    (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.entries(data).map(([id, user]) => ({
          userId: id,
          ...user,
        }));
        
        // Filter out inactive users (not seen in last 2 minutes)
        const now = Date.now();
        const activeUsers = usersList.filter(
          (user) => now - user.lastSeen < 120000
        );
        
        callback(activeUsers);
      } else {
        callback([]);
      }
    },
    (error) => {
      console.error("Error listening for users:", error);
      callback([]);
    }
  );

  // Return cleanup function
  return () => off(usersRef, "value", unsubscribe);
};

/**
 * Update typing status for a user
 * @param {string} roomId - Room ID
 * @param {string} userId - User's ID
 * @param {boolean} isTyping - Is user currently typing
 * @returns {Promise<void>}
 */
export const updateTypingStatus = async (roomId, userId, isTyping) => {
  try {
    // Update new schema: isTyping in user document
    const userRef = ref(db, `rooms/${roomId}/users/${userId}`);
    await update(userRef, { isTyping });
    // Backward compatibility: also update old typing node
    const typingRef = ref(db, `rooms/${roomId}/typing/${userId}`);
    await set(typingRef, isTyping);
  } catch (error) {
    console.error("Error updating typing status:", error);
    // Don't throw - typing indicators are non-critical
  }
};

/**
 * Listen to typing indicators in a room (real-time)
 * @param {string} roomId - Room ID
 * @param {Function} callback - Callback function receives object of {userId: boolean}
 * @returns {Function} Cleanup function to unsubscribe
 */
export const listenForTyping = (roomId, callback) => {
  // Listen for typing status in new schema (user documents)
  const usersRef = ref(db, `rooms/${roomId}/users`);
  const unsubscribe = onValue(
    usersRef,
    (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Find users with isTyping true
        const typingUsers = Object.entries(data)
          .filter(([_, user]) => user.isTyping)
          .map(([userId]) => userId);
        callback(typingUsers);
      } else {
        callback([]);
      }
    },
    (error) => {
      console.error("Error listening for typing:", error);
      callback([]);
    }
  );
  // Backward compatibility: also listen to old typing node
  const typingRef = ref(db, `rooms/${roomId}/typing`);
  const unsubscribeOld = onValue(
    typingRef,
    (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const typingUsers = Object.entries(data)
          .filter(([_, isTyping]) => isTyping)
          .map(([userId]) => userId);
        callback(typingUsers);
      }
    }
  );
  // Return cleanup function
  return () => {
    off(usersRef, "value", unsubscribe);
    off(typingRef, "value", unsubscribeOld);
  };
};

/**
 * Get room metadata
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>} Room metadata
 */
export const getRoomMeta = async (roomId) => {
  try {
    const metaRef = ref(db, `rooms/${roomId}/meta`);
    const snapshot = await get(metaRef);
    
    if (!snapshot.exists()) {
      throw new Error("Room not found");
    }
    
    return snapshot.val();
  } catch (error) {
    console.error("Error getting room meta:", error);
    throw error;
  }
};

/**
 * Listen to room metadata changes (real-time)
 * @param {string} roomId - Room ID
 * @param {Function} callback - Callback function receives room metadata
 * @returns {Function} Cleanup function to unsubscribe
 */
export const listenForRoomMeta = (roomId, callback) => {
  const metaRef = ref(db, `rooms/${roomId}/meta`);
  
  const unsubscribe = onValue(
    metaRef,
    (snapshot) => {
      const data = snapshot.val();
      callback(data || null);
    },
    (error) => {
      console.error("Error listening for room meta:", error);
      callback(null);
    }
  );

  // Return cleanup function
  return () => off(metaRef, "value", unsubscribe);
};

/**
 * Check if room exists
 * @param {string} roomId - Room ID
 * @returns {Promise<boolean>}
 */
export const checkRoomExists = async (roomId) => {
  try {
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);
    return snapshot.exists();
  } catch (error) {
    console.error("Error checking room existence:", error);
    return false;
  }
};

/**
 * Delete a room (cleanup)
 * Note: Should only be called when last user leaves
 * @param {string} roomId - Room ID
 * @returns {Promise<void>}
 */
export const deleteRoom = async (roomId) => {
  try {
    const roomRef = ref(db, `rooms/${roomId}`);
    await remove(roomRef);

    // TODO: Delete room from MongoDB (cascade delete messages/notes)
    // await deleteMongoDBRoom(roomId);

  } catch (error) {
    console.error("Error deleting room:", error);
    throw new Error("Failed to delete room.");
  }
};

// ============================================
// MongoDB Integration Placeholders
// ============================================

/**
 * TODO: Implement MongoDB functions for persistent storage
 * 
 * Functions needed:
 * 
 * 1. createMongoDBRoom(roomId, metadata)
 *    - Store room in MongoDB with roomCode, createdBy, createdAt
 * 
 * 2. addUserToMongoDBRoom(roomId, userId, username)
 *    - Add user to room's member list
 * 
 * 3. removeUserFromMongoDBRoom(roomId, userId)
 *    - Mark user as left in MongoDB
 * 
 * 4. deleteMongoDBRoom(roomId)
 *    - Delete room and all associated data (messages, notes)
 * 
 * 5. saveMessage(roomId, userId, message, type)
 *    - Save chat message to MongoDB
 *    - type: "user" | "assistant"
 * 
 * 6. getMessages(roomId, filter)
 *    - Retrieve messages with filters (all, today, last3days)
 * 
 * 7. saveNote(roomId, userId, title, content, folder)
 *    - Save note to MongoDB
 * 
 * 8. updateNote(noteId, updates)
 *    - Update note title/content/folder
 * 
 * 9. deleteNote(noteId)
 *    - Delete note from MongoDB
 * 
 * 10. getNotes(roomId, folder)
 *     - Retrieve notes with optional folder filter
 */

export default {
  generateRoomCode,
  createRoom,
  joinRoom,
  leaveRoom,
  updateUserPresence,
  listenForUsers,
  updateTypingStatus,
  listenForTyping,
  getRoomMeta,
  listenForRoomMeta,
  checkRoomExists,
  deleteRoom,
};
