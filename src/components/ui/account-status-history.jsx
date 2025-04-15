import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'

export function AccountStatusHistory({ userId, open, onOpenChange }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open && userId) {
      fetchHistory()
    }
  }, [open, userId])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/${userId}/status-history`)
      if (!response.ok) throw new Error('Failed to fetch history')
      const data = await response.json()
      setHistory(data.history)
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Account Status History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              Loading...
            </div>
          ) : history.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              No history found
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        entry.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {entry.status ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <time className="text-sm text-muted-foreground">
                      {format(new Date(entry.created_at), 'PPpp')}
                    </time>
                  </div>
                  {entry.reason && (
                    <p className="text-sm text-muted-foreground">
                      Reason: {entry.reason}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Changed by: {entry.changed_by_name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 