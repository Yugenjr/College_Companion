import { useState, useCallback } from "react";

/**
 * Custom hook for managing Groq AI chat interactions
 * Handles message history, API communication, and loading states
 */
export function useGroqChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your Attendance Advisor AI. I can help you make smart decisions about leave planning based on your attendance, timetable, weather, and more. How can I assist you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Send a message to Groq API with attendance context
   * @param {string} userMessage - The user's message
   * @param {object} contextData - Attendance data context
   * @param {function} onResponse - Callback when response is received
   */
  const sendMessage = useCallback(async (userMessage, contextData = {}, onResponse) => {
    if (!userMessage.trim()) return;

    // Add user message to history
    const userMsg = {
      id: Date.now(),
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      // Get backend URL from environment or use proxy
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const apiUrl = `${backendUrl}/api/ai-attendance/chat`;
      
      // Call the backend AI endpoint
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage,
          context: {
            attendancePercentage: contextData.attendancePercentage || 0,
            totalClasses: contextData.totalClasses || 0,
            attendedClasses: contextData.attendedClasses || 0,
            weeklyTimetable: contextData.weeklyTimetable || [],
            academicCalendar: contextData.academicCalendar || {},
            homeDistance: contextData.homeDistance || 0,
            isHosteller: contextData.isHosteller || false,
            semesterDates: contextData.semesterDates || {},
            weatherData: contextData.weatherData || {},
            leaveHistory: contextData.leaveHistory || [],
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();
      
      // Add AI response to history
      const aiMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.response || "I apologize, but I couldn't generate a response. Please try again.",
        timestamp: new Date().toISOString(),
        metadata: data.metadata || {},
      };
      
      setMessages(prev => [...prev, aiMsg]);
      
      // Call onResponse callback if provided
      if (onResponse) {
        onResponse(aiMsg);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message);
      
      // Add error message to chat
      const errorMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: "I'm having trouble connecting right now. Please check your connection and try again.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  /**
   * Clear all messages except the initial greeting
   */
  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 1,
        role: "assistant",
        content: "Hello! I'm your Attendance Advisor AI. How can I assist you today?",
        timestamp: new Date().toISOString(),
      },
    ]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
