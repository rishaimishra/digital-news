import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { UserRole } from "@prisma/client"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Public routes - allow all
  if (
    path === "/" ||
    path.startsWith("/news") ||
    path.startsWith("/articles") ||
    path.startsWith("/epaper") ||
    path.startsWith("/privacy") ||
    path.startsWith("/terms") ||
    path.startsWith("/grievance") ||
    path.startsWith("/about") ||
    path.startsWith("/api/rss") ||
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/api/auth")
  ) {
    return NextResponse.next()
  }

  // Protected routes require authentication
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const userRole = token.role as UserRole

  // Admin routes
  if (path.startsWith("/admin") && userRole !== UserRole.ADMIN) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Editor routes
  if (
    path.startsWith("/editor") &&
    userRole !== UserRole.EDITOR &&
    userRole !== UserRole.ADMIN
  ) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Reporter routes
  if (
    path.startsWith("/reporter") &&
    userRole !== UserRole.REPORTER &&
    userRole !== UserRole.EDITOR &&
    userRole !== UserRole.ADMIN
  ) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|uploads).*)",
  ],
}
