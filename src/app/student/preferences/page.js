'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

const sectors = [
  'Information Technology',
  'Software Development',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Cloud Computing',
  'Cybersecurity',
  'Web Development',
  'Mobile Development',
  'DevOps',
  'Networking',
  'Hardware',
  'IoT',
  'Robotics',
  'Automotive',
  'Manufacturing',
  'Construction',
  'Healthcare',
  'Finance',
  'Consulting'
]

const locations = [
  'Bangalore',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Remote',
  'Noida',
  'Gurgaon',
  'Anywhere in India',
  'International'
]

export default function JobPreferences() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    preferred_sectors: [],
    preferred_locations: [],
    expected_salary: '',
    willing_to_relocate: false,
    linkedin_url: '',
    github_url: '',
    portfolio_url: ''
  })

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/student/preferences')
        const data = await response.json()
        if (data.success && data.preferences) {
          setFormData({
            ...data.preferences,
            preferred_sectors: JSON.parse(data.preferences.preferred_sectors || '[]'),
            preferred_locations: JSON.parse(data.preferences.preferred_locations || '[]'),
            willing_to_relocate: Boolean(data.preferences.willing_to_relocate)
          })
        }
      } catch (error) {
        console.error('Error fetching preferences:', error)
        toast.error('Failed to load preferences')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchPreferences()
    }
  }, [session])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/student/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Preferences saved successfully!')
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  const handleSectorAdd = (sector) => {
    if (!formData.preferred_sectors.includes(sector)) {
      setFormData(prev => ({
        ...prev,
        preferred_sectors: [...prev.preferred_sectors, sector]
      }))
    }
  }

  const handleLocationAdd = (location) => {
    if (!formData.preferred_locations.includes(location)) {
      setFormData(prev => ({
        ...prev,
        preferred_locations: [...prev.preferred_locations, location]
      }))
    }
  }

  const handleSectorRemove = (sector) => {
    setFormData(prev => ({
      ...prev,
      preferred_sectors: prev.preferred_sectors.filter(s => s !== sector)
    }))
  }

  const handleLocationRemove = (location) => {
    setFormData(prev => ({
      ...prev,
      preferred_locations: prev.preferred_locations.filter(l => l !== location)
    }))
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Job Preferences</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Preferred Sectors</CardTitle>
            <CardDescription>Select the sectors you are interested in working in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select onValueChange={handleSectorAdd}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sectors" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.preferred_sectors.map(sector => (
                  <Badge key={sector} variant="secondary" className="flex items-center gap-1">
                    {sector}
                    <button
                      type="button"
                      onClick={() => handleSectorRemove(sector)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferred Locations</CardTitle>
            <CardDescription>Select your preferred work locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select onValueChange={handleLocationAdd}>
                <SelectTrigger>
                  <SelectValue placeholder="Select locations" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.preferred_locations.map(location => (
                  <Badge key={location} variant="secondary" className="flex items-center gap-1">
                    {location}
                    <button
                      type="button"
                      onClick={() => handleLocationRemove(location)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Preferences</CardTitle>
            <CardDescription>Other important details about your job preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expected_salary">Expected Salary (per annum)</Label>
              <Input
                id="expected_salary"
                placeholder="e.g., 12 LPA"
                value={formData.expected_salary}
                onChange={(e) => setFormData(prev => ({ ...prev, expected_salary: e.target.value }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="willing_to_relocate"
                checked={formData.willing_to_relocate}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, willing_to_relocate: checked }))}
              />
              <Label htmlFor="willing_to_relocate">Willing to relocate</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Profiles</CardTitle>
            <CardDescription>Add links to your professional profiles and portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
              <Input
                id="linkedin_url"
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={formData.linkedin_url}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub Profile</Label>
              <Input
                id="github_url"
                type="url"
                placeholder="https://github.com/..."
                value={formData.github_url}
                onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio_url">Portfolio Website</Label>
              <Input
                id="portfolio_url"
                type="url"
                placeholder="https://..."
                value={formData.portfolio_url}
                onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </div>
  )
} 