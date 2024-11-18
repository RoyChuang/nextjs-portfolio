import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login'];

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token');
  const path = request.nextUrl.pathname;

  const isAuthenticated = !!authToken?.value;

  if (!isAuthenticated && !publicPaths.includes(path)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const response = NextResponse.next();
  
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 