import { NextResponse, type NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const AUTH_ROUTES = ["/login", "/registro"]

// Only checks whether a session cookie is present — cheap, no DB access.
// Full session validation (is it still valid? which household?) happens in
// (app)/layout.tsx, which runs in the Node runtime and can hit the database.
export function proxy(request: NextRequest) {
  const hasSessionCookie = Boolean(getSessionCookie(request))
  const { pathname } = request.nextUrl

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  const isAppRoute = pathname.startsWith("/dashboard") ||
    pathname.startsWith("/hogar") ||
    pathname.startsWith("/vehiculos") ||
    pathname.startsWith("/mascotas") ||
    pathname.startsWith("/ninos") ||
    pathname.startsWith("/salud") ||
    pathname.startsWith("/compras") ||
    pathname.startsWith("/plantillas") ||
    pathname.startsWith("/asistente") ||
    pathname.startsWith("/ajustes")

  if (isAppRoute && !hasSessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthRoute && hasSessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/hogar/:path*",
    "/vehiculos/:path*",
    "/mascotas/:path*",
    "/ninos/:path*",
    "/salud/:path*",
    "/compras/:path*",
    "/plantillas/:path*",
    "/asistente/:path*",
    "/ajustes/:path*",
    "/login",
    "/registro",
  ],
}
