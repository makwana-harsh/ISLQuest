import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import HandMark from "../../components/HandMark";

import "../../styles/Auth/LoginPage.style.css";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await login({ username: username.trim(), password });

      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Check your details and try again.");
      setLoading(false);
    }
  };

  return (
    <main className="ui-scope au-shell">
      <aside className="au-aside">
        <div className="au-aside-inner">
          <HandMark size={84} />
          <h1>Learn Indian Sign Language at your own pace.</h1>
          <p>Lessons, a searchable dictionary and a live translator, all in one place.</p>

          <div className="au-stickers" aria-hidden="true">
            <span className="au-sticker s1">Thank you</span>
            <span className="au-sticker s2">Water</span>
            <span className="au-sticker s3">Friend</span>
            <span className="au-sticker s4">Welcome</span>
          </div>
        </div>
      </aside>

      <section className="au-panel">
        <div className="au-card">
          <div className="au-mobile-brand">
            <HandMark size={44} />
            <span>Sanket</span>
          </div>

          <h2>Welcome back</h2>
          <p className="au-sub">Log in to pick up your lessons.</p>

          <form onSubmit={handleSubmit} className="au-form">
            <label className="ui-field">
              Username
              <input
                className="ui-input"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </label>

            <label className="ui-field">
              Password
              <span className="au-password">
                <input
                  className="ui-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="au-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
            </label>

            {message && (
              <p className="ui-alert" role="alert">
                {message}
              </p>
            )}

            <button type="submit" className="ui-btn ui-btn--primary ui-btn--block" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="au-switch">
            New to Sanket? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
