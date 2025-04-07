import { PageHeader } from '@/app/components/page-header'
import StatisticsClient from '@/app/components/statistics-client' 


export const metadata = {
  title: 'Statistics - Training & Placement Cell NIT Patna',
  description: 'Placement Statistics and Records of NIT Patna',
}


export default function StatisticsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-red-900/5 to-red-950/10 dark:from-background dark:via-red-900/10 dark:to-red-950/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Placement Statistics</span>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Placement Statistics and Records of NIT Patna
            </p>
          </div>
        </div>
      </section>
      
      <StatisticsClient />
    </div>
  )
} 