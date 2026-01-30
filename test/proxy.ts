/* eslint-disable @typescript-eslint/no-explicit-any */
// middleware.ts
import { env } from "@/env";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = env.BACKEND_URL;

export async function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token");
  const { pathname } = request.nextUrl;

  // Public routes
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/shop") ||
    pathname === "/api";

  // Auth routes
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // If logged in and trying to access auth pages, redirect to dashboard
  if (sessionToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If not logged in and trying to access protected routes
  if (!sessionToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based protection for admin routes
  if (pathname.startsWith("/admin")) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: {
          Cookie: `better-auth.session_token=${sessionToken?.value}`,
        },
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const user = await response.json();

      if (user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error: any) {
      console.log(error.message);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Seller routes protection
  if (pathname.startsWith("/seller")) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: {
          Cookie: `better-auth.session_token=${sessionToken?.value}`,
        },
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const user = await response.json();

      if (user.role !== "SELLER") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error: any) {
      console.log(error.message);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
