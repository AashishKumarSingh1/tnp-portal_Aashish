'use client'

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Save, Mail, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { toast } from "sonner"

export default function Settings() {
  const [settings, setSettings] = useState({
    smtp_host: '',
    smtp_port: '',
    smtp_secure: false,
    smtp_user: '',
    smtp_pass: '',
    smtp_from: ''
  })
  const [loading, setLoading] = useState(false)
  const [testEmailDialog, setTestEmailDialog] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [sendingTest, setSendingTest] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/super-admin/setting')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      toast.error('Failed to fetch SMTP settings')
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/super-admin/setting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (!res.ok) {
        throw new Error('Failed to update settings')
      }

      toast.success('SMTP settings updated successfully')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address')
      return
    }

    setSendingTest(true)
    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to send test email')
      }

      toast.success('Test email sent successfully')
      setTestEmailDialog(false)
      setTestEmail('')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSendingTest(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-red-800 to-amber-700 bg-clip-text text-transparent">
          SMTP Settings
        </h1>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-amber-50 dark:from-black dark:to-gray-700">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">SMTP Host</label>
                <Input
                  value={settings.smtp_host}
                  onChange={(e) => setSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
                  placeholder="e.g., smtp.gmail.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">SMTP Port</label>
                <Input
                  value={settings.smtp_port}
                  onChange={(e) => setSettings(prev => ({ ...prev, smtp_port: e.target.value }))}
                  placeholder="e.g., 587"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">SMTP Secure</label>
              <Switch
                checked={settings.smtp_secure}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smtp_secure: checked }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">SMTP User</label>
                <Input
                  value={settings.smtp_user}
                  onChange={(e) => setSettings(prev => ({ ...prev, smtp_user: e.target.value }))}
                  placeholder="Email address"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">SMTP Password</label>
                <Input
                  type="password"
                  value={settings.smtp_pass}
                  onChange={(e) => setSettings(prev => ({ ...prev, smtp_pass: e.target.value }))}
                  placeholder="App password"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">From Email</label>
              <Input
                value={settings.smtp_from}
                onChange={(e) => setSettings(prev => ({ ...prev, smtp_from: e.target.value }))}
                placeholder='e.g., "TNP Cell NIT Patna" <tnp@nitp.ac.in>'
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleSave}
                className="bg-red-900 hover:bg-red-800"
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setTestEmailDialog(true)}
                disabled={loading}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Test Email
              </Button>
            </div>
          </div>
        </Card>

        {/* Test Email Dialog */}
        <Dialog open={testEmailDialog} onOpenChange={setTestEmailDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Test Email</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setTestEmailDialog(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Recipient Email Address
                </label>
                <Input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setTestEmailDialog(false)}
                disabled={sendingTest}
              >
                Cancel
              </Button>
              <Button
                onClick={handleTestEmail}
                disabled={sendingTest || !testEmail}
              >
                {sendingTest ? (
                  <>
                    <Mail className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Test Email
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
} 