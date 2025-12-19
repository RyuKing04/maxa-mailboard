import prisma from "@/prismaClient";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const emailRaw = body?.email;
    const password = body?.password;

    const email = typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";

    if (!email || typeof password !== "string" || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // No dar pistas de si existe o no
    if (!user || !user.active) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Missing JWT_SECRET" }, { status: 500 });
    }

    const expiresInSeconds = 60 * 60 * 24 * 7; // 7 días
    const expires = new Date(Date.now() + expiresInSeconds * 1000);

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        // opcional pero recomendable
        iss: "maxa-mailboard",
        aud: "maxa-mailboard-web",
      },
      secret,
      { expiresIn: expiresInSeconds }
    );

    const res = NextResponse.json(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      { status: 200 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresInSeconds,
      expires,
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
