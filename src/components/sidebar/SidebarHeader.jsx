import React from "react";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";

export default function SidebarHeader({ collapsed, onToggle }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="College Companion Logo"
          className="w-8 h-8 object-contain flex-shrink-0 drop-shadow-[0_2px_10px_rgba(124,58,237,0.5)]"
        />

        {!collapsed && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-semibold text-white glow-purple whitespace-nowrap"
          >
            College Companion
          </motion.h1>
        )}
      </div>

      <button
        onClick={onToggle}
        className="text-white/60 hover:text-neonPurple p-1 rounded-md transition-colors"
        aria-label="toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1H6zm1 2h6v2H7V6zm0 4h4v2H7v-2z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
