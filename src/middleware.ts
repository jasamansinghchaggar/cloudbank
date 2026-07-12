import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

const CUSTOMER_ROUTES = ["/dashboard", "/transfer", "/transactions", "/profile"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isCustomerRoute = CUSTOMER_ROUTES.some((route) => pathname.startsWith(route));

  if (isAdminRoute && (!session || session.role !== "admin")) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (isCustomerRoute && (!session || session.role !== "customer")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transfer/:path*",
    "/transactions/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
