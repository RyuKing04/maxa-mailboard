import AdminUsersTable from "./user-table";

export default function AdminPage() {
  return (
    <main style={{ minHeight: "100vh", padding: 24, background: "#0b0b0b", color: "#fff" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Admin Panel</h1>
        <p style={{ opacity: 0.75, marginBottom: 18 }}>
          Gestión de usuarios (roles y estado).
        </p>

        <AdminUsersTable />
      </div>
    </main>
  );
}
