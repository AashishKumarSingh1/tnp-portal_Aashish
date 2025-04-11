'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function CompanyProfilePage() {
  const { register, handleSubmit, setValue } = useForm()
  const [loading, setLoading] = useState(false)
  const [initialValues, setInitialValues] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/company/profile')
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
      const res = await fetch('/api/company/profile', {
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
    <ProtectedRoute allowedRoles={['COMPANY']}>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Company Profile</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6">
          <div className="space-y-4">
            {/* Company Name */}
            <div className="grid gap-2">
              <Label>Company Name</Label>
              <Input 
                {...register('company_name')} 
                placeholder="e.g. Ashish Software Solutions Pvt. Ltd"
                disabled 
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input 
                {...register('email')} 
                type="email"
                placeholder="e.g. contact@example.com"
                disabled 
              />
            </div>

            {/* Website */}
            <div className="grid gap-2">
              <Label>Website</Label>
              <Input 
                {...register('website')} 
                type="url"
                placeholder="e.g. https://example.com"
                required 
              />
            </div>

            

            {/* Description */}
            <div className="grid gap-2">
              <Label>Company Description</Label>
              <Textarea 
                {...register('description')} 
                placeholder="Brief description of your company..."
                required 
              />
            </div>

            {/* Contact Person Details */}
            <div className="grid gap-2">
              <Label>Contact Person Name</Label>
              <Input 
                {...register('contact_person_name')} 
                placeholder="e.g. John Doe"
                required 
              />
            </div>

            <div className="grid gap-2">
              <Label>Contact Person Designation</Label>
              <Input 
                {...register('contact_person_designation')} 
                placeholder="e.g. HR Manager"
                required 
              />
            </div>

            <div className="grid gap-2">
              <Label>Phone Number</Label>
              <Input 
                {...register('phone')} 
                type="tel"
                pattern="[0-9]{10}"
                placeholder="10-digit phone number"
                required 
              />
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
