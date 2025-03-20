'use client'

import { createContext, useContext, useEffect } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // useEffect(() => {
  //   // Redirect based on role when session changes
  //   if (session?.user) {
  //     const role = session.user.role
  //     if (role === 'SUPER_ADMIN' && !window.location.pathname.startsWith('/super-admin')) {
  //       router.push('/super-admin/dashboard')
  //     } else if (role === 'ADMIN' && !window.location.pathname.startsWith('/admin')) {
  //       router.push('/admin/dashboard')
  //     } else if (role === 'STUDENT' && !window.location.pathname.startsWith('/student')) {
  //       router.push('/student/dashboard')
  //     } else if (role === 'COMPANY' && !window.location.pathname.startsWith('/company')) {
  //       router.push('/company/dashboard')
  //     }
  //   }
  // }, [session, router])

  return (
    <AuthContext.Provider value={{ user: session?.user, isLoading: status === 'loading' }}>
      <SessionProvider>
      {children}
      </SessionProvider>
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 