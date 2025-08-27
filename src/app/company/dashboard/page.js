'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import {
  User,
  BookOpen,
  FileText,
  Briefcase,
  ScrollText,
  Award,
  GraduationCap
} from 'lucide-react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
export default function StudentDashboard() {
  const { data: session } = useSession()
  const [companyData, setCompanyData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompanyData()
  }, [])

  const fetchCompanyData = async () => {
    try {
      const res = await fetch('/api/company/profile')
      if (!res.ok) throw new Error('Failed to fetch profile')
      const data = await res.json()
      setCompanyData(data)
      
    } catch (error) {
      console.error('Error fetching Company data:', error)
    } finally {
      setLoading(false)
    }
  }

  const navigationItems = [
    {
      title: 'Profile',
      description: 'View and update your basic profile information',
      icon: <GraduationCap className="h-6 w-6" />,
      href: '/company/profile',
      color: 'text-blue-500'
    },
    {
      title: 'Comapany Details',
      description: 'Manage your Company and contact information',
      icon: <User className="h-6 w-6" />,
      href: '/company/details',
      color: 'text-green-500'
    },

    {
      title: 'JNF/INF',
      description: 'Job Notification Form (JNF) or Internship Notification Form (INF)',
      icon: <FileText className="h-6 w-6" />,
      href: '/company/jaf',
      color: 'text-yellow-500'
    }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['COMPANY']}>
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Hey {companyData?.company_name?.split(' ')[0]}! 👋
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Name</CardTitle>
              <CardDescription className="text-lg">
                {companyData?.company_name}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact Person Name</CardTitle>
              <CardDescription className="text-lg">
                {companyData?.contact_person_name}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {item.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Profile Completion Status */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Profile Status</CardTitle>
          <CardDescription>
            {companyData?.is_verified_by_admin 
              ? "Your profile has been verified by the admin ✅"
              : "Your profile is pending verification by admin"}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
    </ProtectedRoute>
  )
} 