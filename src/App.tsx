import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { RoomProvider } from "./contexts/RoomContext";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Onboarding from "./pages/Auth/Onboarding";
import AttendanceAdvisor from "./pages/AttendanceAdvisor";
import SemesterSurvival from "./pages/SemesterSurvival";
import StudyArenaHub from "./pages/StudyArena";
import RoomPage from "./pages/StudyArena/RoomPage.jsx";
import ProgressDashboard from "./pages/ProgressDashboard";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import Landing from "./pages/Landing.jsx";
import Pricing from "./pages/Pricing.jsx";
import NotFound from "./pages/NotFound.jsx";
import FAQ from "./pages/FAQ";
console.log("App loaded");
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <RoomProvider>
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<Landing />} />
              <Route path="/pricing" element={<Pricing />} />
              {/* FAQ page – wildcard ensures trailing slash or nested paths don’t fall through */}
              <Route path="/faq/*" element={<FAQ />} />

              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Onboarding - Protected */}
              <Route path="/onboarding" element={
                <PrivateRoute>
                  <Onboarding />
                </PrivateRoute>
              } />

              {/* Protected Routes - All require authentication */}
              <Route element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/progress" element={<ProgressDashboard />} />
                <Route path="/attendance-advisor" element={<AttendanceAdvisor />} />
                <Route path="/semester-survival" element={<SemesterSurvival />} />
                <Route path="/study-arena" element={<StudyArenaHub />} />
                <Route path="/study-arena/room/:roomCode" element={<RoomPage />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Catch all - Show 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RoomProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
