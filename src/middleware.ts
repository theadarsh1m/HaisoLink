import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith("/admin");
  const isAgentPath = pathname.startsWith("/agent");
  const isCustomerPath = pathname.startsWith("/customer");
  const isDashboardRedirect = pathname === "/dashboard-redirect";

  const isProtectedPath = isAdminPath || isAgentPath || isCustomerPath || isDashboardRedirect;

  if (isProtectedPath) {
    try {

      const res = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      if (!res.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const sessionData = await res.json();
      const user = sessionData?.user;

      if (!user) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const role = user.role?.toUpperCase();

      if (isDashboardRedirect) {
        if (role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        } else if (role === "DELIVERY_AGENT") {
          return NextResponse.redirect(new URL("/agent/dashboard", request.url));
        } else {
          return NextResponse.redirect(new URL("/customer/dashboard", request.url));
        }
      }

      if (isAdminPath && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      if (isAgentPath && role !== "DELIVERY_AGENT") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      if (isCustomerPath && role !== "CUSTOMER") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch {

      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const response = NextResponse.next();

  // Add Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (we don't want to block auth callbacks)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
