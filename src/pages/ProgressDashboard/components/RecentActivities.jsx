import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, MessageCircle, Users, Calendar } from "lucide-react";
import { ACTIVITY_TYPES } from "@/services/progressService";

const getActivityIcon = (type) => {
  switch (type) {
    case ACTIVITY_TYPES.QUESTION_GENERATED:
      return BookOpen;
    case ACTIVITY_TYPES.ATTENDANCE_ADVICE:
      return Clock;
    case ACTIVITY_TYPES.STUDY_SESSION:
      return MessageCircle;
    case ACTIVITY_TYPES.STUDY_ROOM_JOINED:
      return Users;
    default:
      return Calendar;
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case ACTIVITY_TYPES.QUESTION_GENERATED:
      return "#FF1E8A";
    case ACTIVITY_TYPES.ATTENDANCE_ADVICE:
      return "#00D4FF";
    case ACTIVITY_TYPES.STUDY_SESSION:
      return "#A855F7";
    case ACTIVITY_TYPES.STUDY_ROOM_JOINED:
      return "#10B981";
    default:
      return "#6B7280";
  }
};

const getActivityTitle = (type, details) => {
  switch (type) {
    case ACTIVITY_TYPES.QUESTION_GENERATED:
      return `Generated questions for ${details.topic || 'topic'}`;
    case ACTIVITY_TYPES.ATTENDANCE_ADVICE:
      return `Got attendance advice`;
    case ACTIVITY_TYPES.STUDY_SESSION:
      return `Completed study session${details.duration ? ` (${details.duration}min)` : ''}`;
    case ACTIVITY_TYPES.STUDY_ROOM_JOINED:
      return `Joined study room: ${details.roomName || 'Room'}`;
    default:
      return 'Activity recorded';
  }
};

export default function RecentActivities({ activities }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Recent Activities</h3>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No activities recorded yet.</p>
          <p className="text-gray-500 text-sm">Start using College Companion tools to see your progress!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const color = getActivityColor(activity.type);

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium mb-1">
                    {getActivityTitle(activity.type, activity)}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                  {activity.tool && (
                    <p className="text-gray-500 text-xs mt-1">
                      Tool: {activity.tool}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}