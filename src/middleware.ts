import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authSession = request.cookies.get('auth_session');

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!authSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect to admin if trying to access login while authenticated
  if (pathname === '/login' && authSession) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/login',
  ],
};
