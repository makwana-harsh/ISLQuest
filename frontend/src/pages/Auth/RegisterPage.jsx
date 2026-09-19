import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth.api";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    mobileNo: "",
    emailId: "",
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await registerUser(form);

      // Registration successful → Login
      navigate("/login");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="mobileNo"
          placeholder="Mobile Number"
          value={form.mobileNo}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="emailId"
          type="email"
          placeholder="Email"
          value={form.emailId}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </main>
  );
}

export default RegisterPage;