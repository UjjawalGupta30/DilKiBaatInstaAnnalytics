"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.message || "Login failed");
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brandmark">dkb</div>
        <p className="eyebrow">PRIVATE CONTENT STUDIO</p>
        <h1>Dil Ki Baat AI</h1>
        <p className="muted">Sign in to review and approve content.</p>
        <form onSubmit={submit} className="auth-form">
          <label htmlFor="password">Dashboard password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error ? <p className="error-text">{error}</p> : null}
          <button className="primary full" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
