import React from "react";
import { motion } from "framer-motion";
import { useGroqChat } from "@/hooks/useGroqChat";
import { useAttendanceData } from "@/hooks/useAttendanceData";
import ChatInterface from "./components/ChatInterface";
import PastAttendanceCard from "./components/PastAttendanceCard";
import LeaveHistoryCard from "./components/LeaveHistoryCard";
import AbsenceTimelineCard from "./components/AbsenceTimelineCard";
import DataInputsPanel from "./components/DataInputsPanel";
import { addActivity, ACTIVITY_TYPES } from "@/services/progressService";

export default function AttendanceAdvisor() {
  const { messages, isLoading, sendMessage } = useGroqChat();
  const {
    attendanceData,
    leaveHistory,
    absenceTimeline,
    userConfig,
    updateUserConfig,
    uploadAcademicCalendar,
    uploadWeeklyTimetable,
  } = useAttendanceData();

  /**
   * Handle sending messages with full context
   */
  const handleSendMessage = (message) => {
    const contextData = {
      attendancePercentage: attendanceData.attendancePercentage,
      totalClasses: attendanceData.totalClasses,
      attendedClasses: attendanceData.attendedClasses,
      weeklyTimetable: userConfig.weeklyTimetable,
      academicCalendar: userConfig.academicCalendar,
      homeDistance: userConfig.homeDistance,
      isHosteller: userConfig.isHosteller,
      semesterDates: {
        start: userConfig.semesterStart,
        end: userConfig.semesterEnd,
      },
      leaveHistory: leaveHistory,
      // Weather data would be fetched from API
      weatherData: {},
    };

    sendMessage(message, contextData, (response) => {
      // Track attendance advice activity
      if (response && !response.isError) {
        addActivity(ACTIVITY_TYPES.ATTENDANCE_ADVICE, {
          query: message,
          tool: 'Attendance Advisor',
        });
      }
    });
  };

  /**
   * Handle file uploads
   */
  const handleFileUpload = (type, file) => {
    if (type === "academicCalendar") {
      uploadAcademicCalendar(file);
    } else if (type === "weeklyTimetable") {
      uploadWeeklyTimetable(file);
    }
  };

  return (
    <div style={{ background: '#050505' }} className="min-h-screen p-4 md:p-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          🎯 Attendance Advisor
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered leave planning and attendance management assistant
        </p>
      </motion.div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chat Interface (Takes 2/3 width on large screens) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 h-[calc(100vh-200px)] md:h-[calc(100vh-180px)]"
        >
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        </motion.div>

        {/* Right Column - Insights & Data Panels (Takes 1/3 width on large screens) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4 h-[calc(100vh-200px)] md:h-[calc(100vh-180px)] overflow-y-auto pr-2 scroll-smooth"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(138, 43, 226, 0.3) rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* Attendance Summary */}
          <PastAttendanceCard attendanceData={attendanceData} />

          {/* Leave History */}
          <LeaveHistoryCard leaveHistory={leaveHistory} />

          {/* Absence Timeline */}
          <AbsenceTimelineCard absenceTimeline={absenceTimeline} />

          {/* Data Inputs */}
          <DataInputsPanel
            userConfig={userConfig}
            onConfigUpdate={updateUserConfig}
            onFileUpload={handleFileUpload}
          />
        </motion.div>
      </div>
    </div>
  );
}
