import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, GraduationCap, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthCard from "@/components/Auth/AuthCard";
import AuthInput from "@/components/Auth/AuthInput";
import PasswordStrength from "@/components/Auth/PasswordStrength";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, signInWithGoogle, createUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    collegeName: "",
    degree: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill data if coming from Google Sign-In
  useEffect(() => {
    if (location.state?.isGoogleSignIn) {
      setFormData(prev => ({
        ...prev,
        email: location.state.email || "",
        fullName: location.state.displayName || ""
      }));
    }
  }, [location.state]);

  const isGoogleSignIn = location.state?.isGoogleSignIn;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic Validation
    if (!formData.fullName.trim() || !formData.collegeName.trim() || !formData.degree.trim()) {
      setError("Please fill in all fields");
      return;
    }

    const age = parseInt(formData.age);
    if (!formData.age || isNaN(age) || age < 16 || age > 100) {
      setError("Please enter a valid age (16-100)");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!isGoogleSignIn) {
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms and Conditions");
      return;
    }

    setLoading(true);

    try {
      let userId;

      if (!isGoogleSignIn) {
        const userCredential = await register(formData.email, formData.password);
        userId = userCredential.user.uid;
      } else {
        const { currentUser } = await signInWithGoogle();
        userId = currentUser.uid;
      }

      await createUserProfile(userId, {
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        collegeName: formData.collegeName.trim(),
        degree: formData.degree.trim(),
        age: parseInt(formData.age)
      });

      navigate("/onboarding");
    } catch (err) {
      console.error("Registration error:", err);
      // Simplify error handling similar to Login
      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered. Please login.");
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      const user = result.user;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/users/${user.uid}`);

      if (response.ok) {
        navigate("/dashboard");
      } else {
        navigate("/register", {
          state: {
            isGoogleSignIn: true,
            email: user.email,
            displayName: user.displayName
          }
        });
      }
    } catch (err) {
      console.error("Google Sign-In error:", err);
      setError("Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Join EduCompanion"
      subtitle={isGoogleSignIn ? "Complete your profile" : "Create your account"}
    >
      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Full Name"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          icon={User}
          disabled={loading}
        />

        <AuthInput
          label="College Name"
          name="collegeName"
          placeholder="Enter your college name"
          value={formData.collegeName}
          onChange={handleChange}
          icon={GraduationCap}
          disabled={loading}
        />

        <div className="grid grid-cols-2 gap-4">
          <AuthInput
            label="Degree"
            name="degree"
            placeholder="e.g. B.Tech"
            value={formData.degree}
            onChange={handleChange}
            icon={GraduationCap}
            disabled={loading}
          />
          <AuthInput
            label="Age"
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            icon={Calendar}
            min="16"
            max="100"
            disabled={loading}
          />
        </div>

        <AuthInput
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          disabled={loading || isGoogleSignIn}
        />

        {!isGoogleSignIn && (
          <>
            <div>
              <AuthInput
                label="Create Password"
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                disabled={loading}
              />
              <PasswordStrength password={formData.password} />
            </div>

            <AuthInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={Lock}
              disabled={loading}
            />
          </>
        )}

        {/* Terms and Conditions */}
        <div className="flex items-start gap-2 pt-2 px-1">
          <div className="relative flex items-center mt-1">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-white/5 checked:bg-violet-500 checked:border-violet-500 transition-all cursor-pointer"
            />
            <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
          </div>
          <label className="text-sm text-white/50 leading-tight">
            I agree to the <span className="text-violet-400 hover:text-violet-300 cursor-pointer transition-colors">Terms of Service</span> and <span className="text-violet-400 hover:text-violet-300 cursor-pointer transition-colors">Privacy Policy</span>.
          </label>
        </div>


        <div className="pt-4 space-y-4">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isGoogleSignIn ? "Completing Profile..." : "Creating Account..."}
              </>
            ) : (
              isGoogleSignIn ? "Complete Profile" : "Create Account"
            )}
          </motion.button>

          {!isGoogleSignIn && (
            <>
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-white/30 text-xs uppercase tracking-wider">Or continue with</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <motion.button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </motion.button>
            </>
          )}
        </div>

        {!isGoogleSignIn && (
          <p className="text-center text-white/40 text-sm pt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-violet-400 hover:text-white transition-colors font-semibold"
            >
              Login here
            </Link>
          </p>
        )}
      </form>
    </AuthCard>
  );
}
