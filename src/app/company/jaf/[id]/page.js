'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, FileText, User, ArrowRight, Download } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from 'date-fns'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function CompanyJAFPage({ params }) {
  const { data: session } = useSession()
  const [jobDetails, setJobDetails] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    shortlisted: 0,
    selected: 0,
    rejected: 0,
    on_hold: 0
  })

  useEffect(() => {
    const id = params?.id
    if (id) {
      fetchJobDetails(id)
    }
  }, [params?.id])

  const fetchJobDetails = async (id) => {
    try {
      setLoading(true)
      const [jobRes, applicationsRes] = await Promise.all([
        fetch(`/api/company/jaf/${id}`),
        fetch(`/api/company/JAF/${id}/applications`)
      ])

      const [jobData, applicationsData] = await Promise.all([
        jobRes.json(),
        applicationsRes.json()
      ])

      if (!jobRes.ok) {
        throw new Error(jobData.message || 'Failed to fetch job details')
      }

      if (!applicationsRes.ok) {
        throw new Error(applicationsData.message || 'Failed to fetch applications')
      }

      if (jobData.success) {
        setJobDetails(jobData.job)
      }

      if (applicationsData.success) {
        setApplicants(applicationsData.applications || [])
        setStats(applicationsData.stats || {
          total: 0,
          applied: 0,
          shortlisted: 0,
          selected: 0,
          rejected: 0,
          on_hold: 0
        })
      }
      
    } catch (error) {
      console.error('Error fetching job details:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch job details',
        variant: 'destructive',
      })
      setError(error.message || 'Failed to fetch job details')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-500/10 text-blue-500'
      case 'Shortlisted':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'In Process':
        return 'bg-purple-500/10 text-purple-500'
      case 'Selected':
        return 'bg-green-500/10 text-green-500'
      case 'Rejected':
        return 'bg-red-500/10 text-red-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!jobDetails) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground text-center">Job not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['COMPANY']}>
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{jobDetails.job_profile}</h1>
          <p className="text-muted-foreground">{jobDetails.company_name}</p>
        </div>
        <Badge variant={jobDetails.status === 'Approved' ? 'success' : 'secondary'}>
          {jobDetails.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Job Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p>{jobDetails.place_of_posting}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mode of Hiring</p>
                <p>{jobDetails.mode_of_hiring}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Offer Type</p>
                <p>{jobDetails.offer_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rounds</p>
                <p>{jobDetails.total_rounds}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">CTC Breakdown</p>
              <p className="whitespace-pre-line bg-muted p-3 rounded-md">
                {jobDetails.ctc_breakdown}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Selection Process</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(jobDetails.selection_process).map(([key, value]) => (
                  <Badge key={key} variant={value ? 'default' : 'secondary'}>
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {jobDetails.job_description_file && (
              <Button variant="outline" className="w-full" asChild>
                <Link href={jobDetails.job_description_file} target="_blank">
                  <Download className="h-4 w-4 mr-2" />
                  Download Job Description
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Eligibility Criteria Card */}
        <Card>
          <CardHeader>
            <CardTitle>Eligibility Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Eligible Batches</p>
              <div className="flex flex-wrap gap-2">
                {jobDetails.eligible_batches.map(batch => (
                  <Badge key={batch} variant="outline">{batch}</Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Eligible Branches</p>
              <div className="flex flex-wrap gap-2">
                {jobDetails.eligible_branches.map(branch => (
                  <Badge key={branch} variant="outline">{branch}</Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Eligible Degrees</p>
              <div className="flex flex-wrap gap-2">
                {jobDetails.eligible_degrees.map(degree => (
                  <Badge key={degree} variant="outline">{degree}</Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Last Date to Apply</p>
              <p>{new Date(jobDetails.last_date_to_apply).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applicants Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            Applicants ({stats.total})
          </CardTitle>
          <CardDescription>
            Applied: {stats.applied} | Shortlisted: {stats.shortlisted} | Selected: {stats.selected} | Rejected: {stats.rejected} | On Hold: {stats.on_hold}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applicants.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No applications yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>CGPA</TableHead>
                  <TableHead>Backlogs</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Round</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{applicant.student_name}</span>
                        <span className="text-sm text-muted-foreground">{applicant.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{applicant.roll_number}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{applicant.branch}</span>
                        <span className="text-sm text-muted-foreground">{applicant.degree_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{applicant.cgpa || 'N/A'}</span>
                        <span className="text-sm text-muted-foreground">Overall: {applicant.overall_cgpa || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>Current: {applicant.current_backlogs || 0}</span>
                        <span className="text-sm text-muted-foreground">Total: {applicant.backlogs || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(applicant.status)} variant="secondary">
                        {applicant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>Round {applicant.current_round}</span>
                        <span className="text-sm text-muted-foreground">
                          {applicant.rounds_cleared} of {jobDetails.total_rounds} cleared
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(applicant.applied_at), 'PPP')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/company/applications/${applicant.id}`}>
                          <Button variant="ghost" size="sm">
                            <User className="h-4 w-4 mr-2" />
                            View Profile
                          </Button>
                        </Link>
                        {applicant.resume_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={applicant.resume_url} target="_blank">
                              <FileText className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
    </ProtectedRoute>
  )
}
