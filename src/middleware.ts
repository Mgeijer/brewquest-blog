import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if user is authenticated
    const isAuthenticated = request.cookies.get('admin-auth')?.value === 'authenticated'
    
    // If trying to access admin login page and already authenticated, redirect to dashboard
    if (request.nextUrl.pathname === '/admin/login' && isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    
    // If trying to access admin pages without authentication, redirect to login
    if (!isAuthenticated && request.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}