'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Building2, Mail, Phone, Globe, User, Loader2 } from 'lucide-react'
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"

export default function JAFDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [jaf, setJaf] = useState(null)
  const [loading, setLoading] = useState(true)
  const [remarks, setRemarks] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchJAFDetails()
  }, [params.id])

  const fetchJAFDetails = async () => {
    try {
      const res = await fetch(`/api/admin/jaf/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch JAF details')
      const data = await res.json()
      setJaf(data)
      setRemarks(data.remarks || '')
    } catch (error) {
      toast.error('Failed to load JAF details')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (status) => {
    try {
      setUpdating(true)
      const res = await fetch('/api/admin/jaf', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: params.id,
          status,
          remarks
        })
      })

      if (!res.ok) throw new Error('Failed to update JAF status')
      
      toast.success(`JAF ${status.toLowerCase()} successfully`)
      router.push('/admin/jaf')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (!jaf) {
    return <div className="text-center p-8">JAF not found</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">JAF Details</h1>
        <Button variant="outline" onClick={() => router.back()}>Back</Button>
      </div>

      <div className="grid gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{jaf.company_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{jaf.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{jaf.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a href={jaf.website} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">
                  {jaf.website}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{jaf.contact_person_name} ({jaf.contact_person_designation})</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Job Profile</label>
                  <p>{jaf.job_profile}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Mode of Hiring</label>
                  <p>{jaf.mode_of_hiring}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Place of Posting</label>
                  <p>{jaf.place_of_posting}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Offer Type</label>
                  <p>{jaf.offer_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Last Date to Apply</label>
                  <p>{new Date(jaf.last_date_to_apply).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Job Status</label>
                  <Badge variant={jaf.job_status === 'Open' ? 'success' : 'secondary'}>
                    {jaf.job_status}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">CTC Breakdown</label>
                <p className="whitespace-pre-wrap">{jaf.ctc_breakdown}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Eligible Batches</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {JSON.parse(jaf.eligible_batches).map(batch => (
                      <Badge key={batch} variant="outline">{batch}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Eligible Branches</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {JSON.parse(jaf.eligible_branches).map(branch => (
                      <Badge key={branch} variant="outline">{branch}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Eligible Degrees</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {JSON.parse(jaf.eligible_degrees).map(degree => (
                      <Badge key={degree} variant="outline">{degree}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Selection Process</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Object.entries(JSON.parse(jaf.selection_process))
                    .filter(([_, value]) => value)
                    .map(([key]) => (
                      <Badge key={key} variant="outline">
                        {key.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        {jaf.status === 'Pending Review' && (
          <Card>
            <CardHeader>
              <CardTitle>Review Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Remarks</label>
                  <Textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add any remarks about this JAF..."
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleStatusUpdate('Approved')}
                    disabled={updating}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve JAF
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate('Rejected')}
                    disabled={updating}
                    className="w-full"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject JAF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Student Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Student Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {jaf.applications?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Registration Number</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jaf.applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>{application.student_name}</TableCell>
                      <TableCell>{application.registration_number}</TableCell>
                      <TableCell>
                        {new Date(application.applied_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge>{application.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/students/${application.student_id}`)}
                        >
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No applications received yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 