import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Calendar, AlertCircle } from "lucide-react";
import StatsCard from "./components/StatsCard";
import UpcomingPanel from "./components/UpcomingPanel";
import QuickActions from "./components/QuickActions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const attendanceData = [
    { month: "Jan", attendance: 75 },
    { month: "Feb", attendance: 82 },
    { month: "Mar", attendance: 78 },
    { month: "Apr", attendance: 85 },
    { month: "May", attendance: 88 },
    { month: "Jun", attendance: 90 },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ background: '#050505' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white glow-purple mb-2">
          Dashboard
        </h1>
        <p className="text-white/70">
          Welcome back! Here's your academic overview.
        </p>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={GraduationCap}
          title="Attendance"
          value="88%"
          progress={88}
          color="#FF1E8A"
        />
        <StatsCard
          icon={BookOpen}
          title="Total Classes"
          value="124"
          progress={75}
          color="#8A2BE2"
        />
        <StatsCard
          icon={Calendar}
          title="Subjects"
          value="6"
          progress={100}
          color="#00D4FF"
        />
        <StatsCard
          icon={AlertCircle}
          title="Alerts"
          value="2"
          progress={40}
          color="#FF6B6B"
        />
      </div>

      {/* Attendance Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="neon-card mb-6 md:mb-8"
      >
        <h2 className="text-xl font-semibold text-white glow-blue mb-6">
          Attendance Trend
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="month"
              stroke="#ffffff"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#ffffff"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a24',
                border: '1px solid rgba(157, 78, 221, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 0 20px rgba(157, 78, 221, 0.2)'
              }}
              labelStyle={{ color: '#ffffff' }}
              itemStyle={{ color: '#ffffff' }}
            />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="url(#colorGradient)"
              strokeWidth={3}
              dot={{ fill: '#9d4edd', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: '#9d4edd', stroke: '#fff', strokeWidth: 2 }}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9d4edd" />
                <stop offset="50%" stopColor="#4cc9f0" />
                <stop offset="100%" stopColor="#ff5ecd" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bottom Grid: Upcoming + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingPanel />
        <QuickActions />
      </div>
    </div>
  );
}
