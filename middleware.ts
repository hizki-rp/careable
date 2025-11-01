import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};

interface TokenPayload {
  userId: string;
  username: string;
  role: string;
}

const PUBLIC_ROUTES = ['/', '/login', '/api/auth/login', '/api/auth/logout'];
const PROTECTED_ROUTES = {
  admin: ['/admin'],
  staff: ['/reception', '/patients'],
};

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
}

function isProtectedRoute(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.startsWith('/reception') || pathname.startsWith('/patients');
}

function getDefaultRedirectPath(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'receptionist':
    case 'doctor':
    case 'laboratorian':
      return '/reception/queue';
    default:
      return '/';
  }
}

function hasAccessToRoute(pathname: string, role: string): boolean {
  // Admin can access everything
  if (role === 'admin') {
    return true;
  }

  // Non-admin roles can access /reception and /patients
  if (pathname.startsWith('/reception') || pathname.startsWith('/patients')) {
    return true;
  }

  // Non-admin roles cannot access /admin
  if (pathname.startsWith('/admin')) {
    return false;
  }

  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - allow access without authentication
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (isProtectedRoute(pathname)) {
    const token = request.cookies.get('auth-token')?.value;

    // No token - redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      const userRole = decoded.role;

      // Check if user has access to this route
      if (!hasAccessToRoute(pathname, userRole)) {
        // Redirect to user's default page
        const defaultPath = getDefaultRedirectPath(userRole);
        return NextResponse.redirect(new URL(defaultPath, request.url));
      }

      // Allow access
      return NextResponse.next();
    } catch (error) {
      // Token is invalid or expired
      const response = NextResponse.redirect(
        new URL('/login', request.url)
      );
      // Clear the invalid token cookie
      response.cookies.set({
        name: 'auth-token',
        value: '',
        maxAge: 0,
      });
      return response;
    }
  }

  return NextResponse.next();
}
