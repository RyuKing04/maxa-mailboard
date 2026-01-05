"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
  setError(data?.error || "Login failed");
  return;
}

if (data?.role === "ADMIN") {
  router.push("/admin");
} else {
  router.push("/dashboard");
}
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b0b0b",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 28,
          border: "1px solid #333",
          borderRadius: 14,
          background: "#111",
        }}
      >
        <h1 style={{ marginBottom: 20 }}>Login</h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
              style={{
                padding: 10,
                borderRadius: 8,
                border: "1px solid #444",
                background: "#000",
                color: "#fff",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
              style={{
                padding: 10,
                borderRadius: 8,
                border: "1px solid #444",
                background: "#000",
                color: "#fff",
              }}
            />
          </label>

          {error && (
            <div
              style={{
                padding: 10,
                borderRadius: 8,
                border: "1px solid #6b1b1b",
                background: "#1a0f0f",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              padding: 12,
              borderRadius: 10,
              border: "1px solid #555",
              cursor: "pointer",
              background: "#fff",
              color: "#000",
              fontWeight: 600,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            margin: "20px 0",
            height: 1,
            background: "#333",
          }}
        />

        {/* Register CTA */}
        <p style={{ fontSize: 14, opacity: 0.8 }}>
          ¿No tienes cuenta?
        </p>

        <button
          onClick={() => router.push("/register")}
          style={{
            marginTop: 8,
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #444",
            background: "transparent",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Crear cuenta
        </button>
      </div>
    </main>
  );
}
