import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Check if the user is authenticated for protected routes
  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Role-based access control
  const path = request.nextUrl.pathname

  // Admin routes
  if (path.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Seller routes - allow both sellers and admins
  if (path.startsWith("/sell") && token.role !== "seller" && token.role !== "admin") {
    // Instead of redirecting, let's show a message about becoming a seller
    return NextResponse.redirect(new URL("/become-seller", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*", "/dashboard/:path*", "/sell/:path*", "/admin/:path*"],
}

