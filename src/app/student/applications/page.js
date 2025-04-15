//applications page
//coming soon under development 

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, FileText, Download, Building2, MapPin, Briefcase, Award, Users, Clock, Calendar } from 'lucide-react'
import Link from 'next/link'
import { JobDetailsModal } from './components/JobDetailsModal'
import { Separator } from "@/components/ui/separator"

export default function ApplicationsPage() {
  const { data: session } = useSession()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/student/applications')
      if (!res.ok) throw new Error('Failed to fetch applications')
      const data = await res.json()
      if (data.success) {
        // Parse eligible_batches, eligible_branches, eligible_degrees if they're strings
        const processedApplications = data.applications.map(app => ({
          ...app,
          eligible_batches: typeof app.eligible_batches === 'string' ? JSON.parse(app.eligible_batches) : app.eligible_batches,
          eligible_branches: typeof app.eligible_branches === 'string' ? JSON.parse(app.eligible_branches) : app.eligible_branches,
          eligible_degrees: typeof app.eligible_degrees === 'string' ? JSON.parse(app.eligible_degrees) : app.eligible_degrees,
          selection_process: typeof app.selection_process === 'string' ? JSON.parse(app.selection_process) : app.selection_process
        }))
        setApplications(processedApplications)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (app) => {
    setSelectedJob(app)
    setShowModal(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-500 text-white'
      case 'Resume Shortlisted':
      case 'Shortlisted':
        return 'bg-yellow-500 text-white'
      case 'Written Test':
      case 'GD Round':
      case 'Technical Interview':
      case 'HR Interview':
        return 'bg-purple-500 text-white'
      case 'Selected':
        return 'bg-green-500 text-white'
      case 'Offer Given':
        return 'bg-emerald-500 text-white'
      case 'Rejected':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>
      
      <div className="grid gap-6">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground text-center">You haven't applied to any positions yet.</p>
              <Link href="/student/jobs">
                <Button className="mt-4">Browse Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          applications.map((app) => (
            <Card key={app.id} className="overflow-hidden">
              {/* Status Banner */}
              <div className={`w-full py-2 px-4 ${getStatusColor(app.status)}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{app.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Round {app.current_round}</span>
                  </div>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{app.job_profile}</CardTitle>
                    <CardDescription className="text-base">{app.company_name}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-6">
                  {/* Job Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Offer Type</p>
                        <p className="font-medium">{app.offer_type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{app.place_of_posting}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Mode of Hiring</p>
                        <p className="font-medium">{app.mode_of_hiring}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Application Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Applied On</p>
                        <p className="font-medium">{new Date(app.applied_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Current Process</p>
                        <p className="font-medium">{app.round_type || 'Application Review'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Remarks */}
                  {app.remarks && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Remarks</p>
                        <p className="bg-muted p-3 rounded-md">{app.remarks}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-4 border-t pt-4">
                <Button variant="default" onClick={() => handleViewDetails(app)}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Job Details
                </Button>
                {app.job_description_file && (
                  <Button variant="outline" asChild>
                    <a href={app.job_description_file} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download JD
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      {/* Job Details Modal */}
      <JobDetailsModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        jobDetails={selectedJob} 
      />
    </div>
  )
}

