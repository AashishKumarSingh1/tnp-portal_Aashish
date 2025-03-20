'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentExperience, setCurrentExperience] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userDegree, setUserDegree] = useState(null)

  useEffect(() => {
    fetchUserDegree()
    fetchExperiences()
  }, [])

  const fetchUserDegree = async () => {
    try {
      const res = await fetch('/api/student/profile')
      if (!res.ok) throw new Error('Failed to fetch profile')
      const data = await res.json()
      setUserDegree(data.degree_type)
    } catch (error) {
      toast.error('Failed to load profile')
    }
  }

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/student/experience')
      if (!res.ok) throw new Error('Failed to fetch experiences')
      const data = await res.json()
      setExperiences(data)
    } catch (error) {
      toast.error('Failed to load experiences')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/student/experience', {
        method: currentExperience?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentExperience)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }

      toast.success(
        currentExperience?.id 
          ? 'Experience updated successfully' 
          : 'Experience added successfully'
      )
      setIsDialogOpen(false)
      fetchExperiences()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this experience?')) return

    try {
      const res = await fetch(`/api/student/experience/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete experience')
      
      toast.success('Experience deleted successfully')
      fetchExperiences()
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Experience Details</h1>
            <p className="text-muted-foreground mt-2">
              Add your internship and job experiences here
            </p>
          </div>
          <Button
            onClick={() => {
              setCurrentExperience({
                company_name: '',
                position: '',
                start_date: '',
                end_date: '',
                current_job: false,
                description: '',
                experience_type: 'internship'
              })
              setIsDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>

        <div className="grid gap-4">
          {experiences.length === 0 ? (
            <Card className="p-6">
              <p className="text-muted-foreground text-center">
                No experience details added yet. Add your internships and job experiences to showcase your professional background.
              </p>
            </Card>
          ) : (
            experiences.map((exp) => (
              <Card key={exp.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{exp.position}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        exp.experience_type === 'internship' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {exp.experience_type === 'internship' ? 'Internship' : 'Job'}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{exp.company_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(exp.start_date).toLocaleDateString()} - {' '}
                      {exp.current_job 
                        ? 'Present'
                        : new Date(exp.end_date).toLocaleDateString()}
                    </p>
                    <p className="mt-2">{exp.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentExperience({
                          ...exp,
                          start_date: exp.start_date.split('T')[0],
                          end_date: exp.end_date?.split('T')[0] || ''
                        })
                        setIsDialogOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(exp.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentExperience?.id ? 'Edit Experience' : 'Add Experience'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Experience Type</Label>
                <Select
                  value={currentExperience?.experience_type || 'internship'}
                  onValueChange={(value) => setCurrentExperience({
                    ...currentExperience,
                    experience_type: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="job">Job</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Company Name</Label>
                <Input
                  value={currentExperience?.company_name || ''}
                  onChange={(e) => setCurrentExperience({
                    ...currentExperience,
                    company_name: e.target.value
                  })}
                  required
                />
              </div>

              <div>
                <Label>Position</Label>
                <Input
                  value={currentExperience?.position || ''}
                  onChange={(e) => setCurrentExperience({
                    ...currentExperience,
                    position: e.target.value
                  })}
                  required
                />
              </div>

              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={currentExperience?.start_date || ''}
                  onChange={(e) => setCurrentExperience({
                    ...currentExperience,
                    start_date: e.target.value
                  })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={currentExperience?.current_job || false}
                  onCheckedChange={(checked) => setCurrentExperience({
                    ...currentExperience,
                    current_job: checked,
                    end_date: checked ? null : currentExperience?.end_date
                  })}
                />
                <Label>Current Job</Label>
              </div>

              {!currentExperience?.current_job && (
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={currentExperience?.end_date || ''}
                    onChange={(e) => setCurrentExperience({
                      ...currentExperience,
                      end_date: e.target.value
                    })}
                    required
                  />
                </div>
              )}

              <div>
                <Label>Description</Label>
                <Textarea
                  value={currentExperience?.description || ''}
                  onChange={(e) => setCurrentExperience({
                    ...currentExperience,
                    description: e.target.value
                  })}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
} 