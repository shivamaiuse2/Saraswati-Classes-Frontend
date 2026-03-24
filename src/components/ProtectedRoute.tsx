import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
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
