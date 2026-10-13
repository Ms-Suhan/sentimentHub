import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadHistory = async () => {
    try {
      const response = await api.get("/predictions");
      setHistory(response.data.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const analyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post("/predictions", { text });
      const prediction = response.data.data;

      setResult(prediction);
      setText("");
      await loadHistory();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Could not analyze the review."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const sentiment = result?.sentiment?.toLowerCase();
  const confidence = Number(result?.confidence);

  return (
    <main className="dashboard">
      <nav className="navbar">
        <div className="brand">Sentimental<span>Hub</span></div>
        <button className="secondary-btn" onClick={logout}>
          Log out
        </button>
      </nav>

      <section className="hero">
        <p className="eyebrow">AI-POWERED REVIEW ANALYSIS</p>
        <h1>Every review has a <span>feeling.</span></h1>
        <p className="muted">
          Discover whether a movie review expresses positive or negative sentiment.
        </p>
      </section>

      <section className="workspace">
        <div className="panel">
          <h2>Analyze a review</h2>
          <p className="muted">
            Paste a movie review below to see what your model predicts.
          </p>

          <form onSubmit={analyze}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Example: The acting was fantastic and the story kept me engaged..."
              maxLength={10000}
              required
            />

            <div className="input-footer">
              <span className="muted">{text.length}/10,000 characters</span>
              <button
                className="primary-btn analyze-btn"
                disabled={loading || !text.trim()}
              >
                {loading ? "Analyzing..." : "Analyze sentiment →"}
              </button>
            </div>
          </form>

          {error && <div className="error-box">{error}</div>}

          {result && (
            <div className="result-card">
              <p className="eyebrow">PREDICTION RESULT</p>
              <div className="result-row">
                <h2 className={sentiment === "positive" ? "positive" : "negative"}>
                  {result.sentiment}
                </h2>
                {Number.isFinite(confidence) && (
                  <span className="confidence">
                    {(confidence <= 1
                      ? confidence * 100
                      : confidence
                    ).toFixed(1)}% confidence
                  </span>
                )}
              </div>
              <p className="muted">{result.text}</p>
            </div>
          )}
        </div>

        <aside className="side-panel">
          <div className="stat-icon">✳</div>
          <h3>Your sentiment lab</h3>
          <p className="muted">
            Submit different reviews and compare how your trained model responds.
          </p>
          <div className="mini-stat">
            <span>Reviews in history</span>
            <strong>{history.length}</strong>
          </div>
        </aside>
      </section>

      <section className="history-section">
        <div className="history-heading">
          <div>
            <p className="eyebrow">YOUR ACTIVITY</p>
            <h2>Recent predictions</h2>
          </div>
          <button className="secondary-btn" onClick={loadHistory}>
            Refresh
          </button>
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <p>No predictions yet.</p>
            <span className="muted">Your analyzed reviews will appear here.</span>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <article className="history-item" key={item._id}>
                <div className="history-text">
                  <p>{item.text}</p>
                  <span className="muted">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : ""}
                  </span>
                </div>
                <span
                  className={`sentiment-tag ${
                    item.sentiment?.toLowerCase() === "positive"
                      ? "tag-positive"
                      : "tag-negative"
                  }`}
                >
                  {item.sentiment}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}