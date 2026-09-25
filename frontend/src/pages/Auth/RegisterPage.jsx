import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../../api/auth.api";
import HandMark from "../../components/HandMark";

import "../../styles/Auth/RegisterPage.style.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    mobileNo: "",
    emailId: "",
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await registerUser({
        ...form,
        fullName: form.fullName.trim(),
        mobileNo: form.mobileNo.trim(),
        emailId: form.emailId.trim(),
        username: form.username.trim(),
      });

      // Registration successful, send the user to log in
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="ui-scope au-shell">
      <aside className="au-aside">
        <div className="au-aside-inner">
          <HandMark size={84} />
          <h1>Join a community that is growing the ISL dictionary together.</h1>
          <p>Learn signs, take quizzes and add signs you know for others to use.</p>

          <div className="au-stickers" aria-hidden="true">
            <span className="au-sticker s1">Hello</span>
            <span className="au-sticker s2">Please</span>
            <span className="au-sticker s3">Family</span>
            <span className="au-sticker s4">Learn</span>
          </div>
        </div>
      </aside>

      <section className="au-panel">
        <div className="au-card au-card--wide">
          <div className="au-mobile-brand">
            <HandMark size={44} />
            <span>Sanket</span>
          </div>

          <h2>Create your account</h2>
          <p className="au-sub">It only takes a minute.</p>

          <form onSubmit={handleSubmit} className="au-form">
            <div className="au-grid">
              <label className="ui-field">
                Full name
                <input
                  className="ui-input"
                  name="fullName"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </label>

              <label className="ui-field">
                Mobile number
                <input
                  className="ui-input"
                  name="mobileNo"
                  type="tel"
                  inputMode="tel"
                  placeholder="Your mobile number"
                  value={form.mobileNo}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                />
              </label>

              <label className="ui-field">
                Email
                <input
                  className="ui-input"
                  name="emailId"
                  type="email"
                  placeholder="you@example.com"
                  value={form.emailId}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </label>

              <label className="ui-field">
                Username
                <input
                  className="ui-input"
                  name="username"
                  placeholder="Pick a username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </label>

              <label className="ui-field au-grid-full">
                Password
                <span className="au-password">
                  <input
                    className="ui-input"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Choose a password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
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
            </div>

            {message && (
              <p className="ui-alert" role="alert">
                {message}
              </p>
            )}

            <button type="submit" className="ui-btn ui-btn--primary ui-btn--block" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="au-switch">
            Already registered? <Link to="/login">Log in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;
