"use client"
import { Metadata } from 'next'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { GraduationCap, Building } from 'lucide-react'
import { branches, Year, PassingYear } from '@/lib/data'





export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [type, setType] = useState('')
  const [formData, setFormData] = useState({})
  const router = useRouter()

  const handleRoleSelect = (selectedType) => {
    setType(selectedType)
    setStep(2)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...formData })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast.success('Registration successful! Please check your email for verification.')
      router.push('/verify-email?email=' + encodeURIComponent(formData.email))
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            <span className="gradient-text">Join TNP Cell NIT Patna</span>
          </h1>
          <p className="text-muted-foreground">
            Register to access the Training & Placement Cell portal
          </p>
        </div>

        <Card className="p-6 md:p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-red-900 dark:text-red-500">Select Your Role</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant={type === 'student' ? 'default' : 'outline'}
                  className="h-32 text-lg border-red-900/20 hover:bg-red-900/5"
                  onClick={() => handleRoleSelect('student')}
                >
                  <GraduationCap className="w-6 h-6 mb-2" />
                  Register as Student
                </Button>
                <Button
                  variant={type === 'company' ? 'default' : 'outline'}
                  className="h-32 text-lg border-red-900/20 hover:bg-red-900/5"
                  onClick={() => handleRoleSelect('company')}
                >
                  <Building className="w-6 h-6 mb-2" />
                  Register as Company
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-red-900 dark:text-red-500">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-muted-foreground">
                      Email*
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder={type === 'student' ? 'ashishk.dd22.cs@nitp.ac.in' : 'ashishk.dd22.cs@nitp.ac.in'}
                      onChange={handleInputChange}
                      className="border-red-900/20 focus:border-red-900/40"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-muted-foreground">
                      Password*
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      onChange={handleInputChange}
                      className="border-red-900/20 focus:border-red-900/40"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Must be at least 8 characters with uppercase, lowercase, number, and special character
                    </p>
                  </div>
                </div>
              </div>

              {/* Student-specific Fields */}
              {type === 'student' && (
                <>
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-red-900 dark:text-red-500">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block text-muted-foreground">
                          Full Name*
                        </label>
                        <Input
                          id="fullName"
                          name="fullName"
                          required
                          placeholder="Ashish Kumar"
                          onChange={handleInputChange}
                          className="border-red-900/20 focus:border-red-900/40"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block text-muted-foreground">
                          Roll Number*
                        </label>
                        <Input
                          id="rollNumber"
                          name="rollNumber"
                          required
                          placeholder="2247002"
                          onChange={handleInputChange}
                          className="border-red-900/20 focus:border-red-900/40"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block text-muted-foreground">
                          Phone Number*
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+91XXXXXXXXXX"
                          onChange={handleInputChange}
                          className="border-red-900/20 focus:border-red-900/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-red-900 dark:text-red-500">Academic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block text-muted-foreground">
                          Branch*
                        </label>
                        <Select 
                          name="branch" 
                          onValueChange={(value) => handleInputChange({ target: { name: 'branch', value }})}
                        >
                          <SelectTrigger className="border-red-900/20 focus:border-red-900/40">
                            <SelectValue placeholder="Select your branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map(branch => (
                              <SelectItem key={branch} value={branch}>
                                {branch}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block text-muted-foreground">
                          Current Year*
                        </label>
                        <Select 
                          name="currentYear" 
                          onValueChange={(value) => handleInputChange({ target: { name: 'currentYear', value: value }})}
                        >
                          <SelectTrigger className="border-red-900/20 focus:border-red-900/40">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Year.map(year => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block text-muted-foreground">
                          Current CGPA*
                        </label>
                        <Input
                          id="cgpa"
                          name="cgpa"
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          placeholder="0.00"
                          onChange={(e) => handleInputChange({ target: { name: 'cgpa', value: parseFloat(e.target.value) }})}
                          className="border-red-900/20 focus:border-red-900/40"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block text-muted-foreground">
                          Passing Year*
                        </label>
                        <Select 
                          name="passingYear" 
                          onValueChange={(value) => handleInputChange({ target: { name: 'passingYear', value: parseInt(value) }})}
                        >
                          <SelectTrigger className="border-red-900/20 focus:border-red-900/40">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {PassingYear.map(year => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Company-specific Fields */}
              {type === 'company' && (
                <>
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-red-900 dark:text-red-500">Company Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-2 block text-muted-foreground">
                          Organization Name*
                        </label>
                        <Input
                          id="companyName"
                          name="companyName"
                          required
                          placeholder="Acme Corporation"
                          onChange={handleInputChange}
                          className="border-red-900/20 focus:border-red-900/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-2 block text-muted-foreground">
                          Company Website*
                        </label>
                        <Input
                          id="website"
                          name="website"
                          type="url"
                          required
                          placeholder="https://www.company.com"
                          onChange={handleInputChange}
                          className="border-red-900/20 focus:border-red-900/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-2 block text-muted-foreground">
                          Company Description*
                        </label>
                        <Textarea
                          id="description"
                          name="description"
                          required
                          placeholder="Brief description of your company..."
                          onChange={handleInputChange}
                          className="border-red-900/20 focus:border-red-900/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-red-900 dark:text-red-500">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block text-muted-foreground">
                          Contact Person Name*
                        </label>
                        <Input
                          id="contactPersonName"
                          name="contactPersonName"
                          required
                          placeholder="Jane Smith"
                          onChange={handleInputChange}
                          className="border-red-900/20 focus:border-red-900/40"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block text-muted-foreground">
                          Designation*
                        </label>
                        <Input
                          id="contactPersonDesignation"
                          name="contactPersonDesignation"
                          required
                          placeholder="HR Manager"
                          onChange={handleInputChange}
                          className="border-red-900/20 focus:border-red-900/40"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block text-muted-foreground">
                          Phone Number*
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+91XXXXXXXXXX"
                          onChange={handleInputChange}
                          className="border-red-900/20 focus:border-red-900/40"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="rounded border-red-900/20 text-red-900"
                  required 
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <Link href="/terms" className="text-red-900 dark:text-red-500 hover:underline">
                    terms and conditions
                  </Link>
                </span>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/2 border-red-900/20 hover:bg-red-900/5"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="w-1/2 bg-red-900 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Please ensure all information provided is accurate
              </p>
            </form>
          )}
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already registered? {' '}
            <Link 
              href="/login" 
              className="text-red-900 dark:text-red-500 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 