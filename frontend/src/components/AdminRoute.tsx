import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, token } = useAuth();
    
    console.log("=== AdminRoute Debug Info ===");
    console.log("Current URL:", window.location.pathname);
    console.log("Token exists:", !!token);
    console.log("Token value:", token);
    console.log("User exists:", !!user);
    console.log("User object:", user);
    console.log("User role:", user?.role);
    console.log("Role comparison (user.role === 'admin'):", user?.role === 'admin');
    console.log("Role type:", typeof user?.role);
    console.log("================================");

    // Check if user is authenticated and has admin role
    if (!user || !token) {
        console.log("❌ REDIRECTING: No user or token, redirecting to login");
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        console.log("❌ REDIRECTING: User is not admin, role:", user.role, "redirecting to dashboard");
        return <Navigate to="/dashboard" replace />;
    }

    console.log("✅ ACCESS GRANTED: User is admin, allowing access to admin panel");
    return <Outlet />;
};

export default AdminRoute;