import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/prismaClient";

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("Missing JWT_SECRET");
  return new TextEncoder().encode(s);
}

async function requireAdmin() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return { ok: false as const, status: 401 };

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const role = String(payload.role || "USER");
    if (role !== "ADMIN") return { ok: false as const, status: 403 };
    return { ok: true as const };
  } catch {
    return { ok: false as const, status: 401 };
  }
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: auth.status });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}
