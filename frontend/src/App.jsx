import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Auth/LandingPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

import DashboardPage from "./pages/Dashboard/DashboardPage";
import DictionaryPage from "./pages/Dictionary/DictionaryPage";
import LearnISLPage from "./pages/LearnISL/LearnISLPage"
import ContributePage from "./pages/Contribute/ContributePage";
import ProfilePage from "./pages/Profile/ProfilePage";
import AwarenessPage from "./pages/Awareness/AwarenessPage";

import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

import { useAuth } from "./context/AuthContext";

function Screen({ name }) {
  return <h1>{name}</h1>;
}

function ModeratorScreen() {
  const { user } = useAuth();

  if (user?.role !== "moderator") {
    return <h1>Access Denied</h1>;
  }

  return <Screen name="Moderate" />;
}

function App() {
  return (
    <Routes>

      {/* Public routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/translator" element={<Screen name="Translator" />} />
        <Route path="/dictionary" element={<DictionaryPage />} />
        <Route path="/learn-isl" element={<LearnISLPage />} />
        <Route path="/awareness" element={<AwarenessPage />} />
        <Route path="/contribute" element={<ContributePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/moderate" element={<ModeratorScreen />} />
      </Route>

    </Routes>
  );
}

export default App;