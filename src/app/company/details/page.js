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
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

const COMPANY_CATEGORIES = ['Government', 'PSU', 'MNC', 'Private Ltd', 'Startup', 'NGO', 'Other']
const INDUSTRY_SECTORS = ['Core', 'IT', 'Management', 'Finance', 'Consulting', 'Analytics', 'Teaching & Research', 'Other']

function CompanyDetailsForm() {
  const [details, setDetails] = useState({
    head_office_address: '',
    hr_head_name: '',
    mailing_address: '',
    hr_head_contact: '',
    hr_executive_name: '',
    hr_executive_contact: '',
    spoc_name: '',
    spoc_contact: '',
    total_employees: '',
    annual_turnover: '',
    company_category: '',
    other_category: '',
    industry_sector: '',
    other_sector: '',
  })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchDetails()
  }, [])

  const fetchDetails = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/company/details') 
      if (!res.ok) throw new Error('Failed to fetch company details')
      const data = await res.json()
      setDetails({
        head_office_address: data.head_office_address || '',
        hr_head_name: data.hr_head_name || '',
        mailing_address: data.mailing_address || '',
        hr_head_contact: data.hr_head_contact || '',
        hr_executive_name: data.hr_executive_name || '',
        hr_executive_contact: data.hr_executive_contact || '',
        spoc_name: data.spoc_name || '',
        spoc_contact: data.spoc_contact || '',
        total_employees: data.total_employees || '',
        annual_turnover: data.annual_turnover || '',
        company_category: data.company_category || '',
        other_category: data.other_category || '',
        industry_sector: data.industry_sector || '',
        other_sector: data.other_sector || '',
      })
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error('Failed to load company details. Please try again later.')
      setDetails({
        head_office_address: '', hr_head_name: '', mailing_address: '',
        hr_head_contact: '', hr_executive_name: '', hr_executive_contact: '',
        spoc_name: '', spoc_contact: '', total_employees: '', annual_turnover: '',
        company_category: '', other_category: '', industry_sector: '', other_sector: '',
      });
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)
    
    const payload = {
      ...details,
      other_category: details.company_category === 'Other' ? details.other_category : null,
      other_sector: details.industry_sector === 'Other' ? details.other_sector : null,
    };

    try {
      const res = await fetch('/api/company/details', { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update details')
      }
      
      toast.success('Company details updated successfully')
    } catch (error) {
       toast.error(error.message || 'An error occurred during update.')
    } finally {
      setUpdating(false)
    }
  }

  const handleChange = (field, value) => {
    setDetails(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Company Details</h1>
      
      <form onSubmit={handleUpdate}>
        <div className="space-y-6">
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
               <div>
                <Label htmlFor="head_office_address">Head Office Address *</Label>
                <Textarea
                  id="head_office_address"
                  value={details.head_office_address}
                  onChange={(e) => handleChange('head_office_address', e.target.value)}
                  required
                />
              </div>
               <div>
                <Label htmlFor="mailing_address">Mailing Address</Label>
                <Textarea
                  id="mailing_address"
                  value={details.mailing_address}
                  onChange={(e) => handleChange('mailing_address', e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                 <div>
                  <Label htmlFor="hr_head_name">Name of the Human Resources Head *</Label>
                  <Input
                    id="hr_head_name"
                    value={details.hr_head_name}
                    onChange={(e) => handleChange('hr_head_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hr_head_contact">Telephone/ Mobile (HR Head)</Label>
                  <Input
                    id="hr_head_contact"
                    type="tel"
                    value={details.hr_head_contact}
                    onChange={(e) => handleChange('hr_head_contact', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hr_executive_name">Name of the Human Resources Executive *</Label>
                  <Input
                    id="hr_executive_name"
                    value={details.hr_executive_name}
                    onChange={(e) => handleChange('hr_executive_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hr_executive_contact">Telephone/ Mobile (HR Executive) *</Label>
                  <Input
                    id="hr_executive_contact"
                    type="tel"
                    value={details.hr_executive_contact}
                    onChange={(e) => handleChange('hr_executive_contact', e.target.value)}
                    required
                  />
                </div>
                 <div>
                  <Label htmlFor="spoc_name">Name of the SPOC (Single Point of Contact) *</Label>
                  <Input
                    id="spoc_name"
                    value={details.spoc_name}
                    onChange={(e) => handleChange('spoc_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="spoc_contact">Telephone/ Mobile (SPOC) *</Label>
                  <Input
                    id="spoc_contact"
                    type="tel"
                    value={details.spoc_contact}
                    onChange={(e) => handleChange('spoc_contact', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Company Overview</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total_employees">Total Number Of Employees *</Label>
                <Input
                  id="total_employees"
                  type="number"
                  min="1"
                  value={details.total_employees}
                  onChange={(e) => handleChange('total_employees', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="annual_turnover">Annual Turnover</Label>
                <Input
                  id="annual_turnover"
                  value={details.annual_turnover}
                  onChange={(e) => handleChange('annual_turnover', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="company_category">Company Category *</Label>
                <Select
                  value={details.company_category}
                  onValueChange={(value) => handleChange('company_category', value)}
                  required
                >
                  <SelectTrigger id="company_category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {details.company_category === 'Other' && (
                <div>
                  <Label htmlFor="other_category">Specify Other Category *</Label>
                  <Input
                    id="other_category"
                    value={details.other_category}
                    onChange={(e) => handleChange('other_category', e.target.value)}
                    required={details.company_category === 'Other'}
                  />
                </div>
              )}
               <div>
                <Label htmlFor="industry_sector">Industry Sector *</Label>
                <Select
                  value={details.industry_sector}
                  onValueChange={(value) => handleChange('industry_sector', value)}
                  required
                >
                  <SelectTrigger id="industry_sector">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRY_SECTORS.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               {details.industry_sector === 'Other' && (
                <div>
                  <Label htmlFor="other_sector">Specify Other Sector *</Label>
                  <Input
                    id="other_sector"
                    value={details.other_sector}
                    onChange={(e) => handleChange('other_sector', e.target.value)}
                    required={details.industry_sector === 'Other'}
                  />
                </div>
              )}
            </div>
          </Card>

          <Button type="submit" disabled={updating || loading}>
            {updating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Company Details'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

// Main page component
export default function CompanyDetailsPage() {
  return (
    <ProtectedRoute allowedRoles={['COMPANY', 'ADMIN']}>
      <CompanyDetailsForm />
    </ProtectedRoute>
  )
}
