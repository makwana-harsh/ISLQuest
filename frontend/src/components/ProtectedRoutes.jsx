import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HeroNavbar from "./HeroNavbar";

function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <HeroNavbar />

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default ProtectedRoutes;