'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function StudentAcademics() {
  const [academics, setAcademics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchAcademics()
  }, [])

  const fetchAcademics = async () => {
    try {
      const res = await fetch('/api/student/academics')
      if (!res.ok) throw new Error('Failed to fetch academics')
      const data = await res.json()
      setAcademics(data)
    } catch (error) {
      toast.error('Failed to load academic details')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)
    try {
      const res = await fetch('/api/student/academics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(academics)
      })
      if (!res.ok) throw new Error('Failed to update academics')
      toast.success('Academic details updated successfully')
    } catch (error) {
      toast.error('Failed to update academic details')
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
        <h1 className="text-3xl font-bold mb-6">Academic Details</h1>
        
        <Card className="p-6">
          <form onSubmit={handleUpdate} className="space-y-8">
            {/* 10th details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">10th Standard</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Board</label>
                  <Input
                    value={academics?.tenth_board || ''}
                    onChange={(e) => setAcademics({...academics, tenth_board: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">School Name</label>
                  <Input
                    value={academics?.tenth_school || ''}
                    onChange={(e) => setAcademics({...academics, tenth_school: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Percentage</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={academics?.tenth_percentage || ''}
                    onChange={(e) => setAcademics({...academics, tenth_percentage: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    type="number"
                    value={academics?.tenth_year || ''}
                    onChange={(e) => setAcademics({...academics, tenth_year: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 12th details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">12th Standard</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Board</label>
                  <Input
                    value={academics?.twelfth_board || ''}
                    onChange={(e) => setAcademics({...academics, twelfth_board: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">School Name</label>
                  <Input
                    value={academics?.twelfth_school || ''}
                    onChange={(e) => setAcademics({...academics, twelfth_school: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Percentage</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={academics?.twelfth_percentage || ''}
                    onChange={(e) => setAcademics({...academics, twelfth_percentage: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    type="number"
                    value={academics?.twelfth_year || ''}
                    onChange={(e) => setAcademics({...academics, twelfth_year: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Undergraduate details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Undergraduate Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">University</label>
                  <Input
                    value={academics?.ug_university || ''}
                    onChange={(e) => setAcademics({...academics, ug_university: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">College</label>
                  <Input
                    value={academics?.ug_college || ''}
                    onChange={(e) => setAcademics({...academics, ug_college: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Year of Admission</label>
                  <Input
                    type="number"
                    value={academics?.ug_year_of_admission || ''}
                    onChange={(e) => setAcademics({...academics, ug_year_of_admission: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Semester-wise CGPA */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Semester-wise CGPA</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i}>
                      <label className="text-sm font-medium">Semester {i + 1}</label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={academics?.[`sem${i + 1}_cgpa`] || ''}
                        onChange={(e) => setAcademics({
                          ...academics,
                          [`sem${i + 1}_cgpa`]: e.target.value
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Overall CGPA</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={academics?.overall_cgpa || ''}
                    onChange={(e) => setAcademics({...academics, overall_cgpa: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Entrance Exam Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Entrance Exam Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">JEE Rank</label>
                  <Input
                    type="number"
                    value={academics?.jee_rank || ''}
                    onChange={(e) => setAcademics({...academics, jee_rank: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">JEE Score</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={academics?.jee_score || ''}
                    onChange={(e) => setAcademics({...academics, jee_score: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">GATE Score</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={academics?.gate_score || ''}
                    onChange={(e) => setAcademics({...academics, gate_score: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">GATE Rank</label>
                  <Input
                    type="number"
                    value={academics?.gate_rank || ''}
                    onChange={(e) => setAcademics({...academics, gate_rank: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Other Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Other Details</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Total Backlogs</label>
                  <Input
                    type="number"
                    value={academics?.backlogs || '0'}
                    onChange={(e) => setAcademics({...academics, backlogs: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Current Backlogs</label>
                  <Input
                    type="number"
                    value={academics?.current_backlogs || '0'}
                    onChange={(e) => setAcademics({...academics, current_backlogs: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Gap Years</label>
                  <Input
                    type="number"
                    value={academics?.gap_years || '0'}
                    onChange={(e) => setAcademics({...academics, gap_years: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Academic Details'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
