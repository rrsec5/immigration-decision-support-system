import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function SurveyGuard({ children }: { children: ReactNode }) {
  const { isLoggedIn, profileComplete } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!profileComplete) return <Navigate to="/survey" replace />;
  return <>{children}</>;
}
