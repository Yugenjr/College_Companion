import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Copy, Check, Save, AlertCircle, Sparkles } from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import API from "@/services/api";
import { addActivity, ACTIVITY_TYPES } from "@/services/progressService";

export default function QuestionGenerator() {
  const { currentUser } = useAuth();
  const [syllabus, setSyllabus] = useState("");
  const [questionType, setQuestionType] = useState("2m");
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const questionTypes = [
    { value: "2m", label: "2 Marks Questions" },
    { value: "3m", label: "3 Marks Questions" },
    { value: "14m", label: "14 Marks Questions" },
    { value: "16m", label: "16 Marks Questions" },
  ];

  const handleGenerate = async () => {
    if (!syllabus.trim()) {
      setError("Please enter syllabus content");
      return;
    }

    if (!currentUser) {
      setError("Please login to generate questions");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setQuestions([]);

    try {
      const data = await API.generateQuestions({
        syllabus: syllabus.trim(),
        questionType,
        userId: currentUser.uid,
      });

      if (data.success && data.questions) {
        // Extract question text from objects
        const questionTexts = data.questions.map(q =>
          typeof q === 'string' ? q : q.question || JSON.stringify(q)
        );
        setQuestions(questionTexts);

        // Track progress
        addActivity(ACTIVITY_TYPES.QUESTION_GENERATED, {
          topic: syllabus.substring(0, 50) + (syllabus.length > 50 ? '...' : ''),
          questionType,
          count: questionTexts.length,
          tool: 'Question Generator',
        });
      } else {
        throw new Error("No questions generated");
      }

    } catch (err) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate questions. Please ensure you are logged in and backend is running.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAsNotes = async () => {
    if (!currentUser) {
      setError("Please login to save notes");
      return;
    }

    if (questions.length === 0) {
      setError("No questions to save");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const data = await API.createNote({
        userId: currentUser.uid,
        title: `${questionType.toUpperCase()} Questions - ${new Date().toLocaleDateString()}`,
        content: questions.join('\n\n'),
        tags: [questionType, 'generated-questions'],
        type: 'question-generator',
      });

      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }

    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save notes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header with Glow */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-[#3b82f6] drop-shadow-[0_0_10px_rgba(59,130,246,0.6)] dark:drop-shadow-[0_0_12px_rgba(59,130,246,0.9)] mb-2">
          Question Generator
        </h1>
        <p className="text-[#1A1A1A] dark:text-[#E4E4E4]">
          Generate exam questions powered by Groq AI
        </p>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Success Alert */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 flex items-start gap-3"
        >
          <Check className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
          <p className="text-sm text-green-700 dark:text-green-300">Questions saved successfully!</p>
        </motion.div>
      )}

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="neon-card p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <img
            src={logo}
            alt="College Companion"
            className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(59,130,246,0.5)]"
          />
          <div>
            <h2 className="text-xl font-semibold text-white glow-blue">Question Generator</h2>
            <p className="text-sm text-white/70">Powered by Groq AI</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Syllabus Input */}
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] dark:text-[#FFFFFF] mb-2">
              Syllabus Content
            </label>
            <textarea
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              placeholder="Paste your syllabus here... (e.g., Data Structures: Arrays, Linked Lists, Stacks, Queues, Trees, Binary Search Trees, Graphs, Hash Tables, Sorting and Searching Algorithms...)"
              rows={6}
              className="w-full px-4 py-3 bg-[#F8F9FB] dark:bg-[#0D1117] border border-[#E5E7EB] dark:border-[#2A2F35] rounded-xl text-sm text-[#0A0A0A] dark:text-[#FFFFFF] placeholder:text-[#1A1A1A] dark:placeholder:text-[#E4E4E4] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Question Type Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] dark:text-[#FFFFFF] mb-2">
                Question Type
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8F9FB] dark:bg-[#0D1117] border border-[#E5E7EB] dark:border-[#2A2F35] rounded-xl text-sm text-[#0A0A0A] dark:text-[#FFFFFF] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
              >
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !syllabus.trim()}
                className="w-full px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-700 dark:disabled:to-gray-800 rounded-xl text-white text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Questions
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      {questions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neon-card p-6"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-neonBlue" />
              <h2 className="text-xl font-semibold text-white glow-blue">
                Generated Questions
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#1A1A1A] dark:text-[#E4E4E4] bg-[#F8F9FB] dark:bg-[#0D1117] px-4 py-2 rounded-lg font-medium">
                {questionTypes.find(t => t.value === questionType)?.label}
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg font-medium">
                {questions.length} questions
              </span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#F8F9FB] dark:bg-[#0D1117] rounded-xl p-4 hover:shadow-md hover:bg-[#F8F9FB] dark:hover:bg-[#0D1117] transition-all duration-200 group border border-[#E5E7EB] dark:border-[#2A2F35]"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-200 dark:border-blue-800">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#0A0A0A] dark:text-[#FFFFFF] text-sm leading-relaxed whitespace-pre-wrap">
                      {question}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(question, index)}
                    className="shrink-0 w-8 h-8 rounded-lg bg-[#F8F9FB] dark:bg-[#0D1117] hover:bg-[#E5E7EB] dark:hover:bg-[#2A2F35] flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Copy question"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#1A1A1A] dark:text-[#E4E4E4]" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-[#E5E7EB] dark:border-[#2A2F35]">
            <button
              onClick={handleSaveAsNotes}
              disabled={isSaving}
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-700 dark:disabled:to-gray-800 rounded-xl text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save as Notes
                </>
              )}
            </button>
            <button
              className="px-6 py-3 bg-[#F8F9FB] dark:bg-[#0D1117] hover:bg-[#E5E7EB] dark:hover:bg-[#111418] rounded-xl text-[#0A0A0A] dark:text-[#FFFFFF] text-sm font-semibold transition-all duration-200 border border-[#E5E7EB] dark:border-[#2A2F35]"
            >
              Export as PDF
            </button>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {questions.length === 0 && !isGenerating && (
        <div className="bg-white dark:bg-[#111418] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-none p-12 text-center border border-[#E5E7EB] dark:border-[#2A2F35] transition-all duration-300">
          <img
            src={logo}
            alt="College Companion"
            className="w-16 h-16 object-contain mx-auto mb-4 opacity-50"
          />
          <p className="text-[#1A1A1A] dark:text-[#E4E4E4] text-base mb-2 font-medium">
            Ready to generate questions
          </p>
          <p className="text-[#1A1A1A] dark:text-[#E4E4E4] text-sm">
            Enter your syllabus content and click "Generate Questions" to get started
          </p>
        </div>
      )}
    </div>
  );
}
