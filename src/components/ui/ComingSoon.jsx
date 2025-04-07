import { Construction } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ComingSoon({ title }) {
  return (
    <div className="flex flex-col min-h-[80vh] bg-gradient-to-b from-background via-red-900/5 to-red-950/10 dark:from-background dark:via-red-900/10 dark:to-red-950/20">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="container relative flex items-center justify-center flex-1 px-4">
        <div className="w-full max-w-lg p-8 bg-card rounded-lg border hover:shadow-lg transition-all hover:border-red-900/20 hover:shadow-red-900/10">
          <div className="text-center">
            <Construction className="mx-auto h-16 w-16 text-red-900 dark:text-red-500 mb-6" />
            <h1 className="text-2xl font-bold text-red-900 dark:text-red-500 mb-4">
              {title}
            </h1>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This page is currently under construction. We're working hard to bring you an amazing experience.
              </p>
              
              <div className="relative">
                <div className="h-1 w-full bg-red-900/20 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-red-900 dark:bg-red-700 animate-pulse rounded-full" />
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Coming Soon
              </p>
            </div>

            <div className="mt-8">
              <Button 
                variant="outline" 
                size="lg"
                className="border-red-900/20 hover:bg-red-900/10 dark:border-red-700/20 dark:hover:bg-red-700/10"
                asChild
              >
                <Link href="/student/dashboard">
                  Return to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 