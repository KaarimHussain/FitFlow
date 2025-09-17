import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { NotificationProvider } from "./context/notification-context";
import { NotificationContainer } from "./components/ui/notification-container";
import { AuthProvider } from "./context/AuthContext";

import Home from "./views/Home";
import { Navbar } from "@/components/Navbar";
import SignUp from "@/views/Auth/Sign-up";
import SignIn from "@/views/Auth/Sign-in";
import Profile from "./views/User/Profile";
import Dashboard from "./views/User/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoutes from "./components/AuthRoutes";
import RecipeDatabase from "./views/Public/RecipeDatabase";

// Import new feature pages
import WorkoutTracker from "./views/User/Workouts/WorkoutTracker";
import NutritionTracker from "./views/User/Nutrition/NutritionTracker";
import ProgressTracker from "./views/User/Progress/ProgressTracker";
import ForgetPassword from "./views/Auth/ForgetPassword";

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <NotificationProvider>
        <AuthProvider>
          <Navbar />
          <NotificationContainer />
          <Routes>

            {/* Auth Routes - Accessible only when NOT logged in */}
            <Route element={<AuthRoutes />}>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/auth/forgot-password" element={<ForgetPassword />} />
            </Route>

            {/* Protected Routes - Require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/workouts" element={<WorkoutTracker />} />
              <Route path="/nutrition" element={<NutritionTracker />} />
              <Route path="/progress" element={<ProgressTracker />} />
            </Route>

            {/* Public Routes */}
            <Route path="/recipes" element={<RecipeDatabase />} />
          </Routes>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App