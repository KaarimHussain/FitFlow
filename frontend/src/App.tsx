import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { NotificationProvider } from "./context/notification-context";
import { NotificationContainer } from "./components/ui/notification-container";
import { AuthProvider } from "./context/auth-context";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

import Home from "./views/Home";
import { Navbar } from "@/components/Navbar";
import SignUp from "@/views/Auth/Sign-up";
import SignIn from "@/views/Auth/Sign-in";
import Profile from "./views/User/Profile";
import Dashboard from "./views/User/Dashboard";


function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <NotificationProvider>
          <Navbar />
          <NotificationContainer />
          <Routes>
            {/* Base Route */}
            <Route path="/" element={<Home />} />

            {/* Auth Routes - Accessible only when NOT logged in */}
            <Route
              path="/auth/sign-up"
              element={
                <ProtectedRoute requireAuth={false} redirectTo="/">
                  <SignUp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth/sign-in"
              element={
                <ProtectedRoute requireAuth={false} redirectTo="/">
                  <SignIn />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Require authentication */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
