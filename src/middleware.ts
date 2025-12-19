import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string) {
  // Si JWT_SECRET no existe, esto va a reventar: mejor que falle temprano.
  return jwtVerify(token, secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  // Si intenta entrar a rutas protegidas sin token -> login
  if ((isDashboard || isAdmin) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si está logueado y entra a /login o /register -> dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Validar token y rol SOLO cuando aplica
  if ((isDashboard || isAdmin) && token) {
    try {
      const { payload } = await verifyToken(token);

      // Si el token no trae role, lo tratamos como USER
      const role = String(payload.role || "USER");

      // Bloqueo de admin
      if (isAdmin && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch {
      // Token inválido/expirado -> login
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.set("token", "", { path: "/", maxAge: 0 });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
