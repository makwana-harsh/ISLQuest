// frontend/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

import DashboardPage from "./pages/Dashboard/DashboardPage";
import DictionaryPage from "./pages/Dictionary/DictionaryPage";
import LearnISLPage from "./pages/LearnISL/LearnISLPage";
import ContributePage from "./pages/Contribute/ContributePage";
import ProfilePage from "./pages/Profile/ProfilePage";
import AwarenessPage from "./pages/Awareness/AwarenessPage";
import TranlatorPage from "./pages/Translator/TranslatorPage";
import ModeratorPage from "./pages/Moderator/ModeratorPage";

import MainLayout from "./components/MainLayout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

import { useAuth } from "./context/AuthContext";

function ModeratorScreen() {
  const { user } = useAuth();

  if (user?.role !== "moderator") {
    return <h1>Access Denied</h1>;
  }

  return <ModeratorPage />;
}

function App() {
  return (
    <Routes>
      {/* 1. Root redirect: Visiting "/" immediately opens Dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 2. Auth-only routes (Only accessible when logged out) */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* 3. Main App Layout (Visible to everyone) */}
      <Route element={<MainLayout />}>
        {/* Guest-accessible routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/translator" element={<TranlatorPage />} />
        <Route path="/dictionary" element={<DictionaryPage />} />
        <Route path="/awareness" element={<AwarenessPage />} />

        {/* Protected routes (Login required) */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/learn-isl" element={<LearnISLPage />} />
          <Route path="/contribute" element={<ContributePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/moderate" element={<ModeratorScreen />} />
        </Route>
      </Route>

      {/* 4. Catch-all: Any invalid URL redirects to /dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;