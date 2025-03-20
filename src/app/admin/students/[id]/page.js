'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function StudentProfile() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [studentData, setStudentData] = useState({
    profile: null,
    academics: null,
    documents: null,
    experiences: null,
    personal: null
  })

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    try {
      setLoading(true)
      
      // Single API call to get all student details
      const response = await fetch(`/api/admin/studentdetail/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch student data')
      }
      
      const data = await response.json()
      console.log('Fetched student data:', data)
      setStudentData(data)

    } catch (error) {
      console.error('Error fetching student data:', error)
      toast.error('Failed to load student data')
    } finally {
      setLoading(false)
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
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: 'Super Admin', href: '/super-admin' },
            { label: 'Students', href: '/super-admin/students' },
            { label: studentData.profile?.full_name || 'Student Profile', href: '#' },
          ]}
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{studentData.profile?.full_name}</h1>
          <p className="text-muted-foreground">
            {studentData.profile?.roll_number} • {studentData.profile?.branch}
          </p>
        </div>
        <Link href="/super-admin/students">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Basic Profile</TabsTrigger>
          <TabsTrigger value="academic">Academic Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p>{studentData.profile?.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Roll Number</label>
                    <p>{studentData.profile?.roll_number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Branch</label>
                    <p>{studentData.profile?.branch}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Year</label>
                    <p>{studentData.profile?.current_year}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Degree Type</label>
                    <p>{studentData.profile?.degree_type}</p>
                  </div>
                  {studentData.profile?.specialization && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                      <p>{studentData.profile?.specialization}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">CGPA</label>
                    <p>{studentData.profile?.cgpa}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Passing Year</label>
                    <p>{studentData.profile?.passing_year}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Primary Email</label>
                    <p>{studentData.profile?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Secondary Email</label>
                    <p>{studentData.profile?.secondary_email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Primary Phone</label>
                    <p>{studentData.profile?.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Secondary Phone</label>
                    <p>{studentData.profile?.secondary_phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Account Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email Verification</label>
                    <p>{studentData.profile?.is_email_verified ? 'Verified' : 'Not Verified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Admin Verification</label>
                    <p>{studentData.profile?.is_verified_by_admin ? 'Verified' : 'Not Verified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                    <p>{new Date(studentData.profile?.registration_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p>{new Date(studentData.profile?.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tenth Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">10th Standard</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">School Name</label>
                    <p>{studentData.academics?.tenth_school || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Board</label>
                    <p>{studentData.academics?.tenth_board || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Percentage</label>
                    <p>{studentData.academics?.tenth_percentage || 'Not provided'}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Year</label>
                    <p>{studentData.academics?.tenth_year || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Twelfth Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">12th Standard</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">School Name</label>
                    <p>{studentData.academics?.twelfth_school || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Board</label>
                    <p>{studentData.academics?.twelfth_board || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Percentage</label>
                    <p>{studentData.academics?.twelfth_percentage || 'Not provided'}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Year</label>
                    <p>{studentData.academics?.twelfth_year || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Undergraduate Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Undergraduate</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">College</label>
                    <p>{studentData.academics?.ug_college || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">University</label>
                    <p>{studentData.academics?.ug_university || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Year of Admission</label>
                    <p>{studentData.academics?.ug_year_of_admission || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Overall CGPA</label>
                    <p>{studentData.academics?.overall_cgpa || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Backlogs</label>
                    <p>{studentData.academics?.backlogs || '0'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Backlogs</label>
                    <p>{studentData.academics?.current_backlogs || '0'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gap Years</label>
                    <p>{studentData.academics?.gap_years || '0'}</p>
                  </div>
                </div>

                {/* Semester-wise CGPA */}
                <div className="mt-4">
                  <h4 className="text-md font-medium mb-2">Semester-wise CGPA</h4>
                  <div className="grid grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                      <div key={sem}>
                        <label className="text-sm font-medium text-muted-foreground">Sem {sem}</label>
                        <p>{studentData.academics?.[`sem${sem}_cgpa`] || '-'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Entrance Exam Scores */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Entrance Exam Scores</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">JEE Score</label>
                    <p>{studentData.academics?.jee_score || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">JEE Rank</label>
                    <p>{studentData.academics?.jee_rank || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">GATE Score</label>
                    <p>{studentData.academics?.gate_score || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">GATE Rank</label>
                    <p>{studentData.academics?.gate_rank || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(studentData.documents || {}).map(([type, doc]) => (
                  <div key={type} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                        <p className="text-sm text-muted-foreground truncate">{doc.file_name}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              {studentData.experiences?.length > 0 ? (
                <div className="space-y-6">
                  {studentData.experiences.map((exp, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{exp.company_name}</h3>
                          <p className="text-sm text-muted-foreground">{exp.position}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(exp.start_date).toLocaleDateString()} - 
                          {exp.current_job ? 'Present' : new Date(exp.end_date).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm mt-2">{exp.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Type: {exp.experience_type?.charAt(0).toUpperCase() + exp.experience_type?.slice(1)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No experience details found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Family Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Family Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
                    <p>{studentData.personal?.fathers_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Father's Occupation</label>
                    <p>{studentData.personal?.fathers_occupation || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Mother's Name</label>
                    <p>{studentData.personal?.mothers_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Mother's Occupation</label>
                    <p>{studentData.personal?.mothers_occupation || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Alternate Mobile</label>
                    <p>{studentData.personal?.alternate_mobile || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Guardian Mobile</label>
                    <p>{studentData.personal?.guardian_mobile || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p>{studentData.personal?.date_of_birth ? new Date(studentData.personal.date_of_birth).toLocaleDateString() : 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                    <p>{studentData.personal?.gender || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <p>{studentData.personal?.category || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
                    <p>{studentData.personal?.blood_group || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Address Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium mb-2">Permanent Address</h4>
                    <p className="whitespace-pre-wrap">{studentData.personal?.permanent_address || 'Not provided'}</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">City</label>
                        <p>{studentData.personal?.permanent_city || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">State</label>
                        <p>{studentData.personal?.permanent_state || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">PIN Code</label>
                        <p>{studentData.personal?.permanent_pincode || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium mb-2">Correspondence Address</h4>
                    <p className="whitespace-pre-wrap">{studentData.personal?.correspondence_address || 'Not provided'}</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">City</label>
                        <p>{studentData.personal?.correspondence_city || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">State</label>
                        <p>{studentData.personal?.correspondence_state || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">PIN Code</label>
                        <p>{studentData.personal?.correspondence_pincode || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ID Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">ID Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Aadhar Number</label>
                    <p>{studentData.personal?.aadhar_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">PAN Number</label>
                    <p>{studentData.personal?.pan_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Driving License</label>
                    <p>{studentData.personal?.driving_license_number || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 