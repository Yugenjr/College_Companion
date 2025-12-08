import React, { useState } from "react";
import { motion } from "framer-motion";
import { Target, BookOpen, AlertCircle, CheckCircle2, Clock, Calendar, Brain, Zap, TrendingUp, Save } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function SurvivalPlan() {
  // Form inputs
  const [userSkills, setUserSkills] = useState("");
  const [stressLevel, setStressLevel] = useState("medium");
  const [timeAvailable, setTimeAvailable] = useState("");
  const [examDates, setExamDates] = useState("");
  const [goals, setGoals] = useState("");
  const [deadline, setDeadline] = useState("");

  // UI states
  const [plan, setPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { currentUser } = useAuth();

  const handleGenerate = async () => {
    // Validation
    if (!userSkills.trim()) {
      setError("Please enter your current skills");
      return;
    }
    if (!timeAvailable.trim()) {
      setError("Please specify time available");
      return;
    }
    if (!examDates.trim()) {
      setError("Please enter exam dates");
      return;
    }
    if (!goals.trim()) {
      setError("Please enter your goals");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const requestBody = {
        skills: userSkills,
        stressLevel,
        timeAvailable,
        examDates,
        goals,
        userId: currentUser?.uid || 'anonymous',
      };

      console.log('Sending request:', requestBody);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/survival-plan/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate survival plan');
      }

      const data = await response.json();
      console.log('Received plan:', data);

      setPlan(data.plan);
    } catch (error) {
      console.error('Error generating plan:', error);
      setError(error.message || 'Failed to generate survival plan. Make sure backend is running on port 5000.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAsNotes = async () => {
    if (!plan || !currentUser) {
      setError('Please login and generate a plan first');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const noteContent = JSON.stringify(plan, null, 2);
      const noteTitle = `Survival Plan - ${goals.substring(0, 50)}`;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/survival-plan/saveNotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          title: noteTitle,
          content: noteContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving notes:', error);
      setError('Failed to save notes');
    } finally {
      setIsSaving(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "low":
        return "text-green-400 bg-green-500/10 border-green-500/30";
      default:
        return "text-white/60 bg-white/5 border-white/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="neon-card p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold glow-purple">AI Survival Plan Generator</h3>
            <p className="text-sm text-[#1A1A1A] dark:text-[#E4E4E4]">Personalized study plan with weekly breakdowns</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Current Skills */}
          <div>
            <label className="text-sm font-medium text-[#0A0A0A] dark:text-[#FFFFFF] mb-2 block">Current Skills (comma-separated)</label>
            <input
              type="text"
              value={userSkills}
              onChange={(e) => setUserSkills(e.target.value)}
              placeholder="e.g., Python, Data Structures, Basic Algorithms"
              className="w-full px-4 py-3 bg-[#F8F9FB] dark:bg-[#0D1117] border border-[#E5E7EB] dark:border-[#2A2F35] rounded-xl text-[#0A0A0A] dark:text-[#FFFFFF] placeholder:text-[#1A1A1A] dark:placeholder:text-[#E4E4E4] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Stress Level */}
          <div>
            <label className="text-sm font-medium text-[#0A0A0A] dark:text-[#FFFFFF] mb-2 block">Stress Level</label>
            <select
              value={stressLevel}
              onChange={(e) => setStressLevel(e.target.value)}
              className="w-full px-4 py-3 bg-[#F8F9FB] dark:bg-[#0D1117] border border-[#E5E7EB] dark:border-[#2A2F35] rounded-xl text-[#0A0A0A] dark:text-[#FFFFFF] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="low">Low - Comfortable pace</option>
              <option value="medium">Medium - Balanced approach</option>
              <option value="high">High - Intense preparation</option>
            </select>
          </div>

          {/* Time Available */}
          <div>
            <label className="text-sm font-medium text-[#0A0A0A] dark:text-[#FFFFFF] mb-2 block">Time Available</label>
            <input
              type="text"
              value={timeAvailable}
              onChange={(e) => setTimeAvailable(e.target.value)}
              placeholder="e.g., 4 hours per day, 20 hours per week"
              className="w-full px-4 py-3 bg-[#F8F9FB] dark:bg-[#0D1117] border border-[#E5E7EB] dark:border-[#2A2F35] rounded-xl text-[#0A0A0A] dark:text-[#FFFFFF] placeholder:text-[#1A1A1A] dark:placeholder:text-[#E4E4E4] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Exam Dates */}
          <div>
            <label className="text-sm font-medium text-[#0A0A0A] dark:text-[#FFFFFF] mb-2 block">Exam Dates (comma-separated)</label>
            <input
              type="text"
              value={examDates}
              onChange={(e) => setExamDates(e.target.value)}
              placeholder="e.g., 2024-01-15, 2024-01-20, 2024-01-25"
              className="w-full px-4 py-3 bg-[#F8F9FB] dark:bg-[#0D1117] border border-[#E5E7EB] dark:border-[#2A2F35] rounded-xl text-[#0A0A0A] dark:text-[#FFFFFF] placeholder:text-[#1A1A1A] dark:placeholder:text-[#E4E4E4] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Goals */}
          <div>
            <label className="text-sm font-medium text-[#0A0A0A] dark:text-[#FFFFFF] mb-2 block">Goals</label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="e.g., Master Data Structures, Score 85%+ in finals, Build strong foundation for placements"
              rows={3}
              className="w-full px-4 py-3 bg-[#F8F9FB] dark:bg-[#0D1117] border border-[#E5E7EB] dark:border-[#2A2F35] rounded-xl text-[#0A0A0A] dark:text-[#FFFFFF] placeholder:text-[#1A1A1A] dark:placeholder:text-[#E4E4E4] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Deadline - REMOVED */}
          {/*
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Deadline</label>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="e.g., 2024-01-30, End of January, 4 weeks from now"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          */}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {saveSuccess && (
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-600 dark:text-green-400 text-sm">Saved to notes successfully!</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 rounded-xl text-white font-semibold transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  Generate Survival Plan
                </>
              )}
            </button>

            {plan && (
              <button
                onClick={handleSaveAsNotes}
                disabled={isSaving}
                className="px-6 py-3.5 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border-2 border-indigo-200 dark:border-indigo-500/30 rounded-xl text-indigo-600 dark:text-indigo-400 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-indigo-600/30 dark:border-indigo-400/30 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save as Notes
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      {plan && (
        <div className="space-y-6">
          {/* Weekly Plan */}
          {plan.weeklyPlan && plan.weeklyPlan.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="neon-card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-neonPurple" />
                <h3 className="text-lg font-bold text-white glow-purple">Weekly Plan</h3>
              </div>
              <div className="space-y-4">
                {plan.weeklyPlan.map((week, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#F8F9FB] dark:bg-[#0D1117] rounded-xl p-5 border border-[#E5E7EB] dark:border-[#2A2F35] transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg">W{week.week}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[#0A0A0A] dark:text-[#FFFFFF] font-semibold mb-3">{week.focus}</h4>
                        {week.tasks && week.tasks.length > 0 && (
                          <ul className="space-y-2 mb-3">
                            {week.tasks.map((task, i) => (
                              <li key={i} className="text-[#1A1A1A] dark:text-[#E4E4E4] text-sm flex items-start gap-2">
                                <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                                <span className="leading-relaxed">{task}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {week.milestones && week.milestones.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {week.milestones.map((milestone, i) => (
                              <span key={i} className="px-3 py-1 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg text-green-600 dark:text-green-400 text-xs font-medium">
                                {milestone}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Daily Schedule */}
          {plan.dailySchedule && plan.dailySchedule.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="neon-card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-neonPink" />
                <h3 className="text-lg font-bold text-white glow-pink">Daily Timetable</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.dailySchedule.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="bg-[#F8F9FB] dark:bg-[#0D1117] rounded-xl p-5 border border-[#E5E7EB] dark:border-[#2A2F35] transition-all duration-300"
                  >
                    <h4 className="text-[#0A0A0A] dark:text-[#FFFFFF] font-semibold mb-4">{day.day}</h4>
                    <div className="space-y-3">
                      {day.timeSlots && day.timeSlots.map((slot, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-indigo-600 dark:text-indigo-400 text-xs font-mono font-semibold flex-shrink-0 mt-0.5">{slot.time}</span>
                          <span className="text-[#1A1A1A] dark:text-[#E4E4E4] text-sm leading-relaxed">{slot.activity}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Skill Roadmap */}
          {plan.skillRoadmap && plan.skillRoadmap.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="neon-card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-neonBlue" />
                <h3 className="text-lg font-bold text-white glow-blue">Skill Roadmap</h3>
              </div>
              <div className="space-y-4">
                {plan.skillRoadmap.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-[#F8F9FB] dark:bg-[#0D1117] rounded-xl p-5 border border-[#E5E7EB] dark:border-[#2A2F35] transition-all duration-300"
                  >
                    <h4 className="text-[#0A0A0A] dark:text-[#FFFFFF] font-medium mb-3">{skill.skill}</h4>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[#1A1A1A] dark:text-[#E4E4E4] text-xs font-medium">Current:</span>
                        <span className="px-3 py-1 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg text-yellow-600 dark:text-yellow-400 text-xs font-medium">
                          {skill.currentLevel}
                        </span>
                      </div>
                      <span className="text-gray-400 dark:text-gray-500">→</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#1A1A1A] dark:text-[#E4E4E4] text-xs font-medium">Target:</span>
                        <span className="px-3 py-1 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg text-green-600 dark:text-green-400 text-xs font-medium">
                          {skill.targetLevel}
                        </span>
                      </div>
                    </div>
                    <p className="text-[#1A1A1A] dark:text-[#E4E4E4] text-sm leading-relaxed">{skill.action}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Revision Plan */}
          {plan.revisionPlan && plan.revisionPlan.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="neon-card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-6 h-6 text-neonPink" />
                <h3 className="text-lg font-bold text-white glow-pink">Revision Strategy</h3>
              </div>
              <div className="space-y-4">
                {plan.revisionPlan.map((phase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-[#F8F9FB] dark:bg-[#0D1117] rounded-xl p-5 border border-[#E5E7EB] dark:border-[#2A2F35] transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[#0A0A0A] dark:text-[#FFFFFF] font-medium mb-2">{phase.phase}</h4>
                        <p className="text-[#1A1A1A] dark:text-[#E4E4E4] text-sm mb-2 leading-relaxed">{phase.focus}</p>
                        <p className="text-[#1A1A1A] dark:text-[#E4E4E4] text-xs">Method: {phase.method}</p>
                      </div>
                      <span className="px-3 py-1.5 bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 rounded-full text-pink-600 dark:text-pink-400 text-xs font-semibold whitespace-nowrap">
                        {phase.duration}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Exam Strategy */}
          {plan.examStrategy && plan.examStrategy.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="neon-card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-neonRed" />
                <h3 className="text-lg font-bold text-white glow-pink">Exam Tactics</h3>
              </div>
              <div className="space-y-4">
                {plan.examStrategy.map((exam, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-[#F8F9FB] dark:bg-[#0D1117] rounded-xl p-5 border border-[#E5E7EB] dark:border-[#2A2F35] transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h4 className="text-[#0A0A0A] dark:text-[#FFFFFF] font-medium">{exam.subject}</h4>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getPriorityColor(exam.priority?.toLowerCase())}`}>
                        {exam.priority}
                      </span>
                    </div>
                    {exam.tactics && exam.tactics.length > 0 && (
                      <ul className="space-y-2">
                        {exam.tactics.map((tactic, i) => (
                          <li key={i} className="text-[#1A1A1A] dark:text-[#E4E4E4] text-sm flex items-start gap-2">
                            <span className="text-red-600 dark:text-red-400">✓</span>
                            <span className="leading-relaxed">{tactic}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Productivity Rules */}
          {plan.productivityRules && plan.productivityRules.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 rounded-2xl shadow-lg border-2 border-green-200 dark:border-green-500/30 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-bold text-[#0A0A0A] dark:text-[#FFFFFF]">Productivity Hacks</h3>
              </div>
              <ul className="space-y-3">
                {plan.productivityRules.map((rule, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3 text-[#0A0A0A] dark:text-[#FFFFFF]"
                  >
                    <span className="text-green-600 dark:text-green-400 mt-1 text-lg">✓</span>
                    <span className="leading-relaxed">{rule}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!plan && !isGenerating && (
        <div className="bg-[#F8F9FB] dark:bg-[#0D1117] rounded-2xl border border-[#E5E7EB] dark:border-[#2A2F35] p-12 text-center transition-all duration-300">
          <Target className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-[#1A1A1A] dark:text-[#E4E4E4] text-sm">
            Fill in your details above to generate a personalized AI survival plan
          </p>
        </div>
      )}
    </div>
  );
}
