import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name : "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Adjust this URL to match your Express auth route.
      const response = await api.post("/auth/register", form);

      // If registration also returns a token, log the user in.
      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        navigate("/home");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="brand">Senti<span>Scope</span></div>
        <p className="eyebrow">CREATE YOUR ACCOUNT</p>
        <h1>Join SentiScope</h1>
        <p className="muted">Analyze reviews with machine learning.</p>

        {error && <div className="error-box">{error}</div>}

        <label htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          minLength={8}
          value={form.password}
          onChange={handleChange}
          required
        />

        <button className="primary-btn" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-footer">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}