// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, loading } = useAuth();

  if (loading) return null; // Or a spinner: <div>Loading...</div>

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
