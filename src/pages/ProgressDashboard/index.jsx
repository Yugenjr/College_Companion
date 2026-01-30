import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, BookOpen, Clock, MessageCircle, Target, Calendar } from "lucide-react";
import StatsCard from "./components/StatsCard";
import ActivityChart from "./components/ActivityChart";
import RecentActivities from "./components/RecentActivities";
import WeeklySummary from "./components/WeeklySummary";
import { getProgressData, getWeeklySummary, getMonthlySummary } from "@/services/progressService";

export default function ProgressDashboard() {
  const progressData = getProgressData();
  const weeklySummary = getWeeklySummary();
  const monthlySummary = getMonthlySummary();

  const stats = progressData.stats;

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ background: '#050505' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white glow-purple mb-2">
          My Progress
        </h1>
        <p className="text-white/70">
          Track your learning journey and study patterns across College Companion.
        </p>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={BookOpen}
          title="Questions Generated"
          value={stats.totalQuestionsGenerated}
          subtitle="Total practice questions"
          color="#FF1E8A"
        />
        <StatsCard
          icon={Clock}
          title="Attendance Advice"
          value={stats.totalAttendanceAdvice}
          subtitle="AI consultations"
          color="#00D4FF"
        />
        <StatsCard
          icon={MessageCircle}
          title="Study Sessions"
          value={stats.totalStudySessions}
          subtitle="Study Arena sessions"
          color="#A855F7"
        />
        <StatsCard
          icon={Target}
          title="Current Streak"
          value={`${stats.currentStreak} days`}
          subtitle={`Best: ${stats.longestStreak} days`}
          color="#10B981"
        />
      </div>

      {/* Charts and Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ActivityChart />
        <WeeklySummary summary={weeklySummary} />
      </div>

      {/* Recent Activities */}
      <div className="mb-8">
        <RecentActivities activities={progressData.activities.slice(0, 10)} />
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">This Month</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Activities</span>
              <span className="text-white font-medium">{monthlySummary.totalActivities}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Questions</span>
              <span className="text-white font-medium">{monthlySummary.questionsGenerated}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Study Time</span>
              <span className="text-white font-medium">{Math.round(monthlySummary.studyTime)}min</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Study Time</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {Math.round(stats.totalStudyTime)}min
          </div>
          <p className="text-gray-400 text-sm">Total time spent studying</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Goals</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Weekly Target</span>
              <span className="text-white font-medium">5 sessions</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-green-400 font-medium">{weeklySummary.studySessions}/5</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}