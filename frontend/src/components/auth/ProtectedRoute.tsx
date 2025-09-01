import  React  from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * ProtectedRoute component that controls access to routes based on authentication status
 * 
 * @param children - The components to render if access is granted
 * @param requireAuth - If true, user must be authenticated to access the route (default: true)
 * @param redirectTo - The path to redirect to if access is denied (default: '/auth/sign-in' for protected routes, '/' for auth-only routes)
 */
export function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // If still loading auth state, you could show a loading spinner
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // For protected routes (requireAuth=true)
  if (requireAuth && !isAuthenticated) {
    // Redirect to sign-in page, but save the current location they were trying to access
    return <Navigate to={redirectTo || '/auth/sign-in'} state={{ from: location }} replace />;
  }

  // For auth-only routes (requireAuth=false) like sign-in/sign-up pages
  // Redirect already authenticated users away from these pages
  if (!requireAuth && isAuthenticated) {
    return <Navigate to={redirectTo || '/'} replace />;
  }

  // If all checks pass, render the children
  return <>{children}</>;
}