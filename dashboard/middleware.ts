import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 공개 라우트 (인증 불필요)
const PUBLIC_ROUTES = ["/auth/login", "/auth/signup", "/auth/forgot-password"];

// 보호된 라우트 (인증 필요)
const PROTECTED_ROUTES = ["/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 공개 라우트는 그냥 통과
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 보호된 라우트 확인
  if (PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route))) {
    // 클라이언트 사이드에서 처리하도록 통과
    // (authStore와 ProtectedRoute에서 실제 인증 확인)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
