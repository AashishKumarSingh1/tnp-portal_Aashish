'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

const PROTECTED_PATHS = {
  SUPER_ADMIN: ['/super-admin', '/super-admin/dashboard'],
  ADMIN: ['/admin', '/admin/dashboard'],
  STUDENT: ['/student', '/student/dashboard'],
  COMPANY: ['/company', '/company/dashboard']
}

const PUBLIC_PATHS = ['/', '/about', '/contact', '/login', '/register', '/verify-email']

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // If still loading, wait
    if (status === 'loading') return

    // Check if current path is public
    const isPublicPath = PUBLIC_PATHS.some(path => pathname === path)

    // If it's a public path and no specific roles are required, allow access
    if (isPublicPath && allowedRoles.length === 0) {
      setIsAuthorized(true)
      return
    }

    // Check if current path is a protected dashboard path
    const isProtectedPath = Object.values(PROTECTED_PATHS).flat().some(path => 
      pathname.startsWith(path)
    )

    // Handle unauthenticated users
    if (!session) {
      if (isProtectedPath) {
        toast.error('Please login to access this page')
        router.replace('/login')
        return
      }
      // If not authenticated but trying to access public path
      if (isPublicPath) {
        setIsAuthorized(true)
        return
      }
    }

    // Handle authenticated users
    if (session) {
      const userRole = session.user.role.toUpperCase()

      // If accessing protected path, check role permissions
      if (isProtectedPath) {
        const hasRequiredRole = allowedRoles.some(role => 
          userRole === role.toUpperCase()
        )

        if (!hasRequiredRole) {
          toast.error('You do not have permission to access this page')
          const userPaths = PROTECTED_PATHS[userRole] || []
          router.replace(userPaths[0] || '/')
          return
        }
      }

      // If accessing public path, just allow it
      if (isPublicPath) {
        setIsAuthorized(true)
        return
      }
    }

    setIsAuthorized(true)
  }, [session, status, router, allowedRoles, pathname])

  // Show loading state
  if (status === 'loading' || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-900"></div>
      </div>
    )
  }

  return children
} 