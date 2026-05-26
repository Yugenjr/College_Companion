import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, Eye, EyeOff, ChevronRight, Sparkles, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthCard from "@/components/Auth/AuthCard";
import AuthInput from "@/components/Auth/AuthInput";

export default function Login() {
  const navigate = useNavigate();
  const { login, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Clear error when form changes
  useEffect(() => {
    if (error && (formData.email || formData.password)) {
      setError("");
    }
  }, [formData.email, formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      // Enhanced error handling with better messages
      if (err.code === "auth/invalid-credential" || err.code === "auth/invalid-email") {
        setError("Invalid email or password. Please check your credentials.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email. Please sign up first.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Try again or reset your password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Account temporarily locked due to too many failed attempts. Try again in 15 minutes.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(err.message || "Failed to login. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithGoogle();
      const user = result.user;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users/${user.uid}`);

      if (!response.ok) {
        navigate("/register", {
          state: {
            isGoogleSignIn: true,
            email: user.email,
            displayName: user.displayName
          }
        });
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google sign in error:", err);
      setError(err.code === "auth/popup-closed-by-user" 
        ? "Sign in was cancelled. Please try again." 
        : "Failed to sign in with Google. Please try again."
      );
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!formData.password) return { text: "", color: "" };
    const length = formData.password.length;
    if (length < 6) return { text: "Weak", color: "text-red-400" };
    if (length < 10) return { text: "Medium", color: "text-yellow-400" };
    return { text: "Strong", color: "text-green-400" };
  };

  const passwordStrength = getPasswordStrength();

  // Validate email format
  const isValidEmail = () => {
    if (!formData.email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email);
  };

  return (
    <AuthCard
      title={
        <div className="flex items-center gap-2">
          <span>Welcome Back</span>
          <Sparkles className="w-5 h-5 text-violet-400" />
        </div>
      }
      subtitle="Sign in to continue your learning journey"
      headerIcon={<Shield className="w-8 h-8 text-violet-400" />}
    >
      {/* Animated Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mb-6 bg-gradient-to-r from-red-500/10 via-red-500/5 to-red-500/10 border border-red-500/30 backdrop-blur-sm text-red-100 px-4 py-3 rounded-xl text-sm flex items-start gap-3 shadow-lg shadow-red-500/10"
          >
            <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Login Failed</p>
              <p className="text-red-200/80 text-sm mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-300 hover:text-white transition-colors p-1"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          {/* Email Input - Improved Visibility */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="email" className="block text-sm font-medium text-white/90">
                Email Address
              </label>
              {formData.email && isValidEmail() && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-green-400 flex items-center gap-1"
                >
                  <span>✓</span> Valid format
                </motion.span>
              )}
            </div>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="relative"
            >
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your.email@college.edu"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
                required
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {formData.email && !isValidEmail() && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400"
                >
                  !
                </motion.div>
              )}
            </motion.div>
            {formData.email && !isValidEmail() && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-yellow-400"
              >
                Please enter a valid email address
              </motion.p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-white/90">
                Password
              </label>
              {formData.password && (
                <span className={`text-xs ${passwordStrength.color}`}>
                  {passwordStrength.text}
                </span>
              )}
            </div>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="relative"
            >
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
                required
                className="w-full pl-10 pr-12 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </motion.div>

            {/* Password strength indicator */}
            {formData.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 space-y-1"
              >
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: formData.password.length >= 12 ? '100%' : 
                            formData.password.length >= 8 ? '66%' : 
                            formData.password.length >= 6 ? '33%' : '0%'
                    }}
                    className={`h-full ${
                      formData.password.length >= 12 ? 'bg-green-500' :
                      formData.password.length >= 8 ? 'bg-yellow-500' :
                      formData.password.length >= 6 ? 'bg-red-500' : ''
                    }`}
                  />
                </div>
                <p className="text-xs text-white/60">
                  {formData.password.length < 6 
                    ? "Password should be at least 6 characters" 
                    : formData.password.length < 8
                    ? "Good! Try adding more characters"
                    : formData.password.length < 12
                    ? "Strong password"
                    : "Excellent password strength"
                  }
                </p>
              </motion.div>
            )}

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between mt-4 px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center"
                >
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border border-white/30 rounded-lg bg-white/10 checked:bg-gradient-to-r checked:from-violet-600 checked:to-fuchsia-600 checked:border-transparent transition-all duration-200"
                  />
                  <motion.div
                    initial={false}
                    animate={{ scale: rememberMe ? 1 : 0 }}
                    className="absolute inset-0 flex items-center justify-center text-white pointer-events-none"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                </motion.div>
                <span className="text-sm text-white/70 group-hover:text-white transition-colors">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent hover:from-violet-300 hover:to-fuchsia-300 transition-all duration-300 flex items-center gap-1 group"
              >
                Forgot Password?
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-2">
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            type="submit"
            disabled={loading || !isValidEmail() || !formData.password}
            className="relative w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
          >
            {/* Animated background effect */}
            <motion.div
              animate={isHovered ? { scale: 2 } : { scale: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100"
            />
            
            {/* Button content */}
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </span>
          </motion.button>

          {/* Divider with animation */}
          <motion.div 
            className="relative flex items-center py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="flex-shrink-0 mx-4 text-white/30 text-xs uppercase tracking-wider font-medium px-2 py-1 bg-white/5 rounded-lg">
              Or continue with
            </span>
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </motion.div>

          <motion.button
            type="button"
            onClick={handleGoogleSignIn}
            whileHover={{ scale: loading ? 1 : 1.02, y: -1 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 group/google relative overflow-hidden"
          >
            {/* Subtle hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/google:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <span>Continue with Google</span>
            </div>
          </motion.button>
        </div>

        {/* Registration Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center pt-6 pb-2"
        >
          <p className="text-white/40 text-sm">
            New to College Companion?{" "}
            <Link 
              to="/register" 
              className="relative bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent hover:from-violet-300 hover:to-fuchsia-300 transition-all duration-300 font-semibold group"
            >
              Create Account
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-violet-400 to-fuchsia-400 group-hover:w-full transition-all duration-300" />
            </Link>
          </p>
        </motion.div>

        {/* Security Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center pt-2"
        >
          <p className="text-white/20 text-xs flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            Your login is secured with industry-standard encryption
          </p>
        </motion.div>
      </form>
    </AuthCard>
  );
}