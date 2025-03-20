'use client'

import { useState, useEffect } from "react"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, RefreshCw, Clock, Activity, UserCircle2, Globe } from "lucide-react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ActivityLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    fetchLogs()
  }, [pagination.currentPage])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/activity-logs?page=${pagination.currentPage}&limit=${pagination.perPage}`)
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch logs')
      }

      setLogs(data.logs || [])
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        pages: data.pagination.pages
      }))
    } catch (error) {
      console.error('Failed to fetch logs:', error)
      toast.error(error.message || 'Failed to fetch activity logs')
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    try {
      // Create a date object
      const date = new Date(dateString)
      
      // Add 5 hours and 30 minutes for IST offset using proper date methods
      date.setHours(date.getHours() + 5)
      date.setMinutes(date.getMinutes() + 30)
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // This will show time in 12-hour format with AM/PM
      })
    } catch (error) {
      console.error('Date formatting error:', error)
      return 'Invalid date'
    }
  }

  const getActionColor = (action) => {
    switch(action) {
      case 'CREATE_ADMIN': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'UPDATE_ADMIN': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'DELETE_ADMIN': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'LOGIN': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'STUDENT VERIFICATION': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const filteredLogs = logs.filter(log => 
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const breadcrumbItems = [
    { label: "Super Admin", href: "/super-admin/dashboard" },
    { label: "Activity Logs", href: "/super-admin/activity-logs" }
  ]

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-4xl font-bold mt-4 bg-gradient-to-r from-red-600 to-amber-600 text-transparent bg-clip-text">
            Activity Logs
          </h1>
        </div>

        <div className="flex justify-between items-center mb-8">
          <Button 
            onClick={fetchLogs}
            className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh Logs'}
          </Button>
        </div>

        <Card className="overflow-hidden border bg-card">
          <div className="p-6 border-b">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search logs by action, details, or user email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-red-600" />
                <span className="ml-2">Loading activity logs...</span>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Activity className="w-12 h-12 mb-2" />
                <p>No activity logs found</p>
                {searchTerm && <p className="text-sm">Try adjusting your search term</p>}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (

                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={log.user_profile_image} alt={log.user_name} />
                            <AvatarFallback className="bg-gradient-to-br from-red-600 to-amber-600 text-white">
                              {log.user_name?.charAt(0) || log.user_email?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{log.user_name}</p>
                            <p className="text-sm text-muted-foreground">{log.user_email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{log.details}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{log.ip_address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{formatDate(log.created_at)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {!loading && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: pagination.pages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={pagination.currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: i + 1 }))}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.pages, prev.currentPage + 1) }))}
                disabled={pagination.currentPage === pagination.pages}
              >
                Next
              </Button>
            </div>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  )
} 