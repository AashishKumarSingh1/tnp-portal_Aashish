"use client"
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Building2, GraduationCap, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [selectedRole, setSelectedRole] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  
  const roles = [
    { 
      icon: GraduationCap, 
      label: "Student", 
      id: "student",
      placeholder: "Enter college email"
    },
    { 
      icon: Building2, 
      label: "Company", 
      id: "company",
      placeholder: "Enter company email"
    },
    { 
      icon: Users, 
      label: "Admin", 
      id: "admin",
      placeholder: "Enter admin email"
    }
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!selectedRole) {
      toast.error('Please select a role')
      setLoading(false)
      return
    }

    try {
      setLoading(true);
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        redirect: false,
      })
      if (result?.error) {
        toast.error(result.error); // Show the error message returned from the server
        setLoading(false);
        return;
      }
    
      if (result?.ok) {
        // Wait for a moment to ensure session is set
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Get the session data
        const response = await fetch('/api/auth/session')
        const sessionData = await response.json()

        if (sessionData?.user?.role === 'SUPER_ADMIN') {
          toast.success('Login successful!')
          setLoading(false);
          window.location.href = '/super-admin/dashboard'
        } else if (sessionData?.user?.redirectPath) {
          toast.success('Login successful!')
          setLoading(false);
          window.location.href = sessionData.user.redirectPath
        } else {
          console.error('No role or redirect path in session:', sessionData)
          setLoading(false);
          toast.error('Error getting redirect path')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false);
      toast.error('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      toast.info('You are already logged in. Redirecting...')
      
      if (session.user.role === 'SUPER_ADMIN') {
        router.push('/super-admin/dashboard')
        return
      }
      
      if (session.user.redirectPath) {
        router.push(session.user.redirectPath)
        return
      }
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                <span className="gradient-text">Welcome Back</span>
              </h1>
              <p className="text-muted-foreground">
                Sign in to access your Training & Placement Cell portal
              </p>
            </div>

            <Card className="p-6 md:p-8">
              {/* Role Selection */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-4 block text-muted-foreground">
                  Select your role to continue
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      type="button"
                      className={`flex flex-col items-center p-3 rounded-lg border transition-all duration-200 ${
                        selectedRole === role.id
                          ? 'border-red-900 bg-red-900/10 dark:border-red-500 dark:bg-red-500/10'
                          : 'border-red-900/20 hover:bg-red-900/10 dark:border-red-700/20 dark:hover:bg-red-700/10'
                      }`}
                    >
                      <role.icon className={`w-6 h-6 mb-2 ${
                        selectedRole === role.id
                          ? 'text-red-900 dark:text-red-500'
                          : 'text-muted-foreground'
                      }`} />
                      <span className={`text-sm font-medium ${
                        selectedRole === role.id
                          ? 'text-red-900 dark:text-red-500'
                          : 'text-muted-foreground'
                      }`}>
                        {role.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">
                    Email
                  </label>
                  <Input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={selectedRole ? roles.find(r => r.id === selectedRole)?.placeholder : "Select role first"} 
                    className="border-red-900/20 focus:border-red-900/40" 
                    required
                    disabled={!selectedRole || loading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">
                    Password
                  </label>
                  <Input 
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password" 
                    className="border-red-900/20 focus:border-red-900/40" 
                    required
                    disabled={!selectedRole || loading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="rounded border-red-900/20 text-red-900 focus:ring-red-900/20" 
                      disabled={!selectedRole || loading}
                    />
                    <span className="text-sm text-muted-foreground">Remember me</span>
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-red-900 dark:text-red-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button 
                  type="submit"
                  className={`w-full transition-colors ${
                    selectedRole && !loading
                      ? 'bg-red-900 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700'
                      : 'bg-red-900/50 cursor-not-allowed'
                  }`}
                  disabled={!selectedRole || loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Register Links */}
              <div className="mt-6 space-y-2 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account? Register Now:
                </p>
                <div className="flex gap-4 justify-center">
                  <Link 
                    href="/register" 
                    className="text-sm text-red-900 dark:text-red-500 hover:underline"
                  >
                    Student | Company
                  </Link>
                </div>
              </div>
            </Card>

            {/* Help Section */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Need help? {' '}
                <Link 
                  href="/contact" 
                  className="text-sm text-red-900 dark:text-red-500 hover:underline"
                >
                  Contact support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
} 