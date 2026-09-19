import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function HeroNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    ["/dashboard", "Dashboard"],
    ["/translator", "Translator"],
    ["/dictionary", "Dictionary"],
    ["/learn-isl", "Learn ISL"],
    ["/awareness", "Awareness"],
    ["/contribute", "Contribute"],
  ];

  if (user?.role === "moderator") {
    links.push(["/moderate", "Moderate"]);
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav>
      <strong>ISL Sanket</strong>

      {" | "}

      {links.map(([path, name]) => (
        <Link key={path} to={path}>
          {name}
        </Link>
      ))}

      {" | "}

      <Link to="/profile">Profile</Link>

      {" "}

      <button onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default HeroNavbar;