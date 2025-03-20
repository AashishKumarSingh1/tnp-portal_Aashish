'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { PassingYear, Specialization, DegreeTypes, DEGREE_WITH_SPECIALIZATION } from '@/lib/data'

export default function StudentProfilePage() {
  const { register, handleSubmit, setValue, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const [initialValues, setInitialValues] = useState(null)
  const currentDegree = watch('degree_type')
  const showSpecialization = DEGREE_WITH_SPECIALIZATION.includes(currentDegree)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/student/profile')
      if (!res.ok) throw new Error('Failed to fetch profile')
      const data = await res.json()
      
      // Store initial values
      setInitialValues(data)
      
      // Set form values
      Object.entries(data).forEach(([key, value]) => {
        setValue(key, value)
      })
    } catch (error) {
      toast.error('Failed to load profile')
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Clear specialization if degree type doesn't need it
      if (!DEGREE_WITH_SPECIALIZATION.includes(data.degree_type)) {
        data.specialization = null
      }

      const res = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }

      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6">
          <div className="space-y-4">
            {/* Non-editable fields */}
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input {...register('full_name')} disabled />
            </div>

            <div className="grid gap-2">
              <Label>Roll Number</Label>
              <Input {...register('roll_number')} disabled />
            </div>

            <div className="grid gap-2">
              <Label>Primary Email</Label>
              <Input {...register('primary_email')} disabled />
            </div>

            {/* Degree Type */}
            <div className="grid gap-2">
              <Label>Degree Type</Label>
              <Select 
                onValueChange={(value) => {
                  setValue('degree_type', value)
                  if (!DEGREE_WITH_SPECIALIZATION.includes(value)) {
                    setValue('specialization', null)
                  }
                }}
                value={watch('degree_type') || initialValues?.degree_type}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select degree type" />
                </SelectTrigger>
                <SelectContent>
                  {DegreeTypes.map((degree) => (
                    <SelectItem key={degree} value={degree}>
                      {degree}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Branch</Label>
              <Input {...register('branch')} disabled />
            </div>

            {/* Show specialization only for relevant degree types */}
            {showSpecialization && (
              <div className="grid gap-2">
                <Label>Specialization</Label>
                <Select 
                  onValueChange={(value) => setValue('specialization', value)} 
                  value={watch('specialization') || initialValues?.specialization}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {Specialization.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Other editable fields */}
            <div className="grid gap-2">
              <Label>CGPA</Label>
              <Input {...register('cgpa')} type="number" step="0.01" min="0" max="10" required />
            </div>

            <div className="grid gap-2">
              <Label>Primary Phone</Label>
              <Input {...register('phone')} type="tel" required />
            </div>

            <div className="grid gap-2">
              <Label>Secondary Phone (Optional)</Label>
              <Input {...register('secondary_phone')} type="tel" />
            </div>

            <div className="grid gap-2">
              <Label>Secondary Email (Optional)</Label>
              <Input {...register('secondary_email')} type="email" />
            </div>

            <div className="grid gap-2">
              <Label>Passing Year</Label>
              <Select 
                onValueChange={(value) => setValue('passing_year', value)} 
                value={watch('passing_year')?.toString() || initialValues?.passing_year?.toString()}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select passing year" />
                </SelectTrigger>
                <SelectContent>
                  {PassingYear.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </ProtectedRoute>
  )
}
