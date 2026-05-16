import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import {
  ProtectedRoute,
  SurveyGuard,
} from "./components/layout/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

import { CountriesPage } from "./pages/CountriesPage";
import { CountryDetailPage } from "./pages/CountryDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SurveyPage } from "./pages/SurveyPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  const { isLoggedIn, profileComplete } = useAuth();

  return (
    <Routes>
      {/* Public auth pages — no navbar */}
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={
          isLoggedIn ? (
            <Navigate to={profileComplete ? "/" : "/survey"} replace />
          ) : (
            <RegisterPage />
          )
        }
      />

      {/* Survey — only for logged-in users */}
      <Route
        path="/survey"
        element={
          <ProtectedRoute>
            <SurveyPage isEditing={false} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/survey/edit"
        element={
          <ProtectedRoute>
            <Layout>
              <SurveyPage isEditing={true} />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Main app with navbar */}
      <Route
        path="/"
        element={
          <Layout>
            <CountriesPage />
          </Layout>
        }
      />
      <Route
        path="/countries/:id"
        element={
          <Layout>
            <CountryDetailPage />
          </Layout>
        }
      />

      <Route
        path="/recommendations"
        element={
          <SurveyGuard>
            <Layout>
              <RecommendationsPage />
            </Layout>
          </SurveyGuard>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
