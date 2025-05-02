import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";

interface PrivateRouteProps {
  element: React.ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute = ({ element, allowedRoles = [] }: PrivateRouteProps) => {
  const { isAuthenticated, userRole } = useUser();
  const location = useLocation();

  // Check if the user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated, preserving the intended destination
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If no specific roles are required or if the user role is in the allowed roles, show the component
  if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
    return <>{element}</>;
  }

  // If the user's role is not allowed, redirect to the dashboard
  return <Navigate to="/dashboard" replace />;
};

export default PrivateRoute;