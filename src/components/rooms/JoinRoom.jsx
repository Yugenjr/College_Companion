import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Loader2, AlertCircle, Hash } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRoom as useRoomContext } from "@/contexts/RoomContext";
import { joinRoom } from "@/firebase/roomService";
import { addActivity, ACTIVITY_TYPES } from "@/services/progressService";

export default function JoinRoom() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const { enterRoom } = useRoomContext();
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    
    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userName = userProfile?.fullName || currentUser?.email || "Anonymous";
      await joinRoom(roomId.trim(), currentUser.uid, userName);

      // Track study room join activity
      addActivity(ACTIVITY_TYPES.STUDY_ROOM_JOINED, {
        roomCode: roomId.trim(),
        roomName: `Room ${roomId.trim()}`,
        tool: 'Study Arena',
      });

      enterRoom(roomId.trim(), {});
      navigate(`/study-arena/room/${roomId.trim()}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="neon-card p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-neonPurple/20 rounded-xl">
          <LogIn className="w-6 h-6 text-neonPurple" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Join Room</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Enter a room ID to join</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleJoinRoom} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Room ID
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              className="neon-input w-full pl-10 pr-4 py-3"
              disabled={loading}
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading || !roomId.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 md:py-4 px-6 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Join Room
            </>
          )}
        </motion.button>
      </form>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
        Get the room ID from your friend who created the room
      </p>
    </motion.div>
  );
}
