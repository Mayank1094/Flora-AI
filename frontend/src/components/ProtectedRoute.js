import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Leaf } from "lucide-react";

function FullScreenLoader() {
  return (
    <div
      data-testid="auth-loading"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background"
    >
      <Leaf className="h-10 w-10 animate-pulse text-primary" />
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Loading FLORAai…
      </p>
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading || user === null) return <FullScreenLoader />;
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

export function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading || user === null) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}
