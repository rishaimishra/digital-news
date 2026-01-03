import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin routes
    if (path.startsWith("/admin") && token?.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Editor routes
    if (path.startsWith("/editor") && 
        token?.role !== UserRole.EDITOR && 
        token?.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Reporter routes
    if (path.startsWith("/reporter") && 
        token?.role !== UserRole.REPORTER && 
        token?.role !== UserRole.EDITOR && 
        token?.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Public routes
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
          path.startsWith("/register")
        ) {
          return true
        }

        // Protected routes require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|uploads).*)",
  ],
}

