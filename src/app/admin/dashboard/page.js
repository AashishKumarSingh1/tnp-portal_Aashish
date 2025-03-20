'use client'

import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Users, Building2, ClipboardCheck } from "lucide-react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useState, useEffect } from "react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    pendingVerifications: 0
  })

  const breadcrumbItems = [
    { label: "Admin", href: "/admin/dashboard" },
    { label: "Dashboard", href: "/admin/dashboard" }
  ]

  const statsData = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <Users className="h-6 w-6" />,
      href: "/admin/students"
    },
    {
      title: "Total Companies",
      value: stats.totalCompanies,
      icon: <Building2 className="h-6 w-6" />,
      href: "/admin/companies"
    },
    {
      title: "Pending Verifications",
      value: stats.pendingVerifications,
      icon: <ClipboardCheck className="h-6 w-6" />,
      href: "/admin/verifications"
    }
  ]

  const quickActions = [
    {
      title: "User Management",
      items: [
        {
          label: "View All Students",
          href: "/admin/students",
          description: "View and manage registered students"
        },
        {
          label: "View All Companies",
          href: "/admin/companies",
          description: "View and manage registered companies"
        }
      ]
    },
    {
      title: "Verification & Logs",
      items: [
        {
          label: "Pending Verifications",
          href: "/admin/verifications",
          description: "Review all pending verification requests"
        },
        {
          label: "Activity Logs",
          href: "/admin/activity-logs",
          description: "View system activity and audit logs"
        }
      ]
    }
  ]

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-4xl font-bold mt-4 bg-gradient-to-r from-red-600 to-amber-600 text-transparent bg-clip-text">
            Admin Dashboard
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Link key={index} href={stat.href}>
              <Card className="p-6 hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-red-600 to-amber-600 text-transparent bg-clip-text">
                      {stat.value}
                    </p>
                  </div>
                  <div className="text-red-600 dark:text-red-500">
                    {stat.icon}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {quickActions.map((section, index) => (
            <Card key={index} className="p-6">
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <Link 
                    key={itemIndex} 
                    href={item.href}
                    className="block p-4 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <h3 className="font-medium">{item.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        {stats.recentRegistrations && stats.recentRegistrations.length > 0 && (
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Registrations</h2>
            <div className="space-y-4">
              {stats.recentRegistrations.map((registration, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-accent/50">
                  <div>
                    <h3 className="font-medium">{registration.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {registration.email} • {registration.type}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(registration.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
} 