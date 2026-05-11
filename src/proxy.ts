import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;
  const { pathname } = req.nextUrl;

  const isPublic = pathname.startsWith("/login") || pathname.startsWith("/api/auth");

  if (!userId && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (userId && pathname === "/login") {
    return NextResponse.redirect(new URL("/candidates", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
