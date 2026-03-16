// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("chef_token");

  // Log every matched request
  console.log(
    `[Middleware] ${new Date().toISOString()} — ${req.nextUrl.pathname}`,
  );

  // Redirect to home if no token
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("error", "login_required");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Only apply to /manage routes
export const config = {
  matcher: ["/manage", "/manage/:path*"],
};
