import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Adjust this URL and response field to your backend.
      const response = await api.post("/auth/login", form);
      const token = response.data.token;

      if (!token) {
        throw new Error("Your login API did not return a JWT token.");
      }

      localStorage.setItem("token", token);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="brand">Senti<span>Scope</span></div>
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Log in</h1>
        <p className="muted">Continue exploring movie sentiment.</p>

        {error && <div className="error-box">{error}</div>}

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Your password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        <button className="primary-btn" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </main>
  );
}