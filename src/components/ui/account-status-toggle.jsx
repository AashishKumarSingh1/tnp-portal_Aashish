import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export function AccountStatusToggle({ userId, isActive, onStatusChange }) {
  const [showDialog, setShowDialog] = useState(false)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingStatus, setPendingStatus] = useState(null)

  const handleToggleClick = (newStatus) => {
    setPendingStatus(newStatus)
    if (!newStatus) {
      setShowDialog(true)
    } else {
      handleStatusChange(newStatus)
    }
  }

  const handleStatusChange = async (newStatus, deactivationReason = '') => {
    try {
      setIsSubmitting(true)
      const response = await fetch('/api/admin/users/toggle-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          isActive: newStatus,
          reason: deactivationReason
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update account status')
      }

      toast.success(`Account ${newStatus ? 'activated' : 'deactivated'} successfully`)
      onStatusChange?.(newStatus)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to update account status')
    } finally {
      setIsSubmitting(false)
      setShowDialog(false)
      setReason('')
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isActive}
        onCheckedChange={handleToggleClick}
        disabled={isSubmitting}
      />
      <Label>{isActive ? 'Active' : 'Inactive'}</Label>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Account</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for deactivating this account. This will be logged and the user will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Textarea
              placeholder="Enter reason for deactivation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isSubmitting}
              onClick={() => {
                setShowDialog(false)
                setReason('')
                setPendingStatus(null)
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting || !reason.trim()}
              onClick={() => handleStatusChange(pendingStatus, reason)}
            >
              {isSubmitting ? 'Deactivating...' : 'Deactivate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 