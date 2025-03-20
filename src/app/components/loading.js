'use client'

export function LoadingSpinner({ className = '', ...props }) {
  return (
    <div className="flex items-center justify-center min-h-[200px]" {...props}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
} 