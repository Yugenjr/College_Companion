import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut 
} from "firebase/auth";
import { auth, googleProvider } from "@/firebase/config";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch or create user profile from backend
        try {
          const response = await fetch(`/api/users/${user.uid}`);
          
          if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await response.json();
              if (data.success && data.user) {
                setUserProfile(data.user);
              }
            }
          } else if (response.status === 404) {
            // User not found in database - create profile
            const createResponse = await fetch("/api/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.displayName || user.email.split('@')[0],
                firebaseUID: user.uid,
                photoURL: user.photoURL || null
              }),
            });
            
            if (createResponse.ok) {
              const data = await createResponse.json();
              if (data.success && data.user) {
                setUserProfile(data.user);
              }
            }
          }
        } catch (error) {
          console.log("Profile fetch/create error:", error.message);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Email/Password Sign In
  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Email/Password Registration
  const register = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Google Sign In with popup
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      // Handle popup blocked error
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Please allow popups for this site to sign in with Google');
      }
      // Handle popup closed error
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign in cancelled');
      }
      // Re-throw other errors
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    setUserProfile(null);
    return signOut(auth);
  };

  // Create or update user profile in MongoDB
  const createUserProfile = async (userId, profileData) => {
    try {
      // Get Firebase auth token
      const token = await currentUser?.getIdToken();
      
      if (!token) {
        throw new Error("Not authenticated. Please login again.");
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/profile/setup`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("❌ Profile setup failed:", data);
        throw new Error(data.message || data.error || "Failed to create user profile");
      }
      
      if (data.success && data.profile) {
        console.log("✅ Profile created successfully:", data.profile);
        setUserProfile(data.profile);
        return data.profile;
      }
      
      throw new Error("Invalid response from server");
    } catch (error) {
      console.error("❌ createUserProfile error:", error);
      throw error;
    }
  };

  // Save onboarding data
  const saveOnboarding = async (userId, onboardingData) => {
    const response = await fetch(`/api/users/${userId}/onboarding`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(onboardingData),
    });
    
    if (!response.ok) {
      throw new Error("Failed to save onboarding data");
    }
    
    const updatedProfile = await response.json();
    setUserProfile(updatedProfile);
    return updatedProfile;
  };

  const value = {
    currentUser,
    userProfile,
    login,
    register,
    signInWithGoogle,
    logout,
    createUserProfile,
    saveOnboarding,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
