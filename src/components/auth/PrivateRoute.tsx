import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Loader2 } from "lucide-react";

interface PrivateRouteProps {
  element: React.ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute = ({ element, allowedRoles = [] }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading, hasRole } = useUser();
  const location = useLocation();

  // Show loading spinner while authentication state is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if the user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated, preserving the intended destination
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If no specific roles are required, show the component
  if (allowedRoles.length === 0) {
    return <>{element}</>;
  }

  // Check if the user has any of the allowed roles
  const hasAllowedRole = allowedRoles.some((role) => hasRole(role));

  if (hasAllowedRole) {
    return <>{element}</>;
  }

  // If the user's role is not allowed, redirect to the dashboard
  return <Navigate to="/dashboard" replace />;
};

export default PrivateRoute;
