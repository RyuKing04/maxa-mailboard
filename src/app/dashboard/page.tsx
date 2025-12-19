"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Me = { id: string; name: string | null; email: string; role: string };

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me", { method: "GET" });
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = (await res.json()) as Me;
        setMe(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) return <main style={{ padding: 24 }}>Loading...</main>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      {me ? (
        <>
          <p><b>ID:</b> {me.id}</p>
          <p><b>Name:</b> {me.name ?? "-"}</p>
          <p><b>Email:</b> {me.email}</p>
          <p><b>Role:</b> {me.role}</p>

          <button
            onClick={logout}
            style={{ marginTop: 16, padding: 12, borderRadius: 10, border: "1px solid #444", cursor: "pointer" }}
          >
            Logout
          </button>
        </>
      ) : (
        <p>No session</p>
      )}
    </main>
  );
}
