import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Clock,
  BookOpen,
  MessageCircle,
  User,
  TrendingUp,
  Sun,
  Moon,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import { useTheme } from "../contexts/ThemeContext";

const MENU = [
  { label: "Dashboard", path: "/dashboard", icon: Home },
  { label: "My Progress", path: "/progress", icon: TrendingUp },
  { label: "Attendance Advisor", path: "/attendance-advisor", icon: Clock },
  { label: "Semester Survival", path: "/semester-survival", icon: BookOpen },
  { label: "Study Arena", path: "/study-arena", icon: MessageCircle },
  { label: "Profile", path: "/profile", icon: User },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ width: 70 }}
        animate={{ width: expanded ? 240 : 70 }}
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="hidden md:flex flex-col h-screen py-4 px-2 border-r border-neonPurple/20 shadow-neon-purple"
        style={{ background: 'rgba(13, 13, 13, 0.9)', backdropFilter: 'blur(12px)', minWidth: 70 }}
        aria-label="Sidebar"
      >
        {/* Logo */}
        <div className="px-2 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-xl">CC</span>
            </motion.div>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="overflow-hidden"
              >
                <h1 className="text-base font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                  College
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  Companion
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-1">
          <ul className="flex flex-col gap-1">
            {MENU.map((m) => (
              <li key={m.path}>
                <SidebarItem
                  icon={m.icon}
                  label={m.label}
                  path={m.path}
                  collapsed={!expanded}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Theme Toggle */}
        <div className="px-2 mb-4">
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
              expanded ? 'justify-start' : 'justify-center'
            } bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700`}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
            {expanded && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            )}
          </motion.button>
        </div>

        {/* Version */}
        {expanded && (
          <div className="px-2 mb-2">
            <div className="px-3 py-2 text-xs text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="font-medium">v1.0.0</div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-neonPurple/20 shadow-neon-purple" style={{ background: 'rgba(13, 13, 13, 0.95)', backdropFilter: 'blur(12px)' }}>
        <ul className="flex items-center justify-around px-2 py-2">
          {MENU.slice(0, 5).map((m) => (
            <li key={m.path} className="flex-1">
              <SidebarItem
                icon={m.icon}
                label={m.label}
                path={m.path}
                collapsed={true}
                isMobile={true}
              />
            </li>
          ))}
          <li className="flex-1">
            <button
              onClick={toggleTheme}
              className="flex flex-col items-center justify-center w-full py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-6 h-6" />
              ) : (
                <Sun className="w-6 h-6" />
              )}
              <span className="text-xs mt-1">Theme</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

