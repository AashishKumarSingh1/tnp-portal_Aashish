import { PageHeader } from '@/app/components/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, Trophy, Target, BookOpen, Building2, GraduationCap, Award, Briefcase } from 'lucide-react'

export const metadata = {
  title: 'About Us - Training & Placement Cell NIT Patna',
  description: 'Learn about the Training & Placement Cell at NIT Patna and our commitment to student success',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-red-900/5 to-red-950/10 dark:from-background dark:via-red-900/10 dark:to-red-950/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">About Training & Placement Cell</span>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Dedicated to bridging the gap between academia and industry, fostering career growth and professional development for our students.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 md:p-8 hover-card bg-gradient-to-br from-background to-red-900/10 dark:from-red-950/20 dark:to-red-900/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-900/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-red-900 dark:text-red-500" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground">
                To facilitate seamless integration of our students into the professional world by providing comprehensive placement support and industry exposure.
              </p>
            </Card>
            <Card className="p-6 md:p-8 hover-card bg-gradient-to-br from-background to-red-900/10 dark:from-red-950/20 dark:to-red-900/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-900/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-red-900 dark:text-red-500" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground">
                To be the premier facilitator of industry-academia partnerships and ensure 100% placement for our eligible students.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-12 md:py-20 bg-red-950/5 dark:bg-red-950/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">What We Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: GraduationCap,
                title: "Career Guidance",
                description: "Personalized career counseling and professional development workshops"
              },
              {
                icon: Building2,
                title: "Industry Connect",
                description: "Regular industry interactions and pre-placement talks"
              },
              {
                icon: Award,
                title: "Skill Development",
                description: "Technical and soft skills training programs"
              },
              {
                icon: Briefcase,
                title: "Placement Support",
                description: "End-to-end placement assistance and interview preparation"
              }
            ].map((item, index) => (
              <Card key={index} className="p-6 hover-card border-red-900/10 dark:border-red-700/10">
                <div className="w-12 h-12 rounded-full bg-red-900/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-red-900 dark:text-red-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Prof. P. K. Jain",
                role: "Director, NIT Patna",
                description: "Leading NIT Patna's vision for excellence in technical education and industry collaboration."
              },
              {
                name: "Dr. Shailesh M Pandey",
                role: "Training & Placement Officer",
                description: "Leading the placement initiatives with 15+ years of experience"
              },
              {
                name: "Dr. Samrat Mukherjee",
                role: "Dean, Student Welfare",
                description: "Leading the placement initiatives with 15+ years of experience"
              },
              
            ].map((member, index) => (
              <Card key={index} className="p-6 hover-card bg-gradient-to-br from-background to-red-900/10 dark:from-red-950/20 dark:to-red-900/20">
                <div className="w-16 h-16 rounded-full bg-red-900/10 flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-8 h-8 text-red-900 dark:text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{member.name}</h3>
                <p className="text-red-900 dark:text-red-500 text-center text-sm mb-4">{member.role}</p>
                <p className="text-muted-foreground text-center text-sm">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-red-900 to-red-950 dark:from-red-800 dark:to-red-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Want to Know More?</h2>
            <p className="text-white/90 mb-8 text-sm md:text-base">
              Get in touch with us to learn more about our placement process and how we can help you.
            </p>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-red-900 hover:bg-red-50" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 