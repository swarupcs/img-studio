import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const publicRoutes = ["/signin", "/signup"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Allow public routes and API auth routes
  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/api/auth")
  ) {
    // Redirect authenticated users away from auth pages
    if (isAuthenticated && publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|logo.png|filters|android-chrome|apple-touch|favicon|site.webmanifest).*)",
  ],
};
