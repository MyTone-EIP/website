import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Routes protégées
  const protectedPaths = [
    "/dashboard",
    "/profile",
    "/settings",
    "/admin"
  ];

  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Si la route est protégée et pas de token, rediriger vers login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login/user", request.url));
  }

  // Si utilisateur authentifié essaie d'accéder à login/signup, rediriger vers dashboard
  if ((request.nextUrl.pathname === "/login/user" || request.nextUrl.pathname === "/signup") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/login/:path*",
    "/signup"
  ]
};
