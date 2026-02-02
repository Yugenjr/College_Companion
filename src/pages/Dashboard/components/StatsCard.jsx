import React from "react";
import { motion } from "framer-motion";

export default function StatsCard({ icon: Icon, title, value, progress, color = "#9d4edd" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="neon-card hover:scale-[1.02]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-neonPurple/10 border border-neonPurple/30">
            <Icon className="w-6 h-6 text-neonPurple" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">{title}</p>
            <p className="text-3xl font-bold text-white glow-purple">{value}</p>
          </div>
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-medium text-white/70 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full bg-primary-gradient"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
