"use client";

import { useEffect, useMemo, useState } from "react";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  active: boolean;
  createdAt?: string; // si existe en tu schema
};

export default function AdminUsersTable() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "No autorizado");
        setUsers([]);
        return;
      }

      setUsers(data.users || []);
    } catch {
      setError("Error de red");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) =>
      `${u.name ?? ""} ${u.email} ${u.role}`.toLowerCase().includes(s)
    );
  }, [q, users]);

  async function patchUser(id: string, body: Partial<Pick<UserRow, "role" | "active">>) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      alert(data?.error || "No se pudo actualizar");
      return;
    }

    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data.user } : u)));
  }

  return (
    <section
      style={{
        border: "1px solid #222",
        borderRadius: 14,
        background: "#111",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: 14, borderBottom: "1px solid #222", display: "flex", gap: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, email, rol…"
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            border: "1px solid #333",
            background: "#0b0b0b",
            color: "#fff",
          }}
        />
        <button
          onClick={load}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #333",
            background: "#fff",
            color: "#000",
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Refrescar
        </button>
      </div>

      <div style={{ padding: 14 }}>
        {loading && <p style={{ opacity: 0.8 }}>Cargando…</p>}
        {error && (
          <div style={{ border: "1px solid #6b1b1b", background: "#1a0f0f", padding: 12, borderRadius: 10 }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
              <thead>
                <tr style={{ textAlign: "left", opacity: 0.8 }}>
                  <th style={{ padding: 10, borderBottom: "1px solid #222" }}>Nombre</th>
                  <th style={{ padding: 10, borderBottom: "1px solid #222" }}>Email</th>
                  <th style={{ padding: 10, borderBottom: "1px solid #222" }}>Rol</th>
                  <th style={{ padding: 10, borderBottom: "1px solid #222" }}>Activo</th>
                  <th style={{ padding: 10, borderBottom: "1px solid #222" }}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td style={{ padding: 10, borderBottom: "1px solid #1a1a1a" }}>{u.name || "-"}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #1a1a1a" }}>{u.email}</td>

                    <td style={{ padding: 10, borderBottom: "1px solid #1a1a1a" }}>
                      <select
                        value={u.role}
                        onChange={(e) => patchUser(u.id, { role: e.target.value as "USER" | "ADMIN" })}
                        style={{
                          padding: 8,
                          borderRadius: 10,
                          border: "1px solid #333",
                          background: "#0b0b0b",
                          color: "#fff",
                        }}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    <td style={{ padding: 10, borderBottom: "1px solid #1a1a1a" }}>
                      <span style={{ opacity: u.active ? 1 : 0.6 }}>{u.active ? "Sí" : "No"}</span>
                    </td>

                    <td style={{ padding: 10, borderBottom: "1px solid #1a1a1a" }}>
                      <button
                        onClick={() => patchUser(u.id, { active: !u.active })}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 10,
                          border: "1px solid #333",
                          background: "transparent",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        {u.active ? "Desactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: 14, opacity: 0.75 }}>
                      Sin resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
