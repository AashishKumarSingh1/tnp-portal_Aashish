'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function CreateAdminDialog({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    batchYear: '',
    phone: '',
    department: '',
    registrationNumber: '',
    roleId: '2', // Default to normal admin
    isVerified: true,
    isActive: true
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/super-admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          batchYear: formData.batchYear ? parseInt(formData.batchYear) : null,
          roleId: parseInt(formData.roleId)
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create admin')
      }

      toast.success('Admin created successfully')
      onSuccess?.()
      onClose()
      setFormData({
        email: '',
        password: '',
        name: '',
        batchYear: '',
        phone: '',
        department: '',
        registrationNumber: '',
        roleId: '2',
        isVerified: true,
        isActive: true
      })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            <span className="gradient-text">Create New Admin</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Role Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Admin Type</h2>
            <RadioGroup
              defaultValue="2"
              value={formData.roleId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, roleId: value }))}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="admin" />
                <Label htmlFor="admin">Normal Admin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="super-admin" />
                <Label htmlFor="super-admin">Super Admin</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block text-muted-foreground">
                  Full Name*
                </Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block text-muted-foreground">
                  Email*
                </Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block text-muted-foreground">
                  Password*
                </Label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block text-muted-foreground">
                  Phone Number
                </Label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block text-muted-foreground">
                  Department
                </Label>
                <Input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                  disabled={loading}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block text-muted-foreground">
                  Batch Year
                </Label>
                <Input
                  name="batchYear"
                  type="number"
                  min="2000"
                  max="2099"
                  value={formData.batchYear}
                  onChange={handleChange}
                  placeholder="Enter batch year"
                  disabled={loading}
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-medium mb-2 block text-muted-foreground">
                  Registration Number
                </Label>
                <Input
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="Enter registration number"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </div>
            ) : (
              'Create Admin'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 