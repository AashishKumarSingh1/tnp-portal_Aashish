import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Define protected paths and their required roles
    const protectedPaths = {
      '/super-admin': ['SUPER_ADMIN'],
      '/admin': ['ADMIN'],
      '/student': ['STUDENT'],
      '/company': ['COMPANY']
    }

    // Check if current path is protected
    const protectedPath = Object.keys(protectedPaths).find(p => path.startsWith(p))
    
    if (!protectedPath) {
      // If path is not protected, allow access
      return NextResponse.next()
    }

    if (!token) {
      // If no token and trying to access protected path, redirect to login
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const userRole = token.user?.role
    const allowedRoles = protectedPaths[protectedPath]

    // Check if user has required role for this path
    const hasAccess = allowedRoles.some(role => 
      userRole?.toUpperCase() === role?.toUpperCase()
    )

    if (!hasAccess && token.user?.redirectPath) {
      // If user doesn't have required role but has a redirectPath, use it
      return NextResponse.redirect(new URL(token.user.redirectPath, req.url))
    }

    // Allow access to the protected route
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/login',
    }
  }
)

// Specify which paths should be protected
export const config = {
  matcher: [
    '/super-admin/:path*',
    '/admin/:path*',
    '/student/:path*',
    '/company/:path*',
  ]
} 