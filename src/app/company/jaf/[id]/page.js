'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { 
  Calendar, 
  Building, 
  MapPin, 
  Mail, 
  Phone, 
  Users, 
  FileText, 
  ChevronLeft, 
  Download,
  Briefcase, 
  GraduationCap,
  ListChecks
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function JAFDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [jafData, setJafData] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jafRes, applicationsRes] = await Promise.all([
          fetch(`/api/company/JAF/${params.id}`),
          fetch(`/api/company/JAF/${params.id}/applications`)
        ])
        
        if (!jafRes.ok || !applicationsRes.ok) {
          const error = await jafRes.json()
          throw new Error(error.error || 'Failed to fetch data')
        }
        
        const [jafData, applicationsData] = await Promise.all([
          jafRes.json(),
          applicationsRes.json()
        ])
        
        setJafData(jafData)
        setApplications(applicationsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error(error.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className="container py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (!jafData) {
    return (
      <div className="container py-8">
        <div className="text-center p-8 border rounded-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">JAF Not Found</h2>
          <p className="text-muted-foreground mb-6">The requested JAF may not exist or you don't have permission to view it.</p>
          <Button onClick={() => router.push('/company/jaf')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to JAFs
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" className="mr-4" onClick={() => router.push('/company/jaf')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{jafData.job_profile}</h1>
        <Badge className="ml-4" variant={
          jafData.status === 'Pending Review' ? 'outline' : 
          jafData.status === 'Approved' ? 'success' : 'destructive'
        }>
          {jafData.status}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-red-600" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Mode of Hiring</h3>
                  <p>{jafData.mode_of_hiring}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Place of Posting</h3>
                  <p>{jafData.place_of_posting || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Offer Type</h3>
                  <p>{jafData.offer_type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Date to Apply</h3>
                  <p>{format(new Date(jafData.last_date_to_apply), 'PPP')}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">CTC Breakdown</h3>
                <p className="whitespace-pre-wrap mt-2 p-3 bg-muted/50 rounded-md">{jafData.ctc_breakdown}</p>
              </div>

              {jafData.job_description_file && (
                <div className="pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={jafData.job_description_file} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download Job Description
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Eligibility Criteria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5 text-red-600" />
                Eligibility Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Eligible Batches</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {jafData.eligible_batches.map(batch => (
                    <Badge key={batch} variant="outline">{batch}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Eligible Branches</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {jafData.eligible_branches.map(branch => (
                    <Badge key={branch} variant="outline">{branch}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Eligible Degrees</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {jafData.eligible_degrees.map(degree => (
                    <Badge key={degree} variant="outline">{degree}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selection Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ListChecks className="mr-2 h-5 w-5 text-red-600" />
                Selection Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(jafData.selection_process).map(([key, value]) => (
                  value && (
                    <Badge key={key} variant="secondary">
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                  )
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Rounds</h3>
                  <p>{jafData.total_rounds}</p>
                </div>
                {jafData.min_offers > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Minimum Offers</h3>
                    <p>{jafData.min_offers}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-red-600" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
                <p className="font-medium">{jafData.company_name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Contact Person</h3>
                <p>{jafData.contact_person_name || 'N/A'}</p>
              </div>
              
              <div className="space-y-2">
                {jafData.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${jafData.email}`} className="text-blue-600 hover:underline">
                      {jafData.email}
                    </a>
                  </div>
                )}
                
                {jafData.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{jafData.phone}</span>
                  </div>
                )}
                
                {jafData.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={jafData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {jafData.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-red-600" />
                Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-2">
                  {applications.map(app => (
                    <div key={app.id} className="p-3 border rounded-md">
                      <div className="font-medium">{app.student_name}</div>
                      <div className="text-sm text-muted-foreground">{app.student_email}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No applications yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
