'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Users, Calendar } from 'lucide-react'
import { JAFForm } from '@/components/forms/JAFForm'
import { toast } from 'sonner'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
export default function JAFPage() {
  const [jafs, setJafs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewJAFDialog, setShowNewJAFDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchJAFs()
  }, [])

  const fetchJAFs = async () => {
    try {
      console.log('Fetching JAFs...')
      const res = await fetch('/api/company/JAF')
      
      if (!res.ok) {
        console.error('Failed to fetch JAFs:', res.status, res.statusText)
        throw new Error('Failed to fetch JAFs')
      }
      
      const data = await res.json()
      console.log('Fetched JAFs:', data)
      setJafs(data)
    } catch (error) {
      console.error('Error fetching JAFs:', error)
      toast.error('Failed to load JAFs')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'Open': 'success',
      'Closed': 'secondary',
      'Cancelled': 'destructive'
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <ProtectedRoute allowedRoles={['COMPANY']}>
    <div className=" mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Announcements</h1>
        <Button onClick={() => setShowNewJAFDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New JAF
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active JAFs</TabsTrigger>
          <TabsTrigger value="closed">Closed JAFs</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jafs.filter(jaf => jaf.job_status === 'Open').map((jaf) => (
              <Card key={jaf.id} className="overflow-hidden border border-border/40 hover:border-red-400 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col">
                <div className="bg-gradient-to-r from-red-700 to-red-600 text-white p-4">
                  <h3 className="text-lg font-semibold truncate">{jaf.job_profile}</h3>
                  <p className="text-xs text-red-100 mt-1 opacity-80 truncate">{jaf.place_of_posting || 'Location not specified'}</p>
                </div>
                
                <CardContent className="p-5 space-y-4 flex-grow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Calendar className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span className="font-medium">Due: {new Date(jaf.last_date_to_apply).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</span>
                    </div>
                    
                    <Badge
                      variant={
                        jaf.status === 'Pending Review' ? 'outline' : 
                        jaf.status === 'Approved' ? 'success' : 'destructive'
                      }
                      className={jaf.status === 'Pending Review' ? 'border-amber-400 bg-amber-50 text-amber-700 whitespace-nowrap' : 'whitespace-nowrap'}
                    >
                      {jaf.status}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-800">
                      {jaf.mode_of_hiring}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-50 hover:bg-blue-100 text-blue-700 line-clamp-1">
                      {jaf.offer_type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-1 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      <span>{jaf.application_count || 0} applications</span>
                    </div>
                  </div>
                </CardContent>
                
                <div className="p-4 pt-0 mt-auto">
                  <Button
                    className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                    size="sm"
                    onClick={() => router.push(`/company/jaf/${jaf.id}`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
            
            {jafs.filter(jaf => jaf.job_status === 'Open').length === 0 && (
              <div className="col-span-full text-center p-8 border rounded-lg bg-muted/30">
                <p className="text-muted-foreground">No active JAFs found</p>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewJAFDialog(true)}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first JAF
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="closed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jafs.filter(jaf => jaf.job_status !== 'Open').map((jaf) => (
              <Card key={jaf.id} className="overflow-hidden border border-border/40 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col">
                <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white p-4">
                  <h3 className="text-lg font-semibold truncate">{jaf.job_profile}</h3>
                  <p className="text-xs text-gray-100 mt-1 opacity-80 truncate">{jaf.place_of_posting || 'Location not specified'}</p>
                </div>
                
                <CardContent className="p-5 space-y-4 flex-grow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="font-medium">Closed: {new Date(jaf.updated_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</span>
                    </div>
                    
                    {getStatusBadge(jaf.job_status)}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-800">
                      {jaf.mode_of_hiring}
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-800 line-clamp-1">
                      {jaf.offer_type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-1 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      <span>{jaf.application_count || 0} applications</span>
                    </div>
                  </div>
                </CardContent>
                
                <div className="p-4 pt-0 border-t mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => router.push(`/company/jaf/${jaf.id}`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
            
            {jafs.filter(jaf => jaf.job_status !== 'Open').length === 0 && (
              <div className="col-span-full text-center p-8 border rounded-lg bg-muted/30">
                <p className="text-muted-foreground">No closed JAFs found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showNewJAFDialog} onOpenChange={setShowNewJAFDialog}>
        <DialogContent className="w-[95vw] md:w-[85vw] lg:w-[75vw] max-w-6xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="sticky top-0 z-10 bg-background p-6 border-b">
            <DialogTitle className="text-2xl font-bold text-red-600">New Job Announcement Form</DialogTitle>
          </DialogHeader>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-10rem)]">
            <JAFForm 
              onSubmit={async (formData) => {
                try {
                  const res = await fetch('/api/company/JAF', {
                    method: 'POST',
                    body: formData
                  })
                  
                  if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Failed to submit JAF');
                  }
                  
                  toast.success('JAF submitted successfully')
                  setShowNewJAFDialog(false)
                  
                  // Add a slight delay to ensure the database is updated
                  setTimeout(() => {
                    fetchJAFs() // Refresh the JAF list
                  }, 500)
                } catch (error) {
                  toast.error(`Error submitting JAF: ${error.message}`)
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </ProtectedRoute>
  )
} 