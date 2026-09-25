// frontend/src/components/HeroNavbar.jsx
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import HandMark from "./HandMark";

import "../styles/Components/HeroNavbar.style.css";

const PUBLIC_PATHS = ["/dashboard", "/translator", "/dictionary", "/awareness"];

function LockIcon() {
  return (
    <svg className="nb-lock" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2.5" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  );
}

function HeroNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // "Login required" modal
  const [modalOpen, setModalOpen] = useState(false);
  const [targetFeature, setTargetFeature] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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
    setMenuOpen(false);

    // Not logged in and trying to open a protected page
    if (!user && !PUBLIC_PATHS.includes(path)) {
      e.preventDefault();
      setTargetFeature(name);
      setModalOpen(true);
    }
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    setLoggingOut(true);

    try {
      await logout();
    } finally {
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  const goTo = (path) => {
    setModalOpen(false);
    setMenuOpen(false);
    navigate(path);
  };

  // Escape closes the modal / mobile menu
  useEffect(() => {
    if (!modalOpen && !menuOpen) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") {
        setModalOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modalOpen, menuOpen]);

  const initial = (user?.fullName || user?.username || "?").trim().charAt(0).toUpperCase();

  return (
    <>
      <header className="ui-scope nb-bar">
        <div className="nb-inner">
          <Link to="/dashboard" className="nb-brand" onClick={() => setMenuOpen(false)}>
            <HandMark size={38} />
            <span>ISLQuest</span>
          </Link>

          <nav
            id="nb-links"
            className={`nb-links ${menuOpen ? "is-open" : ""}`}
            aria-label="Main navigation"
          >
            {links.map(([path, name]) => (
              <NavLink
                key={path}
                to={path}
                onClick={(e) => handleLinkClick(e, path, name)}
                className={({ isActive }) => `nb-link ${isActive ? "is-active" : ""}`}
              >
                {name}
                {!user && !PUBLIC_PATHS.includes(path) && <LockIcon />}
              </NavLink>
            ))}

            {/* Account actions repeat inside the mobile menu */}
            <div className="nb-account nb-account--menu">
              {user ? (
                <>
                  <Link to="/profile" className="nb-link" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                  <button type="button" className="ui-btn ui-btn--sm" onClick={handleLogout} disabled={loggingOut}>
                    {loggingOut ? "Logging out..." : "Log out"}
                  </button>
                </>
              ) : (
                <button type="button" className="ui-btn ui-btn--sm ui-btn--primary" onClick={() => goTo("/login")}>
                  Sign in
                </button>
              )}
            </div>
          </nav>

          <div className="nb-account nb-account--desktop">
            {user ? (
              <>
                <Link to="/profile" className="nb-profile" title="Your profile">
                  <span className="nb-avatar">{initial}</span>
                  <span className="nb-profile-name">{user.username || "Profile"}</span>
                </Link>
                <button type="button" className="ui-btn ui-btn--sm" onClick={handleLogout} disabled={loggingOut}>
                  {loggingOut ? "Logging out..." : "Log out"}
                </button>
              </>
            ) : (
              <button type="button" className="ui-btn ui-btn--sm ui-btn--primary" onClick={() => goTo("/login")}>
                Sign in
              </button>
            )}
          </div>

          <button
            type="button"
            className="nb-burger"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="nb-links"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Login required modal */}
      {modalOpen && (
        <div
          className="ui-scope ui-modal-backdrop nb-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <div className="ui-modal nb-modal" role="dialog" aria-modal="true" aria-labelledby="nb-modal-title">
            <HandMark size={56} />
            <h2 id="nb-modal-title">Sign in to open {targetFeature}</h2>
            <p>
              {targetFeature} is for registered learners. Log in, or create a free account to start.
            </p>

            <div className="nb-modal-actions">
              <button type="button" className="ui-btn ui-btn--primary" onClick={() => goTo("/login")}>
                Log in
              </button>
              <button type="button" className="ui-btn" onClick={() => goTo("/register")}>
                Create account
              </button>
            </div>

            <button type="button" className="nb-modal-cancel" onClick={() => setModalOpen(false)}>
              Not now
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default HeroNavbar;
