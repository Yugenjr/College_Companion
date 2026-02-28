import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  Heart,
  MapPin,
  GraduationCap,
  AlertCircle,
  Loader2,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Onboarding() {
  const navigate = useNavigate();
  const { saveOnboarding, currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    semester: "",
    difficultSubject: "",
    helpArea: "",
    hobbies: "",
    homeDistance: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalSteps = 5;

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleNext = () => {
    // Validate current step
    const currentFieldName = Object.keys(formData)[currentStep - 1];
    const currentValue = formData[currentFieldName];

    if (!currentValue || (typeof currentValue === "string" && !currentValue.trim())) {
      setError("Please answer this question before continuing");
      return;
    }

    if (currentFieldName === "studyHours") {
      const hours = parseInt(currentValue);
      if (isNaN(hours) || hours < 0 || hours > 24) {
        setError("Please enter a valid number between 0 and 24");
        return;
      }
    }

    setError("");
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const handleSubmit = async () => {
    // Validate last question
    if (!formData.homeDistance) {
      setError("Please enter the distance");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await saveOnboarding(currentUser.uid, {
        semester: parseInt(formData.semester),
        difficultSubject: formData.difficultSubject.trim(),
        helpArea: formData.helpArea.trim(),
        hobbies: formData.hobbies.trim(),
        homeDistance: formData.homeDistance.trim()
      });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Onboarding save error:", err);
      setError("Failed to save your responses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <GraduationCap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Which semester are you in?</h2>
                <p className="text-white/40 text-sm">Help us tailor your experience</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <motion.button
                  key={sem}
                  type="button"
                  onClick={() => handleChange("semester", sem.toString())}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-4 rounded-lg font-semibold transition ${formData.semester === sem.toString()
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                      : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                    }`}
                >
                  {sem}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-500/20 rounded-full">
                <BookOpen className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">What's your most difficult subject?</h2>
                <p className="text-white/40 text-sm">We'll provide extra support for this</p>
              </div>
            </div>
            <input
              type="text"
              value={formData.difficultSubject}
              onChange={(e) => handleChange("difficultSubject", e.target.value)}
              placeholder="e.g., Data Structures, Calculus, Quantum Physics"
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Which area do you need the most help in?</h2>
                <p className="text-white/40 text-sm">Let us know where to focus</p>
              </div>
            </div>
            <input
              type="text"
              value={formData.helpArea}
              onChange={(e) => handleChange("helpArea", e.target.value)}
              placeholder="e.g., Time management, Project work, Exam preparation"
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-500/20 rounded-full">
                <Heart className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">What are your hobbies?</h2>
                <p className="text-white/40 text-sm">All work and no play makes learning dull</p>
              </div>
            </div>
            <input
              type="text"
              value={formData.hobbies}
              onChange={(e) => handleChange("hobbies", e.target.value)}
              placeholder="e.g., Gaming, Reading, Music, Sports, Coding"
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-pink-500/20 rounded-full">
                <MapPin className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Distance between home and college?</h2>
                <p className="text-gray-400 text-sm">Helps us understand your commute</p>
              </div>
            </div>
            <input
              type="text"
              value={formData.homeDistance}
              onChange={(e) => handleChange("homeDistance", e.target.value)}
              placeholder="e.g., 5 km, 30 minutes, Same city"
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Onboarding Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl"
      >
        <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-10 shadow-2xl border border-white/10 overflow-hidden relative group font-outfit">
          {/* Hover Glow Effect */}
          <div className="absolute -inset-24 bg-blue-600/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-white/40">Question {currentStep} of {totalSteps}</span>
              <span className="text-sm font-bold text-blue-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </motion.div>
          )}

          {/* Question */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderQuestion()}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-10">
            {currentStep > 1 && (
              <motion.button
                type="button"
                onClick={handlePrevious}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Previous
              </motion.button>
            )}

            {currentStep < totalSteps ? (
              <motion.button
                type="button"
                onClick={handleNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 uppercase tracking-wider text-sm"
              >
                Next Step
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-wider text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Complete Setup
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
