'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'
import { AlertCircle, FileText, ExternalLink } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function StudentJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [profileStatus, setProfileStatus] = useState({
    isComplete: false,
    missing: {
      personal: false,
      academics: false,
      documents: false,
      preferences: false
    }
  })
  const { data: session } = useSession()
  

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/student/jobs')
        const data = await response.json()
        if (data.success) {
          setJobs(data.jobs)
        }
      } catch (error) {
        console.error('Error fetching jobs:', error)
        toast.error('Failed to fetch job listings')
      } finally {
        setLoading(false)
      }
    }

    const checkProfile = async () => {
      try {
        const response = await fetch('/api/student/profile/check-completion')
        const data = await response.json()
        if (data.success) {
          setProfileStatus(data)
        }
      } catch (error) {
        console.error('Error checking profile:', error)
      }
    }

    if (session?.user) {
      fetchJobs()
      checkProfile()
    }
  }, [session])

  const handleApply = async (jobId) => {
    if (!profileStatus.isComplete) {
      toast.error('Profile Incomplete')
      return
    }

    try {
      const response = await fetch('/api/student/jobs/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Application submitted successfully!')
        // Refresh jobs list
        const updatedJobs = jobs.map(job => 
          job.id === jobId ? { ...job, hasApplied: true } : job
        )
        setJobs(updatedJobs)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit application')
    }
  }

  const getMissingProfileItems = () => {
    const missing = []
    if (profileStatus.missing.personal) missing.push('Personal Details')
    if (profileStatus.missing.academics) missing.push('Academic Information')
    if (profileStatus.missing.documents) missing.push('Required Documents')
    if (profileStatus.missing.preferences) missing.push('Job Preferences')
    return missing
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Available Job Opportunities</h1>
      
      {!profileStatus.isComplete && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profile Incomplete</AlertTitle>
          <AlertDescription>
            <p>Please update the following sections before applying:</p>
            <ul className="list-disc list-inside mt-2">
              {getMissingProfileItems().map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <Button variant="link" className="p-0 mt-2" onClick={() => window.location.href = '/student/profile'}>
              Update Profile
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{job.job_profile}</CardTitle>
                  <CardDescription>{job.company_name}</CardDescription>
                </div>
                <Badge variant={job.job_status === 'Open' ? 'default' : 'secondary'}>
                  {job.job_status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-2">
                <p><strong>Location:</strong> {job.place_of_posting}</p>
                <p><strong>Mode:</strong> {job.mode_of_hiring}</p>
                <p><strong>CTC:</strong> {job.ctc_breakdown}</p>
                <p><strong>Last Date:</strong> {format(new Date(job.last_date_to_apply), 'PPP')}</p>
                
                <div className="flex gap-2 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex gap-2">
                        <FileText className="h-4 w-4" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{job.job_profile} at {job.company_name}</DialogTitle>
                        <DialogDescription>
                          Complete job details and requirements
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Location</TableCell>
                              <TableCell>{job.place_of_posting}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Mode of Hiring</TableCell>
                              <TableCell>{job.mode_of_hiring}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">CTC Breakdown</TableCell>
                              <TableCell className="whitespace-pre-line">{job.ctc_breakdown}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Offer Type</TableCell>
                              <TableCell>{job.offer_type}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Eligible Branches</TableCell>
                              <TableCell>{job.eligible_branches.join(', ')}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Eligible Degrees</TableCell>
                              <TableCell>{job.eligible_degrees.join(', ')}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Selection Process</TableCell>
                              <TableCell>
                                {Object.entries(job.selection_process).map(([key, value]) => (
                                  <div key={key}>
                                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: {value ? 'Yes' : 'No'}
                                  </div>
                                ))}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Total Rounds</TableCell>
                              <TableCell>{job.total_rounds}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Last Date to Apply</TableCell>
                              <TableCell>{format(new Date(job.last_date_to_apply), 'PPP')}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>

                        {job.job_description_file && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Job Description Document</h4>
                            <Button variant="outline" className="flex gap-2" asChild>
                              <a href={job.job_description_file} target="_blank" rel="noopener noreferrer">
                                <FileText className="h-4 w-4" />
                                View JD
                                <ExternalLink className="h-4 w-4 ml-1" />
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {job.job_description_file && (
                    <Button variant="outline" size="sm" className="flex gap-2" asChild>
                      <a href={job.job_description_file} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4" />
                        View JD
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
            <div className="p-4 mt-auto">
              <Button 
                className="w-full"
                onClick={() => handleApply(job.id)}
                disabled={job.hasApplied || job.job_status !== 'Open' || !profileStatus.isComplete}
              >
                {job.hasApplied ? 'Applied' : 'Apply Now'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No job opportunities available at the moment.</p>
        </div>
      )}
    </div>
  )
} 