'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
const APPLICATION_STATUSES = [
  'Applied',
  'Resume Shortlisted',
  'Written Test',
  'GD Round',
  'Technical Interview',
  'HR Interview',
  'Selected',
  'Offer Given',
  'Rejected'
]

export function ApplicationStatusDialog({ 
  open, 
  onClose, 
  application, 
  jafId, 
  onStatusUpdate 
}) {
  const [status, setStatus] = useState(application?.status || 'Applied')
  const [remarks, setRemarks] = useState(application?.remarks || '')
  const [updating, setUpdating] = useState(false)

  const handleUpdate = async () => {
    try {
      setUpdating(true)
      const res = await fetch(`/api/company/jaf/${jafId}/applications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: application.id,
          status,
          remarks
        })
      })

      if (!res.ok) throw new Error('Failed to update status')

      toast.success('Application status updated')
      onStatusUpdate()
      onClose()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['COMPANY']}>
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Application Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 bg-black">
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_STATUSES.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Remarks</label>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any remarks about this status change..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updating}>
              Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </ProtectedRoute>
  )
} 