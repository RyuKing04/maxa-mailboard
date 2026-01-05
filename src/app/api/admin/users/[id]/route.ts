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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: auth.status });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { role, active } = body as { role?: "USER" | "ADMIN"; active?: boolean };

  if (role !== undefined && role !== "USER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (active !== undefined && typeof active !== "boolean") {
    return NextResponse.json({ error: "Invalid active" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(role !== undefined ? { role } : {}),
      ...(active !== undefined ? { active } : {}),
    },
    select: { id: true, email: true, role: true, active: true },
  });

  return NextResponse.json({ user: updated });
}
