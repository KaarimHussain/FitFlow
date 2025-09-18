
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { token, user } = useAuth();

    console.log("=== ProtectedRoute Debug Info ===");
    console.log("Current URL:", window.location.pathname);
    console.log("Token exists:", !!token);
    console.log("User exists:", !!user);
    console.log("User role:", user?.role);
    console.log("================================");

    // If not authenticated, redirect to login
    if (!token) {
        console.log("❌ REDIRECTING: No token, redirecting to login");
        return <Navigate to="/login" replace />;
    }

    // If user is admin, redirect to admin panel
    if (user?.role === 'admin') {
        console.log("❌ REDIRECTING: Admin user trying to access user routes, redirecting to admin panel");
        return <Navigate to="/admin" replace />;
    }

    // If regular user, allow access
    console.log("✅ ACCESS GRANTED: Regular user accessing user routes");
    return <Outlet />;
};

export default ProtectedRoute;
