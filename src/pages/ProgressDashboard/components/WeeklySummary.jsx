import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, BookOpen, Clock, MessageCircle } from "lucide-react";

export default function WeeklySummary({ summary }) {
  const items = [
    {
      icon: TrendingUp,
      label: "Total Activities",
      value: summary.totalActivities,
      color: "#3B82F6",
    },
    {
      icon: BookOpen,
      label: "Questions Generated",
      value: summary.questionsGenerated,
      color: "#FF1E8A",
    },
    {
      icon: Clock,
      label: "Attendance Consultations",
      value: summary.attendanceAdvice,
      color: "#00D4FF",
    },
    {
      icon: MessageCircle,
      label: "Study Sessions",
      value: summary.studySessions,
      color: "#A855F7",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-green-400" />
        <h3 className="text-lg font-semibold text-white">This Week</h3>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <span className="text-gray-300 text-sm">{item.label}</span>
              </div>
              <span className="text-white font-semibold">{item.value}</span>
            </motion.div>
          );
        })}
      </div>

      {summary.studyTime > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Study Time</span>
            <span className="text-green-400 font-semibold">{Math.round(summary.studyTime)}min</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}