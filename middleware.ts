/**
 * Next.js Middleware
 * Handles authentication and route protection
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ============================================================================
// Configuration
// ============================================================================

// Routes that require authentication
const protectedRoutes = [
  "/hangar",
  "/workshop",
  "/dashboard",
  "/settings",
  "/checkout",
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

// Public routes that bypass all checks
const publicRoutes = [
  "/",
  "/marketplace",
  "/skills",
  "/privacy",
  "/terms",
  "/api/health",
  "/api/webhooks",
];

// API routes that require authentication
const protectedApiRoutes = [
  "/api/users/me",
  "/api/checkout",
  "/api/agents/create",
];

// ============================================================================
// Middleware Function
// ============================================================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookie or header
  const token =
    request.cookies.get("auth_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const isAuthenticated = !!token;

  // ============================================================================
  // Handle API Routes
  // ============================================================================

  if (pathname.startsWith("/api/")) {
    // Allow webhook routes without auth
    if (pathname.startsWith("/api/webhooks/")) {
      return NextResponse.next();
    }

    // Allow health check
    if (pathname === "/api/health") {
      return NextResponse.next();
    }

    // Check if API route requires authentication
    const requiresAuth = protectedApiRoutes.some(
      (route) => pathname.startsWith(route)
    );

    if (requiresAuth && !isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }

    // Add CORS headers for API routes
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  }

  // ============================================================================
  // Handle Page Routes
  // ============================================================================

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if route is an auth route (login, register, etc.)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && isAuthenticated) {
    const redirectTo =
      request.nextUrl.searchParams.get("redirect") || "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // ============================================================================
  // Add Security Headers
  // ============================================================================

  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Content Security Policy (adjust as needed for your app)
  // This is a basic CSP - you may need to adjust based on your needs
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.stripe.com https://*.posthog.com wss:",
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  // Only set CSP in production to avoid development issues
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Content-Security-Policy", csp);
  }

  return response;
}

// ============================================================================
// Middleware Configuration
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
