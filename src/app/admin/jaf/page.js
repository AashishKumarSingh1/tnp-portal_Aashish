'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Calendar, Users, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function AdminJAFPage() {
  const [jafs, setJafs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchJAFs()
  }, [])

  const fetchJAFs = async () => {
    try {
      const res = await fetch('/api/admin/jaf')
      if (!res.ok) throw new Error('Failed to fetch JAFs')
      const data = await res.json()
      setJafs(data)
    } catch (error) {
      toast.error('Failed to load JAFs')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Pending': 'warning',
      'Approved': 'success',
      'Rejected': 'destructive'
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const getJobStatusBadge = (status) => {
    const variants = {
      'Open': 'success',
      'Closed': 'secondary',
      'Cancelled': 'destructive'
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const filteredJAFs = jafs.filter(jaf => 
    jaf.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jaf.job_profile.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Announcements</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search JAFs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        {['pending', 'approved', 'rejected'].map(tab => (
          <TabsContent key={tab} value={tab}>
            <Card className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Job Profile</TableHead>
                    <TableHead>Last Date</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Job Status</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJAFs
                    .filter(jaf => jaf.status.toLowerCase() === tab)
                    .map((jaf) => (
                      <TableRow key={jaf.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4" />
                            <span>{jaf.company_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{jaf.job_profile}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(jaf.last_date_to_apply).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            {jaf.application_count}
                          </div>
                        </TableCell>
                        <TableCell>{getJobStatusBadge(jaf.job_status)}</TableCell>
                        <TableCell>{getStatusBadge(jaf.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/jaf/${jaf.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 