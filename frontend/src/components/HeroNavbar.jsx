// frontend/src/components/HeroNavbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function HeroNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State to manage the "Login Required" Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [targetFeature, setTargetFeature] = useState("");

  const publicPaths = ["/dashboard", "/translator", "/dictionary", "/awareness"];

  const links = [
    ["/dashboard", "Dashboard"],
    ["/translator", "Translator"],
    ["/dictionary", "Dictionary"],
    ["/awareness", "Awareness"],
    ["/learn-isl", "Learn ISL"],
    ["/contribute", "Contribute"],
  ];

  if (user?.role === "moderator") {
    links.push(["/moderate", "Moderate"]);
  }

  const handleLinkClick = (e, path, name) => {
    // If not logged in and trying to access a protected route
    if (!user && !publicPaths.includes(path)) {
      e.preventDefault();
      setTargetFeature(name);
      setModalOpen(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <strong>ISL Quest</strong>
        {" | "}

        {links.map(([path, name]) => (
          <span key={path}>
            <Link
              to={path}
              onClick={(e) => handleLinkClick(e, path, name)}
              style={{ margin: "0 8px" }}
            >
              {name}
            </Link>
            {" | "}
          </span>
        ))}

        {/* Right side authentication status */}
        {user ? (
          <>
            <Link to="/profile" style={{ margin: "0 8px" }}>
              Profile
            </Link>
            <button onClick={handleLogout} style={{ marginLeft: "8px" }}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate("/login")} style={{ marginLeft: "8px" }}>
            Sign In
          </button>
        )}
      </nav>

      {/* Login Required Modal / Popup */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "8px",
              maxWidth: "400px",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Sign In Required</h3>
            <p>
              You need an account to access <strong>{targetFeature}</strong>. Please
              log in or create a new account to continue.
            </p>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => {
                  setModalOpen(false);
                  navigate("/login");
                }}
              >
                Log In
              </button>

              <button
                onClick={() => {
                  setModalOpen(false);
                  navigate("/register");
                }}
              >
                Register
              </button>

              <button
                onClick={() => setModalOpen(false)}
                style={{ background: "#ccc" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HeroNavbar;