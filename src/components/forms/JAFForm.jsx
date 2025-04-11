'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { Upload, Loader2 } from 'lucide-react'
import { branches, PassingYear, DegreeTypes } from '@/lib/data'

export function JAFForm({ onSubmit, initialData }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(initialData || {
    mode_of_hiring: '',
    job_profile: '',
    place_of_posting: '',
    ctc_breakdown: '',
    offer_type: '',
    eligible_batches: [],
    eligible_branches: [],
    eligible_degrees: [],
    selection_process: {
      resume_shortlist: false,
      written_test: false,
      group_discussion: false,
      personal_interview: false,
      medical_test: false
    },
    total_rounds: 1,
    min_offers: 0,
    last_date_to_apply: '',
    job_description_file: null
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.mode_of_hiring) {
      toast.error('Please select mode of hiring')
      return
    }
    if (!formData.job_profile) {
      toast.error('Please enter job profile')
      return
    }
    if (!formData.ctc_breakdown) {
      toast.error('Please enter CTC breakdown')
      return
    }
    if (!formData.offer_type) {
      toast.error('Please select offer type')
      return
    }
    if (formData.eligible_batches.length === 0) {
      toast.error('Please select at least one eligible batch')
      return
    }
    if (formData.eligible_branches.length === 0) {
      toast.error('Please select at least one eligible branch')
      return
    }
    if (formData.eligible_degrees.length === 0) {
      toast.error('Please select at least one eligible degree')
      return
    }
    if (!formData.last_date_to_apply) {
      toast.error('Please select last date to apply')
      return
    }

    setIsSubmitting(true)

    try {
      // Handle file upload first if there's a file
      let jobDescriptionUrl = null
      let jobDescriptionFileName = null
      
      if (formData.job_description_file) {
        const file = formData.job_description_file
        
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          toast.error('File size should not exceed 10MB')
          setIsSubmitting(false)
          return
        }
        
        // Start file upload with toast notification
        const loadingToast = toast.loading(`Uploading ${file.name}...`)
        
        // Create FormData for file upload
        const fileFormData = new FormData()
        fileFormData.append('file', file)
        
        // Upload file to /api/upload endpoint
        try {
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: fileFormData
          })
          
          if (!uploadRes.ok) throw new Error('Failed to upload file')
          
          const { url, id } = await uploadRes.json()
          jobDescriptionUrl = url
          jobDescriptionFileName = file.name
          
          toast.dismiss(loadingToast)
          toast.success('File uploaded successfully')
        } catch (error) {
          toast.dismiss(loadingToast)
          toast.error('Error uploading file: ' + error.message)
          setIsSubmitting(false)
          return
        }
      }
      
      // Prepare form data with file URL instead of the file
      const formDataToSend = new FormData()
      
      // Add all fields except job_description_file
      Object.keys(formData).forEach(key => {
        if (key !== 'job_description_file') {
          if (typeof formData[key] === 'object') {
            formDataToSend.append(key, JSON.stringify(formData[key]))
          } else {
            formDataToSend.append(key, formData[key])
          }
        }
      })
      
      // Add file URL and filename instead of the file
      if (jobDescriptionUrl) {
        formDataToSend.append('job_description_url', jobDescriptionUrl)
        formDataToSend.append('job_description_filename', jobDescriptionFileName)
      }
      
      // Submit the form data
      const submittingToast = toast.loading('Submitting JAF...')
      await onSubmit(formDataToSend)
      toast.dismiss(submittingToast)
    } catch (error) {
      toast.error('Error submitting JAF: ' + error.message)
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Details Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Basic Details</h3>
        <div className="space-y-6">
          {/* Mode of Hiring */}
          <div className="space-y-3">
            <Label className="text-base">Mode of Hiring *</Label>
            <RadioGroup
              value={formData.mode_of_hiring}
              onValueChange={(value) => setFormData({...formData, mode_of_hiring: value})}
              className="flex flex-col sm:flex-row gap-4"
            >
              {[
                { value: 'OnCampus', label: 'OnCampus (Offline)' },
                { value: 'Virtual', label: 'Virtual' },
                { value: 'Hybrid', label: 'Hybrid' }
              ].map(option => (
                <div key={option.value} className="flex items-center space-x-2 bg-secondary/20 rounded-lg px-4 py-2 flex-1">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-grow cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Job Profile and Place of Posting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-base">Job Profile *</Label>
              <Input
                value={formData.job_profile}
                onChange={(e) => setFormData({...formData, job_profile: e.target.value})}
                placeholder="Enter job profile/designation"
                className="bg-secondary/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base">Place of Posting</Label>
              <Input
                value={formData.place_of_posting}
                onChange={(e) => setFormData({...formData, place_of_posting: e.target.value})}
                placeholder="Enter place of posting"
                className="bg-secondary/10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Compensation Details Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Compensation & Offer Details</h3>
        <div className="space-y-6">
          {/* CTC Breakdown */}
          <div className="space-y-2">
            <Label className="text-base">CTC Breakdown *</Label>
            <Textarea
              value={formData.ctc_breakdown}
              onChange={(e) => setFormData({...formData, ctc_breakdown: e.target.value})}
              placeholder="Enter detailed CTC breakdown"
              rows={4}
              className="bg-secondary/10"
            />
          </div>

          {/* Type of Offer */}
          <div className="space-y-3">
            <Label className="text-base">Type of Offer *</Label>
            <RadioGroup
              value={formData.offer_type}
              onValueChange={(value) => setFormData({...formData, offer_type: value})}
              className="flex flex-col sm:flex-row gap-4"
            >
              {[
                { value: '6 Month Intern', label: '6 Month Intern' },
                { value: '6 Month Intern + PPO', label: '6 Month Intern + PPO' },
                { value: '2 month Intern', label: '2 month Intern' }
              ].map(option => (
                <div key={option.value} className="flex items-center space-x-2 bg-secondary/20 rounded-lg px-4 py-2 flex-1">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-grow cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </Card>

      {/* Eligibility Criteria Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Eligibility Criteria</h3>
        <div className="space-y-6">
          {/* Eligible Batches */}
          <div className="space-y-3">
            <Label className="text-base">Eligible Batches *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {PassingYear.map(year => (
                <div
                  key={year}
                  className={`flex items-center space-x-2 rounded-lg px-3 py-2 border transition-colors
                    ${formData.eligible_batches.includes(year) 
                      ? 'bg-primary/10 border-primary/50' 
                      : 'bg-secondary/10 border-transparent'}`}
                >
                  <Checkbox
                    checked={formData.eligible_batches.includes(year)}
                    onCheckedChange={(checked) => {
                      setFormData({
                        ...formData,
                        eligible_batches: checked 
                          ? [...formData.eligible_batches, year]
                          : formData.eligible_batches.filter(y => y !== year)
                      })
                    }}
                  />
                  <Label className="flex-grow cursor-pointer">{year}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Eligible Branches */}
          <div className="space-y-3">
            <Label className="text-base">Eligible Branches *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {branches.map(branch => (
                <div
                  key={branch}
                  className={`flex items-center space-x-2 rounded-lg px-3 py-2 border transition-colors
                    ${formData.eligible_branches.includes(branch) 
                      ? 'bg-primary/10 border-primary/50' 
                      : 'bg-secondary/10 border-transparent'}`}
                >
                  <Checkbox
                    checked={formData.eligible_branches.includes(branch)}
                    onCheckedChange={(checked) => {
                      setFormData({
                        ...formData,
                        eligible_branches: checked 
                          ? [...formData.eligible_branches, branch]
                          : formData.eligible_branches.filter(b => b !== branch)
                      })
                    }}
                  />
                  <Label className="flex-grow cursor-pointer text-sm">{branch}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Eligible Degrees */}
          <div className="space-y-3">
            <Label className="text-base">Eligible Degrees *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {DegreeTypes.map(degree => (
                <div
                  key={degree}
                  className={`flex items-center space-x-2 rounded-lg px-3 py-2 border transition-colors
                    ${formData.eligible_degrees.includes(degree) 
                      ? 'bg-primary/10 border-primary/50' 
                      : 'bg-secondary/10 border-transparent'}`}
                >
                  <Checkbox
                    checked={formData.eligible_degrees.includes(degree)}
                    onCheckedChange={(checked) => {
                      setFormData({
                        ...formData,
                        eligible_degrees: checked 
                          ? [...formData.eligible_degrees, degree]
                          : formData.eligible_degrees.filter(d => d !== degree)
                      })
                    }}
                  />
                  <Label className="flex-grow cursor-pointer text-sm">{degree}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Selection Process Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Selection Process</h3>
        <div className="space-y-6">
          {/* Selection Process Steps */}
          <div className="space-y-3">
            <Label className="text-base">Selection Rounds</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries({
                resume_shortlist: 'Resume Shortlist',
                written_test: 'Written Test',
                group_discussion: 'Group Discussion',
                personal_interview: 'Personal Interview',
                medical_test: 'Medical Test'
              }).map(([key, label]) => (
                <div
                  key={key}
                  className={`flex items-center space-x-2 rounded-lg px-3 py-2 border transition-colors
                    ${formData.selection_process[key] 
                      ? 'bg-primary/10 border-primary/50' 
                      : 'bg-secondary/10 border-transparent'}`}
                >
                  <Checkbox
                    checked={formData.selection_process[key]}
                    onCheckedChange={(checked) => {
                      setFormData({
                        ...formData,
                        selection_process: {
                          ...formData.selection_process,
                          [key]: checked
                        }
                      })
                    }}
                  />
                  <Label className="flex-grow cursor-pointer">{label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Total Rounds and Minimum Offers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-base">Total Number of Rounds *</Label>
              <Input
                type="number"
                min="1"
                value={formData.total_rounds}
                onChange={(e) => setFormData({...formData, total_rounds: parseInt(e.target.value)})}
                className="bg-secondary/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base">Minimum Number of Offers</Label>
              <Input
                type="number"
                min="0"
                value={formData.min_offers}
                onChange={(e) => setFormData({...formData, min_offers: parseInt(e.target.value)})}
                className="bg-secondary/10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Additional Details Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
        <div className="space-y-6">
          {/* Last Date to Apply */}
          <div className="space-y-2">
            <Label className="text-base">Last Date to Apply *</Label>
            <Input
              type="date"
              value={formData.last_date_to_apply}
              onChange={(e) => setFormData({...formData, last_date_to_apply: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              className="bg-secondary/10"
            />
          </div>

          {/* Job Description File */}
          <div className="space-y-2">
            <Label className="text-base">Job Description File</Label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFormData({...formData, job_description_file: e.target.files[0] || null})}
              className="bg-secondary/10"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Upload PDF, DOC, or DOCX file (Max 10MB). Larger files will be rejected.
            </p>
            {formData.job_description_file && (
              <p className="text-sm font-medium mt-1">
                Selected file: {formData.job_description_file.name} 
                ({Math.round(formData.job_description_file.size / 1024 / 1024 * 10) / 10} MB)
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <div className=" bg-background p-4 border-t">
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Submit JAF
            </>
          )}
        </Button>
      </div>
    </form>
  )
} 