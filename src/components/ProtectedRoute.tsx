import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "student";
}

const ProtectedRoute = ({
  children,
  requiredRole = "admin",
}: ProtectedRouteProps) => {
  const { isAdmin, isStudent, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  if (requiredRole === "student" && !isStudent) {
    return <Navigate to="/student-login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
