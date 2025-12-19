import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

export default async function AdminPage() {
  const cookieStore = await cookies(); // 👈 ESTO
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const secretStr = process.env.JWT_SECRET;
  if (!secretStr) redirect("/login");

  const secret = new TextEncoder().encode(secretStr);

  let role = "USER";

  try {
    const { payload } = await jwtVerify(token, secret);
    role = String(payload.role ?? "USER");
  } catch {
    redirect("/login");
  }

  if (role !== "ADMIN") redirect("/dashboard");

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>Admin Panel</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Aquí vas a ver usuarios, boards, actividad, etc.
      </p>
    </main>
  );
}
