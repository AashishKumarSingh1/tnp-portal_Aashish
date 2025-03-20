'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const CATEGORIES = ['GENERAL', 'OBC-NCL', 'SC', 'ST', 'EWS']
const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
]

export default function PersonalDetails() {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchDetails()
  }, [])

  const fetchDetails = async () => {
    try {
      const res = await fetch('/api/student/personal')
      if (!res.ok) throw new Error('Failed to fetch details')
      const data = await res.json()
      setDetails(data)
    } catch (error) {
      toast.error('Failed to load personal details')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)
    try {
      const res = await fetch('/api/student/personal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }
      
      toast.success('Personal details updated successfully')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Personal Details</h1>
        
        <form onSubmit={handleUpdate}>
          <div className="space-y-6">
            {/* Family Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Family Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Father's Name</Label>
                  <Input
                    value={details?.fathers_name || ''}
                    onChange={(e) => setDetails({...details, fathers_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Father's Occupation</Label>
                  <Input
                    value={details?.fathers_occupation || ''}
                    onChange={(e) => setDetails({...details, fathers_occupation: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Mother's Name</Label>
                  <Input
                    value={details?.mothers_name || ''}
                    onChange={(e) => setDetails({...details, mothers_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Mother's Occupation</Label>
                  <Input
                    value={details?.mothers_occupation || ''}
                    onChange={(e) => setDetails({...details, mothers_occupation: e.target.value})}
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Basic Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={details?.date_of_birth || ''}
                    onChange={(e) => setDetails({...details, date_of_birth: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Alternate Mobile</Label>
                  <Input
                    type="tel"
                    pattern="[0-9]{10}"
                    value={details?.alternate_mobile || ''}
                    onChange={(e) => setDetails({...details, alternate_mobile: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Guardian Mobile</Label>
                  <Input
                    type="tel"
                    pattern="[0-9]{10}"
                    value={details?.guardian_mobile || ''}
                    onChange={(e) => setDetails({...details, guardian_mobile: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select
                    value={details?.gender || ''}
                    onValueChange={(value) => setDetails({...details, gender: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={details?.category || ''}
                    onValueChange={(value) => setDetails({...details, category: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Blood Group</Label>
                  <Select
                    value={details?.blood_group || ''}
                    onValueChange={(value) => setDetails({...details, blood_group: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={details?.height || ''}
                    onChange={(e) => setDetails({...details, height: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={details?.weight || ''}
                    onChange={(e) => setDetails({...details, weight: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={details?.is_physically_handicapped || false}
                    onCheckedChange={(checked) => setDetails({
                      ...details,
                      is_physically_handicapped: checked,
                      ph_percent: checked ? details?.ph_percent : null,
                      disability_type: checked ? details?.disability_type : null
                    })}
                  />
                  <Label>Physically Handicapped</Label>
                </div>

                {details?.is_physically_handicapped && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>PH Percentage</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={details?.ph_percent || ''}
                        onChange={(e) => setDetails({...details, ph_percent: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label>Type of Disability</Label>
                      <Input
                        value={details?.disability_type || ''}
                        onChange={(e) => setDetails({...details, disability_type: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Address Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Address Details</h2>
              
              {/* Permanent Address */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-medium">Permanent Address</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Address</Label>
                    <Textarea
                      value={details?.permanent_address || ''}
                      onChange={(e) => setDetails({...details, permanent_address: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>City</Label>
                      <Input
                        value={details?.permanent_city || ''}
                        onChange={(e) => setDetails({...details, permanent_city: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Select
                        value={details?.permanent_state || ''}
                        onValueChange={(value) => setDetails({...details, permanent_state: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>PIN Code</Label>
                      <Input
                        type="text"
                        pattern="[0-9]{6}"
                        value={details?.permanent_pincode || ''}
                        onChange={(e) => setDetails({...details, permanent_pincode: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label>Domicile</Label>
                      <Input
                        value={details?.domicile || ''}
                        onChange={(e) => setDetails({...details, domicile: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Correspondence Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Correspondence Address</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Address</Label>
                    <Textarea
                      value={details?.correspondence_address || ''}
                      onChange={(e) => setDetails({...details, correspondence_address: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>City</Label>
                      <Input
                        value={details?.correspondence_city || ''}
                        onChange={(e) => setDetails({...details, correspondence_city: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Select
                        value={details?.correspondence_state || ''}
                        onValueChange={(value) => setDetails({...details, correspondence_state: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>PIN Code</Label>
                      <Input
                        type="text"
                        pattern="[0-9]{6}"
                        value={details?.correspondence_pincode || ''}
                        onChange={(e) => setDetails({...details, correspondence_pincode: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* ID Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">ID Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Aadhar Number</Label>
                  <Input
                    type="text"
                    pattern="[0-9]{12}"
                    value={details?.aadhar_number || ''}
                    onChange={(e) => setDetails({...details, aadhar_number: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>PAN Number</Label>
                  <Input
                    type="text"
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    value={details?.pan_number || ''}
                    onChange={(e) => setDetails({...details, pan_number: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={details?.driving_license || false}
                    onCheckedChange={(checked) => setDetails({
                      ...details,
                      driving_license: checked,
                      driving_license_number: checked ? details?.driving_license_number : null
                    })}
                  />
                  <Label>Have Driving License</Label>
                </div>

                {details?.driving_license && (
                  <div>
                    <Label>Driving License Number</Label>
                    <Input
                      value={details?.driving_license_number || ''}
                      onChange={(e) => setDetails({...details, driving_license_number: e.target.value})}
                      required
                    />
                  </div>
                )}
              </div>
            </Card>

            <Button type="submit" disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Personal Details'
              )}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
} 