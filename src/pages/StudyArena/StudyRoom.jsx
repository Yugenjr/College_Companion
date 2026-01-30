/**
 * StudyRoom.jsx - Individual Study Room with Live User Presence
 * 
 * FIREBASE RTDB USAGE:
 * - Real-time user presence tracking
 * - Subscribe to user list updates
 * - Remove user on component unmount
 * - Delete empty rooms automatically
 * 
 * MONGODB USAGE (TODO):
 * - Store and retrieve chat messages
 * - Store uploaded files/documents
 * - Maintain complete room history
 */

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ref, onValue, remove, get } from "firebase/database";
import { db } from "@/firebase/config";
import GroupChat from "@/components/study/GroupChat";
import {
  Users,
  LogOut,
  Wifi,
  WifiOff,
  User as UserIcon,
  MessageSquare,
  FileText,
} from "lucide-react";
import { addActivity, ACTIVITY_TYPES } from "@/services/progressService";

export default function StudyRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomUsers, setRoomUsers] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [roomCreatedAt, setRoomCreatedAt] = useState(null);
  const sessionStartTime = useRef(Date.now());

  const userId = localStorage.getItem("studyArena_userId");
  const username = localStorage.getItem("studyArena_username");

  /**
   * Subscribe to room users in real-time
   * 
   * Uses RTDB because:
   * - Instant updates when users join/leave
   * - Low latency for presence tracking
   * - Automatic sync across all connected clients
   */
  useEffect(() => {
    if (!roomId || !userId || !username) {
      navigate("/study-arena");
      return;
    }

    const roomRef = ref(db, `rooms/${roomId}`);
    
    // Subscribe to room data
    const unsubscribe = onValue(
      roomRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          // Room doesn't exist or was deleted
          navigate("/study-arena");
          return;
        }

        const roomData = snapshot.val();
        setRoomCreatedAt(roomData.createdAt);

        const users = roomData.users || {};
        const usersList = Object.entries(users).map(([id, userData]) => ({
          userId: id,
          ...userData,
        }));

        setRoomUsers(usersList);
      },
      (error) => {
        console.error("Error listening to room:", error);
        setIsOnline(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [roomId, userId, username, navigate]);

  /**
   * Monitor online/offline status
   */
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  /**
   * Leave room and cleanup
   * 
   * Steps:
   * 1. Remove user from RTDB
   * 2. Check if room is empty
   * 3. Delete room if no users remain
   * 4. Clear localStorage
   * 5. Navigate back to home
   * 
   * Uses RTDB because:
   * - Need immediate presence updates
   * - Other users see departure instantly
   * - Automatic room cleanup
   */
  const handleLeaveRoom = async () => {
    if (!confirm("Leave this study room?")) return;

    try {
      // Remove current user from room
      const userRef = ref(db, `rooms/${roomId}/users/${userId}`);
      await remove(userRef);

      // Check if room is now empty
      const roomRef = ref(db, `rooms/${roomId}/users`);
      const snapshot = await get(roomRef);

      if (!snapshot.exists() || Object.keys(snapshot.val()).length === 0) {
        // Room is empty, delete entire room
        const entireRoomRef = ref(db, `rooms/${roomId}`);
        await remove(entireRoomRef);

        // TODO: Delete room data from MongoDB
        // await deleteMongoDBRoom(roomId);
      }

      // Clear localStorage
      localStorage.removeItem("studyArena_currentRoom");

      // Track study session
      const sessionDuration = Math.round((Date.now() - sessionStartTime.current) / 1000 / 60); // in minutes
      if (sessionDuration >= 1) { // Only track sessions of 1+ minutes
        addActivity(ACTIVITY_TYPES.STUDY_SESSION, {
          roomCode: roomId,
          roomName: `Room ${roomId}`,
          duration: sessionDuration,
          tool: 'Study Arena',
        });
      }

      // Navigate back
      navigate("/study-arena");
    } catch (err) {
      console.error("Error leaving room:", err);
    }
  };

  /**
   * Cleanup on component unmount or page close
   */
  useEffect(() => {
    const cleanup = async () => {
      if (!userId || !roomId) return;

      try {
        const userRef = ref(db, `rooms/${roomId}/users/${userId}`);
        await remove(userRef);

        // Check if room is empty and delete if needed
        const roomRef = ref(db, `rooms/${roomId}/users`);
        const snapshot = await get(roomRef);

        if (!snapshot.exists() || Object.keys(snapshot.val()).length === 0) {
          const entireRoomRef = ref(db, `rooms/${roomId}`);
          await remove(entireRoomRef);
        }
      } catch (err) {
        console.error("Error during cleanup:", err);
      }
    };

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [userId, roomId]);

  /**
   * Handle page close/reload
   */
  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      if (!userId || !roomId) return;

      try {
        const userRef = ref(db, `rooms/${roomId}/users/${userId}`);
        await remove(userRef);
      } catch (err) {
        console.error("Error on page close:", err);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userId, roomId]);

  return (
    <div className="min-h-screen bg-bgDark1 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-neonPink/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-neonPurple/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-screen flex flex-col p-6 gap-4">
        {/* Top Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-bgDark2/70 backdrop-blur-xl rounded-2xl border border-white/10 px-6 py-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-neonPink to-neonPurple flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                Study Room
              </h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                <span className="font-mono">Code: {roomId}</span>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{roomUsers.length} user{roomUsers.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isOnline ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Connected</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-red-400" />
                      <span className="text-red-400">Offline</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleLeaveRoom}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-300 group"
            >
              <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300" />
              <span className="text-sm text-red-400 group-hover:text-red-300 font-medium">
                Leave Room
              </span>
            </button>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left: Live Users Panel */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-80 bg-bgDark2/70 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-neonPurple" />
                Live Users
              </h2>
              <span className="px-2 py-1 bg-neonPurple/20 border border-neonPurple/30 rounded text-xs text-neonPurple font-medium">
                {roomUsers.length}/5
              </span>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {roomUsers.map((user, index) => (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="bg-bgDark3/50 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-neonPink/30 to-neonPurple/30 border border-neonPurple/40 flex items-center justify-center shrink-0">
                      <UserIcon className="w-5 h-5 text-neonPurple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {user.username}
                        {user.userId === userId && (
                          <span className="text-neonPink text-xs ml-2">(You)</span>
                        )}
                      </p>
                      <p className="text-white/40 text-xs">
                        Joined {new Date(user.joinedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {roomUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/60 text-sm">No users in room</p>
              </div>
            )}
          </motion.div>

          {/* Right: Chat Interface */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-bgDark2/70 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
          >
            <GroupChat roomId={roomId} userId={userId} username={username} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
