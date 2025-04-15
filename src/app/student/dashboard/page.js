'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
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
  GraduationCap,
  Settings
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export default function StudentDashboard() {
  const { data: session } = useSession()
  const [studentData, setStudentData] = useState(null)
  const [preferences, setPreferences] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchStudentData(),
      fetchPreferences()
    ]).finally(() => setLoading(false))
  }, [])

  const fetchStudentData = async () => {
    try {
      const res = await fetch('/api/student/profile')
      if (!res.ok) throw new Error('Failed to fetch profile')
      const data = await res.json()
      setStudentData(data)
    } catch (error) {
      console.error('Error fetching student data:', error)
    }
  }

  const fetchPreferences = async () => {
    try {
      const res = await fetch('/api/student/preferences')
      if (!res.ok) throw new Error('Failed to fetch preferences')
      const data = await res.json()
      if (data.success && data.preferences) {
        setPreferences({
          ...data.preferences,
          preferred_sectors: JSON.parse(data.preferences.preferred_sectors || '[]'),
          preferred_locations: JSON.parse(data.preferences.preferred_locations || '[]')
        })
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
    }
  }

  const navigationItems = [
    {
      title: 'Profile',
      description: 'View and update your basic profile information',
      icon: <GraduationCap className="h-6 w-6" />,
      href: '/student/profile',
      color: 'text-blue-500'
    },
    {
      title: 'Personal Details',
      description: 'Manage your personal and contact information',
      icon: <User className="h-6 w-6" />,
      href: '/student/personal',
      color: 'text-green-500'
    },
    {
      title: 'Academic Details',
      description: 'Update your academic records and achievements',
      icon: <BookOpen className="h-6 w-6" />,
      href: '/student/academic',
      color: 'text-purple-500'
    },
    {
      title: 'Documents',
      description: 'Upload and manage your important documents',
      icon: <FileText className="h-6 w-6" />,
      href: '/student/documents',
      color: 'text-yellow-500'
    },
    {
      title: 'Experience',
      description: 'Add your internships and work experience',
      icon: <Briefcase className="h-6 w-6" />,
      href: '/student/experience',
      color: 'text-red-500'
    },
    {
      title: 'Job Preferences',
      description: 'Set your job preferences and career interests',
      icon: <Settings className="h-6 w-6" />,
      href: '/student/preferences',
      color: 'text-orange-500'
    },
    {
      title: 'New Job Announcements',
      description: 'See all the new job announcements',
      icon: <ScrollText className="h-6 w-6" />,
      href: '/student/jobs',
      color: 'text-indigo-500'
    },
    {
      title: 'Applications',
      description: 'Track your job applications',
      icon: <ScrollText className="h-6 w-6" />,
      href: '/student/applications',
      color: 'text-indigo-500'
    },
    {
      title: 'Offers',
      description: 'View your placement offers',
      icon: <Award className="h-6 w-6" />,
      href: '/student/offers',
      color: 'text-pink-500'
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
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Hey {studentData?.full_name?.split(' ')[0]}! 👋
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Roll Number</CardTitle>
              <CardDescription className="text-lg">
                {studentData?.roll_number}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Branch</CardTitle>
              <CardDescription className="text-lg">
                {studentData?.branch}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Job Preferences Summary */}
      {preferences && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Job Preferences</CardTitle>
            <CardDescription>Quick overview of your career interests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Preferred Sectors</h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.preferred_sectors.map(sector => (
                    <Badge key={sector} variant="secondary">
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Preferred Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.preferred_locations.map(location => (
                    <Badge key={location} variant="secondary">
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Expected Salary</h3>
                  <p className="text-muted-foreground">{preferences.expected_salary || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Willing to Relocate</h3>
                  <p className="text-muted-foreground">{preferences.willing_to_relocate ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            {studentData?.is_verified_by_admin 
              ? "Your profile has been verified by the admin ✅"
              : "Your profile is pending verification by admin"}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
} 