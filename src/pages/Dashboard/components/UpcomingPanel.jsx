import React from "react";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

export default function UpcomingPanel() {
  const upcomingClasses = [
    {
      subject: "Data Structures",
      time: "10:00 AM",
      room: "Lab 301",
      status: "next",
      dotColor: "bg-blue-500",
      badgeBg: "bg-blue-50 dark:bg-blue-500/10",
      badgeText: "text-blue-600 dark:text-blue-400",
      badgeBorder: "border-blue-200 dark:border-blue-500/30"
    },
    {
      subject: "Database Management",
      time: "12:00 PM",
      room: "Room 205",
      status: "upcoming",
      dotColor: "bg-purple-500"
    },
    {
      subject: "Web Development",
      time: "2:30 PM",
      room: "Lab 102",
      status: "upcoming",
      dotColor: "bg-green-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="neon-card h-full"
    >
      <h2 className="text-xl font-semibold text-white glow-blue mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-neonBlue" />
        Upcoming Classes
      </h2>

      <div className="space-y-4">
        {upcomingClasses.map((cls, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative bg-white/5 rounded-xl p-4 border border-white/10 hover:border-neonBlue/50 transition-all duration-300 hover:bg-white/10"
          >
            {cls.status === "next" && (
              <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold ${cls.badgeBg} ${cls.badgeText} border ${cls.badgeBorder}`}>
                Next
              </div>
            )}

            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white text-lg">{cls.subject}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-white/70">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {cls.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {cls.room}
                  </span>
                </div>
              </div>

              <div className={`w-3 h-3 rounded-full ${cls.dotColor} shadow-neon-blue`} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
