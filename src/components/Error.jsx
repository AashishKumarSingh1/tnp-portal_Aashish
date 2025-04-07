"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({ error, reset }) {
  const [seconds, setSeconds] = useState(10)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1)
    }, 1000)

    const redirect = setTimeout(() => {
      router.push('/')
    }, 10000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirect)
    }
  }, [router])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-red-900/5 to-red-950/10 dark:from-background dark:via-red-900/10 dark:to-red-950/20">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="container relative flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-lg p-8 bg-card rounded-lg border hover:shadow-lg transition-all hover:border-red-900/20 hover:shadow-red-900/10">
          <div className="mb-8 text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-900 dark:text-red-500 mb-6" />
            <h1 className="text-2xl font-bold text-red-900 dark:text-red-500 mb-4">
              Under Maintenance
            </h1>
            
            <p className="text-muted-foreground mb-8">
              We apologize for the inconvenience. This page is currently under maintenance. Our team is working to resolve the issue.
            </p>

            <p className="text-sm text-muted-foreground mb-8">
              Redirecting to homepage in {seconds} seconds...
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="w-full sm:w-auto bg-red-900 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700"
                onClick={reset}
              >
                Try Again
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto border-red-900/20 hover:bg-red-900/10 dark:border-red-700/20 dark:hover:bg-red-700/10"
                asChild
              >
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 