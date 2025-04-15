'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Mail, ArrowRight } from 'lucide-react'

// Loading component to show while waiting for the page to load
function VerifyEmailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="p-6 md:p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-900/10 flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-red-900" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">Verify Your Email</h1>
            <p className="text-muted-foreground text-center">Loading verification...</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

// The main component that uses useSearchParams
function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(300)

  useEffect(() => {
    if (!email) {
      router.replace('/register')
      return
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [email, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!otp) {
      toast.error('Please enter OTP')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      toast.success('Email verified successfully!')
      router.push('/login')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'registration' })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend OTP')
      }

      toast.success('OTP sent successfully!')
      setCountdown(300) 
    } catch (error) {
      toast.error(error.message)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="p-6 md:p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-900/10 flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-red-900" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">Verify Your Email</h1>
            <p className="text-muted-foreground text-center">
              We've sent a verification code to {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-wider"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-900 hover:bg-red-800"
              disabled={loading || countdown === 0}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the code? {countdown > 0 ? `(${formatTime(countdown)})` : ''}
            </p>
            <Button
              variant="link"
              className="text-red-900"
              onClick={handleResendOTP}
              disabled={countdown > 0}
            >
              Resend OTP
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  )
}