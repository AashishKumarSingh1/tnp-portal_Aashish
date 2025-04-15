'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, ArrowLeft, Download, Briefcase, GraduationCap, User, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { format } from 'date-fns'
import ProtectedRoute from "@/components/auth/ProtectedRoute"

export default function StudentApplicationPage({ params }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [application, setApplication] = useState(null)
  const [jobDetails, setJobDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [jafId, setJafId] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [statusRemarks, setStatusRemarks] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true)
        const id = params?.id
        
        if (!id) {
          throw new Error('Application ID is required')
        }

        // First fetch the application details to get the JAF ID
        const appRes = await fetch(`/api/company/applications/${id}`)
        
        if (!appRes.ok) {
          throw new Error('Failed to fetch application details')
        }
        
        const appData = await appRes.json()
        
        if (!appData.success || !appData.application) {
          throw new Error(appData.message || 'Application not found')
        }
        
        setApplication(appData.application)
        setJafId(appData.application.jaf_id)
        setSelectedStatus(appData.application.status)
        setStatusRemarks(appData.application.remarks || '')
        
        // Then fetch the job details
        const jobRes = await fetch(`/api/company/jaf/${appData.application.jaf_id}`)
        
        if (!jobRes.ok) {
          throw new Error('Failed to fetch job details')
        }
        
        const jobData = await jobRes.json()
        
        if (!jobData.success) {
          throw new Error(jobData.message || 'Job not found')
        }
        
        setJobDetails(jobData.job)
      } catch (error) {
        console.error('Error fetching details:', error)
        toast.error(error.message || 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.role?.toUpperCase() === 'COMPANY') {
      fetchApplicationDetails()
    }
  }, [params?.id, session])

  const handleStatusUpdate = async () => {
    try {
      setUpdatingStatus(true)
      
      const res = await fetch(`/api/company/jaf/${jafId}/applications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: application.id,
          status: selectedStatus,
          remarks: statusRemarks
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to update status')
      }

      toast.success('Application status updated')
      
      // Update local state
      setApplication(prev => ({
        ...prev,
        status: selectedStatus,
        remarks: statusRemarks
      }))
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-500/10 text-blue-500'
      case 'Resume Shortlisted':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'Written Test':
      case 'GD Round':
      case 'Technical Interview':
      case 'HR Interview':
        return 'bg-purple-500/10 text-purple-500'
      case 'Selected':
      case 'Offer Given':
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

  if (!application) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-destructive text-center">Application not found</p>
            <Button variant="outline" className="mt-4" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{application.student_name}</h1>
            <p className="text-muted-foreground">{application.roll_number}</p>
          </div>
        </div>
        <Badge className={getStatusColor(application.status)} variant="secondary">
          {application.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Student Info Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage 
                  src={application.documents?.find(d => d.type === 'profile_photo')?.url} 
                  alt={application.student_name} 
                />
                <AvatarFallback>{application.student_name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{application.student_name}</h3>
                <p className="text-sm text-muted-foreground">{application.roll_number}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm">{application.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm">{application.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Education</p>
                  <p className="text-sm">{application.branch}</p>
                  <p className="text-sm text-muted-foreground">{application.degree_type}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Application Status</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Change Status</p>
              <select 
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
              >
                <option value="Applied">Applied</option>
                <option value="Resume Shortlisted">Resume Shortlisted</option>
                <option value="Written Test">Written Test</option>
                <option value="GD Round">GD Round</option>
                <option value="Technical Interview">Technical Interview</option>
                <option value="HR Interview">HR Interview</option>
                <option value="Selected">Selected</option>
                <option value="Offer Given">Offer Given</option>
                <option value="Rejected">Rejected</option>
              </select>
              <textarea
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm mt-2"
                placeholder="Add remarks (optional)"
                value={statusRemarks}
                onChange={e => setStatusRemarks(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleStatusUpdate}
                disabled={updatingStatus || selectedStatus === application.status}
                className="w-full mt-2"
              >
                {updatingStatus ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Update Status
              </Button>
            </div>

            {application.documents?.find(d => d.type === 'resume')?.url && (
              <Button variant="outline" className="w-full" asChild>
                <Link href={application.documents.find(d => d.type === 'resume').url} target="_blank">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Details Tabs */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardDescription>Applied on {format(new Date(application.applied_at), 'PPP')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="education">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
              </TabsList>
              
              <TabsContent value="education" className="space-y-4 mt-4">
                <div>
                  <h3 className="text-lg font-semibold">Academic Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Degree</p>
                      <p>{application.degree_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Branch</p>
                      <p>{application.branch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CGPA</p>
                      <p>{application.cgpa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Overall CGPA</p>
                      <p>{application.overall_cgpa || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Backlogs</p>
                      <p>{application.current_backlogs || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Backlogs</p>
                      <p>{application.backlogs || 0}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="personal" className="space-y-4 mt-4">
                <div>
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Father's Name</p>
                      <p>{application.fathers_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mother's Name</p>
                      <p>{application.mothers_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p>{application.date_of_birth ? format(new Date(application.date_of_birth), 'PPP') : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p>{application.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p>{application.category || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{application.phone || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Permanent Address</p>
                      <p>{application.permanent_address || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Correspondence Address</p>
                      <p>{application.correspondence_address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="skills" className="space-y-4 mt-4">
                <div>
                  <h3 className="text-lg font-semibold">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {application.technical_skills && application.technical_skills.length > 0 ? (
                      application.technical_skills.map((skill, index) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No technical skills listed</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {application.soft_skills && application.soft_skills.length > 0 ? (
                      application.soft_skills.map((skill, index) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No soft skills listed</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Certifications</h3>
                  <div className="mt-2">
                    {application.certifications && application.certifications.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {application.certifications.map((cert, index) => (
                          <li key={index}>{cert}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No certifications listed</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Achievements</h3>
                  <div className="mt-2">
                    {application.achievements && application.achievements.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {application.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No achievements listed</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Projects</h3>
                  <div className="mt-2">
                    {application.projects && application.projects.length > 0 ? (
                      <div className="space-y-4">
                        {application.projects.map((project, index) => (
                          <div key={index} className="border rounded-md p-3">
                            <h4 className="font-semibold">{project.title}</h4>
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No projects listed</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Online Profiles</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {application.linkedin_url && (
                      <Button variant="outline" asChild size="sm">
                        <Link href={application.linkedin_url} target="_blank">LinkedIn</Link>
                      </Button>
                    )}
                    {application.github_url && (
                      <Button variant="outline" asChild size="sm">
                        <Link href={application.github_url} target="_blank">GitHub</Link>
                      </Button>
                    )}
                    {application.portfolio_url && (
                      <Button variant="outline" asChild size="sm">
                        <Link href={application.portfolio_url} target="_blank">Portfolio</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="experience" className="space-y-4 mt-4">
                <div>
                  <h3 className="text-lg font-semibold">Work Experience</h3>
                  <div className="mt-2">
                    {application.experience_companies && application.experience_companies.length > 0 ? (
                      <div className="space-y-4">
                        {application.experience_companies.map((company, index) => (
                          <div key={index} className="border rounded-md p-3">
                            <h4 className="font-semibold">{company}</h4>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No work experience listed</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Applicants
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  )
} 