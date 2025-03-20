import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Star, Users, Trophy, Target, BookOpen, Building2, GraduationCap, Award, Briefcase, ChartBar } from 'lucide-react'

export const metadata = {
  title: 'Why Recruit - Training & Placement Cell NIT Patna',
  description: 'Discover why you should recruit from NIT Patna',
}

export default function WhyRecruitPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-red-900/5 to-red-950/10 dark:from-background dark:via-red-900/10 dark:to-red-950/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Why Recruit from NIT Patna?</span>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Access a pool of talented, well-trained engineers ready to contribute to your organization's success.
            </p>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: "Academic Excellence",
                description: "Consistently ranked among top engineering institutions in India"
              },
              {
                icon: Users,
                title: "Diverse Talent Pool",
                description: "Students from various engineering disciplines with diverse skill sets"
              },
              {
                icon: Trophy,
                title: "Proven Track Record",
                description: "Outstanding placement history with leading companies"
              }
            ].map((item, index) => (
              <Card key={index} className="p-6 hover-card bg-gradient-to-br from-background to-red-900/10 dark:from-red-950/20 dark:to-red-900/20">
                <div className="w-12 h-12 rounded-full bg-red-900/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-red-900 dark:text-red-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Student Skills */}
      <section className="py-12 md:py-20 bg-red-950/5 dark:bg-red-950/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Our Students' Expertise</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Technical Problem Solving",
              "Programming & Development",
              "Data Analysis",
              "Project Management",
              "Team Collaboration",
              "Innovation & Research"
            ].map((skill, index) => (
              <Card key={index} className="p-6 hover-card border-red-900/10 dark:border-red-700/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-900/10 flex items-center justify-center">
                    <ChartBar className="w-4 h-4 text-red-900 dark:text-red-500" />
                  </div>
                  <h3 className="font-semibold">{skill}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Past Recruiters */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Past Recruiters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4 flex items-center justify-center hover-card aspect-square">
                <Briefcase className="w-8 h-8 text-red-900/50 dark:text-red-500/50" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-red-900 to-red-950 dark:from-red-800 dark:to-red-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Recruit?</h2>
            <p className="text-white/90 mb-8 text-sm md:text-base">
              Join the league of top companies recruiting from NIT Patna. Start your recruitment process today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-red-900 hover:bg-red-50" asChild>
                <Link href="/register">Register as Recruiter</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/procedure">View Procedure</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 