import { PageHeader } from '@/app/components/page-header'
import WhyRecruitClient from '@/components/WhyRecruitClient'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Star, Users, Trophy, Target, BookOpen, Building2, GraduationCap } from 'lucide-react'

export const metadata = {
  title: 'Why Recruit - Training & Placement Cell NIT Patna',
  description: 'Discover the compelling reasons to recruit top engineering talent from NIT Patna.',
}

export default function WhyRecruitPage() {
  return (
    <div className="min-h-screen">
      
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-red-900/5 to-red-950/10 dark:from-background dark:via-red-900/10 dark:to-red-950/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Why Recruit from NIT Patna?</span>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Access a pool of exceptional talent equipped with strong technical foundations and professional skills.
            </p>
          </div>
        </div>
      </section>

      
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: 'Rigorous Curriculum', description: 'Industry-aligned syllabus ensuring strong fundamentals.', Icon: BookOpen },
              { title: 'Diverse Talent Pool', description: 'Students from various engineering and architecture disciplines.', Icon: Users },
              { title: 'Problem Solvers', description: 'Trained to tackle complex challenges with innovative solutions.', Icon: Target },
              { title: 'Proven Track Record', description: 'Alumni excelling in top companies globally.', Icon: Trophy },
              { title: 'State-of-the-Art Facilities', description: 'Modern labs and infrastructure supporting practical learning.', Icon: Building2 },
              { title: 'Professional Ethics', description: 'Emphasis on integrity, teamwork, and communication skills.', Icon: GraduationCap },
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover-card text-center">
                <div className="w-16 h-16 rounded-full bg-red-900/10 mx-auto mb-4 flex items-center justify-center">
                  <feature.Icon className="w-8 h-8 text-red-900 dark:text-red-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      
      <WhyRecruitClient />

     
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Connect?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Initiate the recruitment process or learn more about partnership opportunities with NIT Patna.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-900 hover:bg-red-800" asChild>
              <Link href="/procedure">View Placement Procedure</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact T&P Cell</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 